import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const stylesheet = await readFile(
  fileURLToPath(new URL('../src/index.css', import.meta.url)),
  'utf8'
);

test('translated category labels stay left-aligned when they wrap', () => {
  const categoryLinkRule = stylesheet.match(/\.site-left-category-link\s*\{([^}]*)\}/);
  assert.ok(categoryLinkRule, 'category navigation styles are defined');
  assert.match(categoryLinkRule[1], /text-align:\s*left\s*;/);
});
