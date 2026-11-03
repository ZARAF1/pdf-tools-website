import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const readSource = (path) => readFile(new URL(path, import.meta.url), 'utf8');

test('Compress PDF keeps its add-files chooser after selected files and before settings', async () => {
  const component = await readSource('../src/components/PdfCompressor.jsx');
  const selectedFiles = component.indexOf('{selectedFileCards}');
  const addFiles = component.indexOf('Choose up to 5 PDFs to compress', selectedFiles);
  const settings = component.indexOf('Higher compression', selectedFiles);

  assert.ok(selectedFiles >= 0, 'selected files should be rendered first');
  assert.ok(addFiles > selectedFiles && addFiles < settings, 'the add-files chooser should precede compression settings');
});

test('Image to PDF shows a top-right image count and keeps Add more in the attachment panel', async () => {
  const component = await readSource('../src/components/ImageToPdf.jsx');
  const fileSection = component.indexOf('className="image-to-pdf-file-section"');
  const fileSectionEnd = component.indexOf('</section>', fileSection);
  const count = component.indexOf('className="image-to-pdf-image-count"', fileSection);
  const addImages = component.indexOf('imageUi.addMoreImages', fileSection);
  const settings = component.indexOf('className="image-to-pdf-settings-shell"', fileSection);

  assert.ok(fileSection >= 0, 'the image picker should remain in a dedicated attachment panel');
  assert.ok(count > fileSection && count < fileSectionEnd, 'the selected-image count should remain in the attachment heading');
  assert.ok(addImages > count && addImages < fileSectionEnd, 'the add-images action should remain in the attachment panel');
  assert.ok(settings > fileSectionEnd, 'settings should follow the attachment panel');
});

test('Image to PDF attachment panel has a descriptive heading and theme-aware muted surface', async () => {
  const [component, styles] = await Promise.all([
    readSource('../src/components/ImageToPdf.jsx'),
    readSource('../src/index.css')
  ]);
  const panelStart = component.indexOf('className="image-to-pdf-file-section"');
  const panelEnd = component.indexOf('</section>', panelStart);
  const panel = component.slice(panelStart, panelEnd);

  assert.match(panel, /aria-labelledby="image-to-pdf-file-heading"/);
  assert.match(panel, /<h3 id="image-to-pdf-file-heading"[^>]*>\{imageUi\.uploadLabel\}<\/h3>/);
  assert.match(panel, /<p>\{formatToolUiMessage\(imageUi\.uploadDescription, \{ max: MAX_IMAGES \}\)\}<\/p>/);
  assert.match(panel, /pdf-workflow-upload pdf-upload-zone merge-pdf-upload-zone/);
  assert.match(styles, /\.crop-pdf-file-section,\s*\.organize-pdf-file-section,\s*\.image-to-pdf-file-section,\s*\.crop-pdf-settings-shell\s*\{[^}]*background:\s*var\(--surface-muted\)/s);
});

test('Image to PDF page tiles keep their previews and controls within narrow panels', async () => {
  const [component, styles] = await Promise.all([
    readSource('../src/components/ImageToPdf.jsx'),
    readSource('../src/index.css')
  ]);

  assert.match(component, /className={`image-to-pdf-page-card/);
  assert.match(component, /className="image-to-pdf-page-actions"/);
  assert.match(component, /className="image-to-pdf-page-thumbnail-wrap"/);
  assert.match(styles, /\.image-to-pdf-file-section\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)/s);
  assert.match(styles, /\.image-to-pdf-page-grid\s*\{[^}]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/s);
  assert.match(styles, /\.image-to-pdf-page-card\s*\{[^}]*min-width:\s*0/s);
  assert.match(styles, /\.image-to-pdf-page-actions\s*\{[^}]*grid-template-columns:\s*repeat\(5,\s*minmax\(0,\s*1fr\)\)/s);
  assert.match(styles, /@media \(max-width: 600px\) \{[\s\S]*?\.image-to-pdf-page-actions\s*\{/s);
});

test('PDF and Markdown file pickers use the shared attachment upload card', async () => {
  const component = await readSource('../src/components/PdfMarkdown.jsx');
  const pickerCards = component.match(/className="markdown-file-picker pdf-workflow-upload merge-pdf-upload-zone"/g) || [];
  const alternateMarkdownPicker = component.indexOf('id="markdown-upload"');
  const pageSettings = component.indexOf('id="markdown-page-selection"');

  assert.equal(pickerCards.length, 3, 'each PDF or Markdown file picker should use the shared card');
  assert.equal((component.match(/type="file"/g) || []).length, 3, 'all existing file inputs should remain available');
  assert.ok(alternateMarkdownPicker < pageSettings, 'all file choices should precede PDF-to-Markdown settings');
});
