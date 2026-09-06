const safeJoin = (...parts: Array<string | number | undefined>) =>
  ['/', ...parts, '/']
    .filter(part => part !== undefined && part !== '')
    .join('/')
    .replace(/\/{2,}/g, '/');

const Routes = {
  home: () => safeJoin(),
  projects: () => safeJoin('projects'),
  project: (slug: string) => safeJoin('projects', slug),
  mods: () => safeJoin('mods'),
  mod: (slug: string) => safeJoin('mods', slug),
  modGame: (game: string) => `${safeJoin('mods')}#${encodeURIComponent(game)}`,
  topics: () => safeJoin('tags'),
  topic: (tag: string) => safeJoin('tags', tag),
  about: () => safeJoin('about'),
} as const;

export default Routes;
