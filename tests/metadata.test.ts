import assert from 'node:assert/strict';
import test from 'node:test';
import { getCopyrightYearLabel } from '../src/lib/metadata.ts';

test('keeps the copyright year label deterministic for every rendered page', () => {
  assert.equal(getCopyrightYearLabel(2024), '2024');
  assert.equal(getCopyrightYearLabel(2026), '2024 - 2026');
});
