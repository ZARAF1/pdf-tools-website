import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const toolRegistry = await readFile(new URL('../src/components/toolRegistry.js', import.meta.url), 'utf8');
const toolTranslations = await readFile(new URL('../src/i18n/toolTranslations.mjs', import.meta.url), 'utf8');
const app = await readFile(new URL('../src/App.jsx', import.meta.url), 'utf8');
const toolSearch = await readFile(new URL('../src/components/ToolSearch.jsx', import.meta.url), 'utf8');

test('Remove PDF has the shorter label in tool listings', () => {
  assert.match(toolRegistry, /id: 'remove',\s+name: 'Remove PDF'/);
  assert.match(toolTranslations, /'Watermark PDF', 'Remove PDF', 'Extract PDF Pages'/);
});

test('route changes focus the destination heading after FAQ and Guides activation', () => {
  const routeFocusManager = app.match(/const RouteFocusManager = \(\) => \{([\s\S]*?)\n\};/);
  assert.ok(routeFocusManager, 'The route focus manager must exist');
  assert.match(routeFocusManager[1], /focusHeading\(\)/);
  assert.doesNotMatch(routeFocusManager[1], /document\.activeElement\?\.closest\('nav'\)/);
});

test('Tab from the last All Tools item closes the submenu and focuses Organize', () => {
  const keyHandler = app.match(/const handleMegaKeyDown = \(event\) => \{([\s\S]*?)\n  \};/);
  assert.ok(keyHandler, 'The menu keyboard handler must exist');
  assert.match(keyHandler[1], /activeMenu === 'all'\)\s*\{[\s\S]*?setActiveMenu\(null\);[\s\S]*?data-mega-trigger="organize"[\s\S]*?\.focus\(\)/);
  assert.match(app, /onBlur=\{\(event\) => \{\s*if \(!megaMenuRef\.current\?\.contains\(event\.relatedTarget\)\) setActiveMenu\(null\);\s*\}\}/);
});

test('skip navigation focuses search before the sidebar enters keyboard order', () => {
  assert.match(app, /className="skip-to-content" href="#tool-search"/);
  const searchHeader = app.indexOf('<header className="site-topbar">');
  const sidebar = app.indexOf('<LeftNavigation');
  const mainContent = app.indexOf('<main id="main-content"');
  assert.ok(searchHeader >= 0 && searchHeader < sidebar && sidebar < mainContent);
  const searchFocusHandler = toolSearch.match(/onFocus=\{\(\) => \{([\s\S]*?)\n\s*\}\}/);
  assert.ok(searchFocusHandler, 'The search input focus handler must exist');
  assert.match(searchFocusHandler[1], /setIsExpanded\(true\)/);
});
