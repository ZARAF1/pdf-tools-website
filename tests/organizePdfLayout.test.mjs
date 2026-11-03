import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const organizePdf = await readFile(new URL('../src/components/OrganizePdf.jsx', import.meta.url), 'utf8');
const styles = await readFile(new URL('../src/index.css', import.meta.url), 'utf8');

test('Organize PDF shows the selected attachment above its page previews', () => {
  assert.match(organizePdf, /className="pdf-tool-workflow organize-pdf-workflow space-y-6"/);

  const attachmentOrder = styles.match(/\.organize-pdf-workflow\s+\.pdf-workflow-selected\s*\{([^}]*)\}/)?.[1];
  const previewsOrder = styles.match(/\.organize-pdf-workflow\s+\.pdf-workflow-controls\s*\{([^}]*)\}/)?.[1];

  assert.ok(attachmentOrder, 'Organize selected-file order is scoped to its workflow');
  assert.ok(previewsOrder, 'Organize page-preview order is scoped to its workflow');
  assert.match(attachmentOrder, /order:\s*1\s*;/);
  assert.match(previewsOrder, /order:\s*2\s*;/);
});

test('Organize PDF nests Page Preview inside a muted Preview shell', () => {
  const previewShellStart = organizePdf.indexOf('className="organize-pdf-preview-shell"');
  const previewPanelStart = organizePdf.indexOf('organize-pdf-page-preview-panel');
  const previewPanelEnd = organizePdf.indexOf('</section>', previewPanelStart);
  const previewPanel = organizePdf.slice(previewPanelStart, previewPanelEnd);
  const previewShell = organizePdf.slice(previewShellStart, previewPanelEnd);

  assert.match(previewShell, /<h3 className="merge-selected-files-title">Preview<\/h3>/);
  assert.match(previewShell, /<p>Review, reorder, rotate, and remove pages before creating your organized PDF\.<\/p>/);
  assert.match(previewPanel, /Page Preview/);
  assert.match(previewPanel, /className="merge-section-heading merge-page-selection-heading"/);
  assert.match(previewPanel, /className="merge-section-heading-title merge-page-selection-title">Page Preview/);
  assert.match(previewPanel, /<p>Drag page cards to reorder, or use the controls on each page\.<\/p>/);
  assert.doesNotMatch(previewPanel, /pdf-preview-instructions|merge-output-settings-title/);
  assert.doesNotMatch(organizePdf, /At least one page must remain\. Screen readers can hear extracted page text where available\./);

  assert.match(styles, /\.organize-pdf-preview-shell\s*\{[^}]*background:\s*var\(--surface-muted\)/s);
  assert.match(styles, /\.organize-pdf-page-preview-panel \.merge-section-heading p\s*\{[^}]*color:\s*var\(--text-secondary\)/s);
});

test('Organize PDF separates the selected-file card from its empty-state upload zone', () => {
  const workflowStart = organizePdf.indexOf('<div className="pdf-tool-workflow organize-pdf-workflow space-y-6">');
  const pickerInput = organizePdf.indexOf('<input {...getInputProps()} />', workflowStart);
  const attachedCard = organizePdf.indexOf('pdf-workflow-selected pdf-attached-file-card', workflowStart);
  const emptyUploadZone = organizePdf.indexOf('className={`organize-pdf-upload pdf-workflow-upload pdf-upload-zone merge-pdf-upload-zone', workflowStart);

  assert.ok(pickerInput >= 0 && pickerInput < attachedCard, 'the picker input remains mounted before the selected card');
  assert.ok(attachedCard > workflowStart, 'the selected PDF uses the shared card');
  assert.ok(emptyUploadZone > attachedCard, 'the empty-state upload zone is distinct from the selected card');
});

test('Organize PDF uses the Crop PDF attachment section layout', () => {
  const sectionStart = organizePdf.indexOf('className="organize-pdf-file-section"');
  const headingIndex = organizePdf.indexOf('Files to Organize', sectionStart);
  const attachedCardIndex = organizePdf.indexOf('pdf-workflow-selected pdf-attached-file-card', sectionStart);
  const uploadIndex = organizePdf.indexOf('pdf-workflow-upload pdf-upload-zone merge-pdf-upload-zone', sectionStart);
  const previewsIndex = organizePdf.indexOf('className="pdf-workflow-controls space-y-4"');

  assert.ok(sectionStart >= 0, 'a dedicated Organize PDF attachment section is present');
  assert.ok(headingIndex > sectionStart, 'the section is labelled Files to Organize');
  assert.ok(attachedCardIndex > headingIndex, 'the selected PDF card follows the section heading');
  assert.ok(uploadIndex > headingIndex, 'the empty-state upload card follows the section heading');
  assert.ok(previewsIndex > sectionStart, 'page previews follow the attachment section');
  assert.match(styles, /\.crop-pdf-file-section,\s*\.organize-pdf-file-section,\s*\.image-to-pdf-file-section,\s*\.crop-pdf-settings-shell\s*\{[^}]*background:\s*var\(--surface-muted\)/s);
});

test('Organize PDF page tiles are compact and provide an accessible larger preview', () => {
  assert.match(organizePdf, /grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7/);
  assert.match(organizePdf, /className="organize-pdf-page-preview-button"[\s\S]*?onClick=\{\(event\) => openLargePreview\(page, index, event\)\}[\s\S]*?aria-label=\{`View larger preview of page \$\{index \+ 1\}`\}[\s\S]*?<Eye className="h-4 w-4" aria-hidden="true" \/>/);
  assert.match(organizePdf, /className="merge-page-preview-backdrop"[\s\S]*?className="merge-page-preview-dialog"[\s\S]*?role="dialog"[\s\S]*?aria-modal="true"[\s\S]*?aria-label=\{`Page \$\{largePreview\.pageNumber\} preview`\}/);
  assert.match(organizePdf, /aria-label="Close larger page preview"/);
  assert.match(organizePdf, /if \(event\.key === 'Escape'\)/);
  assert.match(organizePdf, /largePreviewTriggerRef\.current\?\.focus\(\)/);

  const previewButtonStyles = styles.match(/\.organize-pdf-page-preview-button\s*\{([^}]*)\}/)?.[1];
  assert.match(previewButtonStyles || '', /position:\s*absolute/);
  assert.match(previewButtonStyles || '', /top:\s*0\.5rem/);
  assert.match(previewButtonStyles || '', /left:\s*0\.5rem/);
  assert.match(styles, /\.merge-page-selection-panel,\s*\.merge-live-output-panel\s*\{[^}]*background:\s*var\(--surface-background\)/s);
  assert.match(previewButtonStyles || '', /background:\s*#0f172a/);
  assert.match(previewButtonStyles || '', /color:\s*#ffffff/);
  assert.doesNotMatch(previewButtonStyles || '', /color:\s*#1d4ed8/);
});

test('Organize PDF aligns its action buttons to the right', () => {
  assert.match(organizePdf, /className="pdf-workflow-actions flex flex-wrap gap-3 justify-end"/);
});
