import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const app = await readFile(new URL('../src/App.jsx', import.meta.url), 'utf8');
const footer = await readFile(new URL('../src/components/Footer.jsx', import.meta.url), 'utf8');
const home = await readFile(new URL('../src/components/Home.jsx', import.meta.url), 'utf8');
const categoryPage = await readFile(new URL('../src/components/CategoryPage.jsx', import.meta.url), 'utf8');
const toolSearch = await readFile(new URL('../src/components/ToolSearch.jsx', import.meta.url), 'utf8');
const sitePages = await readFile(new URL('../src/components/SitePages.jsx', import.meta.url), 'utf8');
const languagePicker = await readFile(new URL('../src/components/LanguagePicker.jsx', import.meta.url), 'utf8');
const styles = await readFile(new URL('../src/index.css', import.meta.url), 'utf8');

test('language selectors appear after Guides in both navigation and footer', () => {
  assert.match(app, /<LanguagePicker[\s\S]*?placement="sidebar"/);
  assert.match(footer, /LanguagePicker placement="footer"/);
  assert.match(app, /<LanguageProvider>/);
});

test('homepage, category headings, and search controls use the selected language', () => {
  assert.match(home, /translate\('homeEyebrow'\)/);
  assert.match(categoryPage, /translate\('allPdfTools'\)/);
  assert.match(toolSearch, /translate\('findPdfTool'\)/);
});

test('all-tools sidebar uses localized tool names', () => {
  assert.match(app, /getLocalizedTool\(language, tool\)/);
});

test('privacy notice discloses local language preference storage and no translation API', () => {
  assert.match(sitePages, /pdf-tools-language/);
  assert.match(sitePages, /translation API/);
});

test('sidebar languages use the stacked All tools submenu pattern', () => {
  assert.match(app, /activeMenu === 'language'/);
  assert.match(app, /site-language-columns/);
  assert.match(languagePicker, /onToggle/);
  assert.match(languagePicker, /onKeyDown=\{isSidebar \? onKeyDown : undefined\}/);
  assert.match(app, /onKeyDown=\{focusFirstMegaItem\}/);
  assert.match(styles, /\.site-language-columns\s*\{[\s\S]*?display:\s*grid/);
  assert.doesNotMatch(styles, /\.site-language-submenu\s*\{[^}]*overflow-y:\s*auto/);
});

test('footer language choices remain a vertical flyout', () => {
  assert.match(styles, /\.language-picker-footer \.language-picker-options \{[\s\S]*?flex-direction: column/);
  assert.match(styles, /\.language-picker-footer \.language-picker-trigger \{[\s\S]*?align-items:\s*center/);
  assert.match(styles, /\.language-picker-footer \.language-picker-trigger \{[\s\S]*?display:\s*inline-flex/);
});

test('language provider and hook use separate modules for stable fast refresh', () => {
  assert.match(app, /\{ LanguageProvider \} from '\.\/i18n\/LanguageProvider'/);
  assert.match(app, /\{ useLanguage \} from '\.\/i18n\/useLanguage'/);
});
