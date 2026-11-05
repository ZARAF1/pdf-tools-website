import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const cropPdf = await readFile(new URL('../src/components/CropPdf.jsx', import.meta.url), 'utf8');
const styles = await readFile(new URL('../src/index.css', import.meta.url), 'utf8');

test('Crop PDF places Reset crop alongside the equal-width bounds fields', () => {
  const boundsStart = cropPdf.indexOf('<fieldset className="crop-pdf-bounds"');
  const boundsEnd = cropPdf.indexOf('</fieldset>', boundsStart);
  const resetIndex = cropPdf.indexOf('Reset crop');

  assert.ok(boundsStart >= 0, 'crop bounds fieldset is present');
  assert.ok(resetIndex > boundsStart && resetIndex < boundsEnd, 'Reset crop is inside the bounds fieldset');
  assert.match(styles, /\.crop-pdf-bounds-grid\s*\{[^}]*grid-template-columns:\s*repeat\(5,\s*minmax\(0,\s*1fr\)\)/s);
  assert.match(styles, /\.crop-pdf-bounds-grid\s*>\s*\.crop-pdf-button\s*\{[^}]*width:\s*100%/s);
});

test('Crop PDF keeps zoom controls above the page and navigation in its thumbnail rail', () => {
  const boundsEnd = cropPdf.indexOf('</fieldset>', cropPdf.indexOf('<fieldset className="crop-pdf-bounds"'));
  const toolbarIndex = cropPdf.indexOf('<div className="crop-pdf-preview-toolbar">');
  const previewIndex = cropPdf.indexOf('<div className="crop-pdf-preview-area"');
  const railIndex = cropPdf.indexOf('<PdfPageThumbnailRail');

  assert.ok(boundsEnd >= 0, 'crop bounds fieldset is present');
  assert.ok(toolbarIndex > boundsEnd, 'zoom controls follow the crop bounds');
  assert.ok(previewIndex > toolbarIndex, 'zoom controls precede the large page preview');
  assert.ok(railIndex > previewIndex, 'page navigation follows the large preview in the thumbnail rail');
});

test('Crop PDF Apply crop shares an output row with the filename field', () => {
  assert.match(cropPdf, /className="crop-pdf-button crop-pdf-button-primary"[^>]*onClick=\{applyCrop\}/);
  assert.match(styles, /\.crop-pdf-output-actions\s*\{[^}]*width:\s*100%;[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)\s+minmax\(12rem,\s*auto\)/s);
  assert.match(styles, /\.crop-pdf-output-actions\s*\{[^}]*flex:\s*1 1 100%/s);
});

test('Crop PDF removes the CropBox disclosure beneath its output controls', () => {
  assert.doesNotMatch(cropPdf, /crop-pdf-disclosure|Cropping changes each page/);
});

