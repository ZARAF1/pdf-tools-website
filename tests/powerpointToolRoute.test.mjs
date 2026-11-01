import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const app = await readFile(new URL('../src/App.jsx', import.meta.url), 'utf8');
const registry = await readFile(new URL('../src/components/toolRegistry.js', import.meta.url), 'utf8');
const toolPage = await readFile(new URL('../src/components/ToolPage.jsx', import.meta.url), 'utf8');
const privacyPage = await readFile(new URL('../src/components/SitePages.jsx', import.meta.url), 'utf8');

test('PowerPoint conversion is available from the bidirectional route and tool catalog', () => {
  assert.match(registry, /id: 'powerpoint'[\s\S]*?name: 'PDF ↔ PowerPoint'[\s\S]*?path: '\/pdf-to-powerpoint'/);
  assert.match(app, /const PdfPowerPoint = lazy\(\(\) => import\('\.\/components\/PdfPowerPoint'\)\)/);
  assert.match(app, /path="\/pdf-to-powerpoint"[\s\S]*?<PdfPowerPoint \/>/);
  assert.match(app, /path="\/powerpoint-to-pdf" element=\{<Navigate to="\/pdf-to-powerpoint" replace \/>}/);
  assert.match(toolPage, /powerpoint: \{[\s\S]*?description: 'Convert selected PDF pages into image-based PowerPoint slides/);
  assert.match(toolPage, /ruleKey: 'powerpointPdfOne'/);
  assert.doesNotMatch(toolPage, /PowerPoint conversion is not available on this page yet/);
  assert.match(toolPage, /font-family names used by the presentation may be sent to Google Fonts/);
  assert.match(privacyPage, /font-family names used by the slides may be included in those requests/i);
});
