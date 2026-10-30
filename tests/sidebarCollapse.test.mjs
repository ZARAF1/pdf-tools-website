import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  getMessage,
  SUPPORTED_LANGUAGES
} from '../src/i18n/languageCatalog.mjs';

const app = await readFile(new URL('../src/App.jsx', import.meta.url), 'utf8');
const styles = await readFile(new URL('../src/index.css', import.meta.url), 'utf8');

test('main navigation has an accessible desktop collapse toggle and positions flyouts by rail width', () => {
  assert.match(app, /PanelLeftClose/);
  assert.match(app, /aria-label=\{translate\(isSidebarCollapsed \? 'expandNavigation' : 'collapseNavigation'\)\}/);
  assert.match(app, /is-collapsed/);
  assert.match(app, /railWidth = isMobile \|\| isSidebarCollapsed \? 76 : 240/);
});

test('collapse toggle is above the theme control in the lower desktop sidebar', () => {
  const bottomControls = app.match(/<div className="site-left-bottom">([\s\S]*?)<\/div>\s*\{activeMenu/);
  assert.ok(bottomControls, 'The sidebar bottom controls must exist');
  assert.match(bottomControls[1], /site-left-mode-controls/);
  assert.ok(
    bottomControls[1].indexOf('site-left-collapse-button') < bottomControls[1].indexOf('site-left-theme-button'),
    'The collapse control must precede the theme control'
  );
  const brandRow = app.match(/<div className="site-left-brand-row">([\s\S]*?)<\/div>/);
  assert.ok(brandRow);
  assert.doesNotMatch(brandRow[1], /site-left-collapse-button/);

  assert.match(styles, /\.site-left-bottom\s*\{[^}]*position:\s*relative/);
  assert.match(styles, /\.site-left-bottom \.site-left-mode-controls\s*\{[^}]*display:\s*contents/);
  assert.match(styles, /\.site-left-bottom \.site-left-collapse-button\s*\{[^}]*position:\s*absolute;[^}]*top:\s*-4\.375rem;[^}]*right:\s*0\.875rem/);
  assert.match(styles, /\.site-left-collapse-button\s*\{[^}]*width:\s*3rem;[^}]*height:\s*3rem/);
  assert.match(styles, /\.site-left-collapse-button svg\s*\{[^}]*width:\s*1\.75rem;[^}]*height:\s*1\.75rem/);
  assert.match(styles, /\.site-left-navigation\.is-collapsed \.site-left-bottom \.site-left-collapse-button\s*\{[^}]*right:\s*-0\.3125rem/);
  assert.match(styles, /\.site-left-navigation\.is-collapsed \.site-left-collapse-button\s*\{[^}]*width:\s*2\.75rem;[^}]*height:\s*2\.75rem/);
  assert.match(styles, /\.site-left-navigation\.is-collapsed \.site-left-collapse-button svg\s*\{[^}]*width:\s*1\.625rem;[^}]*height:\s*1\.625rem/);
});

test('collapsed navigation hides labels while keeping the workspace aligned to the rail', () => {
  assert.match(styles, /\.site-left-navigation\.is-collapsed[\s\S]*?width:\s*4\.75rem/);
  assert.match(styles, /\.site-app-shell\.is-sidebar-collapsed \.site-workspace\s*\{[^}]*margin-left:\s*4\.75rem/);
  assert.match(styles, /\.site-left-navigation\.is-collapsed \.site-left-link span/);
  assert.match(styles, /\.site-left-navigation\.is-collapsed \.site-left-category-link span/);
});

test('main navigation labels and icons use larger desktop sizing', () => {
  const navRule = styles.match(/\.site-left-link,\s*\.site-left-all-tools,\s*\.site-left-category-link,\s*\.site-left-theme-button\s*\{([^}]*)\}/);
  const iconRule = styles.match(/\.site-left-link-icon\s*\{([^}]*)\}/);
  assert.ok(navRule);
  assert.ok(iconRule);
  assert.match(navRule[1], /font-size:\s*0\.9rem/);
  assert.match(iconRule[1], /width:\s*1\.25rem/);
  assert.match(iconRule[1], /height:\s*1\.25rem/);
});

test('collapse toggle labels are translated for every supported language', () => {
  for (const { code } of SUPPORTED_LANGUAGES) {
    assert.notEqual(getMessage(code, 'collapseNavigation'), 'collapseNavigation', `${code} is missing collapseNavigation`);
    assert.notEqual(getMessage(code, 'expandNavigation'), 'expandNavigation', `${code} is missing expandNavigation`);
  }
});
