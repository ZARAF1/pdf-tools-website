import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const app = await readFile(new URL('../src/App.jsx', import.meta.url), 'utf8');
const registry = await readFile(new URL('../src/components/toolRegistry.js', import.meta.url), 'utf8');
const page = await readFile(new URL('../src/components/ToolPage.jsx', import.meta.url), 'utf8');
const component = await readFile(new URL('../src/components/PdfMarkdown.jsx', import.meta.url), 'utf8');
const styles = await readFile(new URL('../src/index.css', import.meta.url), 'utf8');
const wordComponent = await readFile(new URL('../src/components/PdfToWord.jsx', import.meta.url), 'utf8');
const powerpointComponent = await readFile(new URL('../src/components/PdfPowerPoint.jsx', import.meta.url), 'utf8');
const pdfImagesComponent = await readFile(new URL('../src/components/PdfToImages.jsx', import.meta.url), 'utf8');

test('PDF ↔ Markdown has a registered route and direction-specific controls', () => {
  assert.match(app, /<Route path="\/pdf-to-markdown"/);
  assert.match(registry, /id: 'markdown'[\s\S]*?path: '\/pdf-to-markdown'/);
  assert.match(page, /markdown: \{[\s\S]*?title: 'PDF ↔ Markdown'/);
  assert.match(component, /Markdown to PDF/);
  assert.match(component, /PDF to Markdown/);
  assert.match(component, /image-pdf-direction-switch conversion-direction-switch/);
  assert.equal((component.match(/className="markdown-file-picker pdf-workflow-upload merge-pdf-upload-zone"/g) || []).length, 2);
  assert.match(component, /id="markdown-pdf-input"/);
  assert.match(component, /id="markdown-upload-pdf"/);
  assert.doesNotMatch(component, /id="markdown-upload"/);
  assert.match(component, /textarea/);
  assert.match(component, /pageSelection/);
});

test('PDF and Markdown attachments use a dedicated muted selected-file section', () => {
  const selectedSections = component.match(
    /className="conversion-selected-file-section markdown-selected-file-section"[\s\S]*?<\/section>/g
  ) || [];

  assert.equal(selectedSections.length, 2, 'both conversion directions group their selected file');
  assert.match(selectedSections[0], /PDF to convert/);
  assert.match(selectedSections[0], /One PDF selected\./);
  assert.match(selectedSections[1], /Markdown file to convert/);
  assert.match(selectedSections[1], /Optional Markdown file selected\./);
  assert.ok(selectedSections.every((section) => section.includes('pdf-attached-file-card')));
  assert.match(styles, /\.conversion-selected-file-section\s*\{[^}]*background:\s*var\(--surface-muted\)/s);
});

test('each Markdown conversion picker is hidden after attachment and remains replaceable', () => {
  const pickers = component.match(
    /\{!file \? \(\s*<div className="markdown-file-picker pdf-workflow-upload merge-pdf-upload-zone">/g
  ) || [];

  assert.equal(pickers.length, 2, 'both directions hide their picker after selecting a file');
  assert.equal((component.match(/ref=\{(?:pdfInputRef|markdownInputRef)\}/g) || []).length, 2,
    'hidden file inputs remain mounted for Replace actions');
  assert.equal((component.match(/<AttachedFileActions[\s\S]*?onReplace=\{[^}]+\}[\s\S]*?onRemove=\{[^}]+\}/g) || []).length, 2,
    'both selected-file cards provide Replace and Remove actions');
});

test('Markdown selected-file actions align at the end of both attachment cards', () => {
  const selectedSections = component.match(
    /className="conversion-selected-file-section markdown-selected-file-section"[\s\S]*?<\/section>/g
  ) || [];

  assert.equal(selectedSections.length, 2);
  assert.ok(selectedSections.every((section) => (
    section.indexOf('<AttachedFileActions') > section.indexOf('{file.name}')
  )), 'Replace and Remove remain after the filename in both directions');
  assert.match(styles, /\.markdown-selected-file-section \.pdf-attached-file-actions\s*\{[^}]*margin-left:\s*auto/s);
});

test('Markdown conversion filenames are editable beside Convert and not duplicated on the result card', () => {
  assert.match(component, /className="pdf-markdown-conversion-actions"/);
  assert.match(component, /className="word-output-filename pdf-markdown-output-filename"/);
  assert.match(component, /fileActions\.outputFilename/);
  assert.match(component, /value=\{outputName \|\| defaultOutputName\}/);
  assert.match(component, /normalizeOutputFileName/);
  assert.match(component, /showFilenameEditor=\{false\}/);
  assert.match(styles, /\.pdf-markdown-conversion-actions\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)\s+auto/s);
  assert.match(styles, /@media \(max-width: 640px\)[\s\S]*?\.pdf-markdown-conversion-actions\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)/s);
});

test('main PDF conversion actions share a consistent height and readable filename label', () => {
  for (const [name, source] of [
    ['PDF ↔ Markdown', component],
    ['PDF ↔ Word', wordComponent],
    ['PDF ↔ PowerPoint', powerpointComponent],
    ['PDF to Images', pdfImagesComponent]
  ]) {
    assert.match(source, /pdf-conversion-action-button/, `${name} should use the shared conversion action style`);
  }
  assert.match(styles, /\.pdf-conversion-action-button\s*\{[^}]*min-height:\s*3\.25rem;[^}]*padding:\s*0\.75rem\s+1\.25rem/s);
  assert.match(styles, /\.pdf-markdown-output-filename\s*\{[^}]*font-size:\s*0\.875rem/s);
  assert.match(styles, /\.word-conversion-actions\s*>\s*button\s*\{[^}]*flex:\s*0\s+0\s+auto/s);
});
