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
const v6Stylesheet = await readFile(
  fileURLToPath(new URL('../src/components/v6/editorial-light.css', import.meta.url)),
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

test('homepage category links retain descriptive names and comfortable target sizes', async () => {
  const bento = await readFile(
    fileURLToPath(new URL('../src/components/v6/EditorialLightBento.jsx', import.meta.url)),
    'utf8'
  );
  const categoryLink = v6Stylesheet.match(/\.v6-category-link\s*\{([^}]*)\}/)?.[1];

  assert.match(bento, /categoryName = translate\(`category\.\$\{category\.id\}`\)/);
  assert.match(bento, /aria-label=\{`View all \$\{categoryName\} tools`\}/);
  assert.match(bento, /href=\{category\.path\}/);
  assert.ok(categoryLink, 'category links have dedicated styles');
  assert.match(categoryLink, /min-height:\s*44px/);
  assert.match(v6Stylesheet, /\.v6-category-link:hover/);
});

test('homepage tool links expose complete labels and a visible hover state', async () => {
  const bento = await readFile(
    fileURLToPath(new URL('../src/components/v6/EditorialLightBento.jsx', import.meta.url)),
    'utf8'
  );
  const linkStyle = v6Stylesheet.match(/\.v6-tool-link\s*\{([^}]*)\}/)?.[1];

  assert.match(bento, /<strong>\{tool\.name\}<\/strong>/);
  assert.match(bento, /<span>\{tool\.description\}<\/span>/);
  assert.ok(linkStyle, 'tool directory links have dedicated styles');
  assert.match(linkStyle, /min-height:\s*68px/);
  assert.match(v6Stylesheet, /\.v6-tool-link:hover/);
});
