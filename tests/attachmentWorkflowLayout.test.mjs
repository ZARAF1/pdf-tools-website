import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const readSource = (path) => readFile(new URL(path, import.meta.url), 'utf8');

test('Compress PDF keeps its add-files chooser after selected files and before settings', async () => {
  const component = await readSource('../src/components/PdfCompressor.jsx');
  const selectedFiles = component.indexOf('{selectedFileCards}');
  const addFiles = component.indexOf('Choose up to 5 PDFs to compress', selectedFiles);
  const settings = component.indexOf('Higher compression', selectedFiles);

  assert.ok(selectedFiles >= 0, 'selected files should be rendered first');
  assert.ok(addFiles > selectedFiles && addFiles < settings, 'the add-files chooser should precede compression settings');
});

test('Image to PDF shows a top-right image count and keeps Add more in the attachment panel', async () => {
  const component = await readSource('../src/components/ImageToPdf.jsx');
  const fileSection = component.indexOf('className="image-to-pdf-file-section"');
  const fileSectionEnd = component.indexOf('</section>', fileSection);
  const count = component.indexOf('className="image-to-pdf-image-count"', fileSection);
  const addImages = component.indexOf('imageUi.addMoreImages', fileSection);
  const settings = component.indexOf('className="image-to-pdf-settings-shell"', fileSection);

  assert.ok(fileSection >= 0, 'the image picker should remain in a dedicated attachment panel');
  assert.ok(count > fileSection && count < fileSectionEnd, 'the selected-image count should remain in the attachment heading');
  assert.ok(addImages > count && addImages < fileSectionEnd, 'the add-images action should remain in the attachment panel');
  assert.ok(settings > fileSectionEnd, 'settings should follow the attachment panel');
});

test('Image to PDF attachment content has a descriptive heading and a neutral nested panel', async () => {
  const [component, styles] = await Promise.all([
    readSource('../src/components/ImageToPdf.jsx'),
    readSource('../src/index.css')
  ]);
  const panelStart = component.indexOf('className="image-to-pdf-file-section"');
  const panelEnd = component.indexOf('</section>', panelStart);
  const panel = component.slice(panelStart, panelEnd);

  assert.match(panel, /aria-label=\{imageUi\.uploadLabel\}/);
  assert.match(panel, /<h3 id="image-to-pdf-file-heading"[^>]*>\{imageUi\.uploadLabel\}<\/h3>/);
  assert.match(panel, /pdf-workflow-upload pdf-upload-zone merge-pdf-upload-zone/);
  assert.doesNotMatch(panel, /imageUi\.uploadDescription/, 'the file limit should not be repeated in the chooser');
  assert.match(styles, /\.image-to-pdf-file-section,\s*\.crop-pdf-settings-shell\s*\{[^}]*background:\s*var\(--surface-muted\)/s);
});

