
import { afterEach, describe, expect, test } from 'bun:test';
import { spawnSync } from 'node:child_process';
import { chmodSync, existsSync, mkdtempSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const WRAPPER = join(SCRIPT_DIR, 'bun-install-ci.sh');

const cleanupDirs = [];

function setupStub() {
  const tmp = mkdtempSync(join(tmpdir(), 'bun-install-ci-test-'));
  cleanupDirs.push(tmp);
  const counterFile = join(tmp, 'attempt-count');
  const stubPath = join(tmp, 'stub-bun-install.sh');
  writeFileSync(counterFile, '0', 'utf8');
  writeFileSync(
    stubPath,
    `#!/usr/bin/env bash
set -euo pipefail
attempt=$(cat "$TEST_COUNTER_FILE")
attempt=$((attempt + 1))
echo "$attempt" > "$TEST_COUNTER_FILE"
case "$TEST_STUB_BEHAVIOR" in
  always-pass)
    echo "stub: pass on attempt $attempt"
    exit 0
    ;;
  fail-then-pass)
    if [ "$attempt" -le 1 ]; then
      echo 'error: Fail extracting tarball for "@img/sharp-libvips-linux-x64"' >&2
      exit 1
    fi
    echo "stub: pass on attempt $attempt"
    exit 0
    ;;
  always-fail)
    echo 'error: Fail extracting tarball for "@img/sharp-libvips-linux-x64"' >&2
    exit 1
    ;;
  always-fail-code)
    # Generic-passthrough probe — exit with whatever code the test supplies
    # in TEST_FAIL_EXIT_CODE (default 1). Used by the passthrough test that
    # proves \`exit "$rc"\` is not hardcoded.
    echo "stub: synthetic non-1 failure (exit \${TEST_FAIL_EXIT_CODE:-1})" >&2
    exit "\${TEST_FAIL_EXIT_CODE:-1}"
    ;;
  hang-then-pass)
    # Attempt 1 blocks far past the wrapper's BUN_INSTALL_ATTEMPT_TIMEOUT so
    # the watchdog must kill it; attempt 2 succeeds. Trap TERM to exit promptly
    # (and reap the inner sleep) so the SIGTERM path resolves cleanly.
    if [ "$attempt" -le 1 ]; then
      sleep "\${TEST_HANG_SECONDS:-30}" & sleep_pid=$!
      trap 'kill "$sleep_pid" 2>/dev/null; exit 143' TERM
      wait "$sleep_pid"
      exit 0
    fi
    echo "stub: pass on attempt $attempt"
    exit 0
    ;;
  always-hang)
    # Every attempt hangs until the watchdog SIGTERMs it.
    sleep "\${TEST_HANG_SECONDS:-30}" & sleep_pid=$!
    trap 'kill "$sleep_pid" 2>/dev/null; exit 143' TERM
    wait "$sleep_pid"
    exit 0
    ;;
  always-hang-ignore-term)
    # Ignore SIGTERM so the watchdog must escalate to SIGKILL. Loop short
    # sleeps (rather than one long sleep) so the orphan the uncatchable SIGKILL
    # leaves behind is bounded to ~1s instead of the full hang duration.
    trap '' TERM
    while :; do sleep 1; done
    ;;
  *)
    echo "stub: unknown TEST_STUB_BEHAVIOR='$TEST_STUB_BEHAVIOR'" >&2
    exit 2
    ;;
esac
`,
    'utf8',
  );
  chmodSync(stubPath, 0o755);
  return { tmp, counterFile, stubPath };
}

function runWrapper({
  behavior,
  stubPath,
  counterFile,
  maxAttempts = 3,
  retrySleepBase = 0,
  extraEnv = {},
  timeoutMs,
}) {
  return spawnSync('bash', [WRAPPER], {
    env: {
      ...process.env,
      BUN_INSTALL_CMD: stubPath,
      BUN_INSTALL_MAX_ATTEMPTS: String(maxAttempts),
      BUN_INSTALL_RETRY_SLEEP_BASE: String(retrySleepBase),
      TEST_STUB_BEHAVIOR: behavior,
      TEST_COUNTER_FILE: counterFile,
      ...extraEnv,
    },
    encoding: 'utf8',
    ...(timeoutMs ? { timeout: timeoutMs } : {}),
  });
}

function combinedOutput(result) {
  return `${result.stdout ?? ''}${result.stderr ?? ''}`;
}

function countMatches(haystack, needle) {
  return (haystack.match(new RegExp(needle, 'g')) ?? []).length;
}

describe('bun-install-ci.sh — retry wrapper for `bun install --frozen-lockfile`', () => {
  afterEach(() => {
    while (cleanupDirs.length > 0) {
      const dir = cleanupDirs.pop();
      try {
        rmSync(dir, { recursive: true, force: true });
      } catch {
      }
    }
  });

  test('wrapper script exists and is executable', () => {
    if (!existsSync(WRAPPER)) {
      throw new Error(
        `expected wrapper at ${WRAPPER}; not present.\n` +
          `(RED state — implementation lands in Task 4 of fix-sharp-tarball-flake.)`,
      );
    }
    const stat = statSync(WRAPPER);
    expect(stat.mode & 0o100).toBeGreaterThan(0);
  });

  test('happy path: first-attempt success → exit 0, no annotations', () => {
    const ctx = setupStub();
    const result = runWrapper({ ...ctx, behavior: 'always-pass' });

    expect(result.status).toBe(0);
    const out = combinedOutput(result);
    expect(out).not.toContain('::warning::');
    expect(out).not.toContain('::error::');
  });

  test('flake recovery: tarball error then success on attempt 2 → exit 0 with exactly one ::warning::', () => {
    const ctx = setupStub();
    const result = runWrapper({ ...ctx, behavior: 'fail-then-pass' });

    expect(result.status).toBe(0);
    const out = combinedOutput(result);
    expect(countMatches(out, '::warning::')).toBe(1);
    expect(out).not.toContain('::error::');
  });

  test('exhaustion: all 3 attempts fail → exit 1 (passthrough) with 2 ::warning::s + 1 ::error::', () => {
    const ctx = setupStub();
    const result = runWrapper({ ...ctx, behavior: 'always-fail', maxAttempts: 3 });

    expect(result.status).toBe(1);
    const out = combinedOutput(result);
    expect(countMatches(out, '::warning::')).toBe(2);
    expect(countMatches(out, '::error::')).toBe(1);
  });

  test('exit-code passthrough is generic: stub exit 42 → wrapper exit 42', () => {
    const ctx = setupStub();
    const result = runWrapper({
      ...ctx,
      behavior: 'always-fail-code',
      maxAttempts: 1,
      extraEnv: { TEST_FAIL_EXIT_CODE: '42' },
    });

    expect(result.status).toBe(42);
  });

  test('MAX_ATTEMPTS=1: single attempt fails → exit 1, 0 ::warning::s, 1 ::error:: with singular noun', () => {
    const ctx = setupStub();
    const result = runWrapper({ ...ctx, behavior: 'always-fail', maxAttempts: 1 });

    expect(result.status).toBe(1);
    const out = combinedOutput(result);
    expect(countMatches(out, '::warning::')).toBe(0);
    expect(countMatches(out, '::error::')).toBe(1);
    expect(out).toMatch(/after 1 attempt\b/);
    expect(out).not.toMatch(/after 1 attempts\b/);
  });

  test('input validation: non-integer BUN_INSTALL_MAX_ATTEMPTS exits 64 in milliseconds', () => {
    const ctx = setupStub();
    const result = runWrapper({
      ...ctx,
      behavior: 'always-fail',
      extraEnv: { BUN_INSTALL_MAX_ATTEMPTS: 'abc' },
      timeoutMs: 2000,
    });

    expect(result.signal).toBeNull();
    expect(result.status).toBe(64);
    const out = combinedOutput(result);
    expect(out).toContain('::error::');
    expect(out).toContain('BUN_INSTALL_MAX_ATTEMPTS');
  });

  test('input validation: MAX_ATTEMPTS=0 exits 64 (the bash `[ 1 -ge 0 ]` corner)', () => {
    const ctx = setupStub();
    const result = runWrapper({
      ...ctx,
      behavior: 'always-fail',
      extraEnv: { BUN_INSTALL_MAX_ATTEMPTS: '0' },
      timeoutMs: 2000,
    });

    expect(result.signal).toBeNull();
    expect(result.status).toBe(64);
    const out = combinedOutput(result);
    expect(out).toContain('::error::');
    expect(out).toContain('BUN_INSTALL_MAX_ATTEMPTS');
  });

  test('input validation: non-integer BUN_INSTALL_RETRY_SLEEP_BASE exits 64', () => {
    const ctx = setupStub();
    const result = runWrapper({
      ...ctx,
      behavior: 'always-fail',
      extraEnv: { BUN_INSTALL_RETRY_SLEEP_BASE: '1.5' },
      timeoutMs: 2000,
    });

    expect(result.signal).toBeNull();
    expect(result.status).toBe(64);
    const out = combinedOutput(result);
    expect(out).toContain('::error::');
    expect(out).toContain('BUN_INSTALL_RETRY_SLEEP_BASE');
  });

  test('timeout recovery: attempt 1 hangs (killed by watchdog) then attempt 2 passes → exit 0 with one timeout ::warning::', () => {
    const ctx = setupStub();
    const result = runWrapper({
      ...ctx,
      behavior: 'hang-then-pass',
      maxAttempts: 3,
      extraEnv: { BUN_INSTALL_ATTEMPT_TIMEOUT: '3', BUN_INSTALL_KILL_GRACE: '1' },
      timeoutMs: 20000,
    });

    expect(result.signal).toBeNull();
    expect(result.status).toBe(0);
    const out = combinedOutput(result);
    expect(countMatches(out, '::warning::')).toBe(1);
    expect(out).toContain('timed out after 3s');
    expect(out).not.toContain('::error::');
  }, 30000); // Bun per-test timeout > the 3s budget + retries + the 20s spawnSync net

  test('timeout exhaustion: every attempt hangs → exit 124 with (N-1) ::warning::s + 1 ::error::', () => {
    const ctx = setupStub();
    const result = runWrapper({
      ...ctx,
      behavior: 'always-hang',
      maxAttempts: 2,
      extraEnv: { BUN_INSTALL_ATTEMPT_TIMEOUT: '3', BUN_INSTALL_KILL_GRACE: '1' },
      timeoutMs: 20000,
    });

    expect(result.signal).toBeNull();
    expect(result.status).toBe(124);
    const out = combinedOutput(result);
    expect(countMatches(out, '::warning::')).toBe(1);
    expect(countMatches(out, '::error::')).toBe(1);
    expect(out).toContain('timed out after 3s');
  }, 30000); // 2 attempts x 3s budget exceeds Bun's 5s default per-test timeout

  test('SIGKILL escalation: a SIGTERM-ignoring hang is force-killed and normalized to exit 124', () => {
    const ctx = setupStub();
    const result = runWrapper({
      ...ctx,
      behavior: 'always-hang-ignore-term',
      maxAttempts: 1,
      extraEnv: {
        BUN_INSTALL_ATTEMPT_TIMEOUT: '3',
        BUN_INSTALL_KILL_GRACE: '1',
      },
      timeoutMs: 20000,
    });

    expect(result.signal).toBeNull();
    expect(result.status).toBe(124);
    expect(countMatches(combinedOutput(result), '::error::')).toBe(1);
  }, 30000); // 3s budget + 1s grace + SIGKILL can edge past Bun's 5s default

  test('timeout disabled (BUN_INSTALL_ATTEMPT_TIMEOUT=0): direct path, happy install exits 0 with no annotations', () => {
    const ctx = setupStub();
    const result = runWrapper({
      ...ctx,
      behavior: 'always-pass',
      extraEnv: { BUN_INSTALL_ATTEMPT_TIMEOUT: '0' },
    });

    expect(result.status).toBe(0);
    const out = combinedOutput(result);
    expect(out).not.toContain('::warning::');
    expect(out).not.toContain('::error::');
  });

  test('timeout disabled + failure: direct path still retries and recovers', () => {
    const ctx = setupStub();
    const result = runWrapper({
      ...ctx,
      behavior: 'fail-then-pass',
      maxAttempts: 2,
      extraEnv: { BUN_INSTALL_ATTEMPT_TIMEOUT: '0' },
    });

    expect(result.status).toBe(0);
    const out = combinedOutput(result);
    expect(countMatches(out, '::warning::')).toBe(1);
    expect(out).toContain('failed (exit 1)');
    expect(out).not.toContain('timed out');
    expect(out).not.toContain('::error::');
  });

  test('input validation: non-integer BUN_INSTALL_ATTEMPT_TIMEOUT exits 64', () => {
    const ctx = setupStub();
    const result = runWrapper({
      ...ctx,
      behavior: 'always-pass',
      extraEnv: { BUN_INSTALL_ATTEMPT_TIMEOUT: 'soon' },
      timeoutMs: 2000,
    });

    expect(result.signal).toBeNull();
    expect(result.status).toBe(64);
    const out = combinedOutput(result);
    expect(out).toContain('::error::');
    expect(out).toContain('BUN_INSTALL_ATTEMPT_TIMEOUT');
  });

  test('input validation: non-integer BUN_INSTALL_KILL_GRACE exits 64', () => {
    const ctx = setupStub();
    const result = runWrapper({
      ...ctx,
      behavior: 'always-pass',
      extraEnv: { BUN_INSTALL_KILL_GRACE: '1.5' },
      timeoutMs: 2000,
    });

    expect(result.signal).toBeNull();
    expect(result.status).toBe(64);
    const out = combinedOutput(result);
    expect(out).toContain('::error::');
    expect(out).toContain('BUN_INSTALL_KILL_GRACE');
  });
});
