import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getLocalizedToolPage,
  TOOL_PAGE_TRANSLATIONS
} from '../src/i18n/toolPageLocalization.mjs';
import { SUPPORTED_LANGUAGES } from '../src/i18n/languageCatalog.mjs';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const readSource = (path) => readFile(
  fileURLToPath(new URL(path, import.meta.url)),
  'utf8'
);

const mergeDetailPoints = {
  what: 'Combines whole PDFs or selected pages into one document.',
  how: 'Preview, select, and arrange pages, then merge them in your browser.',
  result: 'A separate PDF in your chosen order; optional bookmarks and blank pages are available.'
};

test('Merge keeps its three localized points within the shared tool-detail format', async () => {
  const toolPageSource = await readSource('../src/components/ToolPage.jsx');
  assert.match(toolPageSource, /localizedContent\.detailPoints\.map/);
  assert.match(toolPageSource, /<ToolIcon[^>]*aria-hidden="true"/);

  for (const { code } of SUPPORTED_LANGUAGES) {
    const localized = getLocalizedToolPage(
      code,
      'merge',
      null,
      { intro: 'legacy intro', detailPoints: mergeDetailPoints },
      { ruleKey: 'pdf2To5', rule: 'PDF files' }
    );
    assert.deepEqual(localized.detailPoints.map(({ key }) => key), ['what', 'how', 'result']);
    assert.ok(localized.detailPoints.every(({ text }) => text));
    assert.ok(localized.detailPointHeadings.what);
    if (code !== 'en') {
      assert.notEqual(localized.detailPointHeadings.what, 'What it does', `${code} heading should be translated`);
      assert.ok(TOOL_PAGE_TRANSLATIONS[code], `${code} should have a supported locale`);
    }

    const otherTool = getLocalizedToolPage(
      code,
      'image',
      null,
      { intro: 'legacy intro', detailPoints: mergeDetailPoints },
      { ruleKey: 'images10', rule: 'Images' }
    );
    assert.equal(otherTool.detailPoints.length, 3, `${code} should provide three points on other tools too`);
  }
});

test('the V6 homepage tool links display registry icons inside consistent icon tiles', async () => {
  const homeSource = await readSource('../src/components/Home.jsx');
  const bentoSource = await readSource('../src/components/v6/EditorialLightBento.jsx');
  const stylesSource = await readSource('../src/components/v6/editorial-light.css');
  assert.match(homeSource, /EditorialLightBento/);
  assert.match(bentoSource, /const Icon = tool\.icon/);
  assert.match(bentoSource, /className="v6-tool-icon"/);
  assert.match(stylesSource, /\.v6-tool-icon\s*\{[^}]*width:\s*38px[^}]*height:\s*38px/);
});
