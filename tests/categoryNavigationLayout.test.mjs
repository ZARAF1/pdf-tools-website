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

test('homepage category labels stay upright without changing orbit motion or fan placement', async () => {
  const home = await readFile(
    fileURLToPath(new URL('../src/components/Home.jsx', import.meta.url)),
    'utf8'
  );
  const decorativeOrbit = stylesheet.match(/\.home-hero-orbit\s*\{([^}]*)\}/)?.[1];
  const categoryOrbit = stylesheet.match(/\.home-hero-category-orbit\s*\{([^}]*)\}/)?.[1];
  const categoryBadge = stylesheet.match(/\.home-hero-category-badge\s*\{([^}]*)\}/)?.[1];
  const categoryCounter = stylesheet.match(/\.home-hero-category-counter\s*\{([^}]*)\}/)?.[1];
  const categoryLabel = stylesheet.match(/\.home-hero-category-label\s*\{([^}]*)\}/)?.[1];
  const toolLink = stylesheet.match(/\.home-hero-tool-fan\.is-open \.home-hero-tool-link\s*\{([^}]*)\}/)?.[1];
  const mobileStyles = stylesheet.match(/@media \(max-width: 760px\) \{([\s\S]*?)\n\}/)?.[1];

  assert.match(home, /style=\{\{ '--badge-angle': `\$\{index \* 72\}deg` \}\}/);
  assert.match(home, /event\.propertyName === 'transform'/);
  assert.ok(decorativeOrbit, 'decorative orbit styles should be defined');
  assert.ok(categoryOrbit, 'category orbit styles should be defined');
  assert.ok(categoryBadge, 'category badge styles should be defined');
  assert.ok(categoryCounter, 'category counter-rotation styles should be defined');
  assert.ok(categoryLabel, 'category label styles should be defined');
  assert.ok(toolLink, 'tool fan link placement should be defined');
  assert.match(decorativeOrbit, /top:\s*50%;[\s\S]*left:\s*50%;[\s\S]*transform:\s*translate\(-50%, -50%\)/);
  assert.match(categoryOrbit, /animation:\s*home-hero-orbit 36s linear infinite/);
  assert.match(categoryBadge, /rotate\(var\(--badge-angle\)\) translateY\(-11\.6rem\)/);
  assert.match(categoryCounter, /animation:\s*home-hero-counter-orbit 36s linear infinite/);
  assert.match(categoryLabel, /rotate\(calc\(-1 \* var\(--badge-angle\)\)\)/);
  assert.match(mobileStyles, /\.home-hero-category-badge\s*\{[^}]*translateY\(-6\.3rem\)/);
  assert.match(toolLink, /rotate\(var\(--tool-angle\)\)[\s\S]*?translateY\(calc\(-1 \* var\(--tool-fan-radius, 4rem\)\)\)[\s\S]*?rotate\(calc\(-1 \* var\(--tool-angle\)\)\)/);
});

test('tool-name tooltips stay close to moving tools while remaining upright', async () => {
  const home = await readFile(
    fileURLToPath(new URL('../src/components/Home.jsx', import.meta.url)),
    'utf8'
  );
  const tooltipPosition = stylesheet.match(/\.home-hero-tool-tooltip-position\s*\{([^}]*)\}/)?.[1];
  const tooltip = stylesheet.match(/(?:^|\n)\.home-hero-tool-tooltip\s*\{([^}]*)\}/)?.[1];

  assert.match(home, /<span className="home-hero-tool-tooltip-position"[^>]*>[\s\S]*?<span className="home-hero-tool-tooltip"/);
  assert.ok(tooltipPosition, 'tooltips need a separate wrapper anchored to each tool');
  assert.match(tooltipPosition, /position:\s*absolute\s*;/);
  assert.match(tooltipPosition, /transform:\s*translate\(-50%,\s*0\.25rem\)\s*;/);
  assert.ok(tooltip, 'tool-name tooltip styles should be defined');
  assert.match(tooltip, /transform-origin:\s*50%\s+50%\s*;/);
  assert.match(stylesheet, /\.home-hero-tool-fan\.is-open\.is-ready \.home-hero-tool-tooltip\s*\{[^}]*animation:\s*home-hero-tool-tooltip-counter-orbit 18s linear infinite/);
  assert.match(stylesheet, /@keyframes home-hero-tool-tooltip-counter-orbit\s*\{[\s\S]*?from\s*\{\s*rotate:\s*0turn;?\s*\}[\s\S]*?to\s*\{\s*rotate:\s*-1turn;?\s*\}/);
});
