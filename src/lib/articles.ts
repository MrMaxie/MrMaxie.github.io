import type { CollectionEntry } from 'astro:content';
import { compareDates } from './date';
import { tagToSlug } from './tags';

export const ARTICLES_PER_PAGE = 10;

type ArticleLike = {
    data: {
        date: Parameters<typeof compareDates>[0];
        tags: string[];
    };
};

export type ArticleEntry = CollectionEntry<'articles'>;

export type ArticlePage<T> = {
    entries: T[];
    currentPage: number;
    allPages: number;
};

export type TagPage<T> = ArticlePage<T> & {
    tag: string;
    tagName: string;
};

export const sortArticles = <T extends ArticleLike>(articles: T[]) =>
    [...articles].sort((left, right) => compareDates(right.data.date, left.data.date));

export const paginate = <T>(entries: T[], pageSize = ARTICLES_PER_PAGE): T[][] => {
    if (!Number.isInteger(pageSize) || pageSize <= 0) {
        throw new RangeError('Page size must be a positive integer.');
    }

    return Array.from({ length: Math.ceil(entries.length / pageSize) }, (_, index) =>
        entries.slice(index * pageSize, (index + 1) * pageSize),
    );
};

export const buildArticlePages = <T extends ArticleLike>(articles: T[], pageSize?: number) => {
    const pages = paginate(sortArticles(articles), pageSize);

    return pages.map((entries, index) => ({
        entries,
        currentPage: index + 1,
        allPages: pages.length,
    }));
};

export const buildTagPages = <T extends ArticleLike>(articles: T[], pageSize?: number) => {
    const tagNames = new Map<string, string>();

    for (const article of articles) {
        for (const tagName of article.data.tags) {
            tagNames.set(tagToSlug(tagName), tagName);
        }
    }

    return Array.from(tagNames, ([tag, tagName]) => {
        const matchingArticles = articles.filter(article =>
            article.data.tags.some(articleTag => tagToSlug(articleTag) === tag),
        );
        const pages = paginate(sortArticles(matchingArticles), pageSize);

        return pages.map((entries, index) => ({
            tag,
            tagName,
            entries,
            currentPage: index + 1,
            allPages: pages.length,
        }));
    }).flat();
};

const loadArticles = async () => {
    const { getCollection } = await import('astro:content');
    return getCollection('articles');
};

export const getArticles = async () => sortArticles(await loadArticles());

export const getArticlePages = async () => buildArticlePages(await loadArticles());

export const getTagPages = async () => buildTagPages(await loadArticles());
