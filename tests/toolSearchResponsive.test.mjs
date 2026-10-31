import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const styles = await readFile(new URL('../src/index.css', import.meta.url), 'utf8');
const searchSource = await readFile(new URL('../src/components/ToolSearch.jsx', import.meta.url), 'utf8');

test('mobile search suggestions have room for localized tool names', () => {
  const mobileStyles = styles.match(/@media \(max-width:\s*900px\)\s*\{([\s\S]*)$/)?.[1];
  assert.ok(mobileStyles, 'Mobile layout rules must exist');

  const suggestionPanel = mobileStyles.match(/\.tool-search-panel\s*\{([^}]*)\}/);
  assert.ok(suggestionPanel, 'The mobile search suggestion panel needs its own width');
  assert.match(
    suggestionPanel[1],
    /width:\s*min\(18rem,\s*calc\(100vw\s*-\s*7\.5rem\)\)/,
    'Suggestions should expand beyond the search field while staying within the mobile viewport'
  );
});

test('expanded search stays beside fixed utility icons at every viewport width', () => {
  const topbarRule = styles.match(/\.site-topbar\s*\{([^}]*)\}/);
  const mediaBlocks = [...styles.matchAll(/^@media \(max-width:\s*(900|580)px\)\s*\{([\s\S]*?)^}/gm)];
  const mobileTopbarRule = mediaBlocks
    .filter(([, maxWidth, rules]) => maxWidth === '900' && rules.includes('.site-topbar'))
    .pop();
  const narrowTopbarRule = mediaBlocks
    .filter(([, maxWidth, rules]) => maxWidth === '580' && rules.includes('.site-topbar'))
    .pop();
  const expandedShellRule = styles.match(/\.tool-search-shell\.is-expanded\s*\{([^}]*)\}/);

  assert.ok(topbarRule, 'The desktop topbar rule must exist');
  assert.ok(mobileTopbarRule, 'The mobile topbar rule must exist');
  assert.ok(narrowTopbarRule, 'The narrow mobile topbar rule must exist');
  assert.ok(expandedShellRule, 'Expanded search needs a width constraint');
  assert.match(topbarRule[1], /padding-right:\s*calc\(clamp\(1rem,\s*3vw,\s*2rem\)\s*\+\s*10\.5rem\)/);
  assert.match(mobileTopbarRule[2], /\.site-topbar\s*\{[^}]*padding-right:\s*10\.5rem/);
  assert.match(narrowTopbarRule[2], /\.site-topbar\s*\{[^}]*padding-right:\s*10\.5rem/);
  assert.match(expandedShellRule[1], /max-width:\s*100%/);
  assert.doesNotMatch(searchSource, /style=\{isExpanded\s*&&\s*window\.matchMedia/);
});
