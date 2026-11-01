import test from 'node:test';
import assert from 'node:assert/strict';
import { getLocalizedToolPage } from '../src/i18n/toolPageLocalization.mjs';
import { SUPPORTED_LANGUAGES } from '../src/i18n/languageCatalog.mjs';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const readSource = (path) => readFile(
  fileURLToPath(new URL(path, import.meta.url)),
  'utf8'
);

const content = await readSource('../src/components/ToolPage.jsx');
const expectedTools = [
  'crop', 'edit', 'merge', 'split', 'rotate', 'protect', 'unlock', 'image',
  'pdf-images', 'word', 'ocr', 'compress', 'watermark', 'remove',
  'organize-pages', 'redact', 'sign', 'excel', 'powerpoint', 'markdown'
];

test('every tool detail defines exactly three purpose, process, and result points', () => {
  const toolContent = content.match(/const TOOL_CONTENT = \{([\s\S]*?)\n\};\r?\n\r?\nconst ATTACHMENT_RULES/)?.[1];
  assert.ok(toolContent, 'ToolPage should define tool-specific content');
  for (const id of expectedTools) {
    const key = /^[A-Za-z_$][\w$]*$/.test(id) ? id : `'${id}'`;
    const entry = toolContent.match(new RegExp(`^  ${key}: \\{([\\s\\S]*?)^  \\},?$`, 'm'));
    assert.ok(entry, `${id} should have a tool detail content entry`);
    const points = entry[1].match(/detailPoints: \{\s*what: `([^`]+)`,\s*how: `([^`]+)`,\s*result: `([^`]+)`\s*\}/);
    assert.ok(points, `${id} should define what, how, and result`);
    assert.ok(points.slice(1).every((point) => point.trim()), `${id} should have three non-empty points`);
    assert.doesNotMatch(points[0], /unencrypted/i, `${id} should not repeat PDF password restrictions in its description`);
  }
});

test('tool pages render each point with its matching tool icon', () => {
  assert.match(content, /localizedContent\.detailPoints\.map/);
  assert.match(content, /localizedContent\.detailPointHeadings\[key\]/);
  assert.match(content, /<ToolIcon className="tool-detail-point-icon" aria-hidden="true" \/>/);
});

test('every locale localizes the three point labels and retains tool-page specificity', async () => {
  const image = {
    detailPoints: {
      what: 'Create a PDF from images.',
      how: 'Place each image on a configurable page.',
      result: 'A separate PDF with one page per image.'
    },
    intro: 'legacy intro',
    steps: ['Choose images.', 'Configure options.', 'Create the PDF.'],
    faqs: []
  };
  for (const { code } of SUPPORTED_LANGUAGES) {
    const localized = getLocalizedToolPage(
      code,
      'image',
      { name: 'Image to PDF', description: 'Create a PDF from images.' },
      image,
      { ruleKey: 'images10', rule: 'Images', info: 'Guidance.' }
    );
    assert.deepEqual(localized.detailPoints.map(({ key }) => key), ['what', 'how', 'result']);
    assert.equal(new Set(Object.values(localized.detailPointHeadings)).size, 3, `${code} labels should be distinct`);
    if (code !== 'en') {
      assert.notEqual(localized.detailPointHeadings.what, 'What it does', `${code} labels should be translated`);
    }
  }
});

test('PDF password limitations stay in the input guidance instead of descriptions', async () => {
  assert.match(content, /rule: 'One unencrypted PDF/);
  const imageRule = content.match(/  image: \{\r?\n([\s\S]*?)\r?\n  \},/);
  assert.ok(imageRule);
  assert.doesNotMatch(imageRule[1], /unencrypted|password-protected/i);
});

test('only the Merge Home icon receives the larger tool-fan treatment', async () => {
  const home = await readSource('../src/components/Home.jsx');
  const styles = await readSource('../src/index.css');
  assert.match(home, /localizedTool\.id === 'merge' \? ' home-hero-tool-icon--merge'/);
  assert.match(styles, /\.home-hero-tool-icon--merge\s*\{[^}]*width:\s*1\.75rem[^}]*height:\s*1\.75rem/);
  assert.match(await readSource('../src/components/toolRegistry.js'), /id: 'merge'[\s\S]*?icon: FileStack/);
});
