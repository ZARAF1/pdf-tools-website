import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const merger = await readFile(new URL('../src/components/PdfMerger.jsx', import.meta.url), 'utf8');
const picker = await readFile(new URL('../src/components/PdfMergePagePicker.jsx', import.meta.url), 'utf8');
const toolPage = await readFile(new URL('../src/components/ToolPage.jsx', import.meta.url), 'utf8');
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

test('Merge PDF keeps a compact gap between its heading and attachment workspace', () => {
  const workspaceSpacing = styles.match(
    /\.merge-tool-page\.space-y-8 > section\[aria-labelledby="tool-workspace-heading"\]\s*\{([^}]*)\}/
  )?.[1];

  assert.match(toolPage, /<article className=\{tool === 'merge' \? 'space-y-8 merge-tool-page' : 'space-y-8'\}>/);
  assert.ok(workspaceSpacing, 'Merge workspace has a dedicated spacing override');
  assert.match(workspaceSpacing, /margin-top:\s*1rem\s*;/);
});

test('Merge selected files do not add a second workflow gap inside the attachment panel', () => {
  const selectedFilesSpacing = styles.match(
    /\.merge-tool-page \.tool-attachment-content \.pdf-tool-workflow\.space-y-8 > \.pdf-workflow-selected\s*\{([^}]*)\}/
  )?.[1];

  assert.ok(selectedFilesSpacing, 'Merge selected files have a scoped spacing override');
  assert.match(selectedFilesSpacing, /margin-block-start:\s*0\s*;/);
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

test('Merge attachment list and add-PDF chooser appear immediately before settings', () => {
  const selectedFilesIndex = merger.indexOf('className="merge-selected-files"');
  const selectedFilesEndIndex = merger.indexOf('</section>', selectedFilesIndex);
  const addFilesButtonIndex = merger.indexOf("chooseFilesButton('merge-pdf-add-files-button')", selectedFilesIndex);
  const fileListEndIndex = merger.indexOf('</Reorder.Group>', selectedFilesIndex);
  const settingsIndex = merger.indexOf('className="merge-pdf-settings space-y-6"');
  const footerStyle = styles.match(/\.merge-selected-files-footer\s*\{([^}]*)\}/)?.[1];
  const settingsSpacing = styles.match(
    /\.tool-attachment-content \.pdf-tool-workflow\.space-y-8 > \.merge-pdf-settings\s*\{([^}]*)\}/
  )?.[1];
  const attachmentOrder = styles.match(/\.pdf-tool-workflow\.space-y-8\s*>\s*\.merge-pdf-settings\s*\{([^}]*)\}/)?.[1];

  assert.ok(selectedFilesIndex >= 0, 'selected files section is present');
  assert.ok(addFilesButtonIndex > fileListEndIndex && addFilesButtonIndex < selectedFilesEndIndex, 'add-PDF chooser is below the attachments inside the selected-files section');
  assert.ok(footerStyle, 'the add-files footer has a dedicated layout rule');
  assert.match(footerStyle, /justify-content:\s*flex-end\s*;/);
  assert.ok(settingsIndex > selectedFilesEndIndex, 'settings follow the selected-files section');
  assert.ok(settingsSpacing, 'Merge settings need a scoped spacing override');
  assert.match(settingsSpacing, /margin-block-start:\s*1rem\s*;/);
  assert.ok(attachmentOrder, 'Merge settings have an explicit flex order after attachments');
  assert.match(attachmentOrder, /order:\s*4\s*;/);
});

