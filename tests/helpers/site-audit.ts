import { mkdir, mkdtemp, readdir, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { preview } from 'astro';

export async function auditOutput(kind: string) {
  if (!process.env.AUDIT_OUTPUT_DIR) return mkdtemp(join(tmpdir(), `portfolio-${kind}-audit-`));
  const output = join(process.env.AUDIT_OUTPUT_DIR, kind);
  await mkdir(output, { recursive: true });
  return output;
}

export async function productionPreview() {
  const { AUDIT_TLS_CERT: certificate, AUDIT_TLS_KEY: privateKey } = process.env;
  if (Boolean(certificate) !== Boolean(privateKey)) throw new Error('Audit TLS requires both certificate and key');
  const https =
    certificate && privateKey ? { cert: await readFile(certificate), key: await readFile(privateKey) } : undefined;
  const server = await preview({
    server: { host: '127.0.0.1', port: 0, open: false },
    vite: { preview: { https } },
    logLevel: 'silent',
  });
  return { server, baseURL: `${https ? 'https' : 'http'}://127.0.0.1:${server.port}` };
}

export async function builtRoutes() {
  const files = await readdir(new URL('../../dist/', import.meta.url), { recursive: true });
  return files
    .map(file => file.replaceAll('\\', '/'))
    .filter(file => file === 'index.html' || file.endsWith('/index.html'))
    .map(file => `/${file.replace(/index\.html$/, '')}`)
    .sort();
}
