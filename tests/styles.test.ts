import assert from 'node:assert/strict';
import test from 'node:test';

import { cssVariables } from '../src/lib/styles.ts';

test('serializes defined CSS custom properties', () => {
  assert.equal(
    cssVariables({
      '--resource-color': '#123456',
      '--spotlight-strength': 0,
      '--optional-color': undefined,
    }),
    '--resource-color: #123456; --spotlight-strength: 0',
  );
});
