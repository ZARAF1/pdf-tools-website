# PDF Tool Development Guidelines

This is the authoritative standard for creating, scaffolding, modifying, redesigning, or repairing any PDF tool in this project. Read it together with `.github/project-instructions.md`, `.github/project-status.md`, and `.github/adsense-readiness-checklist.md` before tool work.

## Before changing a tool

- Inspect the current route, component, dependencies, shared UI/content components, design patterns, and the implementation checklist. Treat current source and executed tests as authoritative.
- Keep changes inside `C:\Projects\pdf`, preserve unrelated work, and do not install dependencies or add remote processing without approval.
- Confirm what the installed PDF APIs actually support. Never describe a UI mock, renamed file, or failed operation as a completed PDF action.

## Required tool experience

Every tool must have:

- A stable, directly accessible route, internal navigation, unique document title/meta description, and one clear page heading.
- A responsive interface using the existing palette, typography, spacing, cards, buttons, upload areas, and icons.
- Present each tool title, category, short description, and customer-facing introduction in the shared responsive detail hero. Keep the title prominent, the introduction left-aligned and comfortably readable, and the layout consistent in light and dark themes; avoid placing a long introduction as an unstructured centered paragraph.
- Keyboard-operable controls, visible focus, semantic headings, associated form labels, accessible status/errors, and useful disabled/loading states.
- A unique 100–200-word customer-facing introduction beneath the main heading, a tool-specific How to Use guide, accurate FAQs, an implementation-verified technical/privacy explanation, and links to a few genuinely related implemented tools. Unavailable conversion pages must use this space to explain the limitation without implying an upload or workflow exists.
- Validated inputs, clear limitations, file replacement/removal/reset where appropriate, useful failure recovery, and a real output/download flow.
- Reject password-protected/encrypted PDFs during file selection across every PDF-input tool other than the dedicated Unlock PDF workflow. Use the shared `src/lib/pdfValidation.js` helper so encrypted files are never added to ordinary tools' selected-file state. Unlock PDF may accept a supported encrypted file only to decrypt it with the user's correct supplied password; do not weaken the shared validator, bypass encryption, or attempt password recovery.
- Local processing claims only when verified from the implementation. Disclose network dependencies (for example OCR language-data downloads), hosting requests/logs, analytics, ads, and third-party services accurately.
- A tool-specific end-to-end checklist section with steps, expected result, observed result, status, evidence, and remaining work.

Use the shared `ToolPage` content patterns, related-tool cards, FAQ markup, metadata helper, and optional `AdSlot` when available. Do not copy generic FAQs or promise privacy, security, fidelity, compression, or compatibility that the code does not provide.

## Implementation workflow

1. Read the project instructions, current status, this guideline, and relevant checklist entries.
2. Inspect the route/component, dependency API, and neighbouring tools immediately before editing.
3. Implement the smallest complete change, one file at a time; reread each saved file.
4. Update the route, homepage/navigation, metadata, guide, FAQs, technical explanation, related-tool links, and safe ad placement as applicable.
5. Test the actual input-to-output workflow and relevant invalid cases with synthetic/non-sensitive files. Verify output contents, not only UI success.
6. Test representative viewport and keyboard interactions when browser tooling is available. Record unavailable checks as unverified/blocked.
7. Update the checklist and `.github/project-status.md`; reread both. Report changed files, exact commands, observed outcomes, and limitations.

## Advertising and trust requirements

- Ads are centrally configurable and disabled unless genuine publisher/ad-unit configuration and required consent controls are verified.
- Never invent publisher IDs, business identities, contact details, deployment domains, analytics, consent status, or `ads.txt` records.
- Never put ads near upload, reorder, processing, or download controls. Inactive placements must not look like real ads or leave blank boxes.
- No wording or implementation guarantees AdSense approval. Verify current official policies and disclose external account/legal/consent tasks.

## Reusable acceptance checklist

