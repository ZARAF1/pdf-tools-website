import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const source = async (path) => {
  try {
    return await readFile(fileURLToPath(new URL(path, import.meta.url)), 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') return '';
    throw error;
  }
};

const [app, home, hero, search, bento, searchLogic, toolPage, styles] = await Promise.all([
  source('../src/App.jsx'),
  source('../src/components/Home.jsx'),
  source('../src/components/v6/EditorialLightHero.jsx'),
  source('../src/components/v6/EditorialLightSearch.jsx'),
  source('../src/components/v6/EditorialLightBento.jsx'),
  source('../src/components/v6/searchTools.mjs'),
  source('../src/components/ToolPage.jsx'),
  source('../src/components/v6/editorial-light.css'),
]);

test('the root route renders Home without a variant preview gate', () => {
  assert.match(app, /<Route path="\/" element=\{<Home \/>} \/>/);
  assert.doesNotMatch(app, /preview=v[1-9]|preview=v10|VITE_ENABLE_V[1-9]_PREVIEW/);
  assert.doesNotMatch(app, /Variant(?:ScannableGrid|Editorial|Bento|CommandCenter|Vibrant|Glass|Brutal|Zen|Cyberpunk)/);
});

test('Home composes the selected V6 header, hero, bento, explanation, ad, and footer', () => {
  for (const component of [
    'EditorialLightHeader',
    'EditorialLightHero',
    'EditorialLightBento',
    'EditorialLightWhy',
    'AdSlot',
    'Footer',
  ]) {
    assert.match(home, new RegExp(`<${component}\\b`));
  }
});

test('the homepage provides one main landmark and a working skip target', () => {
  assert.match(home, /href="#v6-main"/);
  assert.match(home, /<main id="v6-main"/);
  assert.equal((home.match(/<main\b/g) || []).length, 1);
});

test('the homepage forces its selected warm light theme locally', () => {
  assert.match(home, /className="v6-editorial" data-theme="light"/);
  assert.match(styles, /color-scheme:\s*light/);
});

test('the homepage hero contains exactly one primary heading', () => {
  assert.equal((hero.match(/<h1\b/g) || []).length, 1);
  assert.match(hero, /id="v6-title"/);
});

test('tool search uses the native search input type', () => {
  assert.match(search, /id="v6-tool-search"\s+type="search"/);
  assert.doesNotMatch(search, /id="v6-tool-search"[\s\S]{0,80}type="text"/);
});

test('tool search has an associated descriptive label', () => {
  assert.match(search, /htmlFor="v6-tool-search"/);
  assert.match(search, /Search PDF tools by name, description, or keyword/);
});

test('tool search exposes its result controls and expanded state', () => {
  assert.match(search, /aria-controls="v6-search-results"/);
  assert.match(search, /aria-expanded=\{Boolean\(isOpen && query\.trim\(\)\)\}/);
});

test('tool search announces results and retains keyboard dismissal', () => {
  assert.match(search, /role="status"/);
  assert.match(search, /event\.key === 'Escape'/);
  assert.match(search, /setQuery\(''\)/);
});

test('the V6 directory maps its category cards from the central registry', () => {
  assert.match(bento, /TOOL_CATEGORIES\.map/);
  assert.match(bento, /TOOL_REGISTRY\.filter/);
});

test('each category link has a category-specific accessible name', () => {
  assert.match(bento, /aria-label=\{`View all \$\{categoryName\} tools`\}/);
  assert.match(bento, /href=\{category\.path\}/);
});

test('tool directory links retain registry names, descriptions, icons, and paths', () => {
  assert.match(bento, /tool\.icon/);
  assert.match(bento, /tool\.name/);
  assert.match(bento, /tool\.description/);
  assert.match(bento, /href=\{tool\.path\}/);
});

test('the tool search retains registry and category matching', () => {
  assert.match(searchLogic, /TOOL_REGISTRY\.filter/);
  assert.ok(searchLogic.includes('return `${tool.name} ${tool.description} ${tool.keywords}'));
  assert.match(searchLogic, /category\?\.name/);
});

test('tool pages opt into the V6 light visual system', () => {
  assert.match(toolPage, /v6-tool-page/);
  assert.match(styles, /\.v6-tool-page\s*\{/);
  assert.match(styles, /color-scheme:\s*light/);
});

test('tool pages retain a single primary heading', () => {
  assert.equal((toolPage.match(/<h1\b/g) || []).length, 1);
});

test('tool workspace and guidance remain wrapped with V6 surface classes', () => {
  assert.match(toolPage, /tool-attachment-section v6-tool-workspace/);
  assert.match(toolPage, /tool-attachment-guidance/);
  assert.match(styles, /\.v6-tool-page \.v6-tool-workspace/);
});

test('tool page instructions and process steps use cohesive cards', () => {
  assert.match(toolPage, /className="v6-tool-info-card"/);
  assert.match(toolPage, /className="v6-tool-steps"/);
  assert.match(toolPage, /className="v6-tool-flow-step"/);
  assert.match(styles, /\.v6-tool-info-card\s*\{/);
});

test('tool page inputs retain the minimum 16px text size and workspace motion is off', () => {
  assert.match(styles, /\.v6-tool-page input,[\s\S]*?font-size:\s*16px/);
  assert.match(styles, /\.v6-tool-workspace\s*\{[^}]*animation:\s*none/s);
});

test('V6 tool-page styles support mobile and desktop workflow layouts and hover states', () => {
  assert.match(styles, /@media \(max-width: 760px\)/);
  assert.match(styles, /@media \(min-width: 760px\)/);
  assert.match(styles, /\.v6-tool-page a:hover/);
  assert.match(styles, /max-width:\s*1440px/);
});
