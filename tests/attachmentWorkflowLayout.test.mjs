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

test('Image to PDF keeps its add-images action with the selected image list before settings', async () => {
  const component = await readSource('../src/components/ImageToPdf.jsx');
  const selectedImages = component.indexOf('className="pdf-workflow-selected space-y-3"');
  const addImages = component.indexOf('imageUi.addMoreImages', selectedImages);
  const settings = component.indexOf('className="pdf-workflow-controls grid', selectedImages);

  assert.ok(selectedImages >= 0, 'selected image cards should be grouped');
  assert.ok(addImages > selectedImages && addImages < settings, 'the add-images action should follow the list and precede settings');
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
