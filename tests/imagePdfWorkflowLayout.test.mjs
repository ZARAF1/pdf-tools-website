import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const readSource = (path) => readFile(new URL(path, import.meta.url), 'utf8');

test('Image to PDF groups settings and composed image tiles in matching preview panels', async () => {
  const [component, styles] = await Promise.all([
    readSource('../src/components/ImageToPdf.jsx'),
    readSource('../src/index.css')
  ]);
  const attachmentStart = component.indexOf('className="image-to-pdf-file-section"');
  const attachmentEnd = component.indexOf('</section>', attachmentStart);
  const attachedImagesIndex = component.indexOf('<ol className="image-to-pdf-attached-image-list"', attachmentStart);
  const addImagesIndex = component.indexOf('imageUi.addMoreImages', attachmentStart);
  const settingsStart = component.indexOf('className="image-to-pdf-settings-shell"');
  const previewStart = component.indexOf('className="image-to-pdf-preview-shell"');
  const settingsSection = component.slice(settingsStart, previewStart);
  const previewSection = component.slice(previewStart);

  assert.ok(attachmentStart >= 0);
  assert.ok(attachedImagesIndex > attachmentStart && attachedImagesIndex < attachmentEnd, 'attached images should be listed in the attachment panel');
  assert.ok(addImagesIndex > attachedImagesIndex && addImagesIndex < attachmentEnd, 'the add-more action should follow the attached image list');
  assert.ok(settingsStart > attachmentStart, 'settings should follow the attachment section');
  assert.ok(previewStart > settingsStart, 'preview should follow settings');
  assert.match(component, /className="image-to-pdf-image-count"[^>]*>[\s\S]*imageUi\.imageCount/);
  assert.doesNotMatch(component, /<h4 className="image-to-pdf-attached-images-title">/);
  assert.match(component, /<ol className="image-to-pdf-attached-image-list" aria-label=\{imageUi\.attachedImages\}>/);
  assert.match(component, /className="merge-selected-file-position image-to-pdf-attached-image-position"/);
  assert.match(component, /String\(index \+ 1\)\.padStart\(2, '0'\)/);
  assert.match(component, /image\.name[\s\S]*image\.width[\s\S]*formatBytes\(image\.file\.size\)/);
  const attachedImageRows = component.slice(attachedImagesIndex, component.indexOf('</ol>', attachedImagesIndex));
  assert.match(attachedImageRows, /className="image-to-pdf-attached-image-actions"/);
  assert.match(attachedImageRows, /onClick=\{\(\) => moveImage\(index, -1\)\}/);
  assert.match(attachedImageRows, /onClick=\{\(\) => moveImage\(index, 1\)\}/);
  assert.match(attachedImageRows, /onClick=\{\(\) => rotateImage\(image\.id, 90\)\}/);
  assert.match(attachedImageRows, /onClick=\{\(\) => removeImage\(image\.id\)\}/);
  assert.match(settingsSection, /className="image-to-pdf-settings-panel"/);
  assert.match(settingsSection, /<div className="merge-panel-title">\s*<Settings2 aria-hidden="true" \/>\s*<h3 className="merge-selected-files-title">\{imageUi\.settingsTitle\}<\/h3>\s*<\/div>\s*<p>\{imageUi\.settingsDescription\}<\/p>/);
  assert.match(settingsSection, /id="image-to-pdf-scope-toggle-label"[^>]*>\s*\{imageUi\.scopeToggleLabel\}\s*<\/p>/);
  assert.match(settingsSection, /imageUi\.pageSize/);
  assert.match(settingsSection, /imageUi\.jpegQuality/);
  assert.match(settingsSection, /imageUi\.encodingNote/);
  assert.match(settingsSection, /imageUi\.settingsDescription/);
  assert.match(settingsSection, /role="switch"[\s\S]*aria-checked=\{settingsScope === 'select'\}[\s\S]*aria-labelledby="image-to-pdf-scope-toggle-label"/);
  assert.equal((settingsSection.match(/role="switch"/g) || []).length, 1, 'setting scope is controlled by one toggle');
  assert.doesNotMatch(settingsSection, /aria-pressed=\{settingsScope ===/);
  assert.ok(
    settingsSection.indexOf('image-to-pdf-output-mode-setting') < settingsSection.indexOf('image-to-pdf-scope-toggle-setting')
      && settingsSection.indexOf('image-to-pdf-scope-toggle-setting') < settingsSection.indexOf('image-to-pdf-settings-controls'),
    'the scope toggle follows PDF output choices and precedes image settings'
  );
  assert.doesNotMatch(previewSection, /imageUi\.pagePreview|Page Preview/, 'the redundant Page Preview label is not rendered');
  assert.match(previewSection, /<section className="image-to-pdf-preview-panel" aria-label=\{imageUi\.previewTitle\}>/);
  assert.match(previewSection, /className="image-to-pdf-page-preview-description"[\s\S]*?\{imageUi\.selectImagesHint\}/);
  assert.match(previewSection, /image-to-pdf-preview-panel/);
  assert.match(previewSection, /image-to-pdf-page-card/);
  assert.match(previewSection, /className="merge-page-source-select image-to-pdf-page-select"[\s\S]*onClick=\{\(\) => toggleImageSelection\(image\.id\)\}[\s\S]*aria-pressed=\{isSelected\}/);
  assert.match(previewSection, /className=\{`merge-page-selection-mark\$\{isSelected \? ' is-selected' : ''\}`\}[\s\S]*<Check/);
  assert.match(styles, /\.merge-page-source-card\.is-selected\s*\{[^}]*#2563eb/s);
  assert.match(component, /image-to-pdf-page-canvas/);
  assert.match(previewSection, /imageUi\.selectImage/);
  assert.match(previewSection, /imageUi\.viewLargerPreview/);
  assert.match(previewSection, /Eye className=/);
  assert.match(previewSection, /image-to-pdf-page-preview-dialog/);
  assert.doesNotMatch(previewSection, /className="image-to-pdf-page-actions"/, 'reorder, rotate, and remove controls are kept in the attached image rows rather than duplicated on preview tiles');
  assert.match(styles, /\.image-to-pdf-settings-shell,\s*\.image-to-pdf-preview-shell\s*\{[^}]*background:\s*var\(--surface-muted\)/s);
  assert.match(styles, /\.image-to-pdf-settings-panel,\s*\.image-to-pdf-preview-panel\s*\{[^}]*background:\s*var\(--surface-background\)/s);
  assert.match(styles, /\.image-to-pdf-workflow \.image-to-pdf-setting\s*\{[^}]*padding:\s*0\.625rem/s);
  assert.match(styles, /\.image-to-pdf-workflow \.image-to-pdf-settings-controls\s*\{[^}]*gap:\s*0\.75rem/s);
  assert.match(styles, /\.image-to-pdf-attached-image-list\s*\{[^}]*gap:\s*0\.625rem/s);
  assert.match(styles, /\.image-to-pdf-attached-image-position\s*\{[^}]*width:\s*1\.875rem/s);
  const mobileStyles = styles.slice(styles.lastIndexOf('@media (max-width: 600px)'));
  assert.match(mobileStyles, /\.image-to-pdf-attached-image-card\s*\{[^}]*grid-template-columns:\s*1\.875rem 2\.5rem minmax\(0, 1fr\);/s);
  assert.match(mobileStyles, /\.image-to-pdf-attached-image-actions\s*\{[^}]*grid-column:\s*3\s*\/\s*-1;[^}]*justify-self:\s*end;/s);
  assert.match(mobileStyles, /\.image-to-pdf-attached-image-action\s*\{[^}]*width:\s*1\.5rem;[^}]*height:\s*1\.5rem;/s);
  const actionStart = component.indexOf('className="pdf-workflow-actions image-to-pdf-action-row');
  const actionEnd = component.indexOf('{error &&', actionStart);
  const actionRow = component.slice(actionStart, actionEnd);
  const settingsShell = component.slice(settingsStart, previewStart);
  assert.match(settingsShell, /onClick=\{resetSettings\}[\s\S]*?\{imageUi\.reset\}/, 'settings reset should be inside the Settings panel');
  assert.doesNotMatch(actionRow, /imageUi\.reset/, 'the action row should not reset or remove attached images');
  assert.match(actionRow, /className="pdf-workflow-actions[^"]*justify-end/);
  assert.match(component, /imageUi\.outputMode/);
  assert.match(component, /outputMode === 'separate'/);
  assert.match(component, /createImagePdfArchive/);
  assert.match(component, /const resetSettings = \(\) => \{[\s\S]*?setImages\(\(current\) => resetImagePdfSettings\(current\)\);[\s\S]*?setSettings\(INITIAL_SETTINGS\);[\s\S]*?clearOutput\(\);[\s\S]*?\};/);
});

