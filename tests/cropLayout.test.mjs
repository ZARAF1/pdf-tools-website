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

test('Crop PDF places page and zoom controls below the crop bounds', () => {
  const boundsEnd = cropPdf.indexOf('</fieldset>', cropPdf.indexOf('<fieldset className="crop-pdf-bounds"'));
  const toolbarIndex = cropPdf.indexOf('<div className="crop-pdf-toolbar">');
  const previewIndex = cropPdf.indexOf('<div className="crop-pdf-preview-area"');

  assert.ok(boundsEnd >= 0, 'crop bounds fieldset is present');
  assert.ok(toolbarIndex > boundsEnd, 'page and zoom controls follow the crop bounds');
  assert.ok(previewIndex > toolbarIndex, 'page and zoom controls precede the page preview');
});

test('Crop PDF Apply crop fills a wide row in the processing actions', () => {
  assert.match(cropPdf, /className="crop-pdf-button crop-pdf-button-primary"[^>]*onClick=\{applyCrop\}/);
  assert.match(styles, /\.crop-pdf-actions\s+\.crop-pdf-button-primary\s*\{[^}]*flex:\s*1\s+1\s+100%[^}]*width:\s*100%/s);
});

test('Crop PDF separates the selected-file card from its empty-state upload zone', () => {
  const workflowStart = cropPdf.indexOf('<div className="crop-pdf-tool">');
  const pickerInput = cropPdf.indexOf('<input {...getInputProps()} />', workflowStart);
  const attachedCard = cropPdf.indexOf('pdf-workflow-selected pdf-attached-file-card', workflowStart);
  const emptyUploadZone = cropPdf.indexOf('className={`crop-pdf-upload pdf-workflow-upload pdf-upload-zone merge-pdf-upload-zone', workflowStart);

  assert.ok(pickerInput >= 0 && pickerInput < attachedCard, 'the picker input remains mounted before the selected card');
  assert.ok(attachedCard > workflowStart, 'the attached file uses the shared card');
  assert.ok(emptyUploadZone > attachedCard, 'the empty-state upload zone is distinct from the selected card');
  assert.match(styles, /\.crop-pdf-attached-file-card\.is-drag-active\s*\{[^}]*border-color:\s*#60a5fa;[^}]*background:\s*var\(--surface-muted\);/s);
});

test('Crop PDF places its attachment in a dedicated File to crop section', () => {
  const sectionStart = cropPdf.indexOf('className="crop-pdf-file-section"');
  const headingIndex = cropPdf.indexOf('File to crop', sectionStart);
  const attachedCardIndex = cropPdf.indexOf('pdf-workflow-selected pdf-attached-file-card', sectionStart);
  const settingsShellIndex = cropPdf.indexOf('className="crop-pdf-settings-shell"');

  assert.ok(sectionStart >= 0, 'a dedicated File to crop section is present');
  assert.ok(headingIndex > sectionStart, 'the section is labelled File to crop');
  assert.ok(attachedCardIndex > headingIndex, 'the selected PDF card follows the section heading');
  assert.ok(settingsShellIndex > attachedCardIndex, 'settings follow the selected-file section');
  assert.match(styles, /\.crop-pdf-file-section,\s*\.crop-pdf-settings-shell\s*\{[^}]*background:\s*var\(--surface-muted\)/s);
});

test('Crop PDF groups scope and bounds in Choose Settings before its page preview', () => {
  const settingsShellIndex = cropPdf.indexOf('className="crop-pdf-settings-shell"');
  const settingsHeadingIndex = cropPdf.indexOf('Settings &gt; Selection &gt; Preview', settingsShellIndex);
  const settingsPanelIndex = cropPdf.indexOf('className="crop-pdf-settings-panel"', settingsShellIndex);
  const chooseSettingsIndex = cropPdf.indexOf('Choose Settings', settingsPanelIndex);
  const scopeIndex = cropPdf.indexOf('Apply crop to', chooseSettingsIndex);
  const boundsIndex = cropPdf.indexOf('className="crop-pdf-bounds"', chooseSettingsIndex);
  const previewPanelIndex = cropPdf.indexOf('className="crop-pdf-page-preview-panel"', boundsIndex);
  const previewHeadingIndex = cropPdf.indexOf('Page preview', previewPanelIndex);
  const toolbarIndex = cropPdf.indexOf('className="crop-pdf-toolbar"', previewHeadingIndex);
  const previewAreaIndex = cropPdf.indexOf('className="crop-pdf-preview-area"', previewHeadingIndex);

  assert.ok(settingsShellIndex >= 0, 'the Merge-style settings shell is present');
  assert.ok(settingsHeadingIndex > settingsShellIndex, 'the shell has the Settings > Selection > Preview heading');
  assert.ok(settingsPanelIndex > settingsHeadingIndex, 'Choose Settings is grouped in its own panel');
  assert.ok(chooseSettingsIndex > settingsPanelIndex, 'the settings panel has a Choose Settings heading');
  assert.ok(scopeIndex > chooseSettingsIndex && scopeIndex < boundsIndex, 'page scope precedes crop bounds within settings');
  assert.ok(previewPanelIndex > boundsIndex, 'the page preview panel follows crop settings');
  assert.ok(previewHeadingIndex > previewPanelIndex && toolbarIndex > previewHeadingIndex, 'the preview heading and page controls follow the settings');
  assert.ok(toolbarIndex > boundsIndex && previewAreaIndex > toolbarIndex, 'page and zoom controls follow crop bounds and precede the canvas');
  assert.match(styles, /\.crop-pdf-settings-shell\s*\{[^}]*background:\s*var\(--surface-muted\)/s);
  assert.match(styles, /\.crop-pdf-settings-panel,\s*\.crop-pdf-page-preview-panel\s*\{[^}]*background:\s*var\(--surface-background\)/s);
});

test('Crop PDF summarizes scope and percentage guidance under Choose Settings', () => {
  const settingsPanelIndex = cropPdf.indexOf('className="crop-pdf-settings-panel"');
  const chooseSettingsIndex = cropPdf.indexOf('Choose Settings', settingsPanelIndex);
  const settingsDescriptionIndex = cropPdf.indexOf('crop-pdf-settings-description', chooseSettingsIndex);
  const scopeDescriptionIndex = cropPdf.indexOf('Crops only the current page; previously cropped pages remain included.');
  const boundsInstructionsIndex = cropPdf.indexOf('Set the crop using the keyboard.');

  assert.ok(settingsDescriptionIndex > chooseSettingsIndex, 'the consolidated guidance belongs to Choose Settings');
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