test('Merge keeps the dropzone empty-state only and puts the add-files button below the file list', () => {
  const headerStart = merger.indexOf('<header className="merge-selected-files-header">');
  const headerEnd = merger.indexOf('</header>', headerStart);
  const headerMarkup = merger.slice(headerStart, headerEnd);
  const selectedFilesEnd = merger.indexOf('</section>', headerStart);
  const fileListEnd = merger.indexOf('</Reorder.Group>', headerStart);
  const addFilesButtonIndex = merger.indexOf("chooseFilesButton('merge-pdf-add-files-button')", headerStart);
  const uploadZoneMarkup = merger.match(/const uploadZone = \([\s\S]*?\n  \);/)?.[0];
  const uploadInputsMarkup = merger.match(/const uploadInputs = \([\s\S]*?\n  \);/)?.[0];
  const chooseFilesButtonMarkup = merger.match(/const chooseFilesButton = \(className\) => \([\s\S]*?\n  \);/)?.[0];

  assert.match(merger, /\{files\.length === 0 && uploadZone\}/, 'the dropzone appears when no files are selected');
  assert.equal([...merger.matchAll(/\{uploadZone\}/g)].length, 0, 'the dropzone is not rendered again after files are added');
  assert.doesNotMatch(headerMarkup, /merge-pdf-add-files-button/, 'the add-files button is not beside the file count');
  assert.ok(addFilesButtonIndex > fileListEnd && addFilesButtonIndex < selectedFilesEnd, 'the add-files button follows all attachment rows');
  assert.match(uploadZoneMarkup, /chooseFilesButton\('merge-pdf-upload-button'\)/);
  assert.match(chooseFilesButtonMarkup, /pdf-editor-primary-button \$\{className\}/);
  assert.match(chooseFilesButtonMarkup, /onClick=\{\(event\) => \{\s*event\.stopPropagation\(\);\s*open\(\);/);
  assert.match(chooseFilesButtonMarkup, /Choose Up to 5 PDFs/);
  assert.match(chooseFilesButtonMarkup, /disabled=\{isValidating \|\| isMerging \|\| files\.length >= MAX_FILES\}/);
  assert.doesNotMatch(uploadZoneMarkup, /getInputProps|open\(\)/, 'the empty-state dropzone does not own the persistent picker inputs');
  assert.match(uploadInputsMarkup, /getInputProps\(/, 'the add-files picker input stays mounted after selection');
  assert.match(uploadInputsMarkup, /getReplaceInputProps\(/, 'the replacement picker input stays mounted after selection');
  assert.match(merger, /\{uploadInputs\}/, 'both hidden picker inputs render outside the conditional dropzone');
});

test('Merge output fields have a Select pages-style Choose Settings introduction', () => {
  const settingsHeadingIndex = merger.indexOf(
    '<h3 className="merge-section-heading-title merge-output-settings-title">Choose Settings</h3>'
  );
  const outputSettingsIndex = merger.indexOf('className="merge-output-settings"');

  assert.match(
    merger,
    /<div className="merge-section-heading merge-output-settings-heading">\s*<div>\s*<h3 className="merge-section-heading-title merge-output-settings-title">Choose Settings<\/h3>\s*<p>Set the output name and page size, and choose optional bookmarks or blank pages\.<\/p>/
  );
  assert.ok(settingsHeadingIndex >= 0, 'Choose Settings heading is present');
  assert.ok(outputSettingsIndex > settingsHeadingIndex, 'settings heading appears before output filename');
});

test('Merge Choose Settings and its controls share one dark panel with a blue title accent', () => {
  const panelIndex = merger.indexOf('className="merge-output-settings-panel"');
  const headingIndex = merger.indexOf('className="merge-section-heading merge-output-settings-heading"', panelIndex);
  const titleIndex = merger.indexOf('className="merge-section-heading-title merge-output-settings-title"', headingIndex);
  const controlsIndex = merger.indexOf('className="merge-output-settings"', titleIndex);
  const panelStyle = styles.match(/\.merge-output-settings-panel\s*\{([^}]*)\}/)?.[1];
  const headingStyle = styles.match(/\.merge-output-settings-heading,\s*\.merge-page-selection-heading,\s*\.merge-live-output-heading\s*\{([^}]*)\}/)?.[1];
  const titleStyle = styles.match(
    /\.merge-section-heading h3\.merge-output-settings-title,\s*\.merge-section-heading h3\.merge-page-selection-title,\s*\.merge-section-heading h3\.merge-live-output-title\s*\{([^}]*)\}/
  )?.[1];
  const controlsStyle = styles.match(/\.merge-output-settings\s*\{([^}]*)\}/)?.[1];

  assert.ok(panelIndex >= 0, 'Choose Settings and its controls have one containing panel');
  assert.ok(headingIndex > panelIndex && titleIndex > headingIndex, 'the highlighted label is inside the panel heading');
  assert.ok(controlsIndex > headingIndex, 'the output controls follow the Choose Settings heading in the same panel');
  assert.ok(panelStyle, 'the combined settings panel has a dedicated style');
  assert.match(panelStyle, /background:\s*var\(--surface-background\)\s*;/);
  assert.match(panelStyle, /border:\s*1px solid var\(--border-color\)\s*;/);
  assert.ok(headingStyle, 'the settings heading has a panel-specific style');
  assert.match(headingStyle, /background:\s*transparent\s*;/);
  assert.doesNotMatch(headingStyle, /border-left:\s*4px solid #3b82f6/);
  assert.ok(titleStyle, 'the Choose Settings label receives the blue tint');
  assert.match(titleStyle, /background:\s*#eff6ff\s*;/);
  assert.match(titleStyle, /border-left:\s*4px solid #3b82f6\s*;/);
  assert.ok(controlsStyle, 'controls have a style within the shared panel');
  assert.doesNotMatch(controlsStyle, /background:\s*var\(--surface-background\)\s*;/);
  assert.doesNotMatch(controlsStyle, /border:\s*1px solid var\(--border-color\)\s*;/);
});

test('Merge page selection and live output each group their heading and content in one dark panel', () => {
  const selectionPanelIndex = merger.indexOf('className="merge-page-selection-panel"');
  const selectionHeadingIndex = merger.indexOf('className="merge-section-heading merge-page-selection-heading"', selectionPanelIndex);
  const selectionTitleIndex = merger.indexOf(
    'className="merge-section-heading-title merge-page-selection-title">Select pages',
    selectionHeadingIndex
  );
  const pagePickersIndex = merger.indexOf('className="merge-source-page-pickers"', selectionTitleIndex);
  const outputPanelIndex = merger.indexOf('className="merge-live-output merge-live-output-panel"');
  const outputHeadingIndex = merger.indexOf('className="merge-section-heading merge-live-output-heading"', outputPanelIndex);
  const outputTitleIndex = merger.indexOf(
    'className="merge-section-heading-title merge-live-output-title">Live output preview',
    outputHeadingIndex
  );
  const outputContentIndex = merger.indexOf('className="merge-live-output-content"', outputTitleIndex);
  const emptyPrompt = merger.match(/<p className="merge-live-output-empty(?:\s+[^"]*)?">Select a page above to start building the output\.<\/p>/);
  const panelStyle = styles.match(/\.merge-page-selection-panel,\s*\.merge-live-output-panel\s*\{([^}]*)\}/)?.[1];
  const headingStyle = styles.match(/\.merge-page-selection-heading,\s*\.merge-live-output-heading\s*\{([^}]*)\}/)?.[1];
  const titleStyle = styles.match(/\.merge-section-heading h3\.merge-page-selection-title,\s*\.merge-section-heading h3\.merge-live-output-title\s*\{([^}]*)\}/)?.[1];
  const outputContentStyle = styles.match(/\.merge-live-output-content\s*\{([^}]*)\}/)?.[1];

  assert.ok(selectionPanelIndex >= 0, 'Select pages has a containing panel');
  assert.ok(selectionHeadingIndex > selectionPanelIndex && selectionTitleIndex > selectionHeadingIndex);
  assert.ok(pagePickersIndex > selectionTitleIndex, 'page pickers follow the Select pages heading within its panel');
  assert.ok(outputPanelIndex >= 0, 'Live output preview has a containing panel');
  assert.ok(outputHeadingIndex > outputPanelIndex && outputTitleIndex > outputHeadingIndex);
  assert.ok(outputContentIndex > outputTitleIndex, 'output content follows its heading within the panel');
  assert.ok(panelStyle, 'both sections use one dark-surface panel style');
  assert.match(panelStyle, /background:\s*var\(--surface-background\)\s*;/);
  assert.match(panelStyle, /border:\s*1px solid var\(--border-color\)\s*;/);
  assert.ok(headingStyle, 'both panel headings are unboxed inside their panel');
  assert.match(headingStyle, /background:\s*transparent\s*;/);
  assert.doesNotMatch(headingStyle, /border-left:\s*4px solid #3b82f6/);
  assert.ok(titleStyle, 'the Select pages and Live output preview labels receive the blue tint');
  assert.match(titleStyle, /background:\s*#eff6ff\s*;/);
  assert.match(titleStyle, /border-left:\s*4px solid #3b82f6\s*;/);
  assert.ok(emptyPrompt, 'the empty output prompt is plain text without the blue-tint instruction class');
  assert.ok(outputContentStyle, 'output content retains a distinct in-panel boundary');
  assert.doesNotMatch(outputContentStyle, /margin-block-start:\s*1rem\s*;/);
});

test('Merge section headings carry the highlight while their explanations stay unhighlighted', () => {
  for (const heading of ['Choose Settings', 'Select pages', 'Live output preview']) {
    const titleClass = {
      'Choose Settings': 'merge-section-heading-title merge-output-settings-title',
      'Select pages': 'merge-section-heading-title merge-page-selection-title',
      'Live output preview': 'merge-section-heading-title merge-live-output-title',
    }[heading];
    const headingMarkup = merger.match(
      new RegExp(`<h3(?: id="[^"]+")? className="${titleClass}">${heading}</h3>`)
    );
    assert.ok(headingMarkup, `${heading} has the highlighted heading style`);
  }

  assert.doesNotMatch(
    merger,
    /<p className="pdf-preview-instructions">(?:Set the output name and page size, and choose optional bookmarks or blank pages\.|Click page previews to add them to the live output in that order\. New selections start empty\.|Pages are shown in the order they will appear\. Drag to reorder, or use the move buttons\.)<\/p>/
  );
  const headingStyle = styles.match(/\.merge-section-heading\s*\{([^}]*)\}/)?.[1];
  const headingTitleStyle = styles.match(/\.merge-section-heading-title\s*\{([^}]*)\}/)?.[1];
  assert.ok(headingStyle, 'Merge section heading bands have a dedicated style');
  assert.match(headingStyle, /background:\s*var\(--surface-background\)\s*;/);
  assert.match(headingStyle, /border-left:\s*4px solid #3b82f6\s*;/);
  assert.match(headingStyle, /width:\s*100%\s*;/);
  assert.ok(headingTitleStyle, 'Merge section titles have a dedicated style');
  assert.doesNotMatch(headingTitleStyle, /background\s*:/);
  assert.doesNotMatch(headingTitleStyle, /border-left\s*:/);
});