test('Image to PDF uses icons and a concise attachment description without a duplicate list heading', async () => {
  const component = await readSource('../src/components/ImageToPdf.jsx');
  const uploadTitle = component.indexOf('id="image-to-pdf-file-heading"');
  const settingsTitle = component.indexOf('image-to-pdf-settings-shell');
  const previewTitle = component.indexOf('image-to-pdf-preview-shell');

  assert.match(component, /<div className="merge-panel-title">\s*<ImageIcon aria-hidden="true" \/>\s*<h3 id="image-to-pdf-file-heading"[^>]*>\{imageUi\.uploadLabel\}<\/h3>\s*<\/div>\s*<p>\{imageUi\.chooseImagesDescription\}<\/p>/);
  assert.doesNotMatch(component, /<h4 className="image-to-pdf-attached-images-title">/);
  assert.match(component, /<ol className="image-to-pdf-attached-image-list" aria-label=\{imageUi\.attachedImages\}>/);
  assert.match(component.slice(settingsTitle, previewTitle), /<div className="merge-panel-title">\s*<Settings2 aria-hidden="true" \/>\s*<h3 className="merge-selected-files-title">\{imageUi\.settingsTitle\}<\/h3>\s*<\/div>/);
  assert.match(component.slice(previewTitle), /<div className="merge-panel-title">\s*<Eye aria-hidden="true" \/>\s*<h3 className="merge-selected-files-title">\{imageUi\.previewTitle\}<\/h3>\s*<\/div>/);
  assert.ok(uploadTitle >= 0 && uploadTitle < settingsTitle && settingsTitle < previewTitle);
});

