import type { ImageMetadata, MarkdownInstance } from 'astro';

export const TagKind = { Technology: 'technology', Topic: 'topic' } as const;
export type TagKind = (typeof TagKind)[keyof typeof TagKind];
export const Access = { Private: 'private', Proprietary: 'proprietary' } as const;
export type Access = (typeof Access)[keyof typeof Access];
export const LinkKind = { Website: 'website', Source: 'source', Issues: 'issues' } as const;
export type LinkKind = (typeof LinkKind)[keyof typeof LinkKind];
export const GameId = { Terraria: 'terraria', Isaac: 'isaac', HogwartsLegacy: 'hogwarts-legacy' } as const;
export type GameId = (typeof GameId)[keyof typeof GameId];

export interface TagDefinition {
  readonly id: string;
  readonly name: string;
  readonly color: string;
  readonly description: string;
  readonly icon?: string;
  readonly kind: TagKind;
  readonly parents: readonly TagDefinition[];
}

function requiredText(value: string): string {
  const text = value.trim();
  if (!text) throw new Error('Content text must not be empty');
  return text;
}

function colorValue(value: string): string {
  if (!/^#[0-9a-f]{6}$/i.test(value)) throw new Error(`Invalid content color: ${value}`);
  return value;
}

export function createTag(
  input: Omit<TagDefinition, 'parents'> & { parents?: readonly TagDefinition[] },
): TagDefinition {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(input.id)) throw new Error(`Invalid tag ID: ${input.id}`);
  return Object.freeze({
    ...input,
    name: requiredText(input.name),
    description: requiredText(input.description),
    color: colorValue(input.color),
    parents: Object.freeze([...(input.parents ?? [])]),
  });
}

export interface ResourceLink {
  label: string;
  href: string;
  kind?: LinkKind;
}

export function normalizeLinks(links: readonly ResourceLink[]): ResourceLink[] {
  return links.map(link => {
    const url = new URL(link.href);
    if (!['https:', 'http:'].includes(url.protocol)) throw new Error(`Unsupported link protocol: ${url.protocol}`);
    return { ...link, label: requiredText(link.label), href: url.href };
  });
}

export interface ResourceData {
  name: string;
  summary: string;
  description: MarkdownInstance<Record<string, unknown>>['Content'];
  tags: readonly TagDefinition[];
  version?: string;
  license?: string;
  access?: Access;
  logo?: ImageMetadata;
  logoTone?: 'original' | 'light';
  icon?: string;
  monogram?: string;
  links: ResourceLink[];
}

export interface ProjectData extends ResourceData {
  color: string;
}
export interface Screenshot {
  image: ImageMetadata;
  alt: string;
}
export interface ModData extends ResourceData {
  game: GameId;
  screenshots: Screenshot[];
}

function normalizeResource<T extends Omit<ResourceData, 'links'> & { links?: ResourceLink[] }>(input: T) {
  return {
    ...input,
    name: requiredText(input.name),
    summary: requiredText(input.summary),
    tags: [...new Set(input.tags)],
    links: normalizeLinks(input.links ?? []),
  };
}

export function createProject(input: Omit<ProjectData, 'links'> & { links?: ResourceLink[] }): ProjectData {
  return { ...normalizeResource(input), color: colorValue(input.color) };
}

export function createMod(
  input: Omit<ModData, 'links' | 'screenshots'> & { links?: ResourceLink[]; screenshots?: Screenshot[] },
): ModData {
  return {
    ...normalizeResource(input),
    screenshots: (input.screenshots ?? []).map(screenshot => ({ ...screenshot, alt: requiredText(screenshot.alt) })),
  };
}
