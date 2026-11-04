import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const organizePdf = await readFile(new URL('../src/components/OrganizePdf.jsx', import.meta.url), 'utf8');
const styles = await readFile(new URL('../src/index.css', import.meta.url), 'utf8');

test('Organize PDF shows the selected attachment above its page previews', () => {
  assert.match(organizePdf, /className="pdf-tool-workflow organize-pdf-workflow space-y-6"/);

  const attachmentOrder = styles.match(/\.organize-pdf-workflow\s+\.organize-pdf-file-section\s*\{([^}]*)\}/)?.[1];
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

test('Organize PDF groups the selected file in a muted section and keeps its empty upload zone', () => {
  const workflowStart = organizePdf.indexOf('<div className="pdf-tool-workflow organize-pdf-workflow space-y-6">');
  const pickerInput = organizePdf.indexOf('<input {...getInputProps()} />', workflowStart);
  const fileSection = organizePdf.indexOf('className="organize-pdf-file-section"', workflowStart);
  const attachedCard = organizePdf.indexOf('pdf-workflow-selected pdf-attached-file-card', fileSection);
  const emptyUploadZone = organizePdf.indexOf('className={`organize-pdf-upload pdf-workflow-upload pdf-upload-zone merge-pdf-upload-zone', workflowStart);

  assert.ok(pickerInput >= 0 && pickerInput < fileSection, 'the picker input remains mounted before the selected-file section');
  assert.ok(fileSection > workflowStart, 'the selected PDF has a dedicated section');
  assert.ok(organizePdf.indexOf('PDF to organize', fileSection) < attachedCard, 'the section heading precedes the attached-file card');
  assert.ok(emptyUploadZone > fileSection, 'the empty-state upload zone remains distinct from the selected-file section');
  assert.match(styles, /\.organize-pdf-file-section[\s\S]*?background:\s*var\(--surface-muted\)/);
});

test('Organize PDF uses the Merge-style empty chooser without a Files to Organize panel', () => {
  const workflowStart = organizePdf.indexOf('<div className="pdf-tool-workflow organize-pdf-workflow space-y-6">');
  const pickerInput = organizePdf.indexOf('<input {...getInputProps()} />', workflowStart);
  const fileSectionIndex = organizePdf.indexOf('className="organize-pdf-file-section"', workflowStart);
  const attachedCardIndex = organizePdf.indexOf('pdf-workflow-selected pdf-attached-file-card', fileSectionIndex);
  const uploadIndex = organizePdf.indexOf(
    'className={`organize-pdf-upload pdf-workflow-upload pdf-upload-zone merge-pdf-upload-zone',
    workflowStart
  );
  const previewsIndex = organizePdf.indexOf('className="pdf-workflow-controls space-y-4"');

  assert.ok(workflowStart >= 0, 'the Organize PDF workflow is present');
  assert.ok(pickerInput > workflowStart && pickerInput < fileSectionIndex, 'the file input precedes the selected-file section');
  assert.ok(fileSectionIndex > pickerInput, 'the selected-file section remains available');
  assert.ok(attachedCardIndex > fileSectionIndex, 'the selected PDF card is nested inside its section');
  assert.ok(uploadIndex > pickerInput, 'the empty-state upload card remains available');
  assert.ok(previewsIndex > attachedCardIndex, 'page previews follow the attachment');
  assert.match(organizePdf, /aria-labelledby="organize-pdf-file-heading"[\s\S]*?<h3 id="organize-pdf-file-heading"[^>]*>PDF to organize<\/h3>/);
  assert.match(styles, /\.image-to-pdf-file-section,\s*\.crop-pdf-settings-shell\s*\{[^}]*background:\s*var\(--surface-muted\)/s);
});

test('Organize PDF empty chooser does not inherit the workflow top margin', () => {
  const uploadSpacing = styles.match(
    /\.tool-attachment-content \.organize-pdf-workflow\.space-y-6 > \.organize-pdf-upload\s*\{([^}]*)\}/
  )?.[1];

  assert.ok(uploadSpacing, 'Organize PDF empty chooser has a scoped spacing rule');
  assert.match(uploadSpacing, /margin-block-start:\s*0\s*;/);
});

test('Organize PDF selected-file section does not inherit the workflow top margin', () => {
  const fileSectionSpacing = styles.match(
    /\.tool-attachment-content \.organize-pdf-workflow\.space-y-6 > \.organize-pdf-file-section\s*\{([^}]*)\}/
  )?.[1];

  assert.ok(fileSectionSpacing, 'Organize PDF selected-file section has scoped top spacing');
  assert.match(fileSectionSpacing, /margin-block-start:\s*0\s*;/);
});

test('Organize PDF page tiles use a responsive grid capped at five columns', () => {
  assert.match(organizePdf, /grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5/);
  assert.doesNotMatch(organizePdf, /(?:sm|md|lg|xl):grid-cols-[6-9]/);
});

