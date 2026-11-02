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

test('Merge page picker labels its bulk selection action Select All', () => {
  assert.match(picker, />\s*Select All\s*</);
});

test('Merge PDF output settings appear between the mode buttons and page selection', () => {
  const modeSwitchIndex = merger.indexOf('className="merge-mode-switch"');
  const outputSettingsIndex = merger.indexOf('className="merge-output-settings"');
  const pageSelectionIndex = merger.indexOf('className="merge-page-selection-workspace"');

  assert.ok(modeSwitchIndex >= 0, 'merge mode buttons are present');
  assert.ok(outputSettingsIndex > modeSwitchIndex, 'output settings follow the mode buttons');
  assert.ok(pageSelectionIndex > outputSettingsIndex, 'page selection follows the output settings');
});

test('Merge output fields have a Select pages-style Choose Settings introduction', () => {
  const settingsHeadingIndex = merger.indexOf('<h3 className="merge-section-heading-title">Choose Settings</h3>');
  const outputSettingsIndex = merger.indexOf('className="merge-output-settings"');

  assert.match(
    merger,
    /<div className="merge-section-heading">\s*<div>\s*<h3 className="merge-section-heading-title">Choose Settings<\/h3>\s*<p>Set the output name and page size, and choose optional bookmarks or blank pages\.<\/p>/
  );
  assert.ok(settingsHeadingIndex >= 0, 'Choose Settings heading is present');
  assert.ok(outputSettingsIndex > settingsHeadingIndex, 'settings heading appears before output filename');
});

test('Merge section headings carry the highlight while their explanations stay unhighlighted', () => {
  for (const heading of ['Choose Settings', 'Select pages', 'Live output preview']) {
    const headingMarkup = merger.match(
      new RegExp(`<h3(?: id="[^"]+")? className="merge-section-heading-title">${heading}</h3>`)
    );
    assert.ok(headingMarkup, `${heading} has the highlighted heading style`);
  }

  assert.doesNotMatch(
    merger,
    /<p className="pdf-preview-instructions">(?:Set the output name and page size, and choose optional bookmarks or blank pages\.|Click page previews to add them to the live output in that order\. New selections start empty\.|Pages are shown in the order they will appear\. Drag to reorder, or use the move buttons\.)<\/p>/
  );
  const headingStyle = styles.match(/\.merge-section-heading-title\s*\{([^}]*)\}/)?.[1];
  assert.ok(headingStyle, 'Merge section headings have a dedicated highlight style');
  assert.match(headingStyle, /background:\s*var\(--surface-muted\)\s*;/);
  assert.match(headingStyle, /border-left:\s*4px solid #3b82f6\s*;/);
});

test('Merge PDF selected files use an ordered, responsive list with clear per-file controls', () => {
  assert.match(merger, /className="merge-selected-files"/);
  assert.match(merger, /className="merge-selected-file-list"/);
  assert.match(merger, /aria-label="PDFs in merge order"/);
  assert.match(merger, /className="pdf-attached-file-card merge-selected-file-card group"/);
  assert.match(merger, /className="merge-selected-file-position" aria-hidden="true"/);
  assert.match(merger, /className="merge-selected-file-details"/);
  assert.match(merger, /fileObj\.pageCount/);
  assert.match(merger, /role="group" aria-label=\{`Change order of \$\{fileObj\.name\}`\}/);
  assert.match(merger, /aria-label=\{`Move \$\{fileObj\.name\} up`\}/);
  assert.match(merger, /aria-label=\{`Move \$\{fileObj\.name\} down`\}/);

  const filePanel = styles.match(/\.merge-selected-files\s*\{([^}]*)\}/)?.[1];
  const fileCard = styles.match(/\.merge-selected-file-card\s*\{([^}]*)\}/)?.[1];
  assert.ok(filePanel, 'selected files have a contained panel style');
  assert.ok(fileCard, 'selected files use a dedicated row layout');
  assert.match(fileCard, /display:\s*grid\s*;/);
  assert.match(
    styles,
    /@media \(max-width: 640px\)[\s\S]*?\.merge-selected-file-card\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)/
  );
  assert.match(
    styles,
    /@media \(max-width: 640px\)[\s\S]*?\.merge-selected-file-main > \.pdf-attached-file-icon\s*\{\s*display:\s*none\s*;/
  );
});

test('Merge PDF settings do not show standalone horizontal divider lines', () => {
  const modeSwitch = styles.match(/\.merge-mode-switch\s*\{([^}]*)\}/)?.[1];
  const outputSettings = styles.match(/\.merge-output-settings\s*\{([^}]*)\}/)?.[1];

  assert.ok(modeSwitch, 'merge mode switch styles are defined');
  assert.ok(outputSettings, 'merge output settings styles are defined');
  assert.doesNotMatch(modeSwitch, /border-bottom\s*:/);
  assert.doesNotMatch(modeSwitch, /padding-bottom\s*:/);
  assert.doesNotMatch(outputSettings, /border-top\s*:/);
  assert.doesNotMatch(outputSettings, /padding-top\s*:/);
});

test('Merge PDF settings remove top margin and leave space before the file list', () => {
  const settingsSpacing = styles.match(
    /\.tool-attachment-content \.pdf-tool-workflow\.space-y-8 > \.merge-pdf-settings\s*\{([^}]*)\}/
  )?.[1];

  assert.ok(settingsSpacing, 'Merge settings need a scoped spacing override');
  assert.match(settingsSpacing, /margin-block-start:\s*0\s*;/);
  assert.match(settingsSpacing, /margin-block-end:\s*1rem\s*;/);
});

test('Merge source filenames are prominent and preview sections are separated', () => {
  const sourceTitle = styles.match(/\.merge-page-source-title\s*\{([^}]*)\}/)?.[1];
  const sourcePickers = styles.match(/\.merge-source-page-pickers\s*\{([^}]*)\}/)?.[1];

  assert.ok(sourceTitle, 'source filename styles are defined');
  assert.match(sourceTitle, /font-size:\s*1rem\s*;/);
  assert.match(sourceTitle, /text-decoration:\s*underline\s*;/);
  assert.ok(sourcePickers, 'source preview sections have a layout rule');
  assert.match(sourcePickers, /display:\s*grid\s*;/);
  assert.match(sourcePickers, /gap:\s*1rem\s*;/);
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

test('Merge page selection uses compact thumbnails and controls with a responsive output preview lane', () => {
  assert.match(styles, /\.merge-page-source-grid\s*\{[^}]*minmax\(min\(100%, 9rem\), 1fr\)/);
  assert.match(styles, /\.merge-page-source-image\s*\{[^}]*height:\s*9rem/);
  assert.match(styles, /\.merge-live-output-item\s*\{[^}]*width:\s*10rem/);
  assert.match(styles, /\.merge-live-output-list\s*\{[^}]*overflow-x:\s*auto/);
  assert.match(picker, /className="merge-page-preview-button"[\s\S]*?title=\{`Larger preview, page \$\{pageIndex \+ 1\}`\}[\s\S]*?<Eye className="h-4 w-4"/);
  assert.doesNotMatch(picker, /<Eye className="h-4 w-4" aria-hidden="true" \/>[\s\S]{0,80}Larger preview/);
  assert.match(styles, /@media \(max-width: 640px\)\s*\{[\s\S]*?\.merge-output-settings\s*\{\s*grid-template-columns:\s*minmax\(0, 1fr\)/);
  assert.match(styles, /@media \(max-width: 640px\)[\s\S]*?\.merge-page-source-grid\s*\{\s*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
});