test('Merge settings and preview controls have matching heading and guidance', () => {
  const settingsIntro = merger.match(
    /<div className="merge-control-intro">\s*<h3 className="merge-selected-files-title">Settings<\/h3>\s*<p>Choose how to combine your PDFs and customize the output\.<\/p>\s*<\/div>/
  );
  const settingsButtons = merger.indexOf('className="merge-mode-switch"');
  const previewControls = picker.match(
    /<div className="merge-page-source-action-group">\s*<h5 className="merge-selected-files-title">Preview<\/h5>\s*<p>Choose which pages to include in the output\.<\/p>\s*<div className="merge-page-source-actions">/
  );

  assert.ok(settingsIntro, 'Settings heading and guidance appear above the merge-mode buttons');
  assert.ok(settingsButtons > merger.indexOf('className="merge-control-intro"'), 'Settings guidance precedes its buttons');
  assert.ok(previewControls, 'Preview heading and guidance appear above Select All and Clear');
});

test('Merge output options occupy their own panel and live output has no outer box', () => {
  const outputPanelStyle = styles.match(/\.merge-output-settings-panel\s*\{([^}]*)\}/)?.[1];
  const outputSettingsStyle = styles.match(/\.merge-output-settings\s*\{([^}]*)\}/)?.[1];
  const liveOutputStyle = styles.match(/(?:^|\n)\.merge-live-output\s*\{([^}]*)\}/)?.[1];

  assert.ok(outputPanelStyle, 'Output heading and controls have a shared panel style');
  assert.match(outputPanelStyle, /background:\s*var\(--surface-background\)\s*;/);
  assert.match(outputPanelStyle, /border:\s*1px solid var\(--border-color\)\s*;/);
  assert.match(outputPanelStyle, /padding:\s*clamp\(/);
  assert.ok(outputSettingsStyle, 'Output controls have a layout rule within their shared panel');
  assert.doesNotMatch(outputSettingsStyle, /background\s*:/);
  assert.doesNotMatch(outputSettingsStyle, /border\s*:/);
  assert.doesNotMatch(outputSettingsStyle, /padding\s*:/);
  assert.ok(liveOutputStyle, 'Live output has a layout rule separate from its heading');
  assert.doesNotMatch(liveOutputStyle, /background\s*:/);
  assert.doesNotMatch(liveOutputStyle, /border\s*:/);
  assert.doesNotMatch(liveOutputStyle, /padding\s*:/);
});

