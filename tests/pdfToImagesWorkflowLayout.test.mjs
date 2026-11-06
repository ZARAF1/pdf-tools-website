import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [source, styles] = await Promise.all([
  readFile(new URL('../src/components/PdfToImages.jsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/index.css', import.meta.url), 'utf8')
]);

test('PDF to Images groups its attachment card and upload area in a muted section', () => {
  const attachmentIndex = source.indexOf('className="pdf-images-file-section"');
  const selectedFileIndex = source.indexOf('className="pdf-attached-file-card', attachmentIndex);
  const uploadIndex = source.indexOf('className: `pdf-workflow-upload', attachmentIndex);
  const settingsIndex = source.indexOf('className="pdf-images-settings-shell');
  const shellIndex = source.indexOf('className="tool-attachment-section image-pdf-attachment-section pdf-images-attachment-section"');

  assert.match(source, /className="pdf-tool-workflow pdf-to-images-workflow space-y-6"/, 'the PDF workflow should not constrain the shared shell width');
  assert.ok(shellIndex >= 0, 'the PDF attachment should use the shared attachment shell');
  assert.ok(attachmentIndex >= 0, 'the PDF attachment workspace has its own section');
  assert.ok(selectedFileIndex > attachmentIndex, 'the selected PDF card is inside its attachment section');
  assert.ok(uploadIndex > attachmentIndex, 'the upload zone is inside its attachment section');
  assert.ok(settingsIndex > attachmentIndex, 'settings follow the attachment section');
  assert.match(source, /translate\('attachPdfHere'\)/);
  assert.match(source, /One unencrypted PDF · up to \{MAX_PAGES\} pages/);
  assert.match(source, /tool-attachment-guidance/);
  assert.match(source, /One-page PDFs download as a single image; multi-page PDFs are bundled in a ZIP/);
  assert.match(styles, /\.pdf-images-file-section,\s*\.pdf-images-settings-shell\s*\{[^}]*background:\s*var\(--surface-muted\)/s);
  assert.match(styles, /\.pdf-images-attachment-section\s+\.pdf-images-file-section\s*\{[^}]*background:\s*transparent/s);
  assert.match(styles, /\.pdf-images-settings-panel\s*\{[^}]*background:\s*var\(--surface-muted\)/s);
  assert.match(styles, /\.pdf-images-settings-panel \.pdf-images-crop-setting\s*\{[^}]*background:\s*var\(--surface-background\)/s);
  assert.match(styles, /\.pdf-images-settings-panel \.pdf-images-option-card\s*\{[^}]*background:\s*var\(--surface-background\)/s);
  assert.match(styles, /\.pdf-images-attachment-section \.tool-attachment-guidance\s*\{[^}]*margin-inline:\s*1\.25rem/s);
  assert.match(styles, /\.pdf-images-attachment-section \.tool-attachment-guidance\s*\{[^}]*margin-block-end:\s*0;/s);
  assert.match(styles, /\.pdf-images-attachment-section > \.tool-attachment-content\s*\{[^}]*padding:\s*1\.25rem;/s);
  assert.match(styles, /\.pdf-images-selected-file-section\s*\{[^}]*width:\s*100%/s);
});

test('Choose Settings exposes automatic margin cropping before Preview and conversion output', () => {
  const settingsIndex = source.indexOf('className="pdf-images-settings-shell');
  const settingsHeadingIndex = source.indexOf('Choose Settings', settingsIndex);
  const previewIndex = source.indexOf('className="pdf-images-preview-shell"', settingsIndex);
  const outputNameIndex = source.indexOf('id="pdf-images-output-name"');

  assert.ok(settingsIndex >= 0, 'the settings shell uses its own panel');
  assert.ok(settingsHeadingIndex > settingsIndex, 'Choose Settings is inside that panel');
  assert.ok(settingsIndex < previewIndex && previewIndex < outputNameIndex, 'the output filename follows Preview, after Settings');
  assert.match(source, /id="pdf-images-auto-crop"/);
  assert.match(source, /aria-describedby="pdf-images-auto-crop-help"/);
  assert.match(source, /id="pdf-images-auto-crop-help"/);
  assert.match(source, /Automatically crop blank page margins/);
  assert.match(source, /Removes blank space around page content\. Pages without visible content are left unchanged\./);
  assert.match(source, /id="pdf-images-output-name"/);
  assert.match(source, /Output filename/);
});

