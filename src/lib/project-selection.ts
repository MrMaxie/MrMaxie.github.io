type ProjectLike = { slug: string };

export const FEATURED_RESOURCE_LIMIT = 4;

export const orderCatalog = <T extends ProjectLike>(entries: T[], ids: readonly string[]) => [
  ...selectProjects(entries, ids, { label: 'Catalog order' }),
  ...entries.filter(entry => !ids.includes(entry.slug)),
];

export const selectProjects = <T extends ProjectLike>(
  projects: T[],
  ids: readonly string[],
  options: { label: string; minimum?: number; maximum?: number },
) => {
  const { label, minimum, maximum } = options;

  if (minimum !== undefined && ids.length < minimum) {
    throw new RangeError(`${label} must contain at least ${minimum} project.`);
  }

  if (maximum !== undefined && ids.length > maximum) {
    throw new RangeError(`${label} must contain at most ${maximum} projects.`);
  }

  if (new Set(ids).size !== ids.length) {
    throw new Error(`${label} contains duplicate project identifiers.`);
  }

  const projectsBySlug = new Map(projects.map(project => [project.slug, project]));
  const unknownIds = ids.filter(id => !projectsBySlug.has(id));

  if (unknownIds.length > 0) {
    throw new Error(`${label} references unknown projects: ${unknownIds.join(', ')}.`);
  }

  return ids.map(id => projectsBySlug.get(id) as T);
};
