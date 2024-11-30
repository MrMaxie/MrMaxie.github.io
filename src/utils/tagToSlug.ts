export const tagToSlug = (tag: string) => tag
    .toLowerCase()
    .replace(/\//g, ' or ')
    .replace(/\+/g, 'plus')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-');