test('PDF to Images groups the selected attachment, settings, and page preview in one workspace shell', () => {
  const workspaceStart = source.indexOf('className="image-pdf-workspace-shell pdf-images-workspace-shell"');
  const actionStart = source.indexOf('className="pdf-images-convert-actions"', workspaceStart);
  const settingsStart = source.indexOf('className="pdf-images-settings-shell', workspaceStart);
  const previewStart = source.indexOf('className="pdf-images-preview-shell"', workspaceStart);
  const progressStart = source.indexOf('{progress &&', actionStart);
  const workspaceEnd = source.lastIndexOf('</div>', progressStart);
  const workspace = source.slice(workspaceStart, workspaceEnd);

  assert.ok(workspaceStart >= 0, 'a workspace shell should appear after selecting a PDF');
  assert.ok(actionStart > workspaceStart && actionStart < workspaceEnd, 'the conversion action row is inside the blue workspace');
  assert.ok(settingsStart < previewStart && previewStart < actionStart, 'Settings and Preview precede the conversion action row');
  assert.ok(progressStart > workspaceEnd && workspaceEnd > actionStart, 'the workspace closes after the conversion action row and before progress feedback');
  assert.match(workspace, /pdf-images-file-section[\s\S]*pdf-attached-file-card[\s\S]*pdf-images-settings-shell[\s\S]*pdf-images-preview-shell[\s\S]*pdf-images-convert-actions/);
  assert.match(workspace, /<Paperclip aria-hidden="true" \/>[\s\S]*PDF to convert/);
  assert.match(workspace, /<Settings2 aria-hidden="true" \/>[\s\S]*Choose Settings/);
  assert.match(workspace, /<Eye aria-hidden="true" \/>[\s\S]*Preview/);
  assert.match(workspace, /className="pdf-images-preview-shell"[\s\S]*?<\/section>\s*\)\}\s*\{file && \(\s*<div className="pdf-images-convert-actions"/);
  assert.match(workspace, /className="pdf-images-convert-actions"[\s\S]*id="pdf-images-output-name"[\s\S]*onClick=\{convert\}[\s\S]*PDF to Images/);
  assert.match(workspace, /<PdfPageThumbnailRail[\s\S]*document=\{previewDocument\}[\s\S]*pageNumbers=\{Array\.from[\s\S]*showPageNavigation=\{false\}[\s\S]*showSelectedMark/);
  assert.match(source, /className="image-pdf-workspace-shell pdf-images-workspace-shell"\s+data-has-content=\{file \? 'true' : 'false'\}\s+data-has-file=\{file \? 'true' : 'false'\}/);
  assert.match(styles, /\.image-pdf-workspace-shell\[data-has-content='true'\]\s*\{[^}]*border:[^}]*background:\s*var\(--surface-muted\)[^}]*animation:\s*tool-attachment-border-pulse/s);
  assert.match(styles, /:root \.image-pdf-workspace-shell\[data-has-content='true'\] > \.tool-attachment-section\s*\{[^}]*animation:\s*none/s);
  assert.match(styles, /\.image-pdf-workspace-shell > \.pdf-images-settings-shell\s*\{[^}]*order:\s*1;/s);
  assert.match(styles, /\.image-pdf-workspace-shell > \.pdf-images-preview-shell\s*\{[^}]*order:\s*2;/s);
  assert.match(styles, /\.image-pdf-workspace-shell > \.pdf-images-convert-actions\s*\{[^}]*order:\s*3;/s);
  assert.match(styles, /\.pdf-images-preview-panel \.pdf-page-thumbnail-list\s*\{[^}]*display:\s*grid;[^}]*grid-template-columns:\s*repeat\(4,\s*minmax\(0,\s*1fr\)\);[^}]*gap:\s*1rem/s);
  assert.match(styles, /\.pdf-images-preview-panel \.pdf-page-thumbnail-list\s*\{[^}]*grid-auto-rows:\s*max-content/s);
  assert.match(styles, /@media \(max-width: 760px\)[\s\S]*\.pdf-images-preview-panel \.pdf-page-thumbnail-list\s*\{[^}]*grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\)/s);
});

test('PDF to Images selected workspace removes only its top padding at desktop and mobile', () => {
  const mobileStyles = styles.slice(styles.lastIndexOf('@media (max-width: 600px)'));

  assert.match(styles, /\.pdf-images-workspace-shell\[data-has-content='true'\]\s*\{[^}]*padding-top:\s*0;/s);
  assert.match(mobileStyles, /\.pdf-images-workspace-shell\[data-has-content='true'\]\s*\{[^}]*padding-top:\s*0;/s);
});