test('Organize PDF page tiles provide an accessible larger preview', () => {
  assert.match(organizePdf, /className="organize-pdf-page-preview-button"[\s\S]*?onClick=\{\(event\) => openLargePreview\(page, index, event\)\}[\s\S]*?aria-label=\{`View larger preview of page \$\{index \+ 1\}`\}[\s\S]*?<Eye className="h-4 w-4" aria-hidden="true" \/>/);
  assert.match(organizePdf, /className="merge-page-preview-backdrop"[\s\S]*?className=\{`merge-page-preview-dialog[\s\S]*?role="dialog"[\s\S]*?aria-modal="true"[\s\S]*?`Page \$\{largePreview\.pageNumber\} preview`/);
  assert.match(organizePdf, /largePreview\.mode === 'crop' \? 'Close crop editor' : 'Close larger page preview'/);
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

test('Organize PDF page tiles open a crop editor and retain crop selection per page', () => {
  assert.match(organizePdf, /crop:\s*null/);
  assert.match(organizePdf, /const openCropEditor = \(page, pageIndex, event\)/);
  assert.match(organizePdf, /onClick=\{\(event\) => openCropEditor\(page, index, event\)\}[\s\S]*?aria-label=\{`Crop page \$\{index \+ 1\}`\}/);
  assert.match(organizePdf, /largePreview\.mode === 'crop'/);
  assert.match(organizePdf, /Save crop/);
  assert.match(organizePdf, /Cancel/);
  assert.match(organizePdf, /item\.crop[\s\S]*?setCropBox/);
  assert.match(organizePdf, /selectionToPdfRectangle/);
});

test('Organize PDF page thumbnails visibly show and announce saved crop selections', () => {
  assert.match(organizePdf, /className="organize-pdf-saved-crop-frame"/);
  assert.match(organizePdf, /page\.crop &&[\s\S]*?className="organize-pdf-saved-crop-frame"[\s\S]*?left: `\$\{page\.crop\.x \* 100\}%`[\s\S]*?top: `\$\{page\.crop\.y \* 100\}%`[\s\S]*?width: `\$\{page\.crop\.width \* 100\}%`[\s\S]*?height: `\$\{page\.crop\.height \* 100\}%`/);
  assert.match(organizePdf, /saved crop for this page/i);
  assert.match(styles, /\.organize-pdf-saved-crop-frame\s*\{[^}]*box-shadow:\s*0 0 0 999px/s);
});

test('Organize PDF crop editor retains preview dimensions after releasing its canvas', () => {
  assert.match(organizePdf, /const previewWidth = canvas\.width;[\s\S]*?const previewHeight = canvas\.height;[\s\S]*?width: previewWidth, height: previewHeight/);
});

test('Organize PDF drag reordering displays a drag image and animates tile movement', () => {
  assert.match(organizePdf, /dataTransfer\.setDragImage/);
  assert.match(organizePdf, /useLayoutEffect/);
  assert.match(organizePdf, /const capturePageRects = \(\) => \{[\s\S]*?pageRectsRef\.current = rects;[\s\S]*?const reorderPage = \([\s\S]*?capturePageRects\(\);/);
  assert.match(organizePdf, /card\.style\.transition = '';[\s\S]*?card\.getBoundingClientRect\(\);[\s\S]*?card\.style\.transform = '';/);
  assert.match(organizePdf, /is-drop-target/);
  assert.match(organizePdf, /className="organize-pdf-page-image-frame"[\s\S]*?draggable="false"/);
  assert.match(styles, /\.organize-pdf-page-card\s*\{[^}]*transition:[^;]*transform/s);
  assert.match(styles, /\.organize-pdf-page-card\.is-dragging\s*\{/);
  assert.match(styles, /\.organize-pdf-page-card\.is-drop-target\s*\{/);
});

test('Organize PDF aligns its action buttons to the right', () => {
  assert.match(organizePdf, /className="pdf-workflow-actions flex flex-wrap gap-3 justify-end"/);
});

test('Organize PDF shows the download card after its action buttons', () => {
  const actionIndex = organizePdf.indexOf('className="pdf-workflow-actions flex flex-wrap gap-3 justify-end"');
  const downloadCardIndex = organizePdf.indexOf('<DownloadReadyCard', actionIndex);
  const downloadCardOrder = styles.match(/\.organize-pdf-workflow\s*>\s*\.download-ready-card\s*\{([^}]*)\}/)?.[1];

  assert.ok(actionIndex >= 0 && downloadCardIndex > actionIndex, 'the download card follows the Organize PDF action in the workflow');
  assert.ok(downloadCardOrder, 'the Organize PDF download card has an explicit flex order');
  assert.match(downloadCardOrder, /order:\s*5\s*;/);
});

test('Organize PDF disables processing until the page arrangement has changed', () => {
  assert.match(organizePdf, /hasOrganizeChanges\(pages,\s*sourcePageCount\)/);
  assert.match(organizePdf, /disabled=\{isLoading \|\| isProcessing \|\| !hasChanges\}/);
});