test('Crop PDF places an editable output filename beside Apply crop', () => {
  const actionsStart = cropPdf.indexOf('<div className="crop-pdf-actions">');
  const filenameIndex = cropPdf.indexOf('id="crop-pdf-output-filename"', actionsStart);
  const applyIndex = cropPdf.indexOf('onClick={applyCrop}', actionsStart);
  const resultCardIndex = cropPdf.indexOf('<DownloadReadyCard', applyIndex);

  assert.ok(actionsStart >= 0, 'crop processing actions are present');
  assert.ok(filenameIndex > actionsStart && filenameIndex < applyIndex, 'output filename precedes Apply crop in the action row');
  assert.match(cropPdf.slice(filenameIndex, applyIndex), /value=\{outputFileName\}[\s\S]*setOutputFileName\(event\.target\.value\)/);
  assert.match(cropPdf, /normalizeOutputFileName\([\s\S]*outputFileName,[\s\S]*_cropped\.pdf/);
  assert.match(styles, /\.crop-pdf-output-actions\s*\{[^}]*width:\s*100%;[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)\s+minmax\(12rem,\s*auto\)/s);
  assert.match(styles, /\.crop-pdf-output-actions\s+\.crop-pdf-button-primary\s*\{[^}]*grid-area:\s*action/s);
  assert.match(cropPdf.slice(resultCardIndex), /fileName=\{outputFileName\}[\s\S]*showFilenameEditor=\{false\}/);
  assert.match(styles, /@media \(max-width:\s*600px\)\s*\{[\s\S]*?\.crop-pdf-output-actions\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)/);
});

test('Crop PDF groups the selected file in a muted section and keeps its empty upload zone', () => {
  const workflowStart = cropPdf.indexOf('<div className="crop-pdf-tool">');
  const pickerInput = cropPdf.indexOf('<input {...getInputProps()} />', workflowStart);
  const fileSection = cropPdf.indexOf('className="crop-pdf-file-section"', workflowStart);
  const attachedCard = cropPdf.indexOf('pdf-workflow-selected pdf-attached-file-card', fileSection);
  const emptyUploadZone = cropPdf.indexOf('className={`crop-pdf-upload pdf-workflow-upload pdf-upload-zone merge-pdf-upload-zone', workflowStart);

  assert.ok(pickerInput >= 0 && pickerInput < fileSection, 'the picker input remains mounted before the selected-file section');
  assert.ok(fileSection > workflowStart, 'the selected file has a dedicated section');
  assert.ok(cropPdf.indexOf('PDF to crop', fileSection) < attachedCard, 'the section heading precedes the attached-file card');
  assert.ok(emptyUploadZone > fileSection, 'the empty-state upload zone remains distinct from the selected-file section');
  assert.match(styles, /\.crop-pdf-file-section[\s\S]*?background:\s*var\(--surface-muted\)/);
  assert.match(styles, /\.crop-pdf-attached-file-card\.is-drag-active,\s*\.organize-pdf-attached-file-card\.is-drag-active\s*\{[^}]*border-color:\s*#60a5fa;[^}]*background:\s*var\(--surface-muted\);/s);
});

test('Crop PDF keeps the selected-file section separate from its Merge-style empty chooser', () => {
  const toolStart = cropPdf.indexOf('<div className="crop-pdf-tool">');
  const pickerInput = cropPdf.indexOf('<input {...getInputProps()} />', toolStart);
  const fileSectionIndex = cropPdf.indexOf('className="crop-pdf-file-section"', toolStart);
  const attachedCardIndex = cropPdf.indexOf('pdf-workflow-selected pdf-attached-file-card', fileSectionIndex);
  const emptyUploadZone = cropPdf.indexOf(
    'className={`crop-pdf-upload pdf-workflow-upload pdf-upload-zone merge-pdf-upload-zone',
    toolStart
  );
  const settingsShellIndex = cropPdf.indexOf('className="crop-pdf-settings-shell"');

  assert.ok(toolStart >= 0, 'the Crop PDF workflow is present');
  assert.ok(pickerInput > toolStart && pickerInput < emptyUploadZone, 'the file input precedes the empty-state chooser');
  assert.ok(fileSectionIndex > pickerInput, 'the selected-file section remains available after the input');
  assert.ok(attachedCardIndex > fileSectionIndex, 'the selected-file card is nested inside its section');
  assert.ok(emptyUploadZone > pickerInput, 'the empty-state chooser remains available');
  assert.ok(settingsShellIndex > attachedCardIndex, 'settings follow the selected-file card');
  assert.match(cropPdf, /aria-labelledby="crop-pdf-file-heading"[\s\S]*?<h3 id="crop-pdf-file-heading"[^>]*>PDF to crop<\/h3>/);
  assert.match(styles, /\.image-to-pdf-file-section,\s*\.crop-pdf-settings-shell\s*\{[^}]*background:\s*var\(--surface-muted\)/s);
});

test('Crop PDF uses icon-labelled neutral attachment, settings, and preview headings', () => {
  assert.match(
    cropPdf,
    /className="crop-pdf-file-section"[\s\S]*?<div className="merge-panel-title">\s*<FileText aria-hidden="true" \/>\s*<h3 id="crop-pdf-file-heading"[^>]*>PDF to crop<\/h3>/
  );
  assert.match(
    cropPdf,
    /className="crop-pdf-settings-panel"[\s\S]*?<div className="merge-panel-title">\s*<Settings2 aria-hidden="true" \/>\s*<h3 id="crop-pdf-settings-heading"[^>]*>Settings<\/h3>/
  );
  assert.match(
    cropPdf,
    /className="crop-pdf-page-preview-panel"[\s\S]*?<div className="merge-panel-title">\s*<Eye aria-hidden="true" \/>\s*<h3 id="crop-pdf-preview-heading"[^>]*>Preview<\/h3>/
  );
  assert.match(styles, /\.crop-pdf-settings-shell \.merge-section-heading h3\.merge-output-settings-title\s*\{[^}]*font-weight:\s*750/s);
  assert.match(styles, /\.crop-pdf-settings-shell \.merge-section-heading h3\.merge-output-settings-title\s*\{[^}]*background:\s*transparent/s);
});

test('Crop PDF aligns its first thumbnail with the large page and keeps page navigation in the rail', () => {
  const previewStart = cropPdf.indexOf('className="crop-pdf-page-preview-panel"');
  const previewMarkup = cropPdf.slice(previewStart);
  const previewMain = previewMarkup.indexOf('className="crop-pdf-preview-main"');
  const largePreview = previewMarkup.indexOf('className="crop-pdf-preview-area"');
  const thumbnailRail = previewMarkup.indexOf('<PdfPageThumbnailRail');

  assert.ok(previewMain >= 0 && previewMain < thumbnailRail, 'large preview is placed before the page rail');
  assert.ok(largePreview > previewMain && largePreview < thumbnailRail, 'large page canvas is inside the main preview column');
  assert.ok(thumbnailRail > largePreview, 'the thumbnail rail sits beside the large page');
  assert.match(previewMarkup, /pageNumbers=\{Array\.from\(\{ length: pageCount \}, \(_, index\) => index \+ 1\)\}/);
  assert.match(previewMarkup, /currentPage=\{currentPage \+ 1\}/);
  assert.match(previewMarkup, /onSelectPage=\{\(pageNumber\) => navigatePage\(pageNumber - 1\)\}/);
  assert.match(styles, /\.crop-pdf-preview-layout\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)\s+12\.5rem/);
  assert.match(styles, /\.crop-pdf-preview-main,\s*\.pdf-page-thumbnail-rail\s*\{[^}]*grid-template-rows:\s*auto minmax\(0,\s*1fr\)/s);
});

test('Crop PDF hidden file input does not add grid spacing before its empty chooser', () => {
  const inputSpacing = styles.match(
    /\.tool-attachment-content \.crop-pdf-tool > input\[type="file"\]\s*\{([^}]*)\}/
  )?.[1];

  assert.ok(inputSpacing, 'Crop PDF file input is removed from the workflow grid');
  assert.match(inputSpacing, /position:\s*absolute\s*;/);
});

