const safeJoin = (...parts: Array<string | number | undefined>) => ['/', ...parts]
    .filter(x => x !== undefined && x !== '')
    .join('/')
    .replace(/\/+/g, '/');

/**
 * Routes - a collection of functions that return the path to a specific page.
 */
const Routes = {
    home: () => safeJoin(),
    about: () => safeJoin('about'),
    contact: () => safeJoin('contact'),

    articles: (page = 1) => page === 1 ? safeJoin('blog') : safeJoin('blog', 'page', page),
    article: (slug: string) => safeJoin('blog', 'article', slug),

    tag: (tag: string, page = 1) => page === 1 ? safeJoin('blog', 'tag', tag) : safeJoin('blog', 'tag', tag, 'page', page),
} as const;

export default Routes;
