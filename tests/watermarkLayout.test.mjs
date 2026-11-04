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
  assert.match(stylesheet, /\.watermark-primary-settings-grid\s*\{[^}]*repeat\(4,\s*minmax\(0,\s*1fr\)\)/s);
});

test('Watermark text controls use two compact rows with the enable toggle beside opacity', () => {
  const controlOrder = [
    'watermark-text',
    'watermark-rotation',
    'watermark-size',
    'watermark-color',
    'watermark-opacity',
    'Add text watermark'
  ].map((text) => component.indexOf(text));

  assert.ok(controlOrder.every((index) => index >= 0));
  assert.deepEqual([...controlOrder].sort((a, b) => a - b), controlOrder);
  assert.match(component, /className=\{`watermark-settings-control-grid/);
  assert.match(component, /className="watermark-setting-control watermark-opacity-setting"/);
  assert.match(component, /className="watermark-toggle-setting inline-flex/);
  assert.match(stylesheet, /\.watermark-primary-settings-grid\s*\{[^}]*repeat\(4,\s*minmax\(0,\s*1fr\)\)/s);
  assert.match(stylesheet, /\.watermark-opacity-setting\s*\{\s*grid-column:\s*span 3/s);
  assert.match(stylesheet, /\.watermark-settings-control-grid\s*\{[^}]*gap:\s*0\.\d+rem/s);
});

test('Number colour is last in the second row after Number pages', () => {
  const numberColorInputStart = component.indexOf('id="number-color"');
  const numberColorInputEnd = component.indexOf('/>', numberColorInputStart);
  const numberColorInput = component.slice(numberColorInputStart, numberColorInputEnd);
  const numberingControlOrder = [
    'number-start',
    'number-placement',
    'number-align',
    'number-size',
    'number-margin',
    'number-pages-mode',
    'number-color'
  ].map((id) => component.indexOf(`id="${id}"`));

  assert.ok(numberingControlOrder.every((index) => index >= 0));
  assert.deepEqual([...numberingControlOrder].sort((a, b) => a - b), numberingControlOrder);
  assert.match(component, /className="space-y-2 watermark-number-pages-mode-setting"/);
  assert.match(component, /className="space-y-2 watermark-number-pages-range-setting"/);
  assert.match(numberColorInput, /className="h-12 w-full/);
  assert.match(stylesheet, /\.watermark-numbering-grid\s*\{[^}]*repeat\(4,\s*minmax\(0,\s*1fr\)\)/s);
  assert.match(stylesheet, /\.watermark-number-pages-range-setting\s*\{\s*grid-column:\s*1\s*\/\s*-1/s);
  assert.doesNotMatch(stylesheet, /\.watermark-numbering-grid > div:has\(#number-pages-mode\)/);
});

test('Watermark output filename appears before Apply Watermark, without a duplicate editor on the result card', () => {
  const actionRowStart = component.indexOf('className="watermark-output-actions"');
  const filenameInput = component.indexOf('id="watermark-output-filename"', actionRowStart);
  const applyAction = component.indexOf('onClick={addWatermark}', actionRowStart);
  const resultCard = component.indexOf('<DownloadReadyCard', applyAction);

  assert.ok(actionRowStart >= 0, 'watermark output action row is present');
  assert.ok(filenameInput > actionRowStart && filenameInput < applyAction, 'output filename precedes Apply Watermark');
  assert.ok(resultCard > applyAction, 'download result card follows the apply action');
  assert.match(component.slice(filenameInput, applyAction), /value=\{outputFileName \?\? defaultOutputName\}/);
  assert.match(component.slice(filenameInput, applyAction), /setOutputFileName\(event\.target\.value\)/);
  assert.match(component, /normalizeOutputFileName\(outputFileName \?\? defaultOutputName, defaultOutputName\)/);
  assert.match(component.slice(resultCard), /fileName=\{outputName\}[\s\S]*?showFilenameEditor=\{false\}/);
  assert.doesNotMatch(component, /Apply PDF Options/);
  assert.match(stylesheet, /\.watermark-output-actions\s*\{[^}]*grid-template-areas:\s*"label action"\s*"input action"/s);
  assert.match(stylesheet, /\.watermark-output-actions\s*>\s*\.watermark-output-filename\s*\{[^}]*width:\s*100%/s);
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
