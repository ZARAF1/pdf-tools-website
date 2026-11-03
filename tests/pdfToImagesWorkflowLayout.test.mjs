import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [source, styles] = await Promise.all([
  readFile(new URL('../src/components/PdfToImages.jsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/index.css', import.meta.url), 'utf8')
]);

test('PDF to Images groups its attachment card and upload area in a muted section', () => {
  const attachmentIndex = source.indexOf('className="pdf-images-file-section"');
  const selectedFileIndex = source.indexOf('className="pdf-attached-file-card', attachmentIndex);
  const uploadIndex = source.indexOf('className: `pdf-workflow-upload', attachmentIndex);
  const settingsIndex = source.indexOf('className="pdf-images-settings-shell');
  const shellIndex = source.indexOf('className="tool-attachment-section image-pdf-attachment-section pdf-images-attachment-section"');

  assert.match(source, /className="pdf-tool-workflow pdf-to-images-workflow space-y-6"/, 'the PDF workflow should not constrain the shared shell width');
  assert.ok(shellIndex >= 0, 'the PDF attachment should use the shared attachment shell');
  assert.ok(attachmentIndex >= 0, 'the PDF attachment workspace has its own section');
  assert.ok(selectedFileIndex > attachmentIndex, 'the selected PDF card is inside its attachment section');
  assert.ok(uploadIndex > attachmentIndex, 'the upload zone is inside its attachment section');
  assert.ok(settingsIndex > attachmentIndex, 'settings follow the attachment section');
  assert.match(source, /translate\('attachPdfHere'\)/);
  assert.match(source, /One unencrypted PDF · up to \{MAX_PAGES\} pages/);
  assert.match(source, /tool-attachment-guidance/);
  assert.match(source, /One-page PDFs download as a single image; multi-page PDFs are bundled in a ZIP/);
  assert.match(styles, /\.pdf-images-file-section,\s*\.pdf-images-settings-shell\s*\{[^}]*background:\s*var\(--surface-muted\)/s);
  assert.match(styles, /\.pdf-images-attachment-section\s+\.pdf-images-file-section\s*\{[^}]*background:\s*transparent/s);
  assert.match(styles, /\.pdf-images-settings-panel\s*\{[^}]*background:\s*var\(--surface-background\)/s);
});

test('Choose Settings exposes automatic margin cropping and a pre-conversion output name', () => {
  const settingsIndex = source.indexOf('className="pdf-images-settings-shell');
  const settingsHeadingIndex = source.indexOf('Choose Settings', settingsIndex);

  assert.ok(settingsIndex >= 0, 'the settings shell uses its own panel');
  assert.ok(settingsHeadingIndex > settingsIndex, 'Choose Settings is inside that panel');
  assert.match(source, /id="pdf-images-auto-crop"/);
  assert.match(source, /aria-describedby="pdf-images-auto-crop-help"/);
  assert.match(source, /id="pdf-images-auto-crop-help"/);
  assert.match(source, /Automatically crop blank page margins/);
  assert.match(source, /Removes blank space around page content\. Pages without visible content are left unchanged\./);
  assert.match(source, /id="pdf-images-output-name"/);
  assert.match(source, /Output file name/);
});

test('conversion trims page margins and routes one image separately from multi-page ZIP output', () => {
  assert.match(source, /findContentBounds\(context\.getImageData/);
  assert.match(source, /createPdfImageDownload\(/);
  assert.match(source, /useToolExitGuard\(Boolean\(file\),\s*outputUrl\)/);
  assert.match(source, /href=\{outputUrl\}/);
  assert.match(source, /downloadLabel=\{downloadLabel\}/);
});

test('PDF to Images keeps Convert and Reset right-aligned', () => {
  const actionRowStart = source.indexOf('className="pdf-workflow-actions');
  const actionRowEnd = source.indexOf('{progress &&', actionRowStart);
  const actionRow = source.slice(actionRowStart, actionRowEnd);

  assert.match(actionRow, /className="pdf-workflow-actions[^"]*justify-end/);
  assert.ok(
    actionRow.indexOf('Convert PDF to Images') < actionRow.indexOf('Reset'),
    'Reset follows the conversion action'
  );
});
