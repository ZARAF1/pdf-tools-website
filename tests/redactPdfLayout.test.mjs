import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const component = await readFile(new URL('../src/components/RedactPdf.jsx', import.meta.url), 'utf8');
const stylesheet = await readFile(new URL('../src/index.css', import.meta.url), 'utf8');

test('Redact PDF shows the selected attachment in its own muted panel before settings', () => {
  const filePanelStart = component.indexOf('className="redact-pdf-file-section"');
  const settingsPanelStart = component.indexOf('className="redact-pdf-settings-panel"', filePanelStart);
  const actionStart = component.indexOf('Create Redacted PDF', settingsPanelStart);
  const filePanel = component.slice(filePanelStart, settingsPanelStart);

  assert.ok(filePanelStart >= 0, 'selected attachment has its own panel');
  assert.ok(settingsPanelStart > filePanelStart, 'settings follow the attachment panel');
  assert.ok(actionStart > settingsPanelStart, 'processing follows the settings panel');
  assert.match(filePanel, /PDF to redact/);
  assert.match(filePanel, /<FileText aria-hidden="true" \/>[\s\S]*?<h3 id="redact-pdf-file-heading"/);
  assert.match(filePanel, /AttachedFileIcon/);
  assert.match(filePanel, /AttachedFileActions/);
  assert.match(component, /redact-pdf-upload pdf-workflow-upload pdf-upload-zone merge-pdf-upload-zone/);
  assert.match(stylesheet, /\.redact-pdf-file-section,\s*\.redact-pdf-settings-panel\s*\{[^}]*background:\s*var\(--surface-muted\)/s);
  assert.match(stylesheet, /\.redact-pdf-file-section\s+\.pdf-attached-file-card\s*\{[^}]*background:\s*var\(--surface-background\)/s);
});

test('Redact PDF groups page editing controls in a separate settings panel', () => {
  const settingsStart = component.indexOf('className="redact-pdf-settings-panel"');
  const settingsEnd = component.indexOf('className="redact-pdf-preview-panel watermark-preview-panel"', settingsStart);
  const settingsPanel = component.slice(settingsStart, settingsEnd);

  assert.match(settingsPanel, /<h3 id="redact-pdf-settings-heading">Redaction Settings<\/h3>/);
  assert.match(settingsPanel, /<Settings2 aria-hidden="true" \/>[\s\S]*?<h3 id="redact-pdf-settings-heading">Redaction Settings<\/h3>/);
  assert.match(settingsPanel, /Add redaction by coordinates/);
  assert.match(component.slice(settingsEnd), /aria-label="Preview previous page"/);
  assert.match(component.slice(settingsEnd), /aria-label="Preview next page"/);
  assert.match(component.slice(settingsEnd), /aria-label=\{`Preview page \$\{pageNumber\}`\}/);
  assert.match(component.slice(settingsEnd), /aria-pressed=\{pageNumber === currentPage\}/);
  assert.match(component.slice(settingsEnd), /Visual preview and redaction drawing area/);
  assert.match(settingsPanel, /Redaction rasterizes every page/);
  assert.match(stylesheet, /\.redact-pdf-file-section,\s*\.redact-pdf-settings-panel\s*\{[^}]*background:\s*var\(--surface-muted\)/s);
});

test('Redact PDF supports up to 30 pages and documents the same limit', async () => {
  const toolPage = await readFile(new URL('../src/components/ToolPage.jsx', import.meta.url), 'utf8');

  assert.match(component, /const MAX_PAGES = 30;/);
  assert.match(toolPage, /intro: 'Cover sensitive information in a new PDF copy before sharing it\. Select a document with up to 30 pages/);
  assert.match(toolPage, /\['How many pages are supported\?', 'The tool accepts documents with up to 30 pages\.'\]/);
  assert.match(toolPage, /redact:[\s\S]*?ruleKey: 'pdf30',\r?\n    rule: 'One unencrypted PDF · up to 30 pages'/);
});

test('Redact PDF places a filename field before right-aligned processing actions', () => {
  assert.match(component, /import \{ normalizeOutputFileName \} from '\.\.\/lib\/outputFileName\.mjs';/);
  assert.match(component, /className="watermark-output-actions redact-pdf-output-actions"/);
  assert.match(component, /className="watermark-preview-layout"/);
  assert.match(component, /className="watermark-preview-page-thumbnails"/);
  assert.match(component, /htmlFor="redact-pdf-output-filename">Output Filename/);
  assert.match(component, /id="redact-pdf-output-filename"/);
  assert.match(component, /className="redact-pdf-output-buttons watermark-apply-button"/);
  assert.match(component, /showFilenameEditor=\{false\}/);
  assert.match(stylesheet, /\.redact-pdf-output-buttons\s*\{[^}]*justify-content:\s*flex-end/s);
});