test('Image to PDF page tiles keep their previews and controls within narrow panels', async () => {
  const [component, styles] = await Promise.all([
    readSource('../src/components/ImageToPdf.jsx'),
    readSource('../src/index.css')
  ]);

  assert.match(component, /className={`image-to-pdf-page-card/);
  assert.match(component, /className="image-to-pdf-page-actions"/);
  assert.match(component, /className="image-to-pdf-page-thumbnail-wrap"/);
  assert.match(styles, /\.image-to-pdf-file-section\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)/s);
  assert.match(styles, /\.image-to-pdf-page-grid\s*\{[^}]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/s);
  assert.match(styles, /\.image-to-pdf-page-card\s*\{[^}]*min-width:\s*0/s);
  assert.match(styles, /\.image-to-pdf-page-actions\s*\{[^}]*grid-template-columns:\s*repeat\(5,\s*minmax\(0,\s*1fr\)\)/s);
  assert.match(styles, /@media \(max-width: 600px\) \{[\s\S]*?\.image-to-pdf-page-actions\s*\{/s);
});

test('PDF and Markdown file pickers use the shared attachment upload card', async () => {
  const component = await readSource('../src/components/PdfMarkdown.jsx');
  const styles = await readSource('../src/index.css');
  const pickerCards = component.match(/className="markdown-file-picker pdf-workflow-upload merge-pdf-upload-zone"/g) || [];
  const attachmentPanels = Array.from(component.matchAll(/<section className="pdf-markdown-attachment-panel"[\s\S]*?<\/section>/g), ([panel]) => panel);
  const settingsPanels = Array.from(component.matchAll(/<section className="pdf-markdown-settings-panel"[\s\S]*?<\/section>/g), ([panel]) => panel);

  assert.equal(pickerCards.length, 2, 'each conversion direction should show only its own file picker');
  assert.equal((component.match(/type="file"/g) || []).length, 2, 'each conversion direction should keep its own file input');
  assert.equal(attachmentPanels.length, 2, 'both conversion directions have a dedicated attachment panel');
  assert.equal(settingsPanels.length, 2, 'both conversion directions have their own settings panel');
  assert.equal((component.match(/conversion-attachment-shell pdf-markdown-attachment-shell/g) || []).length, 2);
  assert.equal((component.match(/tool-attachment-guidance/g) || []).length, 2);
  assert.match(component, /translate\('attachMarkdownFileHere'\)/);
  assert.ok(
    component.indexOf('aria-label="Conversion direction"') < component.indexOf('conversion-attachment-shell'),
    'the direction switch appears before both shared attachment shells'
  );
  assert.match(attachmentPanels[0], /id="markdown-pdf-input"/);
  assert.doesNotMatch(attachmentPanels[0], /id="markdown-upload"/);
  assert.match(attachmentPanels[1], /id="markdown-upload-pdf"/);
  assert.match(component, /image-pdf-direction-switch conversion-direction-switch/);
  assert.equal((component.match(/className="conversion-direction-option"/g) || []).length, 2);
  assert.ok(attachmentPanels.every((panel) => !/id="markdown-page-selection"|<textarea/.test(panel)));
  assert.match(settingsPanels[0], /id="markdown-page-selection"/);
  assert.match(settingsPanels[0], /Add Markdown separators between pages/);
  assert.match(settingsPanels[1], /aria-label="Markdown content"/);
  assert.match(settingsPanels[1], /Page size[\s\S]*Orientation[\s\S]*Text size/);
  assert.ok(
    component.indexOf('pdf-markdown-settings-panel') > component.indexOf('pdf-markdown-attachment-panel'),
    'settings follow the attachment panel'
  );
  assert.match(styles, /\.pdf-markdown-attachment-shell \.pdf-markdown-attachment-panel\s*\{[^}]*background:\s*transparent/);
  assert.match(styles, /\.tool-attachment-section\.conversion-attachment-shell\s*\{[^}]*background:\s*var\(--surface-muted\)/);
});

test('PDF and PowerPoint use the shared attachment shell before conversion settings', async () => {
  const [component, styles] = await Promise.all([
    readSource('../src/components/PdfPowerPoint.jsx'),
    readSource('../src/index.css')
  ]);
  const attachmentPanel = component.match(/<section className="powerpoint-attachment-panel"[\s\S]*?<\/section>/)?.[0];
  const settingsPanel = component.match(/<section className="powerpoint-settings-panel"[\s\S]*?<\/section>/)?.[0];

  assert.ok(attachmentPanel, 'PDF or PPTX selection has its own panel');
  assert.ok(settingsPanel, 'conversion options have their own settings panel');
  assert.match(component, /className="tool-attachment-section conversion-attachment-shell powerpoint-attachment-shell"/);
  assert.match(component, /<input \{\.\.\.getInputProps\(\)\} className="sr-only" \/>/);
  assert.match(component, /image-pdf-direction-switch conversion-direction-switch/);
  assert.equal((component.match(/className="conversion-direction-option disabled:cursor-not-allowed disabled:opacity-50"/g) || []).length, 2);
  assert.ok(
    component.indexOf('aria-pressed=') < component.indexOf('conversion-attachment-shell'),
    'the direction switch appears before the shared attachment shell'
  );
  assert.match(component, /tool-attachment-guidance/);
  assert.match(component, /powerpointUi\.imageBasedWarning/);
  assert.match(attachmentPanel, /uploadPdfPrompt/);
  assert.match(attachmentPanel, /AttachedFileActions/);
  assert.doesNotMatch(attachmentPanel, /pageSelection|outputName|powerpointUi\.imageQuality/);
  assert.match(settingsPanel, /powerpointUi\.pageSelection/);
  assert.match(settingsPanel, /powerpointUi\.outputFilename/);
  assert.match(settingsPanel, /powerpointUi\.imageQuality/);
  assert.match(settingsPanel, /powerpointUi\.convert/);
  assert.ok(
    component.indexOf('powerpoint-settings-panel') > component.indexOf('powerpoint-attachment-panel'),
    'settings follow the attachment panel'
  );
  assert.match(styles, /\.powerpoint-attachment-shell \.powerpoint-attachment-panel,[\s\S]*?background:\s*transparent/);
  assert.match(styles, /\.image-pdf-direction-switch\.conversion-direction-switch\s*\{[^}]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/s);
  assert.match(styles, /\.tool-attachment-section\.conversion-attachment-shell\s*\{[^}]*background:\s*var\(--surface-muted\)/);
});