test('PDF to Images aligns Reset right beside Choose Settings', () => {
  const settingsStart = source.indexOf('className="pdf-images-settings-shell');
  const settingsEnd = source.indexOf('className="pdf-images-preview-shell"', settingsStart);
  const settings = source.slice(settingsStart, settingsEnd);
  const headingStart = settings.indexOf('pdf-images-settings-heading');
  const headingEnd = settings.indexOf('pdf-images-crop-setting', headingStart);
  const heading = settings.slice(headingStart, headingEnd);

  assert.match(heading, /<Settings2 aria-hidden="true" \/>[\s\S]*Choose Settings/);
  assert.doesNotMatch(heading, /merge-section-heading|merge-output-settings-title/);
  assert.match(settings, /className="pdf-images-settings-title-row"[\s\S]*pdf-images-settings-heading[\s\S]*onClick=\{resetSettings\}[\s\S]*className="pdf-images-settings-reset[\s\S]*>[\s\S]*?Reset\s*<\/button>/);
  assert.match(styles, /\.pdf-images-settings-title-row\s*\{[^}]*display:\s*flex;[^}]*justify-content:\s*space-between/s);
  assert.match(styles, /\.pdf-images-settings-reset\s*\{[^}]*margin-inline-start:\s*auto/s);
});

