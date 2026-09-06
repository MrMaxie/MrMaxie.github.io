import { featuredModIds, modOrder } from '~/config/mods';
import { gameCatalog } from '../data/games';
import type { ModData } from './content';
import { FEATURED_RESOURCE_LIMIT, orderCatalog, selectProjects } from './project-selection';

export interface Mod extends ModData {
  slug: string;
}

export type Game = (typeof gameCatalog)[number];

export const getGame = (gameId: Mod['game']) => {
  const game = gameCatalog.find(candidate => candidate.id === gameId);

  if (!game) {
    throw new Error(`Unknown game: ${gameId}`);
  }

  return game;
};

const loadMods = async (): Promise<Mod[]> => {
  const entries = import.meta.glob<{ default: ModData }>('../data/mods/*.ts', { eager: true });
  return Object.entries(entries).map(([path, entry]) => ({
    slug: path.slice(path.lastIndexOf('/') + 1).replace(/\.ts$/, ''),
    ...entry.default,
  }));
};

export const getMods = async () => {
  const entries = await loadMods();
  return orderCatalog(entries, modOrder);
};

export const getFeaturedMods = async () =>
  selectProjects(await loadMods(), featuredModIds, {
    label: 'Featured mods',
    minimum: 1,
    maximum: FEATURED_RESOURCE_LIMIT,
  });

export const getModGroups = async () => {
  const mods = await getMods();

  return gameCatalog
    .map(game => ({
      ...game,
      mods: mods.filter(mod => mod.game === game.id),
    }))
    .filter(group => group.mods.length > 0);
};
