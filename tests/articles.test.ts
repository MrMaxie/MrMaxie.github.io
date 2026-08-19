import assert from 'node:assert/strict';
import test from 'node:test';
import { buildArticlePages, buildTagPages, paginate } from '../src/lib/articles.ts';

const article = (id: number, tags: string[]) => ({
    id: String(id),
    data: {
        date: { year: 2026, month: 1, day: id },
        tags,
    },
});

test('paginates entries without gaps or duplicates', () => {
    const entries = Array.from({ length: 23 }, (_, index) => index + 1);
    const pages = paginate(entries, 10);

    assert.deepEqual(
        pages.map(page => page.length),
        [10, 10, 3],
    );
    assert.deepEqual(pages.flat(), entries);
});

test('sorts articles before assigning stable pages', () => {
    const pages = buildArticlePages([article(1, []), article(3, []), article(2, [])], 2);

    assert.deepEqual(
        pages.map(page => page.entries.map(entry => entry.id)),
        [['3', '2'], ['1']],
    );
    assert.deepEqual(
        pages.map(page => [page.currentPage, page.allPages]),
        [
            [1, 2],
            [2, 2],
        ],
    );
});

test('paginates every tag independently', () => {
    const articles = [
        ...Array.from({ length: 11 }, (_, index) => article(index + 1, ['PHP'])),
        article(12, ['Rust']),
    ];
    const pages = buildTagPages(articles, 10);
    const phpPages = pages.filter(page => page.tag === 'php');
    const rustPages = pages.filter(page => page.tag === 'rust');

    assert.equal(phpPages.length, 2);
    assert.deepEqual(
        phpPages.map(page => page.entries.length),
        [10, 1],
    );
    assert.equal(rustPages.length, 1);
    assert.equal(rustPages[0]?.entries.length, 1);
});

test('rejects invalid page sizes', () => {
    assert.throws(() => paginate([1], 0), RangeError);
    assert.throws(() => paginate([1], 1.5), RangeError);
});
