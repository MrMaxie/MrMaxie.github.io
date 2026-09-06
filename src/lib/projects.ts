import { featuredProjectIds, projectOrder } from '~/config/projects';
import type { ProjectData } from './content';
import { FEATURED_RESOURCE_LIMIT, orderCatalog, selectProjects } from './project-selection';

export interface Project extends ProjectData {
  slug: string;
}

const loadProjects = async (): Promise<Project[]> => {
  const entries = import.meta.glob<{ default: ProjectData }>('../data/projects/*.ts', { eager: true });
  return Object.entries(entries).map(([path, entry]) => ({
    slug: path.slice(path.lastIndexOf('/') + 1).replace(/\.ts$/, ''),
    ...entry.default,
  }));
};

export const getProjects = async () => {
  const entries = await loadProjects();
  return orderCatalog(entries, projectOrder);
};

export const getFeaturedProjects = async () =>
  selectProjects(await loadProjects(), featuredProjectIds, {
    label: 'Featured projects',
    minimum: 1,
    maximum: FEATURED_RESOURCE_LIMIT,
  });
