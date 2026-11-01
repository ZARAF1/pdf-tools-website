import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { GUIDE_ONLY_TOOLS, TOOL_GUIDES } from '../src/components/toolGuides.mjs';

const app = await readFile(
  fileURLToPath(new URL('../src/App.jsx', import.meta.url)),
  'utf8'
);
const sitePages = await readFile(
  fileURLToPath(new URL('../src/components/SitePages.jsx', import.meta.url)),
  'utf8'
);
const toolPage = await readFile(
  fileURLToPath(new URL('../src/components/ToolPage.jsx', import.meta.url)),
  'utf8'
);
const registry = await readFile(
  fileURLToPath(new URL('../src/components/toolRegistry.js', import.meta.url)),
  'utf8'
);

test('every active tool and the unavailable Excel page has a detailed guide', () => {
  const toolEntries = registry.split('export const TOOL_REGISTRY = [')[1];
  const expectedIds = [...toolEntries.matchAll(/id: '([^']+)'/g)].map(([, id]) => id).concat('excel');
  assert.deepEqual(Object.keys(TOOL_GUIDES).sort(), expectedIds.sort());

  for (const id of expectedIds) {
    const guide = TOOL_GUIDES[id];
    assert.ok(guide.what.length >= 100, `${id} needs a detailed explanation of what it does`);
    assert.ok(guide.how.length >= 100, `${id} needs a detailed explanation of how it works`);
    assert.ok(guide.result.length >= 100, `${id} needs a detailed explanation of its output`);
    assert.ok(guide.applications.length >= 100, `${id} needs practical application examples`);
  }
  assert.equal(GUIDE_ONLY_TOOLS.length, 1);
  assert.equal(GUIDE_ONLY_TOOLS[0].id, 'excel');
});

test('tool guides have a specific route and are grouped under tool categories', () => {
  assert.match(app, /<Route path="\/resources\/tools\/:toolId"/);
  assert.match(sitePages, /TOOL_CATEGORIES\.map/);
  assert.match(sitePages, /TOOL_REGISTRY/);
  assert.match(sitePages, /\/resources\/tools\/\$\{tool\.id\}/);
});

test('each active tool attachment card links to its matching detailed guide', () => {
  assert.match(toolPage, /to=\{`\/resources\/tools\/\$\{tool\}`\}/);
  assert.match(toolPage, /localizedResources\.readMore/);
});
