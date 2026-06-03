import { describe, expect, test } from 'bun:test';
import { STARTER_PACK_IDS, STARTER_PACKS } from './starter.ts';

function userFacingStrings(): string[] {
  const out: string[] = [];
  for (const id of STARTER_PACK_IDS) {
    const pack = STARTER_PACKS[id];
    out.push(pack.name, pack.description);
    for (const folder of pack.folders) {
      out.push(folder.title, folder.description);
    }
    out.push(...Object.values(pack.templates));
    if (pack.rootFiles) out.push(...Object.values(pack.rootFiles));
  }
  return out;
}

describe('starter packs — no insider jargon in user-facing copy', () => {
  test('no "sweep" in any folder description, template body, or root file', () => {
    const offenders = userFacingStrings().filter((s) => /\bsweeps?\b/i.test(s));
    expect(offenders).toEqual([]);
  });
});
