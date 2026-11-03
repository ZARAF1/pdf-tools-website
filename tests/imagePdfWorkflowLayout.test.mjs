import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const readSource = (path) => readFile(new URL(path, import.meta.url), 'utf8');

test('Image to PDF groups settings and composed image tiles in matching preview panels', async () => {
  const [component, styles] = await Promise.all([
    readSource('../src/components/ImageToPdf.jsx'),
    readSource('../src/index.css')
  ]);
  const attachmentStart = component.indexOf('className="image-to-pdf-file-section"');
  const attachmentEnd = component.indexOf('</section>', attachmentStart);
  const attachedImagesIndex = component.indexOf('<ol className="image-to-pdf-attached-image-list"', attachmentStart);
  const addImagesIndex = component.indexOf('imageUi.addMoreImages', attachmentStart);
  const settingsStart = component.indexOf('className="image-to-pdf-settings-shell"');
  const previewStart = component.indexOf('className="image-to-pdf-preview-shell"');
  const settingsSection = component.slice(settingsStart, previewStart);
  const previewSection = component.slice(previewStart);

  assert.ok(attachmentStart >= 0);
  assert.ok(attachedImagesIndex > attachmentStart && attachedImagesIndex < attachmentEnd, 'attached images should be listed in the attachment panel');
  assert.ok(addImagesIndex > attachedImagesIndex && addImagesIndex < attachmentEnd, 'the add-more action should follow the attached image list');
  assert.ok(settingsStart > attachmentStart, 'settings should follow the attachment section');
  assert.ok(previewStart > settingsStart, 'preview should follow settings');
  assert.match(component, /className="image-to-pdf-image-count"[^>]*>[\s\S]*imageUi\.imageCount/);
  assert.match(component, /<h4 className="image-to-pdf-attached-images-title">\{imageUi\.attachedImages\}<\/h4>/);
  assert.match(component, /<ol className="image-to-pdf-attached-image-list" aria-label=\{imageUi\.attachedImages\}>/);
  assert.match(component, /className="merge-selected-file-position image-to-pdf-attached-image-position"/);
  assert.match(component, /String\(index \+ 1\)\.padStart\(2, '0'\)/);
  assert.match(component, /image\.name[\s\S]*image\.width[\s\S]*formatBytes\(image\.file\.size\)/);
  assert.match(settingsSection, /className="image-to-pdf-settings-panel"/);
  assert.match(settingsSection, /<h3 className="merge-selected-files-title">\{imageUi\.settingsTitle\}<\/h3>\s*<p>\{imageUi\.settingsDescription\}<\/p>/);
  assert.match(settingsSection, /className="merge-section-heading-title merge-output-settings-title">\{imageUi\.settingsScope\}<\/h3>/);
  assert.match(settingsSection, /className="merge-section-heading merge-output-settings-heading"[\s\S]*?<\/div>\s*<p className="image-to-pdf-choose-settings-description">/);
  assert.match(settingsSection, /imageUi\.pageSize/);
  assert.match(settingsSection, /imageUi\.jpegQuality/);
  assert.match(settingsSection, /imageUi\.encodingNote/);
  assert.match(settingsSection, /imageUi\.settingsDescription/);
  assert.match(settingsSection, /aria-pressed=\{settingsScope === 'all'\}/);
  assert.match(settingsSection, /aria-pressed=\{settingsScope === 'select'\}/);
  assert.match(previewSection, /className="merge-section-heading merge-page-selection-heading"[\s\S]*className="merge-section-heading-title merge-page-selection-title">\{imageUi\.pagePreview\}/);
  assert.match(previewSection, /className="image-to-pdf-page-preview-description"/);
  assert.match(previewSection, /image-to-pdf-preview-panel/);
  assert.match(previewSection, /image-to-pdf-page-card/);
  assert.match(previewSection, /className="merge-page-source-select image-to-pdf-page-select"[\s\S]*onClick=\{\(\) => toggleImageSelection\(image\.id\)\}[\s\S]*aria-pressed=\{isSelected\}/);
  assert.match(previewSection, /className=\{`merge-page-selection-mark\$\{isSelected \? ' is-selected' : ''\}`\}[\s\S]*<Check/);
  assert.match(styles, /\.merge-page-source-card\.is-selected\s*\{[^}]*#2563eb/s);
  assert.match(component, /image-to-pdf-page-canvas/);
  assert.match(previewSection, /imageUi\.selectImage/);
  assert.match(previewSection, /imageUi\.viewLargerPreview/);
  assert.match(previewSection, /Eye className=/);
  assert.match(previewSection, /image-to-pdf-page-preview-dialog/);
  assert.match(previewSection, /moveImage\(index, -1\)/);
  assert.match(previewSection, /moveImage\(index, 1\)/);
  assert.match(previewSection, /rotateImage\(image\.id, 90\)/);
  assert.match(previewSection, /removeImage\(image\.id\)/);
  assert.match(styles, /\.image-to-pdf-settings-shell,\s*\.image-to-pdf-preview-shell\s*\{[^}]*background:\s*var\(--surface-muted\)/s);
  assert.match(styles, /\.image-to-pdf-settings-panel,\s*\.image-to-pdf-preview-panel\s*\{[^}]*background:\s*var\(--surface-background\)/s);
  assert.match(styles, /\.image-to-pdf-workflow \.image-to-pdf-setting\s*\{[^}]*padding:\s*0\.625rem/s);
  assert.match(styles, /\.image-to-pdf-workflow \.image-to-pdf-settings-controls\s*\{[^}]*gap:\s*0\.75rem/s);
  assert.match(styles, /\.image-to-pdf-attached-image-list\s*\{[^}]*gap:\s*0\.625rem/s);
  assert.match(styles, /\.image-to-pdf-attached-image-position\s*\{[^}]*width:\s*1\.875rem/s);
  const actionRow = component.slice(component.indexOf('className="pdf-workflow-actions'), component.indexOf('{error &&'));
  assert.ok(actionRow.indexOf('imageUi.createPdf') < actionRow.indexOf('imageUi.reset'), 'Create PDF should precede Reset in the action row');
  assert.match(actionRow, /className="pdf-workflow-actions[^"]*justify-end/);
  assert.match(component, /imageUi\.outputMode/);
  assert.match(component, /outputMode === 'separate'/);
  assert.match(component, /createImagePdfArchive/);
});
