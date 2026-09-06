type LighthouseMetrics = {
  categories: Record<string, { score: number | null }>;
  audits: Record<string, { numericValue?: number }>;
};

export function lighthouseFailures(report: LighthouseMetrics): string[] {
  const failures: string[] = [];
  for (const [category, minimum] of Object.entries({
    performance: 0.95,
    accessibility: 0.95,
    'best-practices': 0.95,
    seo: 0.95,
  })) {
    const score = report.categories[category]?.score;
    if (typeof score !== 'number' || !Number.isFinite(score) || score < minimum) {
      failures.push(`${category}: ${score ?? 'missing'}; required >= ${minimum}`);
    }
  }
  const cls = report.audits['cumulative-layout-shift']?.numericValue;
  if (typeof cls !== 'number' || !Number.isFinite(cls) || cls > 0.1)
    failures.push(`CLS: ${cls ?? 'missing'}; required <= 0.1`);
  return failures;
}
