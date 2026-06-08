import { describe, expect, test } from 'bun:test';
import { INLINE_TAG_VALUE_RE } from './tag-promotion.ts';

describe('INLINE_TAG_VALUE_RE', () => {
  test('accepts letter-leading values', () => {
    expect(INLINE_TAG_VALUE_RE.test('typescript')).toBe(true);
    expect(INLINE_TAG_VALUE_RE.test('proj/team')).toBe(true);
    expect(INLINE_TAG_VALUE_RE.test('a1')).toBe(true);
  });

  test('rejects digit-leading values (keeps #2026 as plain text)', () => {
    expect(INLINE_TAG_VALUE_RE.test('2026')).toBe(false);
    expect(INLINE_TAG_VALUE_RE.test('123')).toBe(false);
    expect(INLINE_TAG_VALUE_RE.test('1q-recap')).toBe(false);
  });
});
