import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { SUPPORTED_LANGUAGES } from '../src/i18n/languageCatalog.mjs';

const localizationFileExists = await readFile(
  new URL('../src/i18n/toolUiLocalization.mjs', import.meta.url)
).then(() => true).catch((error) => {
  if (error.code === 'ENOENT') return false;
  throw error;
});
const imageToolSource = await readFile(
  new URL('../src/components/ImageToPdf.jsx', import.meta.url),
  'utf8'
);
const attachedControlsSource = await readFile(
  new URL('../src/components/AttachedFileControls.jsx', import.meta.url),
  'utf8'
);

const imageControlKeys = [
  'uploadLabel', 'uploadPrompt', 'dropPrompt', 'uploadDescription', 'chooseImages',
  'moveUp', 'moveDown', 'rotateCounterclockwise', 'rotateClockwise', 'pageSize',
  'fitImageDimensions', 'customDimensions', 'orientation', 'portrait', 'landscape',
  'autoOrient', 'customWidth', 'customHeight', 'imageFit', 'contain', 'fill',
  'margin', 'horizontalAlignment', 'left', 'center', 'right', 'verticalAlignment',
  'top', 'middle', 'bottom', 'maximumWidth', 'maximumHeight', 'scale',
  'pageBackgroundColor', 'jpegQuality', 'maintainAspectRatio', 'encodingNote',
  'reset', 'addMoreImages', 'createPdf', 'creatingPdf', 'page', 'pages',
  'downloadPdf'
];
const powerpointControlKeys = [
  'directionPdfToPptx', 'directionPptxToPdf', 'choosePdf', 'choosePptx',
  'uploadPdfPrompt', 'uploadPptxPrompt', 'dropPdfPrompt', 'dropPptxPrompt',
  'pageSelection', 'pageSelectionHint', 'outputFilename', 'imageQuality',
  'standardQuality', 'highQuality', 'slideSize', 'wideSlides', 'matchPdfPages',
  'pdfPageSize', 'matchSlides', 'a4', 'letter', 'imageBasedWarning',
  'fontNetworkWarning', 'fontNameDisclosure', 'countPages', 'countSlides', 'convert', 'converting',
  'renderingPage', 'renderingSlide'
];
const powerpointToolSource = await readFile(
  new URL('../src/components/PdfPowerPoint.jsx', import.meta.url),
  'utf8'
).catch((error) => {
  if (error.code === 'ENOENT') return '';
  throw error;
});

test('every bundled language has localized image attachment and control labels', async () => {
  assert.ok(localizationFileExists, 'The bundled tool UI localization module must exist');
  const { getLocalizedToolUi, TOOL_UI_TRANSLATIONS } = await import('../src/i18n/toolUiLocalization.mjs');
  for (const { code } of SUPPORTED_LANGUAGES) {
    const localized = getLocalizedToolUi(code);
    assert.ok(localized.fileActions.replace, `${code} is missing the replace label`);
    assert.ok(localized.fileActions.remove, `${code} is missing the remove label`);
    for (const key of imageControlKeys) {
      assert.ok(localized.imageToPdf[key], `${code} is missing imageToPdf.${key}`);
    }
    assert.ok(localized.imageToPdf.ready, `${code} is missing imageToPdf.ready`);

    if (code !== 'en') {
      for (const key of ['uploadPrompt', 'pageSize', 'createPdf', 'reset', 'downloadPdf']) {
        assert.notEqual(
          localized.imageToPdf[key],
          TOOL_UI_TRANSLATIONS.en.imageToPdf[key],
          `${code} leaves imageToPdf.${key} in English`
        );
      }
      assert.notEqual(localized.fileActions.replace, TOOL_UI_TRANSLATIONS.en.fileActions.replace, `${code} leaves replace in English`);
      assert.notEqual(localized.fileActions.remove, TOOL_UI_TRANSLATIONS.en.fileActions.remove, `${code} leaves remove in English`);
    }
  }
});

test('every bundled language has localized PowerPoint conversion controls', async () => {
  const { getLocalizedToolUi, TOOL_UI_TRANSLATIONS } = await import('../src/i18n/toolUiLocalization.mjs');
  for (const { code } of SUPPORTED_LANGUAGES) {
    const localized = getLocalizedToolUi(code).powerpoint;
    assert.ok(localized, `${code} is missing the PowerPoint controls`);
    for (const key of powerpointControlKeys) {
      assert.ok(localized[key], `${code} is missing powerpoint.${key}`);
    }

    if (code !== 'en') {
      for (const key of ['choosePdf', 'pageSelection', 'imageQuality', 'convert']) {
        assert.notEqual(
          localized[key],
          TOOL_UI_TRANSLATIONS.en.powerpoint[key],
          `${code} leaves powerpoint.${key} in English`
        );
      }
    }
  }
});

test('PowerPoint conversion controls render through the selected language', () => {
  assert.match(powerpointToolSource, /getLocalizedToolUi\(language\)/);
  for (const key of powerpointControlKeys) {
    assert.match(powerpointToolSource, new RegExp(`powerpointUi\\.${key}\\b`), `PowerPoint conversion does not render ${key}`);
  }
});

test('image attachment prompts and settings render through the selected language', () => {
  assert.match(imageToolSource, /getLocalizedToolUi\(language\)/);
  assert.match(imageToolSource, /imageUi\.uploadPrompt/);
  assert.match(imageToolSource, /imageUi\.pageSize/);
  assert.match(imageToolSource, /imageUi\.createPdf/);
  assert.match(imageToolSource, /imageUi\.page\s*:/);
  for (const key of imageControlKeys) {
    assert.match(imageToolSource, new RegExp(`imageUi\\.${key}\\b`), `Image to PDF does not render ${key}`);
  }
  assert.match(attachedControlsSource, /getLocalizedToolUi\(language\)/);
  assert.match(attachedControlsSource, /fileActions\.replace/);
  assert.match(attachedControlsSource, /fileActions\.remove/);
});
