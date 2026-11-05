import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const rail = await readFile(new URL('../src/components/PdfPageThumbnailRail.jsx', import.meta.url), 'utf8').catch(() => '');

test('PDF page thumbnail rail provides accessible page navigation and current-page state', () => {
  assert.match(rail, /<aside className="pdf-page-thumbnail-rail" aria-label="Page preview navigation">/);
  assert.match(rail, /<p className="pdf-page-thumbnail-rail-title"><Eye aria-hidden="true" \/>Preview page<\/p>/);
  assert.match(rail, /aria-label="Previous page"/);
  assert.match(rail, /aria-label="Next page"/);
  assert.match(rail, /Page \{safeCurrentIndex \+ 1\} of \{pageNumbers\.length\}/);
  assert.match(rail, /aria-current=\{pageNumber === currentPage \? 'page' : undefined\}/);
  assert.match(rail, /onClick=\{\(\) => onSelectPage\(pageNumber\)\}/);
});

test('PDF thumbnail previews render lazily inside their scrollable rail', () => {
  assert.match(rail, /className="pdf-page-thumbnail-list"/);
  assert.match(rail, /new IntersectionObserver/);
  assert.match(rail, /root:\s*rootRef\.current/);
  assert.match(rail, /rootMargin:\s*'120px 0px'/);
  assert.match(rail, /page\.render\(\{ canvasContext: context, viewport, intent: 'display' \}\)/);
  assert.match(rail, /Preview unavailable/);
});

test('PDF thumbnail lazy rendering observes the visible paper placeholder', () => {
  assert.match(rail, /const paper = paperRef\.current/);
  assert.match(rail, /observer\.observe\(paper\)/);
});

test('PDF page navigation keeps the active thumbnail in the scrollable rail', () => {
  assert.match(rail, /const activeThumbnail = currentThumbnailRef\.current/);
  assert.match(rail, /const thumbnailBounds = activeThumbnail\.getBoundingClientRect\(\)/);
  assert.match(rail, /rail\.scrollTop [+-]=/);
  assert.match(rail, /rail\.scrollLeft [+-]=/);
  assert.match(rail, /new ResizeObserver\(ensureCurrentThumbnailVisible\)/);
  assert.match(rail, /observer\.observe\(rail\)/);
  assert.match(rail, /ref=\{pageNumber === currentPage \? currentThumbnailRef : undefined\}/);
});
