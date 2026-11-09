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
const sitePages = await readSource('../src/components/SitePages.jsx');
const expectedTools = [
  'crop', 'edit', 'merge', 'split', 'rotate', 'protect', 'unlock', 'image-pdf',
  'word', 'ocr', 'compress', 'watermark', 'remove',
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

test('tool detail and individual guide pages omit category labels', () => {
  assert.doesNotMatch(content, /<p className="tool-detail-category">/);
  const toolGuidePage = sitePages.match(/export const ToolGuidePage = \(\{ toolId \}\) => \{([\s\S]*?)\n\};/)?.[1];
  assert.ok(toolGuidePage, 'individual tool guide page should be defined');
  assert.doesNotMatch(toolGuidePage, /category\? translate\(`category\.\$\{category\.id\}`\)/);
});

test('tool guide link appears under the What you get point', () => {
  assert.match(
    content,
    /key === 'result' && \([\s\S]*?to=\{`\/resources\/tools\/\$\{tool\}`\}[\s\S]*?localizedResources\.readMore[\s\S]*?\)\}/
  );
});

test('attachment guidance does not repeat the tool guide link', () => {
  const attachmentGuidance = content.match(
    /<aside className="tool-attachment-guidance"[\s\S]*?<\/aside>/
  )?.[0];
  assert.ok(attachmentGuidance, 'tool attachment guidance should render');
  assert.doesNotMatch(attachmentGuidance, /resources\/tools|readMore/i);
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
      'image-pdf',
      { name: 'Images ↔ PDF', description: 'Create PDFs from images or export PDF pages as images.' },
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
  const imageTool = content.match(/  'image-pdf': \{([\s\S]*?)\r?\n  \},/);
  assert.ok(imageTool);
  const imageDescriptions = imageTool[1].match(/detailPoints: \{([\s\S]*?)\r?\n    \}/)?.[1];
  assert.ok(imageDescriptions);
  assert.doesNotMatch(imageDescriptions, /unencrypted|password-protected/i);
  assert.match(content, /tool === 'image-pdf'[\s\S]*?\? null/);
});

test('homepage collection links use their registered tool icon consistently', async () => {
  const bento = await readSource('../src/components/v6/EditorialLightBento.jsx');
  const styles = await readSource('../src/components/v6/editorial-light.css');
  assert.match(bento, /const Icon = tool\.icon/);
  assert.match(bento, /<Icon aria-hidden="true" \/>/);
  assert.match(styles, /\.v6-tool-icon\s*\{[^}]*width:\s*38px[^}]*height:\s*38px/);
  assert.match(await readSource('../src/components/toolRegistry.js'), /id: 'merge'[\s\S]*?icon: FileStack/);
});
