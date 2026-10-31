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

test('mobile navigation uses the existing rail collapse control without taking search space', () => {
  assert.match(app, /aria-controls="site-left-navigation"/);
  assert.match(app, /id="site-left-navigation"/);
  assert.match(app, /<NavigationCollapseButton\s+className="site-left-collapse-button"/);
  assert.match(app, /const NavigationCollapseButton =/);
  assert.doesNotMatch(app, /site-mobile-navigation-toggle/);
  assert.match(styles, /@media \(max-width:\s*900px\)\s*\{[\s\S]*?\.site-left-collapse-control\s*\{[^}]*display:\s*flex;[^}]*width:\s*100%;[^}]*justify-content:\s*center;[^}]*margin-bottom:\s*0\.75rem/);
  assert.match(styles, /@media \(max-width:\s*900px\)\s*\{[\s\S]*?\.site-app-shell\.is-sidebar-collapsed \.site-left-navigation\s*\{[^}]*width:\s*0/);
  assert.match(styles, /@media \(max-width:\s*900px\)\s*\{[\s\S]*?\.site-app-shell\.is-sidebar-collapsed \.site-left-collapse-control\s*\{[^}]*position:\s*fixed;[^}]*top:\s*50%;[^}]*left:\s*0;[^}]*bottom:\s*auto/);
  assert.match(styles, /@media \(max-width:\s*900px\)\s*\{[\s\S]*?\.site-app-shell\.is-sidebar-collapsed \.site-workspace\s*\{[^}]*margin-left:\s*0/);
  assert.match(styles, /@media \(max-width:\s*900px\)\s*\{[\s\S]*?\.site-topbar\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)/);
});

test('utility icons stay top-right and mobile collapse toggle becomes a vertical drawer handle', () => {
  const categoryNav = app.match(/<nav aria-label=\{translate\('categories'\)\} className="site-left-category-nav">([\s\S]*?)<\/nav>/);
  const collapseControl = app.match(/<div className="site-left-collapse-control">([\s\S]*?)<\/div>/);
  const bottomControls = app.match(/<div className="site-left-bottom">([\s\S]*?)<\/div>\s*\{activeMenu/);
  assert.ok(categoryNav, 'The category navigation must exist');
  assert.ok(collapseControl, 'The sidebar collapse control must exist');
  assert.ok(bottomControls, 'The top-right utility controls must exist');
  assert.match(bottomControls[1], /site-left-privacy/);
  assert.match(bottomControls[1], /site-left-contact/);
  assert.match(bottomControls[1], /site-left-about/);
  assert.match(bottomControls[1], /site-left-theme-button/);
  assert.doesNotMatch(bottomControls[1], /site-left-collapse-button/);
  assert.ok(
    app.indexOf(collapseControl[0]) > app.indexOf(categoryNav[0]),
    'The collapse control must follow the category navigation'
  );
  const brandRow = app.match(/<div className="site-left-brand-row">([\s\S]*?)<\/div>/);
  assert.ok(brandRow);
  assert.doesNotMatch(brandRow[1], /site-left-collapse-button/);

  assert.match(styles, /\.site-left-bottom\s*\{[^}]*position:\s*fixed;[^}]*top:\s*0\.75rem;[^}]*right:\s*0\.75rem/);
  assert.match(styles, /\.site-left-bottom\s*\{[^}]*grid-template-columns:\s*repeat\(4,\s*2rem\)/);
  assert.match(styles, /\.site-left-collapse-control\s*\{[^}]*display:\s*flex/);
  assert.match(styles, /\.site-left-collapse-control\s*\{[^}]*margin-top:\s*auto/);
  assert.match(styles, /\.site-left-navigation\.is-collapsed \.site-left-collapse-control\s*\{[^}]*justify-content:\s*center/);
  assert.match(styles, /\.site-left-collapse-control\s*\{[^}]*margin-bottom:\s*0\.75rem/);
  assert.match(styles, /\.site-left-category-nav\s*\{[^}]*flex:\s*1 1 auto;[^}]*overflow-y:\s*auto/);
  assert.match(styles, /\.site-left-collapse-button\s*\{[^}]*width:\s*3rem;[^}]*height:\s*3rem/);
  assert.match(styles, /\.site-left-collapse-button svg\s*\{[^}]*width:\s*1\.75rem;[^}]*height:\s*1\.75rem/);
  assert.match(styles, /\.site-left-navigation\.is-collapsed \.site-left-collapse-button\s*\{[^}]*width:\s*2\.75rem;[^}]*height:\s*2\.75rem/);
  assert.match(styles, /\.site-left-navigation\.is-collapsed \.site-left-collapse-button svg\s*\{[^}]*width:\s*1\.625rem;[^}]*height:\s*1\.625rem/);
  assert.match(app, /<PanelLeftOpen className="site-left-collapse-panel-icon" aria-hidden="true" \/>/);
  assert.match(app, /<PanelLeftClose className="site-left-collapse-panel-icon" aria-hidden="true" \/>/);
  assert.match(app, /<ChevronRight className="site-left-collapse-arrow-icon" aria-hidden="true" \/>/);
  assert.match(app, /<ChevronLeft className="site-left-collapse-arrow-icon" aria-hidden="true" \/>/);
  assert.match(styles, /\.site-left-collapse-arrow-icon\s*\{\s*display:\s*none/);
  assert.match(styles, /@media \(max-width:\s*900px\)\s*\{[\s\S]*?\.site-left-collapse-panel-icon\s*\{\s*display:\s*block/);
  assert.match(styles, /@media \(max-width:\s*900px\)\s*\{[\s\S]*?\.site-left-collapse-arrow-icon\s*\{\s*display:\s*none/);
  assert.match(styles, /@media \(max-width:\s*900px\)\s*\{[\s\S]*?\.site-app-shell\.is-sidebar-collapsed \.site-left-collapse-panel-icon\s*\{\s*display:\s*none/);
  assert.match(styles, /@media \(max-width:\s*900px\)\s*\{[\s\S]*?\.site-app-shell\.is-sidebar-collapsed \.site-left-collapse-arrow-icon\s*\{\s*display:\s*block/);
  assert.match(styles, /@media \(max-width:\s*900px\)\s*\{[\s\S]*?\.site-app-shell\.is-sidebar-collapsed \.site-left-collapse-button\s*\{[^}]*border-radius:\s*0\s+0\.75rem\s+0\.75rem\s+0/);
  assert.match(styles, /@media \(max-width:\s*900px\)\s*\{[\s\S]*?\.site-app-shell\.is-sidebar-collapsed \.site-left-collapse-control\s*\{[^}]*pointer-events:\s*auto/);
  assert.match(styles, /@media \(max-width:\s*900px\)\s*\{[\s\S]*?\.site-left-primary-nav \.language-picker-sidebar\s*\{\s*width:\s*3\.55rem;\s*\}/);
  assert.match(styles, /@media \(max-width:\s*900px\)\s*\{[\s\S]*?\.site-left-navigation \.language-picker-sidebar \.language-picker-trigger\s*\{\s*justify-content:\s*center;\s*padding-inline:\s*0;\s*\}/);
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
