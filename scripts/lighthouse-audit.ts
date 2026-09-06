import { writeFile } from 'node:fs/promises';
import { createServer } from 'node:net';
import { join } from 'node:path';
import lighthouse from 'lighthouse';
import desktopConfig from 'lighthouse/core/config/desktop-config.js';
import { chromium } from 'playwright';
import { lighthouseFailures } from '../tests/helpers/audit-thresholds.ts';
import { auditOutput, productionPreview } from '../tests/helpers/site-audit.ts';

async function availablePort(): Promise<number> {
  const socket = createServer();
  await new Promise<void>((resolve, reject) => {
    socket.once('error', reject);
    socket.listen(0, '127.0.0.1', resolve);
  });
  const address = socket.address();
  if (!address || typeof address === 'string') throw new Error('No debugging port available');
  await new Promise<void>((resolve, reject) => socket.close(error => (error ? reject(error) : resolve())));
  return address.port;
}

const output = await auditOutput('lighthouse');
const { server, baseURL } = await productionPreview();
const summary: unknown[] = [];
const failures: string[] = [];
try {
  for (const route of ['/', '/projects/maxiedev-events/', '/mods/boss-scaler/']) {
    for (const profile of ['mobile', 'desktop']) {
      for (let run = 1; run <= 3; run++) {
        const path = join(output, `${route.replaceAll('/', '_')}-${profile}-${run}`);
        console.log(`Lighthouse: ${route} ${profile} ${run}/3`);
        const port = await availablePort();
        const browser = await chromium.launch({
          executablePath: chromium.executablePath(),
          // Audit the normal browser cache behavior rather than Playwright's disabled default.
          ignoreDefaultArgs: ['--disable-back-forward-cache'],
          args: [`--remote-debugging-port=${port}`],
        });
        try {
          const result = await lighthouse(
            `${baseURL}${route}`,
            {
              port,
              output: ['json', 'html'],
              logLevel: 'error',
              onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
            },
            profile === 'desktop' ? desktopConfig : undefined,
          );
          if (!result) throw new Error('No Lighthouse report');
          await writeFile(`${path}.report.json`, result.report[0]);
          await writeFile(`${path}.report.html`, result.report[1]);
          if (result.lhr.runtimeError) throw new Error(JSON.stringify(result.lhr.runtimeError));
          failures.push(...lighthouseFailures(result.lhr).map(failure => `${route} ${profile} run ${run}: ${failure}`));
          summary.push({
            route,
            profile,
            run,
            version: result.lhr.lighthouseVersion,
            cls: result.lhr.audits['cumulative-layout-shift'].numericValue,
            categories: Object.fromEntries(
              Object.entries(result.lhr.categories).map(([key, value]) => [key, value.score]),
            ),
            audits: Object.values(result.lhr.audits).filter(audit => audit.score !== null && audit.score < 1),
          });
          await writeFile(join(output, 'summary.json'), JSON.stringify(summary, null, 2));
        } finally {
          await browser.close();
        }
      }
    }
  }
  if (failures.length) throw new Error(`Lighthouse quality gates failed:\n${failures.join('\n')}`);
} finally {
  await server.stop();
  console.log(`Lighthouse reports: ${output}`);
}