test('Image to PDF places selected images in their own muted attachment section', async () => {
  const [component, styles] = await Promise.all([
    readSource('../src/components/ImageToPdf.jsx'),
    readSource('../src/index.css')
  ]);
  const selectedSection = component.match(
    /className="conversion-selected-file-section image-to-pdf-selected-file-section"[\s\S]*?<\/section>/
  )?.[0];

  assert.ok(selectedSection, 'selected images have a dedicated section');
  assert.match(selectedSection, /imageUi\.uploadLabel/);
  assert.match(selectedSection, /imageUi\.imageCount/);
  assert.match(selectedSection, /image-to-pdf-attached-image-list/);
  assert.match(selectedSection, /imageUi\.addMoreImages/);
  assert.match(styles, /\.conversion-selected-file-section\s*\{[^}]*background:\s*var\(--surface-muted\)/s);
});

test('Image to PDF uses a compact right-aligned action and places its result afterward', async () => {
  const [component, styles] = await Promise.all([
    readSource('../src/components/ImageToPdf.jsx'),
    readSource('../src/index.css')
  ]);
  const actionStart = component.indexOf('className="pdf-workflow-actions image-to-pdf-action-row');
  const actionEnd = component.indexOf('{error &&', actionStart);
  const actionRow = component.slice(actionStart, actionEnd);
  const createButton = actionRow.match(/<button[^>]*onClick=\{generatePdf\}[\s\S]*?<\/button>/)?.[0];

  assert.ok(actionStart >= 0, 'the image workflow action row is present');
  assert.match(actionRow, /flex flex-row flex-wrap justify-end/, 'actions remain right-aligned and can wrap on narrow screens');
  assert.doesNotMatch(createButton, /\bflex-1\b/, 'Create PDF should size to its content');
  assert.match(createButton, /\bshrink-0\b/, 'Create PDF should retain its compact width on narrow screens');
  assert.match(createButton, /px-5 py-2\.5/, 'Create PDF should use compact button padding');
  assert.ok(actionRow.indexOf('imageUi.reset') < actionRow.indexOf('imageUi.createPdf'), 'Create PDF is the rightmost action');
  assert.match(styles, /\.image-to-pdf-workflow \.pdf-workflow-actions\s*\{[^}]*order:\s*4/s);
  assert.match(styles, /\.image-to-pdf-workflow > \.download-ready-card,\s*\.pdf-to-images-workflow > \.download-ready-card\s*\{\s*order:\s*5;/s);
  assert.match(component, /<DownloadReadyCard[\s\S]*?showFilenameEditor=\{false\}/);
});
