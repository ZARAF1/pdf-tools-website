import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const app = await readFile(new URL('../src/App.jsx', import.meta.url), 'utf8');
const registry = await readFile(new URL('../src/components/toolRegistry.js', import.meta.url), 'utf8');
const toolPage = await readFile(new URL('../src/components/ToolPage.jsx', import.meta.url), 'utf8');
const privacyPage = await readFile(new URL('../src/components/SitePages.jsx', import.meta.url), 'utf8');
const component = await readFile(new URL('../src/components/PdfPowerPoint.jsx', import.meta.url), 'utf8');
const styles = await readFile(new URL('../src/index.css', import.meta.url), 'utf8');

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

test('PDF and PowerPoint attachments use a dedicated muted selected-file section', () => {
  const selectedSection = component.match(
    /className="conversion-selected-file-section powerpoint-selected-file-section"[\s\S]*?<\/section>/
  )?.[0];

  assert.ok(selectedSection, 'the selected PDF or PowerPoint file has a dedicated section');
  assert.match(selectedSection, /PDF to convert/);
  assert.match(selectedSection, /PowerPoint file to convert/);
  assert.match(selectedSection, /One PDF selected\./);
  assert.match(selectedSection, /One PowerPoint file selected\./);
  assert.match(selectedSection, /pdf-attached-file-card powerpoint-attached-file-card/);
  assert.match(selectedSection, /<AttachedFileActions/);
  assert.match(styles, /\.conversion-selected-file-section\s*\{[^}]*background:\s*var\(--surface-muted\)/s);
});

test('PowerPoint directions group the three conversion settings and filename with their action', () => {
  const settingsControls = component.match(
    /className="powerpoint-settings-controls">([\s\S]*?)<\/div>\s*\n\s*\{isProcessing &&/
  )?.[0];
  const actionRow = component.match(
    /className="powerpoint-conversion-actions"[\s\S]*?<\/div>/
  )?.[0];

  assert.match(component, /id="powerpoint-settings-heading"[^>]*>Conversion Settings<\/h3>/);
  assert.ok(settingsControls, 'conversion settings controls are present');
  assert.match(settingsControls, /powerpointUi\.pageSelection/);
  assert.match(settingsControls, /powerpointUi\.imageQuality/);
  assert.match(settingsControls, /powerpointUi\.slideSize/);
  assert.match(settingsControls, /powerpointUi\.pdfPageSize/);
  assert.doesNotMatch(settingsControls, /powerpointUi\.outputFilename/);
  assert.match(styles, /\.powerpoint-settings-controls\s*\{[^}]*grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\)/s);

  assert.ok(actionRow, 'filename and conversion action row is present');
  assert.match(actionRow, /powerpoint-output-filename/);
  assert.match(actionRow, /value=\{outputName\}/);
  assert.match(actionRow, /setOutputName\(event\.target\.value\)/);
  assert.match(actionRow, /isPdfToPowerPoint \? powerpointUi\.convertToPowerPoint : powerpointUi\.convertToPdf/);
  assert.match(component, /<DownloadReadyCard[\s\S]*?showFilenameEditor=\{false\}/);
  assert.match(styles, /\.powerpoint-conversion-actions\s*\{[^}]*display:\s*grid/s);
});