test('Merge live output pages sit inside a dark surface box spaced from its heading', () => {
  const outputContentStyle = styles.match(/\.merge-live-output-content\s*\{([^}]*)\}/)?.[1];
  const outputPanelStyle = styles.match(/\.merge-page-selection-panel,\s*\.merge-live-output-panel\s*\{([^}]*)\}/)?.[1];
  const contentStart = merger.indexOf('<div className="merge-live-output-content">');
  const emptyStateIndex = merger.indexOf('className="merge-live-output-empty', contentStart);
  const outputListIndex = merger.indexOf('className="merge-live-output-list"', contentStart);

  assert.ok(outputContentStyle, 'Live output pages have a dedicated containing box');
  assert.match(outputContentStyle, /background:\s*var\(--surface-background\)\s*;/);
  assert.match(outputContentStyle, /border:\s*1px solid var\(--border-color\)\s*;/);
  assert.match(outputContentStyle, /border-radius:\s*0\.875rem\s*;/);
  assert.match(outputContentStyle, /padding:\s*clamp\(/);
  assert.ok(outputPanelStyle, 'the output panel separates its heading and content');
  assert.match(outputPanelStyle, /gap:\s*1rem\s*;/);
  assert.ok(contentStart >= 0, 'Output content has a wrapper below the preview heading');
  assert.ok(emptyStateIndex > contentStart, 'The empty-state prompt is inside the output box');
  assert.ok(outputListIndex > contentStart, 'Output pages are inside the output box');
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

test('Merge settings panel uses the muted Merge surface color', () => {
  const settingsPanel = styles.match(/(?:^|\n)\.merge-pdf-settings\s*\{([^}]*)\}/)?.[1];

  assert.ok(settingsPanel, 'Merge settings panel has a dedicated style rule');
  assert.match(settingsPanel, /background:\s*var\(--surface-muted\)\s*;/);
});

test('Merge PDF settings have a gap after the file panel and before the processing action', () => {
  const settingsSpacing = styles.match(
    /\.tool-attachment-content \.pdf-tool-workflow\.space-y-8 > \.merge-pdf-settings\s*\{([^}]*)\}/
  )?.[1];

  assert.ok(settingsSpacing, 'Merge settings need a scoped spacing override');
  assert.match(settingsSpacing, /margin-block-start:\s*1rem\s*;/);
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
