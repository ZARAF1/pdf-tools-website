import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const stylesheet = await readFile(new URL('../src/index.css', import.meta.url), 'utf8');

test('Edit PDF attachment content has no extra top padding', () => {
  assert.match(
    stylesheet,
    /\.tool-attachment-content:has\(> \.pdf-editor-shell\)\s*\{\s*padding-top:\s*0;?\s*\}/
  );
});

test('Edit PDF shows the empty upload zone outside the muted panel and selected files inside it', async () => {
  const component = await readFile(new URL('../src/components/EditPdf.jsx', import.meta.url), 'utf8');
  const uploadZone = component.match(/const uploadZone = \([\s\S]*?\n  \);/)?.[0];
  const selectedFileBranch = component.match(/\{file \? \(\s*<section className="pdf-editor-attachment-panel merge-selected-files"[\s\S]*?<\/section>\s*\)\s*:\s*uploadZone\}/)?.[0];

  assert.ok(uploadZone, 'the upload zone is available as a standalone empty state');
  assert.match(uploadZone, /Choose or drop a PDF to edit/);
  assert.doesNotMatch(uploadZone, /pdf-editor-attachment-panel/);
  assert.match(uploadZone, /pdf-editor-upload-zone/);
  assert.match(uploadZone, /AttachedFileActions/);
  assert.ok(selectedFileBranch, 'the selected-file branch wraps the existing upload row in the attachment panel');
  assert.match(selectedFileBranch, /\{uploadZone\}/);
  assert.match(selectedFileBranch, /<h3 className="merge-selected-files-title">File to Edit<\/h3>/);
  assert.match(selectedFileBranch, /: uploadZone/);
  assert.doesNotMatch(selectedFileBranch, /pdf-editor-toolbar/);
  assert.match(
    stylesheet,
    /\.merge-selected-files\s*\{[^}]*padding:\s*1rem;[^}]*border-radius:\s*1rem;[^}]*background:\s*var\(--surface-muted\)/s
  );
  assert.match(stylesheet, /\.pdf-editor-upload-zone\s*\{[^}]*min-width:\s*0/s);
  assert.match(stylesheet, /\.tool-attachment-content \.pdf-editor-attachment-panel \.pdf-editor-upload-zone\.has-file\s*\{[^}]*padding:\s*0\.75rem/s);
});

test('Edit PDF groups the editing toolbar and page editor in a grey Editor section', async () => {
  const component = await readFile(new URL('../src/components/EditPdf.jsx', import.meta.url), 'utf8');
  const editorStart = component.indexOf('<section className="pdf-editor-section merge-selected-files"');
  const editorEnd = component.indexOf('<div className="pdf-editor-save-row">', editorStart);
  const editorSection = component.slice(editorStart, editorEnd);

  assert.ok(editorStart >= 0 && editorEnd > editorStart, 'editing controls and the page editor share the Editor section');
  assert.match(editorSection, /id="edit-pdf-editor-heading"[^>]*>Editor<\/h3>/);
  assert.match(editorSection, /className="pdf-editor-toolbar"/);
  assert.match(editorSection, /className="pdf-editor-workspace"/);
  assert.match(editorSection, /aria-label="Editing tools"/);
  assert.match(editorSection, /aria-label="Page preview and editor"/);
  assert.match(
    stylesheet,
    /\.merge-selected-files\s*\{[^}]*background:\s*var\(--surface-muted\)/s
  );
  assert.match(stylesheet, /\.pdf-editor-section\s*\{[^}]*gap:\s*1rem/s);
  assert.match(stylesheet, /\.pdf-editor-section \.pdf-editor-section-header\s*\{\s*margin-bottom:\s*0/s);
  assert.doesNotMatch(
    component.slice(component.indexOf('<div className="pdf-editor-save-row">')),
    /pdf-editor-section merge-selected-files/
  );
});

test('Edit PDF aligns page thumbnails with the large editor preview', async () => {
  const component = await readFile(new URL('../src/components/EditPdf.jsx', import.meta.url), 'utf8');
  const workspaceStart = component.indexOf('<div className="pdf-editor-workspace">');
  const canvasAreaIndex = component.indexOf('<section className="pdf-editor-canvas-area"', workspaceStart);
  const thumbnailRailIndex = component.indexOf('<PdfPageThumbnailRail', workspaceStart);

  assert.ok(canvasAreaIndex > workspaceStart && canvasAreaIndex < thumbnailRailIndex, 'the large page editor is the first workspace column');
  assert.ok(thumbnailRailIndex > canvasAreaIndex, 'the page thumbnail rail is beside the large editor');
  assert.match(component.slice(workspaceStart, thumbnailRailIndex), /className="pdf-editor-canvas-controls"[\s\S]*?Zoom out[\s\S]*?Zoom in/);
  assert.match(component.slice(thumbnailRailIndex), /pageNumbers=\{visiblePageIds\.map\(\(pageId\) => pageId \+ 1\)\}/);
  assert.match(component.slice(thumbnailRailIndex), /currentPage=\{currentPageId \+ 1\}/);
  assert.match(component.slice(thumbnailRailIndex), /onSelectPage=\{\(pageNumber\) => selectedPage\(pageNumber - 1\)\}/);
  assert.match(component.slice(workspaceStart), /aria-label="Page preview and editor"/);
  assert.match(
    stylesheet,
    /\.pdf-editor-workspace\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)\s+12\.5rem;[^}]*align-items:\s*start/s
  );
  assert.match(
    stylesheet,
    /\.pdf-editor-canvas-controls,\s*\.pdf-page-thumbnail-rail-header\s*\{[^}]*min-height:\s*5rem/s
  );
  assert.match(stylesheet, /\.pdf-page-thumbnail-list\s*\{[^}]*max-height:\s*min\(70vh,\s*48rem\)/);
});
