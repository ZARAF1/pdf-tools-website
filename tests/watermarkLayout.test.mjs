import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const component = await readFile(new URL('../src/components/PdfWatermarker.jsx', import.meta.url), 'utf8');
const stylesheet = await readFile(new URL('../src/index.css', import.meta.url), 'utf8');

test('Watermark PDF has no standalone intro or extra attachment top spacing', () => {
  assert.doesNotMatch(component, /Add a custom text watermark to all pages or selected pages/);
  assert.match(component, /className="watermark-tool-workspace space-y-8"/);
  assert.match(
    stylesheet,
    /\.tool-attachment-content:has\(> \.watermark-tool-workspace\)\s*\{\s*padding-top:\s*0;?\s*\}/
  );
});

test('Watermark PDF separates the selected attachment, settings, and preview panels', () => {
  assert.match(component, /className="watermark-selected-file-section"/);
  assert.match(component, /className="watermark-settings-panel"/);
  assert.match(component, /<h2[^>]*>Watermark Settings<\/h2>/);
  assert.match(component, /className="watermark-primary-settings-grid"/);
  assert.match(component, /className="watermark-preview-panel"/);
  assert.match(component, /<h2[^>]*>Watermark Preview<\/h2>/);
  assert.match(component, /aria-label="Move watermark preview/);
  assert.match(component, /onPointerDown=\{handleWatermarkPointerDown\}/);
  assert.match(component, /onPointerMove=\{handleWatermarkPointerMove\}/);
  assert.match(component, /onKeyDown=\{handleWatermarkPositionKeyDown\}/);
  assert.match(component, /id="watermark-preview-page"/);
  assert.match(component, /showPreviewPageNumber\s*\?\s*`Page number/);
  assert.match(component, /rotate\(\$\{previewRotation - settings\.rotation\}deg\)/);
  assert.match(component, /getWatermarkPositionOnPage\(/);
  assert.match(stylesheet, /\.watermark-primary-settings-grid\s*\{[^}]*repeat\(3,\s*minmax\(0,\s*1fr\)\)/s);
});

test('Watermark preview shows every page as a live selectable thumbnail beside the large page', () => {
  assert.match(component, /function WatermarkPageThumbnail\(/);
  assert.match(component, /className="watermark-preview-layout"/);
  assert.match(component, /className="watermark-preview-page-thumbnails"/);
  assert.match(component, /Array\.from\(\{ length: pageCount \}, \(_, index\) => index \+ 1\)/);
  assert.match(component, /aria-pressed=\{selected\}/);
  assert.match(component, /selected=\{pageNumber === previewPage\}/);
  assert.match(component, /onSelect=\{\(\) => setPreviewPage\(pageNumber\)\}/);
  assert.match(component, /onClick=\{onSelect\}/);
  assert.match(component, /className="watermark-page-thumbnail-canvas"/);
  assert.match(component, /className="watermark-page-thumbnail-mark"/);
  assert.match(stylesheet, /\.watermark-preview-layout\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)\s+\d+(?:\.\d+)?(?:rem|px)/s);
  assert.match(stylesheet, /\.watermark-preview-page-thumbnails\s*\{[^}]*overflow-y:\s*auto/s);
});