- [ ] Instructions/status/guideline/checklist and existing route/design patterns inspected.
- [ ] Route, internal links, title, description, and single page heading are correct.
- [ ] Responsive layout and keyboard/focus/labels/status/errors reviewed.
- [ ] Introduction, How to Use, verified FAQs, technical/privacy explanation, and related tools are present.
- [ ] Inputs, file restrictions, errors, loading, success, reset/retry, and output are exercised.
- [ ] Output opens and has expected pages/content/quality; original remains unchanged.
- [ ] Advertising is disabled or configured with verified publisher, unit, consent, and safe placement.
- [ ] Build/test/browser results and remaining work recorded in checklist and project status.

## Checklist status vocabulary

- **PASS — VERIFIED:** Executed and expected behavior observed.
- **PASS — ALREADY PRESENT:** Existing behavior inspected and verified.
- **IMPLEMENTED — NOT YET VERIFIED:** Code exists; expected behavior is not fully tested.
- **NEEDS USER ACTION:** Publisher ID, contact/business details, domain, account, consent decision, or legal review is required.
- **BLOCKED:** A concrete environment/tooling limitation prevents the check.
- **FAIL:** An executed check did not meet its expected result.

## Shared site and tool behavior

- Every active tool attachment section presents, in order, the attachment heading with accurate accepted-file and page limits, a concise tool-specific information card, and then the upload/workflow controls. State only limits actually enforced; use “no fixed page cap” when there is no configured cap, distinguish password-protected input only for Unlock PDF, and include batch/image limits where applicable. Do not substitute generic “processed in your browser” copy for tool guidance.
- The attachment information card briefly explains what the tool does and important constraints users should understand before selecting a file. Keep it specific and shorter than the full tool introduction; include material behavior such as Redact PDF rasterizing pages and losing selectable text, or Unlock PDF requiring a correct supported password. Use a rounded, bordered muted-surface card with shared theme surface, text, and border tokens, and a labelled heading.
- Preserve the shared attachment shell's blue border glow and pulse when applying tool-specific muted surfaces. Neutralize the guidance card or inner content as needed, but do not suppress the outer shell glow unless the user explicitly requests that change.
- Use the Merge PDF “Attach PDFs Here” section as the reference layout for attachment workflows:
  1. Start with a clear attachment heading and a nearby, concise statement of accepted formats and enforced file/page limits.
  2. Follow with a labelled, tool-specific guidance card that explains the task and any important constraint before the user chooses a file.
  3. Place the upload/drop zone after that guidance. Give it a prominent, state-aware prompt and primary picker action; support drag-and-drop where the tool supports it, and keep validation, drag-active, disabled, and error states legible in both themes.
  4. After selection, show selected-file cards before settings or processing controls. For multi-file tools, make the list ordered and scannable, show the file count and useful file details, and keep reorder/replace/remove actions attached to the relevant file. Keep an add-more chooser after the selected list when additional files are supported. In Merge PDF, place the add-PDF action below the selected-file rows, aligned to the right inside the “Files to merge” panel; leave a clear gap before Settings. Hide the separate dropzone after a valid file is attached, but retain the hidden picker inputs so add and replace actions continue working. For single-file tools, use Replace on the selected-file card instead of showing a competing second upload zone.
  5. Continue from attachments to tool settings or page-selection controls, then processing/reset/download actions. Keep this hierarchy within the attachment workspace rather than interleaving upload controls with unrelated settings.

### Canonical “Attach PDFs Here” design reference

Use the current Merge PDF attachment workspace as the visual and hierarchy reference when updating the “Attach PDFs Here” sections of other tools. This standard governs presentation and layout, not tool capabilities:

