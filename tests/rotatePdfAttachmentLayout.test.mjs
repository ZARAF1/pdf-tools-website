import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const component = await readFile(new URL('../src/components/PdfRotator.jsx', import.meta.url), 'utf8');
const styles = await readFile(new URL('../src/index.css', import.meta.url), 'utf8');

test('Rotate PDF places page tabs, rotation settings, and previews in order', () => {
  const fileHeading = component.indexOf('PDF to rotate');
  const attachmentCard = component.indexOf('className="pdf-attached-file-card rotate-selected-file-card"');
  const workflowShell = component.indexOf('className="rotate-settings-shell"');
  const overviewHeading = component.indexOf('<h3 className="merge-selected-files-title">Settings &gt; Preview</h3>');
  const pageTabs = component.indexOf('role="tablist" aria-label="Pages to Rotate"');
  const settingsPanel = component.indexOf('className="rotate-settings-panel"');
  const settingsHeading = component.indexOf('Choose Settings');
  const pageRangeControls = component.indexOf('className="rotate-page-range-controls"');
  const outputFilenameInput = component.indexOf('id="rotate-output-filename"');
  const rotationControls = component.indexOf('className="rotate-angle-fieldset"');
  const pageGrid = component.indexOf('className="rotate-page-grid"');
  const previewPanel = component.indexOf('className="rotate-page-preview-panel"');
  const processButton = component.indexOf('Rotate PDF');

  assert.ok(fileHeading >= 0, 'selected source has a descriptive section heading');
  assert.ok(attachmentCard > fileHeading, 'source card follows its heading');
  assert.ok(workflowShell > attachmentCard, 'dark workflow shell follows the selected source');
  assert.ok(overviewHeading > workflowShell, 'workflow overview is inside the shell');
  assert.doesNotMatch(component, /<h3 className="merge-selected-files-title">Pages &gt; Settings &gt; Preview<\/h3>/);
  assert.ok(pageTabs > overviewHeading, 'All Pages and Select Pages tabs follow the overview');
  assert.ok(pageTabs < settingsPanel, 'page tabs precede the settings and preview panels');
  assert.match(
    component,
    /<div className="rotate-settings-shell">[\s\S]*?<div className="merge-control-intro">[\s\S]*?<h3 className="merge-selected-files-title">Settings &gt; Preview<\/h3>[\s\S]*?<div className="rotate-page-tabs"[\s\S]*?role="tablist" aria-label="Pages to Rotate"[\s\S]*?<section[\s\S]*?className="rotate-page-workspace"[\s\S]*?className="rotate-settings-panel"[\s\S]*?className="rotate-page-preview-panel"[\s\S]*?<\/section>[\s\S]*?<\/section>\s*<\/div>/
  );
  assert.ok(settingsPanel > pageTabs, 'rotation settings follow the page tabs');
  assert.ok(settingsHeading > settingsPanel, 'rotation panel is labelled Choose Settings');
  assert.ok(pageRangeControls > settingsHeading, 'selected page range controls are inside settings');
  assert.ok(rotationControls > pageRangeControls, 'rotation controls follow page selection settings');
  assert.ok(outputFilenameInput > rotationControls, 'output filename follows the rotation angle controls');
  assert.ok(rotationControls > settingsHeading, 'rotation controls are grouped under Choose Settings');
  assert.ok(previewPanel > rotationControls, 'page previews follow rotation settings');
  assert.ok(pageGrid > previewPanel, 'page tiles are rendered inside the preview panel');
  assert.ok(processButton > previewPanel, 'processing follows the page previews');
  assert.match(component, /className="rotate-selected-file-section"[\s\S]*?<h3 id="rotate-selected-file-heading"[^>]*>PDF to rotate<\/h3>[\s\S]*?<AttachedFileIcon \/>[\s\S]*?<AttachedFileActions/);
  assert.match(component, /role="tablist" aria-label="Pages to Rotate"[\s\S]*?All Pages[\s\S]*?Select Pages/);
  assert.match(component, /className="rotate-angle-fieldset"[\s\S]*?\[90, 180, 270\][\s\S]*?setTargetRotation\(0\)/);
  assert.match(
    component,
    /className="rotate-settings-panel">[\s\S]*?className="rotate-page-range-controls"[\s\S]*?Page numbers or ranges[\s\S]*?className="rotate-angle-fieldset"[\s\S]*?id="rotate-output-filename"/
  );
  assert.match(component, /className="merge-option-field"[\s\S]*?<label htmlFor="rotate-output-filename">Output filename<\/label>/);
  assert.match(component, /<p>The \.pdf extension is added automatically when needed\.<\/p>/);
  assert.match(component, /normalizeOutputFileName\(outputFileName, `rotated_\$\{file\.name\}`\)/);
  assert.match(component, /setOutputFileName\(`rotated_\$\{selectedFile\.name\}`\)/);
  assert.match(
    component,
    /className="rotate-settings-panel">[\s\S]*?<div className="merge-section-heading merge-output-settings-heading">[\s\S]*?<h3 className="merge-section-heading-title merge-output-settings-title">Choose Settings<\/h3>[\s\S]*?<p>Angles preview immediately and apply to all or selected pages; rotate individual pages with their buttons\.<\/p>/
  );
  assert.doesNotMatch(component, /Angle buttons update the page previews immediately/);
  assert.doesNotMatch(component, /className="pdf-preview-instructions">[\s\S]*?rotate page \{pageNumber\} clockwise/i);
  assert.match(
    component,
    /className="rotate-page-preview-panel"[\s\S]*?<div className="merge-section-heading merge-output-settings-heading">[\s\S]*?<h3 id="rotate-page-preview-heading" className="merge-section-heading-title merge-output-settings-title">Page Preview<\/h3>[\s\S]*?className="rotate-page-grid"/
  );
});

