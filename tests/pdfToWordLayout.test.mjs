import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const component = await readFile(new URL('../src/components/PdfToWord.jsx', import.meta.url), 'utf8');
const styles = await readFile(new URL('../src/index.css', import.meta.url), 'utf8');

test('places direction-specific guidance above the full-width upload card', () => {
  const guidance = component.match(/<aside className="tool-attachment-guidance"[\s\S]*?<\/aside>/)?.[0];

  assert.ok(guidance?.includes('Convert text-based PDFs into editable Word documents.'));
  assert.ok(guidance?.includes('image-based PDF'));
  assert.match(component, /translate\('attachWordFileHere'\)/);
  assert.doesNotMatch(component, /<p className="mt-2 text-slate-500">Convert text-based and scanned PDFs into editable Word documents\.<\/p>/);
  assert.match(component, /className="tool-attachment-section conversion-attachment-shell word-attachment-section"/);
  assert.match(component, /className="word-conversion-workspace"/);
  assert.match(component, /image-pdf-direction-switch conversion-direction-switch/);
  assert.match(component, />\s*PDF to Word\s*<\/button>/);
  assert.match(component, />\s*Word to PDF\s*<\/button>/);
  assert.equal((component.match(/className="conversion-direction-option disabled:cursor-not-allowed disabled:opacity-50"/g) || []).length, 2);
  assert.ok(component.indexOf('tool-attachment-guidance') < component.indexOf('word-file-panel'));
  assert.ok(
    component.indexOf('aria-label="Choose conversion direction"') < component.indexOf('conversion-attachment-shell'),
    'the direction switch appears before the shared attachment shell'
  );
  assert.match(styles, /\.image-pdf-direction-switch\.conversion-direction-switch\s*\{[^}]*display:\s*grid;[^}]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/s);
  assert.match(styles, /\.image-pdf-direction-switch button\[aria-pressed='true'\]\s*\{[^}]*background:\s*#2563eb;[^}]*color:\s*#fff/s);
  assert.doesNotMatch(component, /max-w-3xl/);
});

test('separates the attachment panel from conversion controls with the workspace gap', () => {
  assert.match(styles, /\.word-conversion-workspace,\s*\.powerpoint-workspace\s*\{[^}]*gap:\s*2rem/s);
  assert.doesNotMatch(component, /conversion-direction-switch mb-5/);
  assert.match(component, /<input \{\.\.\.getInputProps\(\)\} className="sr-only" \/>/);
  assert.match(styles, /\.word-file-workspace\s*\{[^}]*gap:\s*1rem/s);
  assert.doesNotMatch(styles, /\.word-file-workspace\s*\{[^}]*margin-top/s);
});

test('places the PDF or Word attachment in its own panel before conversion controls', () => {
  const attachmentPanel = component.match(/<section className="word-file-panel"[\s\S]*?<\/section>/)?.[0];

  assert.ok(attachmentPanel, 'file selection has its own labelled panel');
  assert.match(attachmentPanel, /aria-label="File to convert"/);
  assert.match(attachmentPanel, /merge-pdf-upload-zone/);
  assert.match(attachmentPanel, /pdf-attached-file-card/);
  assert.match(attachmentPanel, /<AttachedFileActions/);
  assert.ok(
    component.indexOf('word-conversion-panel') > component.indexOf('className="word-file-panel"'),
    'conversion controls follow the attachment panel'
  );
  assert.match(styles, /\.conversion-attachment-shell \.word-file-panel,[\s\S]*?background:\s*transparent/);
  assert.match(styles, /\.conversion-attachment-shell \.word-file-panel,[\s\S]*?border:\s*0/);
});

test('PDF to Word keeps the muted attachment surface and shared blue glow', () => {
  assert.match(
    component,
    /className="tool-attachment-section conversion-attachment-shell word-attachment-section"/
  );
  assert.match(
    styles,
    /\.tool-attachment-section\.conversion-attachment-shell\s*\{[^}]*background:\s*var\(--surface-muted\)/
  );
  assert.match(styles, /\.tool-attachment-section\s*\{[^}]*animation:\s*tool-attachment-border-pulse 2\.8s ease-in-out infinite/s);
  assert.doesNotMatch(
    styles,
    /\.tool-attachment-section\.word-attachment-section\s*\{[^}]*box-shadow:\s*none[^}]*animation:\s*none/s
  );
  assert.match(
    styles,
    /\.conversion-attachment-shell \.tool-attachment-guidance\s*\{[^}]*background:\s*var\(--surface-background\)/s
  );
  assert.match(
    styles,
    /:root\[data-theme='dark'\] \.tool-attachment-section\s*\{[^}]*box-shadow:[^}]*rgb\(37 99 235/s
  );
  assert.doesNotMatch(
    styles,
    /:root\[data-theme='dark'\] \.tool-attachment-section\.word-attachment-section\s*\{[^}]*box-shadow:\s*none/s
  );
});
