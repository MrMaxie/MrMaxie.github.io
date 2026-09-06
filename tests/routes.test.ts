import assert from 'node:assert/strict';
import test from 'node:test';
import Routes from '../src/lib/routes.ts';

test('generates the stable public route shapes', () => {
  assert.equal(Routes.home(), '/');
  assert.equal(Routes.projects(), '/projects/');
  assert.equal(Routes.project('arcantry'), '/projects/arcantry/');
  assert.equal(Routes.mods(), '/mods/');
  assert.equal(Routes.mod('boss-scaler'), '/mods/boss-scaler/');
  assert.equal(Routes.modGame('terraria'), '/mods/#terraria');
  assert.equal(Routes.topics(), '/tags/');
  assert.equal(Routes.topic('typescript'), '/tags/typescript/');
  assert.equal(Routes.about(), '/about/');
});
