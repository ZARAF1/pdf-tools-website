import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const component = await readFile(new URL('../src/components/PageSelectionTool.jsx', import.meta.url), 'utf8');
const toolPage = await readFile(new URL('../src/components/ToolPage.jsx', import.meta.url), 'utf8');
const toolGuide = await readFile(new URL('../src/components/toolGuides.mjs', import.meta.url), 'utf8');
const styles = await readFile(new URL('../src/index.css', import.meta.url), 'utf8');

test('Remove PDF presents its attachment, settings, and preview in workflow order', () => {
  const attachment = component.indexOf('className="remove-pdf-file-section"');
  const settingsShell = component.indexOf('className="remove-pdf-settings-shell"');
  const settingsPanel = component.indexOf('className="remove-pdf-settings-panel"');
  const previewPanel = component.indexOf('className="remove-pdf-page-preview-panel"');
  const outputActions = component.indexOf('className="rotate-output-actions remove-pdf-output-actions"');

  assert.ok(attachment >= 0, 'Remove PDF should have a dedicated selected-file section');
  assert.ok(attachment < settingsShell, 'the selected file should appear before settings');
  assert.ok(settingsShell < settingsPanel, 'the settings shell should contain its settings panel');
  assert.ok(settingsPanel < previewPanel, 'page previews should follow settings');
  assert.ok(previewPanel < outputActions, 'processing and output naming should follow page review');
});

test('Remove PDF keeps page selection controls in settings and real page tiles in preview', () => {
  const settingsStart = component.indexOf('className="remove-pdf-settings-panel"');
  const previewStart = component.indexOf('className="remove-pdf-page-preview-panel"');
  const settings = component.slice(settingsStart, previewStart);
  const rangeControls = settings.slice(
    settings.indexOf('className="rotate-page-range-controls"'),
    settings.indexOf('className="remove-pdf-selection-actions"')
  );
  const preview = component.slice(previewStart);

  assert.match(component, /Removal Settings &amp; Preview/);
  assert.match(settings, /<Settings2 aria-hidden="true" \/><h3 id="remove-pdf-settings-heading"[^>]*>Settings<\/h3>/);
  assert.match(settings, />\s*Select All\s*</);
  assert.match(settings, /className="remove-pdf-clear-selection-group"[\s\S]*?>\s*Clear Selection\s*<\/button>[\s\S]*?At least one page must remain in the output PDF\./);
  assert.doesNotMatch(rangeControls, /At least one page must remain in the output PDF\./);
  assert.match(preview, /<Eye aria-hidden="true" \/><h3 id="remove-pdf-page-preview-heading"[^>]*>Preview<\/h3>/);
  assert.match(preview, /<PdfPageGrid\b/);
  assert.match(preview, /showPreviewButton=\{isRemoving\}/);
  assert.match(preview, /Selected pages:/);
});

test('Remove PDF attachment heading has a decorative file icon', () => {
  assert.match(
    component,
    /className="remove-pdf-file-section"[\s\S]*?<div className="merge-panel-title">\s*<FileText aria-hidden="true" \/>\s*<h3 id="remove-pdf-file-heading"[^>]*>File to Remove Pages<\/h3>/
  );
});

