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
- Reject password-protected/encrypted PDFs during file selection across every PDF-input tool. Use the shared `src/lib/pdfValidation.js` helper so an encrypted file is never added to a tool's selected-file state; do not bypass encryption or attempt password recovery.
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

- Keep the tool registry limited to tools that genuinely work. If an Office format cannot be rendered with installed local dependencies, show an explicit limitation notice; do not accept a file or imitate conversion. Ask before adding dependencies or a remote service.
- Use the shared category and tool registries as the source for homepage grouping, category navigation, search, tool-page context, and related tools. Keep labels and assignments consistent; do not duplicate routes or tools to fill categories.
- Build homepage and related-tool links from the shared, theme-aware tool-card component. Use compact consistent dimensions, readable one-line descriptions where practical, semantic links, visible focus, and responsive grids that expose every tool.
- When using a decorative homepage hero illustration, keep it `aria-hidden` if it conveys no essential information, use non-interactive badges around a clear focal point, and style their placement, contrast, and spacing for both themes and narrow layouts. Do not let decorative labels overlap the main illustration or create horizontal overflow.
- Category disclosure controls must allow normal Tab/Shift+Tab navigation, close with Escape and focus restoration, dismiss on outside interaction or focus leaving the navigation, close after tool selection, and ensure only one category is open. Keep the trigger and submenu in a stable shared pointer area.
- Use semantic disclosure/navigation markup and only accurate ARIA attributes. Search suggestions must remain keyboard reachable after the clear control; support arrow keys, Enter, Escape, query clearing, no-result feedback, and visible focus without unexpected focus stealing.
- Theme-sensitive menus, cards, and upload controls must use shared surface/text/border tokens. Verify readable text, icons, focus, hover, pressed, disabled, and drag-active states in both themes; do not depend on broad light-theme utility colors for dark-mode states.
- Persist a user-selected light/dark theme. Keep search keyboard-operable with a labelled search field, semantically correct suggestion links/actions, active-result styling, Escape handling, direct navigation, and suggestions that remain visible while focus moves within the search controls.
- Redaction must remove the source content beneath each mask from the exported PDF, not merely draw a cover over searchable text. If pages are rasterized to achieve this, disclose the resulting loss of selectable text, vector quality, links, forms, and other interactive features.
- Distinguish a visible typed/drawn/image signature from a cryptographic PDF signature. Do not claim identity verification or tamper protection unless an actual certificate-backed signature is implemented and verified.
- PDF unlocking requires the correct password and a genuine local decryption implementation. Never attempt password guessing or encryption bypass, and do not add a decryption dependency without user approval.
- Dark-theme upload-zone hover styles must remain visibly distinct from the normal state and from drag-active styling.
- Page-selection grids must show real PDF previews, use human-readable one-based labels, preserve source page order in output, enforce documented page-count limits without silent truncation, prevent removing every page, and clear stale output when selection or source changes.
- Keep generated files available through a clearly labelled manual Download action; do not imply a download started automatically. Ensure download controls are not nested in other buttons. Revalidate output after settings change.
- Image-to-PDF should validate actual browser decoding for each claimed format, preserve the image list order, disclose resize/re-encode behavior, and verify generated page count and dimensions. Do not promise format support based only on the file extension or picker filter.
- PDF-to-image outputs must contain genuine bytes for the selected format, not a renamed encoding. Render pages sequentially, bound per-page and cumulative memory, package only completed images, and verify ZIP entry names, order, signatures, and archive readability.
- Watermark page numbering is independent from text-watermark settings and page selections. Verify the starting sequence against selected pages in document order.
- Configure PDF.js through the shared worker URL helper. For rendering performed offscreen (page previews, OCR preparation, or image compression), account for background-tab `requestAnimationFrame` throttling and verify completion without requiring the tab to be foregrounded.
- Treat an extracted text check, parsed page count, or successful build as separate evidence from visual inspection and browser download verification. Record each result independently; never claim an output looks correct unless it was rendered and inspected.