1. Keep the tool-specific attachment heading and concise accepted-file/limit summary above a labelled, muted-surface guidance card. Put the empty-state upload/drop zone after the card.
2. When files are selected, show their attachment cards before settings and processing. In Merge PDF, the ordered “Files to merge” list, count, per-file actions, and right-aligned add-PDF chooser stay together in one card; the chooser follows the rows. Leave the established 16 px separation before Settings. Adapt the card contents and actions for other tools rather than adding merge-only controls.
3. Keep the “Settings > Selection > Preview” overview and its short explanation above the existing settings or mode controls. In Merge PDF, the “Choose Settings” label, neutral explanation, output filename, page size, and optional checkboxes share one dark-surface panel. Tint only the label blue.
4. In Select pages mode, place the “Select pages” label, neutral instructions, selected-page count, and source-page pickers together in their own dark-surface panel. Give “Live output preview” a separate matching panel containing its neutral explanation, output count, and output content. Keep the output pages/empty state in the inset dark box below the heading with visible spacing; the “Select a page above to start building the output” prompt is plain, untinted text. Blue tint belongs on each section label only.
5. Continue to processing and result/download controls after the relevant file and settings/preview sections. Keep panel widths aligned, use theme-aware surface/border/text tokens, and retain comfortable mobile padding without horizontal overflow.

When applying this reference to other tools, preserve their existing processing behavior and user-visible capabilities—including validation, file/page limits, settings, defaults, selection/reordering behavior, errors, reset, and output—unless the user explicitly requests a behavior change. Make only the presentation or layout changes needed to align with the reference; do not remove, add, or reinterpret functionality as part of a visual redesign. Adapt or omit Merge-specific panels when a tool has no corresponding settings or page-selection feature.

### Proven Merge PDF and Rotate PDF design decisions

These decisions are grounded in the current `PdfMerger.jsx`, `PdfMergePagePicker.jsx`, `PdfRotator.jsx`, `src/index.css`, and their layout tests. Use them as the paired reference when designing another tool. The components intentionally share a visual language but not the same workflow or controls.

#### Shared decisions

| Decision | Standard | Reason / implementation reference |
|---|---|---|
| Workflow order | Attachment/upload first; once a file is selected, show its file card, settings or mode controls, page previews, then processing and output. | Users see the source and applicable choices before an irreversible-looking action. Do not retain a competing empty dropzone after selection. |
| Panel hierarchy | Use a theme-aware outer muted panel for a complete workflow group and a separate surface-background panel for each focused settings/preview section. | The enclosing workflow, settings, and preview need distinct visual grouping. Reuse `var(--surface-muted)`, `var(--surface-background)`, `var(--border-color)`, and text tokens rather than hardcoding one theme's panel color. |
| Panel geometry | Outer shells use a 1rem radius and responsive `clamp(1rem, 2.5vw, 1.5rem)` padding. Inner settings/preview panels use a 0.875rem radius, 1px token border, 1rem gap, and the same responsive padding. | Keeps panels aligned and readable while preserving nesting. Current styles are `.merge-pdf-settings`, `.rotate-settings-shell`, `.remove-pdf-settings-shell`, `.merge-output-settings-panel`, `.merge-page-selection-panel`, `.merge-live-output-panel`, `.rotate-settings-panel`, `.rotate-page-preview-panel`, `.remove-pdf-settings-panel`, and `.remove-pdf-page-preview-panel`. |
| Section heading | Reuse the shared section-heading markup. Accent only the heading label with the blue left border and pale-blue surface; keep its explanatory sentence plain supporting text. | Prevents whole paragraphs from looking like buttons/callouts and keeps Choose Settings / Page preview / Select pages hierarchy consistent. |
| Mode controls | Use real buttons with a 44px minimum height, 0.7rem radius, token border, and visible focus. Use a blue border/tint for the active mode; provide a dark-theme equivalent. | Modes should read as discrete choices, not underlined navigation tabs. Merge uses `aria-pressed`; Rotate retains accessible tab semantics (`role=tab`, `aria-selected`, `aria-controls`, roving `tabIndex`, arrow-key navigation) while visually matching Merge buttons. Never change semantics merely to copy appearance. |
| Width and overflow | Every panel, grid, and tile must allow shrinking (`min-width: 0`); grids stay at `width: 100%` inside their panel, use `minmax(0, 1fr)` columns, and never escape with negative margins or `calc(100% + ...)`. | This is the verified fix for Rotate tiles spilling across the panel border. Test the narrow viewport and actual tile bounds, not only CSS declarations. |
| Accessibility | Associate headings and sections; label controls; keep all actions keyboard-operable with visible `:focus-visible`; give icon-only actions a specific `aria-label` and `title`; hide decorative icons from assistive technology. | The preview, mode, selection, and file actions must remain understandable without visual context. |
| Preserve capability | Treat layout alignment as presentation-only. Do not transfer a neighbor tool's settings, limits, page-selection behavior, defaults, or processing semantics. | Merge's multi-file selection/order is not Rotate's single-file angle workflow. Existing validation, errors, and output remain authoritative. |

