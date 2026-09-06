import type { Mod } from './mods';
import type { Project } from './projects';
import { getTagCatalog, type TagDefinition, tagToSlug } from './tags';

export type TopicGroup = {
  color: string;
  description: string;
  icon?: string;
  name: string;
  linkLabel?: string;
  mods: Mod[];
  projects: Project[];
  slug: string;
};

const buildTagCoverage = (tagCatalog: TagDefinition[]) => {
  const definitionsBySlug = new Map<string, TagDefinition>();

  for (const definition of tagCatalog) {
    const slug = tagToSlug(definition);

    if (definitionsBySlug.has(slug)) {
      throw new Error(`Duplicate tag definition: ${slug}`);
    }

    definitionsBySlug.set(slug, definition);
  }

  const ancestorsBySlug = new Map<string, Set<string>>();

  const resolveAncestors = (slug: string, trail: string[] = []): Set<string> => {
    const cached = ancestorsBySlug.get(slug);

    if (cached) {
      return cached;
    }

    if (trail.includes(slug)) {
      throw new Error(`Circular tag parents: ${[...trail, slug].join(' -> ')}`);
    }

    const definition = definitionsBySlug.get(slug);

    if (!definition) {
      throw new Error(`Missing tag definition: ${slug}`);
    }

    const ancestors = new Set([slug]);

    for (const parent of definition.parents) {
      const parentSlug = tagToSlug(parent);

      if (!definitionsBySlug.has(parentSlug)) {
        throw new Error(`Unknown parent tag "${parent.id}" for "${slug}"`);
      }

      for (const ancestor of resolveAncestors(parentSlug, [...trail, slug])) {
        ancestors.add(ancestor);
      }
    }

    ancestorsBySlug.set(slug, ancestors);

    return ancestors;
  };

  const coveredTagsBySlug = new Map([...definitionsBySlug.keys()].map(slug => [slug, new Set<string>()]));

  for (const childSlug of definitionsBySlug.keys()) {
    for (const ancestorSlug of resolveAncestors(childSlug)) {
      coveredTagsBySlug.get(ancestorSlug)?.add(childSlug);
    }
  }

  return coveredTagsBySlug;
};

export const buildTopicGroups = (projects: Project[], mods: Mod[], tagCatalog: TagDefinition[]): TopicGroup[] => {
  const usedTags = new Set([
    ...projects.flatMap(project => project.tags.map(tagToSlug)),
    ...mods.flatMap(mod => mod.tags.map(tagToSlug)),
  ]);

  const missingTags = [...usedTags].filter(slug => !tagCatalog.some(definition => tagToSlug(definition) === slug));

  if (missingTags.length > 0) {
    throw new Error(`Missing tag definitions: ${missingTags.join(', ')}`);
  }

  const coveredTagsBySlug = buildTagCoverage(tagCatalog);

  return tagCatalog
    .filter(definition => {
      const coveredTags = coveredTagsBySlug.get(tagToSlug(definition));

      return coveredTags && [...usedTags].some(slug => coveredTags.has(slug));
    })
    .map(definition => {
      const slug = tagToSlug(definition);
      const coveredTags = coveredTagsBySlug.get(slug) ?? new Set([slug]);
      const { parents: _parents, ...topicDefinition } = definition;

      return {
        ...topicDefinition,
        slug,
        projects: projects.filter(project => project.tags.some(tag => coveredTags.has(tagToSlug(tag)))),
        mods: mods.filter(mod => mod.tags.some(tag => coveredTags.has(tagToSlug(tag)))),
      };
    });
};

export const getTopicGroups = async () => {
  const [{ getProjects }, { getMods }] = await Promise.all([import('./projects'), import('./mods')]);

  const [projects, mods, tags] = await Promise.all([getProjects(), getMods(), getTagCatalog()]);

  return buildTopicGroups(projects, mods, tags);
};
