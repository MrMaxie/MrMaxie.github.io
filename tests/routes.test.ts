import assert from 'node:assert/strict';
import test from 'node:test';
import Routes from '../src/lib/routes.ts';

test('generates the stable public route shapes', () => {
    assert.equal(Routes.home(), '/');
    assert.equal(Routes.about(), '/about');
    assert.equal(Routes.articles(), '/blog');
    assert.equal(Routes.articles(2), '/blog/page/2');
    assert.equal(Routes.article('php-game-development'), '/blog/article/php-game-development');
    assert.equal(Routes.tag('game-development'), '/blog/tag/game-development');
    assert.equal(Routes.tag('game-development', 2), '/blog/tag/game-development/2');
});