#### Merge PDF: multi-source assembly and output-order reference

1. **Empty state:** show one drag/drop zone and persistent picker inputs. After a valid selection, hide the empty-state zone but keep its add/replace inputs mounted so actions do not break.
2. **Files to merge:** keep the count and ordered, scannable file rows together. Rows show one-based order and useful file details, with move-up/down, replace, and remove actions on the relevant row. Put the add-PDF chooser below the rows, right-aligned inside that panel; label it “Choose Files” when empty and “Add More Files (n/5)” after files are attached, where `n` is the current selection count. Keep it disabled at the five-file cap and retain the visible gap before Settings.
3. **Overview and modes:** use `Settings > Selection > Preview`, followed by the concise “Choose how to combine your PDFs and customize the output.” explanation, then button-style “Merge all pages” / “Select pages”. Merge all is the default.
4. **Choose Settings:** place the heading, neutral explanation, output filename, page size, and optional source-bookmark / between-source blank-page settings in one inner panel. Keep these before conditional page selection so output-wide settings are easy to find.
5. **Select pages mode:** group the page-selection heading, instructions, count, and source pickers in one panel. Keep separate source sections; show up to 12 real page thumbnails initially and expose a “Show next” action when more exist. Page selection starts empty and appends in user selection order; do not silently sort away output order.
6. **Live output:** in a separate matching panel, show the selected output sequence and count. The inset output-content box contains either a neutral empty prompt or the real selected-page previews. Allow drag reorder and provide explicit move/remove controls as keyboard-accessible alternatives. Preserve the existing blank-page markers and output ordering.
7. **Output:** processing and the manual download/result card follow settings and preview. Clear or revalidate generated output when relevant inputs/settings change.

#### Image to PDF: page selection, output, and actions

1. **Selectable image tiles:** In Select Pages settings scope, clicking the page image toggles that image's settings selection. Match Merge's selected-page treatment: a blue tile outline, a selected checkmark at the upper-right of the image, and a distinct eye action at the upper-left. Keep the selection button keyboard-operable and labelled; the eye opens the larger preview without changing selection. This selection scopes per-image settings and does not exclude images from PDF output.
2. **PDF output mode:** Offer one PDF containing all images or a separate one-page PDF per image, packaged together in a single ZIP download. The combined PDF is the default. Keep the mode localized and clear generated output when the user changes it.
3. **Primary and reset actions:** Place Create PDF before Reset in the action row, with Reset immediately to its right. Keep them side by side at narrow widths; let Create PDF flex while keeping Reset compact.

#### Rotate PDF: single-source transformation reference

