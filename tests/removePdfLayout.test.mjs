import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const component = await readFile(new URL('../src/components/PageSelectionTool.jsx', import.meta.url), 'utf8');
const styles = await readFile(new URL('../src/index.css', import.meta.url), 'utf8');

test('Remove PDF presents its attachment, settings, and preview in workflow order', () => {
  const attachment = component.indexOf('className="remove-pdf-file-section"');
  const settingsShell = component.indexOf('className="remove-pdf-settings-shell"');
  const settingsPanel = component.indexOf('className="remove-pdf-settings-panel"');
  const previewPanel = component.indexOf('className="remove-pdf-page-preview-panel"');
  const confirmation = component.indexOf('className="space-y-3 rounded-xl border border-amber-200');

  assert.ok(attachment >= 0, 'Remove PDF should have a dedicated selected-file section');
  assert.ok(attachment < settingsShell, 'the selected file should appear before settings');
  assert.ok(settingsShell < settingsPanel, 'the settings shell should contain its settings panel');
  assert.ok(settingsPanel < previewPanel, 'page previews should follow settings');
  assert.ok(previewPanel < confirmation, 'the removal confirmation should follow page review');
});

test('Remove PDF keeps page selection controls in settings and real page tiles in preview', () => {
  const settingsStart = component.indexOf('className="remove-pdf-settings-panel"');
  const previewStart = component.indexOf('className="remove-pdf-page-preview-panel"');
  const settings = component.slice(settingsStart, previewStart);
  const preview = component.slice(previewStart);

  assert.match(settings, /Choose Settings/);
  assert.match(settings, />\s*Select All\s*</);
  assert.match(settings, />\s*Clear Selection\s*</);
  assert.match(preview, /Page preview/);
  assert.match(preview, /<PdfPageGrid\b/);
  assert.match(preview, /showPreviewButton=\{isRemoving\}/);
  assert.match(preview, /Selected pages:/);
});

test('Remove PDF workflow panels use bounded responsive surfaces and theme-aware colors', () => {
  assert.match(styles, /\.remove-pdf-settings-shell\s*\{[^}]*background:\s*var\(--surface-muted\)/s);
  assert.match(styles, /\.remove-pdf-settings-panel,\s*\.remove-pdf-page-preview-panel\s*\{[^}]*min-width:\s*0/s);
  assert.match(styles, /\.remove-pdf-selection-actions\s*\{[^}]*flex-wrap:\s*wrap/s);
  assert.match(styles, /:root\[data-theme='dark'\]\s+\.remove-pdf-selection-action/);
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

test('Remove PDF redesign retains confirmation and last-page removal safeguards', () => {
  assert.match(component, /if \(isRemoving && selectedPages\.size >= pageCount\)/);
  assert.match(component, /At least one page must remain in the output PDF\./);
  assert.match(component, /if \(isRemoving && !confirmRemoval\)/);
  assert.match(component, /Confirm Remove Pages/);
  assert.match(component, /isRemoving \? 'pages_removed' : 'pages_extracted'/);
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
