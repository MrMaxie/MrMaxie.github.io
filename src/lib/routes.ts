const safeJoin = (...parts: Array<string | number | undefined>) =>
    ['/', ...parts]
        .filter(part => part !== undefined && part !== '')
        .join('/')
        .replace(/\/{2,}/g, '/');

const Routes = {
    home: () => safeJoin(),
    about: () => safeJoin('about'),
    articles: (page = 1) => (page === 1 ? safeJoin('blog') : safeJoin('blog', 'page', page)),
    article: (id: string) => safeJoin('blog', 'article', id),
    tag: (tag: string, page = 1) =>
        page === 1 ? safeJoin('blog', 'tag', tag) : safeJoin('blog', 'tag', tag, page),
} as const;

export default Routes;