1. **Selected source:** show one selected-file card with file details and Replace/Remove actions. Do not show a second add-file chooser; replacement remains a single-file operation.
2. **Outer workflow shell:** after the selected file, use one muted shell containing, in order, the concise `Settings > Preview` overview and explanation, the page-mode controls, and their tabpanel. The overview belongs inside this shell, not outside or in the file card.
3. **Page modes:** provide “All Pages” and “Selected Pages” as adjacent Merge-style buttons, but preserve their `tablist`/`tab`/`tabpanel` relationships and keyboard arrow behavior. All Pages is the default. Do not make page mode itself change the rotation algorithm.
4. **Choose Settings:** place the conditional page-number/range input first and show it only in Selected Pages mode. Keep the rotation-angle fieldset after it. Angle presets update the page previews immediately and target all pages or only the selected pages; the individual per-page rotate action remains independent. Put Output filename directly after the angle controls, with the shared automatic `.pdf` handling. Editing settings must continue to clear stale generated output.
5. **Page preview:** render the real page grid in its own inner panel after Choose Settings. Use two columns on narrow screens, three at 640px, four at 768px, and five at 1024px; keep every tile within the panel with no negative grid margins. Each tile has a page number/current rotation, a separate eye button for the larger preview, and an individual clockwise-rotate action. In Selected Pages mode, selection remains a separate action from preview and rotation.
6. **Larger page preview:** the eye opens an accessible dialog with a fresh high-resolution render using that page's current rotation. Keep the eye action independent so it neither selects nor rotates a page. Support a labelled close button, Escape, backdrop close, focus restoration, loading/error feedback, and cancellation of obsolete render work.
7. **Output:** the Rotate PDF action follows the preview. Keep its existing validation, selected-page interpretation, rotation state, processing, reset/error, and downloadable output behavior unchanged when aligning the layout.

#### Remove PDF: single-source page-removal reference

1. **Selected source:** show a dedicated selected-file card before the workflow. Reuse the shared file icon and Replace/Remove actions, and keep the existing PDF validation, page limit, and replacement/drop behavior.
2. **Outer workflow shell:** place the concise `Settings > Preview` heading and explanation inside the muted shell. Do not add All Pages/Selected Pages tabs, page-range input, rotation controls, or output-name settings; Remove PDF does not have those modes.
3. **Choose Settings:** keep the live selected-page count and Select All/Clear Selection actions in one inner panel. These actions change only the existing page-selection state.
4. **Page preview:** show real, one-based page tiles in a separate inner panel after settings. Tile clicks select/deselect pages; the independent eye action opens a labelled larger preview and must not change selection.
5. **Confirm and process:** keep the existing confirmation and processing action after page review. Preserve the refusal to remove every page, the 50-page cap, source-order output, and stale-result clearing.
6. **Shared implementation:** Remove PDF and Extract Pages share `PageSelectionTool.jsx`. Scope the redesigned shell, file card, settings, and eye action to Remove mode; keep Extract's layout and selection/output behavior intact.

#### Apply this reference without regressions

Before editing, identify whether the target is single- or multi-file, what controls actually exist, and which actions change output. Sketch the order from attachment through result; map each existing control into that order without inventing features. Reuse shared classes/components only when their semantics match. Add a regression for the requested order, containment, responsive/theme styles, and unchanged action relationships; verify the test fails before the change. Then run the focused tool tests, full suite/build when appropriate, and inspect a synthetic PDF in a browser at desktop and narrow widths. Record only observed results. Do not claim pixel-perfect equivalence based solely on shared class names.

