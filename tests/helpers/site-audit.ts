import { readdir } from 'node:fs/promises';
import { preview } from 'astro';

export async function productionPreview() {
  const server = await preview({ server: { host: '127.0.0.1', port: 0, open: false }, logLevel: 'silent' });
  return { server, baseURL: `http://127.0.0.1:${server.port}` };
}

export async function builtRoutes() {
  const files = await readdir(new URL('../../dist/', import.meta.url), { recursive: true });
  return files
    .map(file => file.replaceAll('\\', '/'))
    .filter(file => file === 'index.html' || file.endsWith('/index.html'))
    .map(file => `/${file.replace(/index\.html$/, '')}`)
    .sort();
}

export const sampleRoutes = [
  '/',
  '/about/',
  '/projects/',
  '/mods/',
  '/projects/maxiedev-events/',
  '/mods/boss-scaler/',
  '/mods/daedalian-keys/',
  '/projects/free-tray-games/',
  '/tags/',
  '/tags/typescript/',
];