test('Remove PDF supports synchronized page ranges, output naming, and a Rotate-style action', () => {
  assert.match(component, /Removal Settings &amp; Preview/);
  assert.match(component, /import \{ formatPageRanges, parsePageRanges, parsePageRangesWhileTyping \} from '\.\.\/lib\/pageSelection\.mjs'/);
  assert.match(component, /id="remove-page-ranges"/);
  assert.match(component, /parsePageRangesWhileTyping\(value, pageCount\)/);
  assert.match(component, /setRangeInput\(formatPageRanges\(\[\.\.\.updated\]\)\)/);
  assert.match(component, /parsePageRanges\(rangeInput, pageCount\)/);
  assert.match(component, /selectedPages\.size >= pageCount/);
  assert.match(component, /id="remove-output-filename"/);
  assert.match(component, /className="rotate-output-actions remove-pdf-output-actions"/);
  assert.match(component, /className=\{`rotate-process-button[\s\S]*?Remove Selected Pages/);
  assert.match(component, /normalizeOutputFileName\(outputFileName, [^)]*_pages_removed\.pdf/);
  assert.match(component, /showFilenameEditor=\{false\}/);
});

test('Remove PDF workflow panels use bounded responsive surfaces and theme-aware colors', () => {
  assert.match(styles, /\.remove-pdf-settings-shell\s*\{[^}]*background:\s*var\(--surface-muted\)/s);
  assert.match(styles, /\.remove-pdf-settings-panel,\s*\.remove-pdf-page-preview-panel\s*\{[^}]*min-width:\s*0/s);
  assert.match(styles, /\.remove-pdf-selection-actions\s*\{[^}]*flex-wrap:\s*wrap/s);
  assert.match(styles, /:root\[data-theme='dark'\]\s+\.remove-pdf-selection-action/);
});

test('Remove PDF settings and preview titles use neutral overview-matched typography', () => {
  const headingStyle = styles.match(
    /\.remove-pdf-settings-shell \.merge-section-heading h3\.merge-output-settings-title\s*\{([^}]*)\}/
  )?.[1];
  const darkHeadingStyle = styles.match(
    /:root\[data-theme='dark'\] \.remove-pdf-settings-shell \.merge-section-heading h3\.merge-output-settings-title\s*\{([^}]*)\}/
  )?.[1];

  assert.match(component, /<h3 id="remove-pdf-workspace-heading" className="merge-selected-files-title">Removal Settings &amp; Preview<\/h3>/);
  assert.ok(headingStyle, 'Remove section labels have scoped typography');
  assert.match(headingStyle, /font-size:\s*1rem\s*;/);
  assert.match(headingStyle, /font-weight:\s*750\s*;/);
  assert.match(headingStyle, /background:\s*transparent\s*;/);
  assert.match(headingStyle, /border:\s*0\s*;/);
  assert.match(headingStyle, /padding:\s*0\s*;/);
  assert.ok(darkHeadingStyle, 'dark theme removes the shared title tint for Remove');
  assert.match(darkHeadingStyle, /background:\s*transparent\s*;/);
  assert.match(darkHeadingStyle, /border:\s*0\s*;/);
});

test('Remove PDF panels constrain narrow grid items and allow selection controls to wrap', () => {
  assert.match(styles, /\.remove-pdf-workspace\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)/s);
  assert.match(styles, /\.remove-pdf-settings-shell\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)/s);
  assert.match(styles, /\.remove-pdf-settings-panel,\s*\.remove-pdf-page-preview-panel\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)/s);
  assert.match(styles, /\.remove-pdf-selection-action\s*\{[^}]*min-width:\s*0/s);
  assert.match(styles, /\.remove-pdf-settings-panel \.merge-section-heading > div[^}]*min-width:\s*0/s);
});

test('Remove PDF panels reduce spacing and wrap actions on narrow screens', () => {
  const narrowStart = styles.indexOf('@media (max-width: 580px)', styles.indexOf('.remove-pdf-settings-shell'));
  const narrowStyles = narrowStart >= 0 ? styles.slice(narrowStart) : '';

  assert.match(narrowStyles, /\.remove-pdf-settings-shell\s*\{[^}]*padding:\s*0\.75rem/s);
  assert.match(narrowStyles, /\.remove-pdf-settings-panel,\s*\.remove-pdf-page-preview-panel\s*\{[^}]*padding:\s*0\.75rem/s);
  assert.match(narrowStyles, /\.remove-pdf-selection-action\s*\{[^}]*flex:\s*1 1 100%/s);
});

test('Remove PDF controls and page tiles keep dark-theme surfaces and contrast', () => {
  assert.match(styles, /:root\[data-theme='dark'\] \.remove-pdf-selection-action\s*\{[^}]*background(?:-color)?:\s*var\(--surface-background\)\s*!important/s);
  assert.match(styles, /:root\[data-theme='dark'\] \.remove-pdf-page-preview-panel \.pdf-page-grid-select\s*\{[^}]*background(?:-color)?:\s*var\(--surface-background\)\s*!important/s);
  assert.match(styles, /:root\[data-theme='dark'\] \.remove-pdf-page-preview-panel \.pdf-page-grid-select\[aria-pressed='true'\]\s*\{[^}]*background(?:-color)?:\s*color-mix\([^;]*\)\s*!important/s);
});

test('Remove PDF skips confirmation and offers a ready-to-download verified output', () => {
  assert.match(component, /if \(isRemoving && pagesToProcess\.size >= pageCount\)/);
  assert.match(component, /At least one page must remain in the output PDF\./);
  assert.doesNotMatch(component, /confirmRemoval|Confirm Remove Pages|Remove \{selectedPages\.size\} selected/);
  assert.match(component, /const downloadOutput = \(downloadFileName, bytes = outputBytes, fileName = outputName\)/);
  assert.match(component, /\{outputBytes && \(/);
  assert.match(component, /isRemoving \? 'pages_removed' : 'pages_extracted'/);
});

test('Remove PDF shows a Download PDF action without a duplicate filename editor', () => {
  assert.match(component, /\{outputBytes && \(/);
  assert.match(component, /<DownloadReadyCard[\s\S]*?fileName=\{outputName\}[\s\S]*?showFilenameEditor=\{false\}[\s\S]*?onDownload=\{downloadOutput\}/);
  assert.doesNotMatch(component, /downloadOutput\(normalizedOutputName, bytes\)/);
});

test('Remove PDF instructions describe its result-card download flow', () => {
  const removeToolCopy = toolPage.slice(toolPage.indexOf('remove: {'), toolPage.indexOf('redact: {'));
  const removeGuideCopy = toolGuide.slice(toolGuide.indexOf('remove: {'), toolGuide.indexOf('ocr: {'));

  assert.match(removeToolCopy, /Download PDF/);
  assert.doesNotMatch(removeToolCopy, /download(?:s| automatically)[^.]*automatically/i);
  assert.doesNotMatch(removeToolCopy, /confirm removal|confirm that at least one page remains|download the generated PDF manually/i);
  assert.match(removeGuideCopy, /click Remove Selected Pages[\s\S]*Download PDF/);
  assert.doesNotMatch(removeGuideCopy, /downloads automatically/i);
  assert.doesNotMatch(removeGuideCopy, /confirm the remaining page sequence/i);
});

test('Remove PDF page previews offer an accessible larger-view action', async () => {
  const pageGrid = await readFile(new URL('../src/components/PdfPageGrid.jsx', import.meta.url), 'utf8');

  assert.match(pageGrid, /showPreviewButton = false/);
  assert.match(pageGrid, /View larger preview of page/);
  assert.match(pageGrid, /aria-modal="true"/);
  assert.match(pageGrid, /event\.key === 'Escape'/);
});

test('closing a larger page preview restores focus without waiting for animation frames', async () => {
  const pageGrid = await readFile(new URL('../src/components/PdfPageGrid.jsx', import.meta.url), 'utf8');

  assert.match(pageGrid, /previewTriggerRef\.current\?\.focus\(\)/);
  assert.doesNotMatch(pageGrid, /requestAnimationFrame/);
});
