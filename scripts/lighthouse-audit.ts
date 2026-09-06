import { mkdtemp, writeFile } from 'node:fs/promises';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import lighthouse from 'lighthouse';
import desktopConfig from 'lighthouse/core/config/desktop-config.js';
import { chromium } from 'playwright';
import { productionPreview } from '../tests/helpers/site-audit.ts';

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

const output = await mkdtemp(join(tmpdir(), 'portfolio-lighthouse-'));
const { server, baseURL } = await productionPreview();
const summary: unknown[] = [];
try {
  for (const route of ['/', '/projects/maxiedev-events/', '/mods/boss-scaler/']) {
    for (const profile of ['mobile', 'desktop']) {
      for (let run = 1; run <= 3; run++) {
        const path = join(output, `${route.replaceAll('/', '_')}-${profile}-${run}`);
        console.log(`Lighthouse: ${route} ${profile} ${run}/3`);
        const port = await availablePort();
        const browser = await chromium.launch({
          executablePath: chromium.executablePath(),
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
          if (!result || result.lhr.runtimeError)
            throw new Error(JSON.stringify(result?.lhr.runtimeError ?? 'No report'));
          await writeFile(`${path}.report.json`, result.report[0]);
          await writeFile(`${path}.report.html`, result.report[1]);
          summary.push({
            route,
            profile,
            run,
            version: result.lhr.lighthouseVersion,
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
} finally {
  await server.stop();
  console.log(`Lighthouse reports: ${output}`);
}
