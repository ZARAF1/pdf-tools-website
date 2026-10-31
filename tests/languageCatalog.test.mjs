import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getInitialLanguage,
  getMessage,
  LANGUAGE_REGIONS,
  SUPPORTED_LANGUAGES
} from '../src/i18n/languageCatalog.mjs';

test('the language catalog includes 20 unique options, including Finnish and Swedish', () => {
  const codes = SUPPORTED_LANGUAGES.map(({ code }) => code);
  assert.equal(SUPPORTED_LANGUAGES.length, 20);
  assert.equal(new Set(codes).size, 20);
  assert.ok(codes.includes('fi'));
  assert.ok(codes.includes('sv'));
});

test('language regions group each supported language exactly once', () => {
  const groupedCodes = LANGUAGE_REGIONS.flatMap(({ languages }) => languages);
  const supportedCodes = SUPPORTED_LANGUAGES.map(({ code }) => code);

  assert.equal(new Set(groupedCodes).size, supportedCodes.length);
  assert.deepEqual([...groupedCodes].sort(), [...supportedCodes].sort());
});

test('every supported language has localized navigation and category labels', () => {
  const keys = [
    'home', 'faq', 'guides', 'language', 'chooseLanguage', 'allTools',
    'categories', 'privacy', 'contact', 'about', 'terms', 'security', 'cookiePolicy',
    'category.organize', 'category.convert', 'category.edit-sign',
    'category.protect-repair', 'category.extract-analyze', 'homeEyebrow', 'homeTitle',
    'homeTagline', 'homeDescription', 'homeExplore', 'browseToolCategories',
    'categoryEyebrow', 'allPdfTools', 'toolsIn', 'toolsToChooseFrom',
    'browseAllCategories', 'hide', 'show', 'searchPdfTools', 'findPdfTool',
    'clearSearch', 'matchingTools', 'noMatchingTools', 'howToUse', 'howItWorks',
    'frequentlyAskedQuestions', 'uploadToTool', 'processDocumentInBrowser',
    'download', 'filesStayInBrowser', 'privacyPolicy', 'conversionStatus',
    'loadingTool', 'routeLoadFailed', 'reloadPage',
    'discardAttachedFiles', 'discardAttachedFilesMessage',
    'stayOnPage', 'leavePage',
    'toolbox', 'selectToolToGetStarted', 'toolWorkspace',
    'instructionsAndWorkflow', 'attachPdfHere', 'attachPdfsHere',
    'attachImagesHere', 'relatedTools'
  ];

  for (const { code } of SUPPORTED_LANGUAGES) {
    for (const key of keys) {
      assert.notEqual(getMessage(code, key), key, `${code} is missing ${key}`);
    }
  }
});

test('stored language is used only when it is supported', () => {
  const originalWindow = globalThis.window;
  try {
    globalThis.window = {
      localStorage: { getItem: () => 'fi' }
    };
    assert.equal(getInitialLanguage(), 'fi');

    globalThis.window.localStorage.getItem = () => 'xx';
    assert.equal(getInitialLanguage(), 'en');

    globalThis.window.localStorage.getItem = () => {
      throw new Error('Storage disabled');
    };
    assert.equal(getInitialLanguage(), 'en');
  } finally {
    if (originalWindow === undefined) delete globalThis.window;
    else globalThis.window = originalWindow;
  }
});
