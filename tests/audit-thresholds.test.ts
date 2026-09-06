import assert from 'node:assert/strict';
import test from 'node:test';
import { lighthouseFailures } from './helpers/audit-thresholds.ts';

const passing = () => ({
  categories: {
    performance: { score: 1 },
    accessibility: { score: 1 },
    'best-practices': { score: 1 },
    seo: { score: 1 },
  },
  audits: { 'cumulative-layout-shift': { numericValue: 0.1 } },
});

test('audit gates accept the exact thresholds', () => assert.deepEqual(lighthouseFailures(passing()), []));
test('audit gates reject regressions and missing metrics', () => {
  for (const category of Object.keys(passing().categories)) {
    const report = passing();
    report.categories[category as keyof typeof report.categories].score -= 0.01;
    assert.equal(lighthouseFailures(report).length, 1, category);
  }
  const report = passing();
  report.audits['cumulative-layout-shift'].numericValue = 0.101;
  assert.equal(lighthouseFailures(report).length, 1);
  assert.equal(lighthouseFailures({ categories: {}, audits: {} }).length, 5);
});
