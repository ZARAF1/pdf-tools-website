import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const app = await readFile(
  fileURLToPath(new URL('../src/App.jsx', import.meta.url)),
  'utf8'
);
const stylesheet = await readFile(
  fileURLToPath(new URL('../src/index.css', import.meta.url)),
  'utf8'
);

test('translated category labels stay left-aligned when they wrap', () => {
  const categoryLinkRule = stylesheet.match(/\.site-left-category-link\s*\{([^}]*)\}/);
  assert.ok(categoryLinkRule, 'category navigation styles are defined');
  assert.match(categoryLinkRule[1], /text-align:\s*left\s*;/);
});

test('category navigation has 10 px spacing and translated tooltips in every rail mode', () => {
  const defaultCategoryNav = stylesheet.match(
    /\.site-left-category-nav\s*\{\s*(?=[^}]*min-height:)([^}]*)\}/
  );
  const collapsedCategoryNav = stylesheet.match(
    /\.site-left-navigation\.is-collapsed \.site-left-category-nav\s*\{\s*(?=[^}]*margin-top:\s*0\.35rem)([^}]*)\}/
  );
  const mobileCategoryNav = stylesheet.match(
    /\.site-left-category-nav\s*\{\s*(?=[^}]*margin-top:\s*0\.35rem)([^}]*)\}/
  );

  assert.ok(defaultCategoryNav, 'default category navigation styles are defined');
  assert.ok(collapsedCategoryNav, 'collapsed category navigation styles are defined');
  assert.ok(mobileCategoryNav, 'mobile category navigation styles are defined');
  for (const [mode, rule] of [
    ['expanded', defaultCategoryNav],
    ['collapsed', collapsedCategoryNav],
    ['mobile', mobileCategoryNav]
  ]) {
    assert.match(rule[1], /row-gap:\s*0\.625rem\s*;/, `${mode} category icons need 10 px vertical spacing`);
  }
  assert.match(app, /title=\{translate\(`category\.\$\{category\.id\}`\)\}/);
});