- Keep the tool registry limited to tools that genuinely work. If an Office format cannot be rendered with installed local dependencies, show an explicit limitation notice; do not accept a file or imitate conversion. Ask before adding dependencies or a remote service.
- Use the shared category and tool registries as the source for homepage grouping, category navigation, search, tool-page context, and related tools. Keep labels and assignments consistent; do not duplicate routes or tools to fill categories.
- Build homepage and related-tool links from the shared, theme-aware tool-card component. Use compact consistent dimensions, readable one-line descriptions where practical, semantic links, visible focus, and responsive grids that expose every tool.
- Keep shared tool-card hover and keyboard-focus feedback consistent with the homepage hero's blue palette; a restrained blue tint rising from the bottom can indicate interactivity without obscuring card text in either theme.
- For a decorative homepage hero illustration with interactive category badges, derive links and labels from the shared registry, link each badge to its category section, keep the static artwork hidden from assistive technology while exposing semantic navigation, and provide keyboard focus, a paused/enlarged hover state, theme contrast, narrow-layout fit, and reduced-motion behavior.
- Category disclosure controls must allow normal Tab/Shift+Tab navigation, close with Escape and focus restoration, dismiss on outside interaction or focus leaving the navigation, close after tool selection, and ensure only one category is open. Keep the trigger and submenu in a stable shared pointer area.
- Use semantic disclosure/navigation markup and only accurate ARIA attributes. Search suggestions must remain keyboard reachable after the clear control; support arrow keys, Enter, Escape, query clearing, no-result feedback, and visible focus without unexpected focus stealing.
- Theme-sensitive menus, cards, and upload controls must use shared surface/text/border tokens. Verify readable text, icons, focus, hover, pressed, disabled, and drag-active states in both themes; do not depend on broad light-theme utility colors for dark-mode states.
- Reuse `AttachedFileIcon` and `AttachedFileActions` for selected-file cards across active tools. Keep the document tile neutral slate like Merge PDF, expose Replace/Remove with filename-specific `title` tooltips and `aria-label`s, hide decorative SVGs from assistive technology, and preserve each tool's validation, file limits, ordering, and existing-file state when replacement fails or is cancelled.
- In the attachment workspace, render selected-file cards first, then tool settings or page-selection controls, then processing/reset/download actions. Multi-file tools may keep an add-files chooser after the selected cards; single-file tools should use the card's Replace action instead of showing a second chooser above it. Keep the picker input mounted when hiding a single-file dropzone.
- Persist a user-selected light/dark theme. Keep search keyboard-operable with a labelled search field, semantically correct suggestion links/actions, active-result styling, Escape handling, direct navigation, and suggestions that remain visible while focus moves within the search controls.
- Redaction must remove the source content beneath each mask from the exported PDF, not merely draw a cover over searchable text. If pages are rasterized to achieve this, disclose the resulting loss of selectable text, vector quality, links, forms, and other interactive features.
- Distinguish a visible typed/drawn/image signature from a cryptographic PDF signature. Do not claim identity verification or tamper protection unless an actual certificate-backed signature is implemented and verified.
- PDF unlocking requires the correct password and a genuine local decryption implementation. Never attempt password guessing or encryption bypass, and do not add a decryption dependency without user approval.
- Dark-theme upload-zone hover styles must remain visibly distinct from the normal state and from drag-active styling.
- Page-selection grids must show real PDF previews, use human-readable one-based labels, preserve source page order in output, enforce documented page-count limits without silent truncation, prevent removing every page, and clear stale output when selection or source changes.
- Keep generated files available through a clearly labelled manual Download action; do not imply a download started automatically. Ensure download controls are not nested in other buttons. Revalidate output after settings change.
- Image-to-PDF should validate actual browser decoding for each claimed format, preserve the image list order, disclose resize/re-encode behavior, and verify generated page count and dimensions. Do not promise format support based only on the file extension or picker filter.
- PDF-to-image outputs must contain genuine bytes for the selected format, not a renamed encoding. Render pages sequentially, bound per-page and cumulative memory, package only completed images, and verify ZIP entry names, order, signatures, and archive readability.
- PDF to Images should use a theme-aware muted attachment section and Settings shell, with its “Choose Settings” controls in a surface-background inner panel. Keep the existing format and quality options; make blank-margin cropping an explicit, default-on choice that trims near-white margins only, preserves blank pages, and is not described as extracting embedded photos. Let users name the output before conversion; download a single-page result as its selected image format and multiple pages as a named ZIP with numbered entries.
- Watermark page numbering is independent from text-watermark settings and page selections. Verify the starting sequence against selected pages in document order.
- Configure PDF.js through the shared worker URL helper. For rendering performed offscreen (page previews, OCR preparation, or image compression), account for background-tab `requestAnimationFrame` throttling and verify completion without requiring the tab to be foregrounded.
- Treat an extracted text check, parsed page count, or successful build as separate evidence from visual inspection and browser download verification. Record each result independently; never claim an output looks correct unless it was rendered and inspected.