test('PDF to Images removes page pagination and keeps thumbnail selection', () => {
  const railStart = source.indexOf('<PdfPageThumbnailRail');
  const railEnd = source.indexOf('/>', railStart);
  const rail = source.slice(railStart, railEnd);

  assert.match(rail, /document=\{previewDocument\}/);
  assert.match(rail, /showPageNavigation=\{false\}/);
  assert.match(rail, /selectedPageNumbers=\{selectedPageNumbers\}/);
  assert.match(rail, /onTogglePageSelection=\{toggleExportPage\}/);
  assert.match(styles, /\.pdf-images-preview-panel \.pdf-page-thumbnail-button\[aria-pressed='true'\]\s*\{[^}]*border-color:\s*#2563eb/s);
  assert.match(styles, /\.pdf-images-preview-panel \.pdf-page-thumbnail-rail\s*\{[^}]*grid-template-rows:\s*minmax\(0,\s*1fr\)/s);
  assert.match(styles, /\.pdf-images-preview-panel \.pdf-page-thumbnail-list\s*\{[^}]*gap:\s*1rem/s);
});

test('PDF to Images previews and exports all pages or only selected pages as a named image or ZIP', () => {
  assert.match(source, /pdfToImages: pdfImagesUi/);
  assert.match(source, /const \[selectedPageNumbers, setSelectedPageNumbers\] = useState\(\(\) => new Set\(\)\)/);
  assert.match(source, /const \[exportScope, setExportScope\] = useState\('all'\)/);
  assert.match(source, /const changeExportScope = \(nextScope\) => \{/);
  assert.match(source, /if \(nextScope === 'all'\) setSelectedPageNumbers\(new Set\(\)\)/);
  assert.match(source, /const toggleExportPage = \(pageNumber\) => \{\s*if \(exportScope !== 'selected' \|\| isProcessing\) return;/);
  assert.match(source, /const toggleExportPage = \(pageNumber\) => \{/);
  assert.match(source, /const convert = async \(\) => \{/);
  assert.match(source, /const pageNumbersToExport = Array\.from\([\s\S]*?\)\.filter\(\(pageNumber\) => \(\s*exportScope === 'all' \|\| selectedPageNumbers\.has\(pageNumber\)\s*\)\)/);
  assert.match(source, /for \(const pageNumber of pageNumbersToExport\)/);
  assert.match(source, /name: `page-\$\{String\(pageNumber\)\.padStart\(3, '0'\)\}\.\$\{selectedFormat\.extension\}`/);
  assert.match(source, /await createOutput\(imageFiles, selectedFormat, outputBaseName, runId\)/);
  assert.match(source, /<p>\{pdfImagesUi\.previewSelectionDescription\}<\/p>/);
  assert.match(source, /pdfImagesUi\.selectedPageCount[\s\S]*pdfImagesUi\.selectedPagesCount/);
});

test('PDF to Images places Include scope buttons after Settings and restores the single conversion action', () => {
  const settingsStart = source.indexOf('className="pdf-images-settings-shell');
  const previewStart = source.indexOf('className="pdf-images-preview-shell"', settingsStart);
  const settings = source.slice(settingsStart, previewStart);
  const titleRow = settings.match(/className="pdf-images-settings-title-row">[\s\S]*?<\/div>\s*<p>/)?.[0];
  const topbar = settings.match(/className="pdf-images-settings-topbar">[\s\S]*?<\/div>\s*<div className="pdf-images-crop-setting">/)?.[0];
  const actionStart = source.indexOf('<div className="pdf-images-convert-actions">', previewStart);
  const actionEnd = source.indexOf('\n        </div>', actionStart);
  const actionRow = source.slice(actionStart, actionEnd);

  assert.ok(actionStart > previewStart, 'filename and conversion action are below Preview');
  assert.match(titleRow, /pdf-images-settings-heading[\s\S]*pdf-images-settings-reset/);
  assert.doesNotMatch(titleRow, /pdf-images-export-scope/);
  assert.match(topbar, /Choose Settings[\s\S]*Set how each page is cropped and saved\.[\s\S]*pdf-images-export-scope[\s\S]*pdfImagesUi\.includeAllImages[\s\S]*pdfImagesUi\.includeSelectedImages/);
  assert.match(topbar, /Set how each page is cropped and saved\.<\/p>\s*<div className="pdf-images-export-scope"/);
  assert.match(topbar, /aria-pressed=\{exportScope === 'all'\}/);
  assert.match(topbar, /aria-pressed=\{exportScope === 'selected'\}/);
  assert.match(source, /disabled=\{isProcessing \|\| exportScope === 'all'\}[\s\S]*selectedPageNumbers=\{selectedPageNumbers\}/);
  assert.match(actionRow, /pdf-images-output-name-field[\s\S]*id="pdf-images-output-name"[\s\S]*pdf-images-convert-buttons[\s\S]*onClick=\{convert\}[\s\S]*PDF to Images/);
  const conversionButton = actionRow.match(/aria-label="PDF to Images"([\s\S]*?)<\/button>/)?.[1];
  assert.ok(conversionButton, 'the conversion button has a concise accessible label');
  assert.match(conversionButton, /PDF to Images/);
  assert.doesNotMatch(conversionButton, /Export all pages as|Export selected page as|Converting…|PNG/);
  assert.doesNotMatch(actionRow, /pdf-images-convert-button-title|pdf-images-convert-output-label/);
  assert.match(actionRow, /disabled=\{isValidating \|\| isProcessing \|\| \(exportScope === 'selected' && selectedPageNumbers\.size === 0\)\}/);
  assert.doesNotMatch(actionRow, /onClick=\{\(\) => convert\('(all|selected)'\)\}/);
  assert.match(actionRow, /className="pdf-images-output-name-controls">[\s\S]*id="pdf-images-output-name"[\s\S]*className="pdf-images-convert-buttons"[\s\S]*onClick=\{convert\}[\s\S]*<\/div>\s*<p/);
  assert.match(styles, /\.pdf-images-output-name-controls\s*\{[^}]*display:\s*grid;[^}]*grid-template-columns:\s*minmax\(0, 1fr\) auto;[^}]*align-items:\s*center/s);
  assert.match(styles, /@media \(max-width: 600px\)[\s\S]*\.pdf-images-convert-actions\s*\{[^}]*grid-template-columns:\s*minmax\(0, 1fr\)/s);
  assert.match(styles, /@media \(max-width: 600px\)[\s\S]*\.pdf-images-output-name-controls\s*\{[^}]*grid-template-columns:\s*minmax\(0, 1fr\)/s);
  assert.match(styles, /\.pdf-images-export-scope\s*\{[^}]*display:\s*flex/s);
  assert.match(styles, /\.pdf-images-settings-topbar\s*\{[^}]*gap:\s*0\.25rem/s);
  assert.match(styles, /\.pdf-images-export-scope\s*\{[^}]*margin-top:\s*0\.5rem/s);
  assert.doesNotMatch(styles, /\.pdf-images-convert-buttons \.pdf-conversion-action-button\s*\{[^}]*flex-direction:\s*column/s);
});

test('conversion trims page margins and routes one image separately from multi-page ZIP output', () => {
  assert.match(source, /findContentBounds\(context\.getImageData/);
  assert.match(source, /createPdfImageDownload\(/);
  assert.match(source, /useToolExitGuard\(Boolean\(file\),\s*outputUrl\)/);
  assert.match(source, /href=\{outputUrl\}/);
  assert.match(source, /downloadLabel=\{downloadLabel\}/);
  const createOutput = source.slice(source.indexOf('const createOutput ='), source.indexOf('const convert ='));
  assert.doesNotMatch(createOutput, /ZIP ready with/);
  assert.match(createOutput, /setProgress\(''\);/, 'the completed output should not leave a redundant ZIP-ready status');
});

test('PDF to Images keeps the conversion action right-aligned and resets settings in Settings', () => {
  const settingsStart = source.indexOf('className="pdf-images-settings-shell');
  const settingsEnd = source.indexOf('className="pdf-images-preview-shell', settingsStart);
  const actionRowStart = source.indexOf('className="pdf-images-convert-actions', settingsEnd);
  const actionRowEnd = source.indexOf('\n      )}\n\n      </div>', actionRowStart);
  const actionRow = source.slice(actionRowStart, actionRowEnd);
  const settings = source.slice(settingsStart, settingsEnd);

  assert.ok(actionRowStart > settingsEnd, 'conversion actions follow Settings and Preview');
  assert.match(actionRow, /className="pdf-images-convert-actions"/);
  assert.match(actionRow, /onClick=\{convert\}[\s\S]*PDF to Images/);
  assert.doesNotMatch(actionRow, />\s*Reset\s*</, 'the action row should not include a settings reset');
  assert.match(settings, /pdfImagesUi\.includeAllImages[\s\S]*pdfImagesUi\.includeSelectedImages/);
  assert.match(settings, /onClick=\{resetSettings\}[\s\S]*?>\s*Reset\s*</, 'Reset should be inside Settings');
  assert.match(source, /const resetSettings = \(\) => \{[\s\S]*?setExportScope\('all'\);[\s\S]*?setFormat\('png'\);[\s\S]*?setQuality\('standard'\);[\s\S]*?setJpegQuality\(0\.85\);[\s\S]*?setAutoCrop\(true\);[\s\S]*?setOutputBaseName\(file \? getBaseName\(file\.name\) : ''\);[\s\S]*?clearOutput\(\);[\s\S]*?\};/);
  const resetSettings = source.match(/const resetSettings = \(\) => \{([\s\S]*?)\n  \};/)?.[1];
  assert.ok(resetSettings);
  assert.doesNotMatch(resetSettings, /setFile\(null\)|setPageCount\(0\)/, 'settings reset should retain the selected PDF');
});

test('PDF to Images places its selected PDF in a separate muted file section', () => {
  const fileSectionStart = source.indexOf('className="pdf-images-file-section"');
  const settingsStart = source.indexOf('className="pdf-images-settings-shell', fileSectionStart);
  const selectedSection = source.slice(fileSectionStart, settingsStart);

  assert.ok(selectedSection, 'the selected PDF has a dedicated section');
  assert.match(selectedSection, /PDF to convert/);
  assert.match(selectedSection, /<Paperclip aria-hidden="true" \/>/);
  assert.match(selectedSection, /One PDF selected\./);
  assert.match(selectedSection, /pdf-attached-file-card/);
  assert.match(selectedSection, /<AttachedFileActions/);
  assert.doesNotMatch(selectedSection, /pdf-images-convert-actions|pdf-images-output-name/, 'conversion controls are no longer inside the attachment card');
  assert.doesNotMatch(styles, /\.pdf-images-selected-file-section > \.pdf-images-convert-actions/);
  assert.match(styles, /\.pdf-images-selected-file-section\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)/s);
  assert.match(styles, /\.pdf-images-selected-file-section > \.pdf-attached-file-card\s*\{\s*order:\s*1;\s*\}/s);
  assert.match(styles, /\.conversion-selected-file-section\s*\{[^}]*background:\s*var\(--surface-muted\)/s);
});

test('PDF to Images places its download result after the conversion actions', () => {
  assert.match(styles, /\.pdf-tool-workflow \.pdf-workflow-actions\s*\{\s*order:\s*4;/s);
  assert.match(styles, /\.image-to-pdf-workflow > \.download-ready-card,\s*\.pdf-to-images-workflow > \.download-ready-card\s*\{\s*order:\s*5;/s);
  assert.match(styles, /\.pdf-to-images-workflow\.space-y-6 > \.pdf-workflow-actions\s*\{\s*margin-block-start:\s*0\.75rem;/s);
  assert.match(source, /\{outputUrl && \(\s*<DownloadReadyCard/);
  assert.match(source, /<DownloadReadyCard[\s\S]*?showFilenameEditor=\{false\}/);
});
