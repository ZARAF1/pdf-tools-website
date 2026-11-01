import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const merger = await readFile(new URL('../src/components/PdfMerger.jsx', import.meta.url), 'utf8');
const picker = await readFile(new URL('../src/components/PdfMergePagePicker.jsx', import.meta.url), 'utf8');
const styles = await readFile(new URL('../src/index.css', import.meta.url), 'utf8');

test('Merge PDF keeps merge-all as the default and offers selective page mode', () => {
  assert.match(merger, /useState\('all'\)/);
  assert.match(merger, /Merge all pages/);
  assert.match(merger, /Select pages/);
  assert.match(merger, /<PdfMergePagePicker\b/);
  assert.match(picker, /INITIAL_PREVIEW_COUNT = 12/);
  assert.match(picker, /scale = Math\.min\(1\.5, 520 \/ originalViewport\.width, 740 \/ originalViewport\.height\)/);
  assert.match(picker, /Larger preview/);
});

test('selected pages are previewed in their live output order and can be reordered', () => {
  assert.match(merger, /<Reorder\.Group[^>]*axis="x"[^>]*values=\{selectedPages\}/);
  assert.match(merger, /onReorder=\{reorderSelectedPages\}/);
  assert.match(merger, /<img src=\{item\.preview\.preview\} alt="" draggable=\{false\}/);
  assert.match(merger, /Live output preview/);
  assert.match(merger, /onClick=\{\(\) => moveSelectedPage/);
});

test('blank-page markers reserve the same space on every live-output tile', () => {
  assert.match(merger, /<div className=\{`merge-live-blank-slot\$\{addBlankPages \? ' is-enabled' : ''\}`\}>\s*\{item\.blankBefore &&/);
  assert.match(styles, /\.merge-live-blank-slot\.is-enabled\s*\{\s*flex:\s*0 0 2\.125rem;\s*\}/);
});

test('Merge PDF exposes output filename, source bookmarks, page sizing, and file-boundary blanks', () => {
  assert.match(merger, /Output filename/);
  assert.match(merger, /Bookmark each source file/);
  assert.match(merger, /Preserve original page sizes/);
  assert.match(merger, /Fit to US Letter/);
  assert.match(merger, /Fit to A4/);
  assert.match(merger, /Insert a blank page between source files/);
});

test('Merge page thumbnails have a large readable responsive grid and output preview lane', () => {
  assert.match(styles, /\.merge-page-source-grid\s*\{[^}]*minmax\(min\(100%, 15rem\), 1fr\)/);
  assert.match(styles, /\.merge-page-source-image\s*\{[^}]*min-height:\s*16rem/);
  assert.match(styles, /\.merge-live-output-list\s*\{[^}]*overflow-x:\s*auto/);
  assert.match(styles, /@media \(max-width: 640px\)\s*\{[\s\S]*?\.merge-output-settings\s*\{\s*grid-template-columns:\s*minmax\(0, 1fr\)/);
});
