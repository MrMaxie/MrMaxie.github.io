import { Tags } from '../data/tags';
import type { TagDefinition } from './content';

export { type TagDefinition, TagKind } from './content';

export function resolveTags(tags: readonly TagDefinition[]): TagDefinition[] {
  const catalog = new Map(Object.values(Tags).map(tag => [tag.id, tag]));
  const resolved = new Map<string, TagDefinition>();
  for (const tag of tags) {
    const definition = catalog.get(tag.id);
    if (!definition) throw new Error(`Unknown tag: ${tag.id}`);
    resolved.set(definition.id, definition);
  }
  return [...resolved.values()];
}
export const tagToSlug = (tag: TagDefinition) => tag.id;
export const getTagCatalog = async () => Object.values(Tags);
export const getTagDefinitions = async () => new Map((await getTagCatalog()).map(tag => [tag.id, tag]));