test('Rotate PDF attachment panels use theme-aware surfaces and section accents', () => {
  const selectedFileStyles = styles.match(/\.rotate-selected-file-section\s*\{([^}]*)\}/)?.[1];
  const workflowShellSurfaceStyles = styles.match(
    /\.merge-pdf-settings,\s*\.merge-page-source,\s*\.rotate-settings-shell,\s*\.organize-pdf-preview-shell\s*\{([^}]*)\}/
  )?.[1];
  const groupedPanelStyles = styles.match(
    /\.rotate-settings-panel,\s*\.rotate-page-preview-panel\s*\{([^}]*)\}/
  )?.[1];
  const groupedMergePanelStyles = styles.match(/\.merge-output-settings-panel\s*\{([^}]*)\}/)?.[1];

  assert.match(selectedFileStyles || '', /background:\s*var\(--surface-muted\)/);
  assert.match(workflowShellSurfaceStyles || '', /background:\s*var\(--surface-background\)/);
  assert.match(
    styles,
    /\.rotate-settings-shell,\s*\.organize-pdf-preview-shell\s*\{\s*display:\s*grid;\s*gap:\s*1\.5rem;\s*background:\s*var\(--surface-muted\);/
  );
  assert.match(groupedPanelStyles || '', /background:\s*var\(--surface-background\)/);
  assert.match(groupedPanelStyles || '', /border:\s*1px solid var\(--border-color\)/);
  assert.equal(
    groupedPanelStyles?.replace(/\s+/g, ' ').trim(),
    groupedMergePanelStyles?.replace(/\s+/g, ' ').trim(),
    'Rotate settings and preview panels reuse the exact Merge settings panel style'
  );
  assert.match(
    styles,
    /\.merge-section-heading h3\.merge-output-settings-title,[\s\S]*?\{[^}]*border-left:\s*4px solid/
  );
  assert.match(styles, /:root\[data-theme='dark'\] \.merge-section-heading h3\.merge-output-settings-title/);
  assert.doesNotMatch(styles, /rotate-section-title|rotate-section-heading/);
});

test('Rotate page tabs use Merge button styling and page tiles stay within the preview panel', () => {
  const mergeButtonStyles = styles.match(
    /\.merge-mode-switch button,\s*\.rotate-page-tabs button,[\s\S]*?\{([^}]*)\}/
  )?.[1];
  const selectedTabStyles = styles.match(
    /\.rotate-page-tabs button\[aria-selected='true'\]\s*\{([^}]*)\}/
  )?.[1];
  const pageGridStyles = styles.match(/\.rotate-page-grid\s*\{([^}]*)\}/)?.[1];
  const darkSelectedTabStyles = styles.match(
    /:root\[data-theme='dark'\] \.rotate-page-tabs button\[aria-selected='true'\]\s*\{([^}]*)\}/
  )?.[1];

  assert.match(styles, /\.rotate-page-tabs\s*\{[^}]*display:\s*flex;[^}]*flex-wrap:\s*wrap;[^}]*gap:\s*0\.5rem;/);
  assert.match(mergeButtonStyles || '', /min-height:\s*2\.75rem/);
  assert.match(mergeButtonStyles || '', /border-radius:\s*0\.7rem/);
  assert.match(selectedTabStyles || '', /border-color:\s*#2563eb/);
  assert.match(selectedTabStyles || '', /background:\s*#eff6ff/);
  assert.match(darkSelectedTabStyles || '', /background:\s*#172554/);
  assert.match(pageGridStyles || '', /width:\s*100%/);
  assert.doesNotMatch(pageGridStyles || '', /margin-inline:\s*-/);
  assert.doesNotMatch(pageGridStyles || '', /width:\s*calc\(/);
});

test('Rotate pages provide an eye action that opens and closes an accessible larger preview', () => {
  const previewButtonStyles = styles.match(/\.rotate-page-preview-button\s*\{([^}]*)\}/)?.[1];
  assert.match(component, /import \{[\s\S]*?\bEye\b[\s\S]*?\bX\b[\s\S]*?\} from 'lucide-react'/);
  assert.match(
    component,
    /className="rotate-page-preview-button"[\s\S]*?onClick=\{\(event\) => openLargePreview\(pageNumber, event\)\}[\s\S]*?aria-label=\{`View larger preview of page \$\{pageNumber\}`\}[\s\S]*?<Eye className="h-4 w-4" aria-hidden="true" \/>/
  );
  assert.match(
    component,
    /className="merge-page-preview-backdrop"[\s\S]*?className="merge-page-preview-dialog"[\s\S]*?role="dialog"[\s\S]*?aria-modal="true"[\s\S]*?aria-label=\{`Page \$\{largePreview\.pageNumber\} preview`\}[\s\S]*?aria-label="Close larger page preview"[\s\S]*?<X className="h-5 w-5" aria-hidden="true" \/>[\s\S]*?<img src=\{largePreview\.preview\}/
  );
  assert.match(component, /if \(event\.key === 'Escape'\)/);
  assert.match(component, /largePreviewTriggerRef\.current\?\.focus\(\)/);
  assert.match(previewButtonStyles || '', /position:\s*absolute/);
  assert.match(previewButtonStyles || '', /top:\s*0\.5rem/);
  assert.match(previewButtonStyles || '', /left:\s*0\.5rem/);
  assert.match(styles, /\.rotate-page-preview-button:focus-visible\s*\{[^}]*outline:\s*2px solid #2563eb/);
});