test('Crop PDF groups scope and bounds in Choose Settings before its page preview', () => {
  const settingsShellIndex = cropPdf.indexOf('className="crop-pdf-settings-shell"');
  const settingsHeadingIndex = cropPdf.indexOf('Crop Settings &amp; Preview', settingsShellIndex);
  const settingsPanelIndex = cropPdf.indexOf('className="crop-pdf-settings-panel"', settingsShellIndex);
  const chooseSettingsIndex = cropPdf.indexOf('Settings', settingsPanelIndex);
  const scopeIndex = cropPdf.indexOf('Apply crop to', chooseSettingsIndex);
  const boundsIndex = cropPdf.indexOf('className="crop-pdf-bounds"', chooseSettingsIndex);
  const previewPanelIndex = cropPdf.indexOf('className="crop-pdf-page-preview-panel"', boundsIndex);
  const previewHeadingIndex = cropPdf.indexOf('Preview</h3>', previewPanelIndex);
  const toolbarIndex = cropPdf.indexOf('className="crop-pdf-preview-toolbar"', previewHeadingIndex);
  const previewAreaIndex = cropPdf.indexOf('className="crop-pdf-preview-area"', previewHeadingIndex);

  assert.ok(settingsShellIndex >= 0, 'the Merge-style settings shell is present');
  assert.ok(settingsHeadingIndex > settingsShellIndex, 'the shell has the Crop Settings & Preview heading');
  assert.ok(settingsPanelIndex > settingsHeadingIndex, 'Settings is grouped in its own panel');
  assert.ok(chooseSettingsIndex > settingsPanelIndex, 'the settings panel has a Settings heading');
  assert.ok(scopeIndex > chooseSettingsIndex && scopeIndex < boundsIndex, 'page scope precedes crop bounds within settings');
  assert.ok(previewPanelIndex > boundsIndex, 'the page preview panel follows crop settings');
  assert.ok(previewHeadingIndex > previewPanelIndex && toolbarIndex > previewHeadingIndex, 'the preview heading and zoom controls follow the settings');
  assert.ok(toolbarIndex > boundsIndex && previewAreaIndex > toolbarIndex, 'page and zoom controls follow crop bounds and precede the canvas');
  assert.match(styles, /\.crop-pdf-settings-shell\s*\{[^}]*background:\s*var\(--surface-muted\)/s);
  assert.match(styles, /\.crop-pdf-settings-panel,\s*\.crop-pdf-page-preview-panel\s*\{[^}]*background:\s*var\(--surface-background\)/s);
});

test('Crop PDF summarizes scope and percentage guidance under Settings', () => {
  const settingsPanelIndex = cropPdf.indexOf('className="crop-pdf-settings-panel"');
  const settingsHeadingIndex = cropPdf.indexOf('>Settings</h3>', settingsPanelIndex);
  const settingsDescriptionIndex = cropPdf.indexOf('crop-pdf-settings-description', settingsHeadingIndex);
  const scopeDescriptionIndex = cropPdf.indexOf('Crops only the current page; previously cropped pages remain included.');
  const boundsInstructionsIndex = cropPdf.indexOf('Set the crop using the keyboard.');

  assert.ok(settingsDescriptionIndex > settingsHeadingIndex, 'the consolidated guidance belongs to Settings');
  assert.match(cropPdf.slice(settingsDescriptionIndex, scopeDescriptionIndex), /Set bounds as percentages from the page&apos;s top-left\. Current-page crops preserve earlier crops\./);
  assert.equal(scopeDescriptionIndex, -1, 'the separate current-page explanation is removed');
  assert.equal(boundsInstructionsIndex, -1, 'the separate keyboard instructions are removed');
});

test('Crop PDF keeps accessible bounds grouping without a visible legend or border', () => {
  const boundsStart = cropPdf.indexOf('<fieldset className="crop-pdf-bounds"');
  const boundsEnd = cropPdf.indexOf('</fieldset>', boundsStart);
  const boundsMarkup = cropPdf.slice(boundsStart, boundsEnd);

  assert.match(boundsMarkup, /aria-label="Crop bounds"/);
  assert.doesNotMatch(boundsMarkup, /<legend/);
  assert.match(styles, /\.crop-pdf-bounds\s*\{[^}]*border:\s*0/s);
  assert.match(styles, /\.crop-pdf-bounds\s*\{[^}]*padding:\s*0/s);
});
