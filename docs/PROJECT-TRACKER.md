# Project Tracker

## Locked Decisions (D1–D7)

| ID | Decision | Reason | Source | Day 10 action |
|----|----------|--------|--------|---------------|
| D1 | WCAG 2.2 AA is the confirmed accessibility target. | Keep accessibility requirements and evidence consistent across redesign work. | Task 1.2, Section K.3 | Create `docs/accessibility.md` with criterion-level evidence. |
| D2 | SEO keyword research is deferred to Day 9. | Avoid treating current homepage wording as a fixed keyword strategy before research. | Task 1.2, Section K.4 | Create `docs/seo-strategy.md` with the Day 9 findings. |
| D3 | Keep all 20 shipped languages in the product. | The redesign must not remove supported languages; translation quality is tracked separately. | Task 1.2, Section K.5 | Create `docs/internationalization.md` documenting language support and review status. |
| D4 | A CSP explanation is required before Day 9.4. | Deployment constraints must be understood before final deployment decisions. | Task 1.2, Section K.7 | Create `docs/deployment.md` with the CSP explanation and hosting posture. |
| D5 | Create seven strategy and handover documents with real project content at Day 10. | The final handover needs durable architecture, user, accessibility, SEO, i18n, testing, and deployment guidance. | Task 1.2, Section L | Create the seven documents listed in H1–H7 and execute the remaining Section L updates. |
| D6 | Ads remain below content, never above the fold or near primary CTAs. | Preserve content-first browsing and avoid deceptive or disruptive ad placement. | Task 1.3 | Recheck final placements against the completed homepage and AdSense checklist. |
| D7 | Set `noindex` for `ar`, `hi`, `ja`, `ko`, and `zh-CN` during AdSense submission. | Defer indexing of languages whose samples still require native review. | Task 1.4, Sections D and F; Task 1.6 decision | Revisit indexing after native-language QA and document the final policy in `docs/internationalization.md`. |

## Rule Amendments (R1–R9)

| ID | Amendment | Applies from |
|----|-----------|--------------|
| R1 | Mobile and desktop behavior tables use `N/A — audit only` for documentation-only tasks. | Documentation-only tasks |
| R2 | Include evidence for all 20 WCAG criteria in every task completion report. | All tasks |
| R3 | End each task completion report with the required `STOPPING HERE` line. | All tasks |
| R4 | Do not copy competitors' visual designs, illustrations, colors, typography, icons, wording, or composition. | All redesign tasks |
| R5 | Reuse First checks `docs/architecture.md` once that document exists. | After `docs/architecture.md` is created |
| R6 | `docs/testing.md` is the authoritative testing reference once created. | After `docs/testing.md` is created |
| R7 | Include evidence-of-read lines for every item in a task's READ list. | All tasks with a READ list |
| R8 | Same as R1: use `N/A — audit only` in mobile and desktop tables for documentation-only tasks. | Documentation-only tasks |
| R9 | Read this tracker first at the start of every future task. | Task 1.6 onward |

## Findings to Fix (F1–F12)

| ID | Finding | Source | Fix scheduled | Status |
|----|---------|--------|---------------|--------|
| F1 | Search input uses `text-sm`, below the 16px input-text requirement. | Task 1.2, Section E6 | Day 3 | Open |
| F2 | Clear-search button may be smaller than the 44×44px project target. | Task 1.2, Section E6 | Day 3 | Open |
| F3 | Skip-link visibility on focus is unverified. | Task 1.2, Section E3 | Day 3 | Open |
| F4 | Skip-link target should be `#main-content`. | Task 1.2, Section E1; Q1 | Day 3 | Open |
| F5 | Hero-title contrast needs a runtime check. | Task 1.2, Section E5 | Day 3 | Open |
| F6 | Clear-search button `text-slate-400` may fail the 4.5:1 contrast requirement. | Task 1.2, Sections E5–E6 | Day 3 | Open |
| F7 | Category fan applies `aria-hidden` to elements that may still be tabbable. | Task 1.2, Section E4 | Day 3 | Open |
| F8 | Workspace is empty until JavaScript hydration, creating a CLS risk. | Task 1.6 packet | Day 9.5 | Open |
| F9 | Several body-copy and instructional text styles are below the 16px mobile floor. | Task 2.3, Section C in `docs/main-page.md` | Redesign typography pass | Open |
| F10 | Long-form paragraphs exceed the 80-character desktop line-length target across multiple page templates. | Task 2.3, Section D in `docs/main-page.md` | Redesign layout pass | Open |
| F11 | The homepage uses 28px category-stack gaps/padding that do not match the named spacing tokens. | Task 2.3, Section F in `docs/main-page.md` | Redesign spacing pass | Open |
| F12 | Theme toggle lacked a pressed state and used a changing accessible name. | Task 2.4, Section D in `docs/main-page.md` | Task 2.4 | Resolved |

## Open Questions

| ID | Question | Resolution |
|----|----------|------------|
| Q1 | What should the skip link target? | Resolved: change it to `#main-content`. |
| Q2 | How should the 20-language quality gap be handled? | Resolved: apply D7 and noindex `ar`, `hi`, `ja`, `ko`, and `zh-CN` during AdSense submission pending native QA. |
| Q3 | When is native-language QA scheduled? | Resolved: approximately two weeks after approval. |

## Day 10 Handover Backlog (H1–H10)

| ID | Item | Status |
|----|------|--------|
| H1 | Create `docs/architecture.md`. | Pending — Day 10 |
| H2 | Create `docs/user-guide.md`. | Pending — Day 10 |
| H3 | Create `docs/accessibility.md`. | Pending — Day 10 |
| H4 | Create `docs/seo-strategy.md`. | Pending — Day 10 |
| H5 | Create `docs/internationalization.md`. | Pending — Day 10 |
| H6 | Create `docs/testing.md`. | Pending — Day 10 |
| H7 | Create `docs/deployment.md`. | Pending — Day 10 |
| H8 | Execute Task 1.2 Section L documentation updates. | Pending — Day 10 |
| H9 | Archive rejected homepage variants. | Pending — Day 10 |
| H10 | Complete the final AdSense readiness checklist. | Pending — Day 10 |

## Baseline Metrics (from Task 1.5)

| Metric | Value | Source | Threshold |
|--------|-------|--------|-----------|
| LH Performance | 92 | Human — local production preview | ≥ 90 |
| LH Accessibility | 100 | Human — local production preview | ≥ 95 |
| LH Best Practices | 100 | Human — local production preview | ≥ 90 |
| LH SEO | 92 | Human — local production preview | ≥ 95 |
| LCP | Passed; no numeric value supplied | Human — local production preview | < 2.5s |
| CLS | Passed; no layout shifts reported | Human — local production preview | < 0.1 |
| INP | N/A — not supplied | Human — local production preview | < 200ms |
| TBT | 10 ms | Human — local production preview | — |
| WAVE Contrast Errors | 28 | Human — WAVE; axe DevTools injection failed | 0 |
| npm test | 352/352 passed | Copilot CLI | 352 (no regression) |
| Bundle size | 53 MB `dist/`; 968 KB largest generated chunk | Copilot build output | Decrease |
| Homepage entry payload | 1,155.38 KiB uncompressed | Copilot build output | Decrease |

## Paste Log

| Date/Paste # | Reason | Notes |
|--------------|--------|-------|
| 2026-11-09 | Task 2.2 completion and design decision | Interactive Primitives is Ready for Review in `docs/status.md`; created Button, Input, Card, Badge, and FocusRing. Decision: Button `sm` uses a 44px minimum height (rather than the primitive-specific 32px suggestion) to honor the project-wide 44×44px touch-target rule; compact padding is retained. |
| Task 2.3 | Typography and spacing audit | Marked Task 2.3 Ready for Review in `docs/status.md`. Logged F9–F11: undersized body/instruction text, desktop prose lines longer than 80 characters, and 28px homepage spacing values that are off-token. The 200% zoom check was emulated with a 640px viewport and is documented as such; text-spacing overrides produced no measured overflow or paragraph clipping. |
| 2026-11-09 | Task 2.4 dark-mode audit and toggle fix | All 17 documented token contrast pairs passed in dark mode; Home, Merge PDF, and Privacy rendered without observed light-only text/surfaces. F12 resolved: theme button now exposes `aria-pressed` with a stable “Dark mode” accessible name; first-load system preference and localStorage persistence were browser-checked. |
| Task 2.5 design-system summary | Consolidated Task 2.1 token values (including light/dark colors and shadows) and Task 2.2 primitive usage into the canonical visual rulebook in `docs/main-page.md`. Decisions: keep status meaning explicit in text, preserve semantic links separately from action buttons, use one interactive target per clickable card, and constrain variants to approved tokens/primitives. Five design choices (wordmark, headline tone, hero treatment, trust proof, and content density) remain for human resolution before Day 3. No code changed; `npm.cmd test` passed 352/352 before and after. |

## Resolved

| ID | Item | Resolution | Resolved on |
|----|------|------------|-------------|
| Q1 | Skip-link destination | Change the target to `#main-content`. | Task 1.6 |
| Q2 | 20-language indexing strategy | Noindex `ar`, `hi`, `ja`, `ko`, and `zh-CN` during AdSense submission pending native QA. | Task 1.6 |
| Q3 | Native-language QA schedule | Schedule QA approximately two weeks after approval. | Task 1.6 |
| F12 | Theme toggle state semantics and stable accessible name | Added `aria-pressed` and the stable “Dark mode” accessible name in `src/App.jsx`; browser verified state and persistence. | Task 2.4 |

## Task 3.1 — Variant 1: Scannable Grid Homepage

- Added the unrouted registry-driven variant and its focused subcomponents; the existing Home route, app shell, tool workflows, and shared search remain unchanged.
- Decision: keep the full-width hero `Input` required by this variant while preserving the global `ToolSearch`; revisit whether both remain visible when the final route is selected in Task 6.1.
- Added a temporary dev-only preview gate in `src/App.jsx` at `http://localhost:5173/?preview=v1`; it requires both `import.meta.env.DEV` and the query flag. The production JavaScript contains no preview copy, and no application route was changed.
- Follow-up corrections: the preview now has its own `main` landmark, the hero Input is measured at 48px/16px, visible footer controls meet the 44px target minimum, and the header brand and skip link have explicit hover states.
- Verification: `npm.cmd test` passed 358/358 (352/352 before implementation); the six focused variant tests pass. `npm.cmd run build` passed with existing `buffer` externalization and >500kB chunk warnings (995.44 kB main JS asset).
- Chromium measured no horizontal overflow or undersized visible controls at 320, 375, 414, 768, 1024, 1280, 1440, and 1920px. It confirmed the category link counts (4, 4, 4, 3, 3), search result/no-result announcements, input border contrast (4.72:1 light, 6.72:1 dark), theme state persistence, skip-link reveal, focus-ring visibility, and no overlap between the last Extract link and mobile CTA.
- Hover utility classes are present, but browser hover rendering was not confirmed. Full text-contrast review, axe/WAVE, Lighthouse, and reliable keyboard-event automation remain outstanding.
- Status remains **In Progress — awaiting user input**. Do not claim zero critical/serious violations until human WAVE/axe evidence is supplied.

## Task 4.1 — Variant 2 (Bold Editorial)

- Added `VariantEditorial.jsx` and four isolated `v2` components: `V2Header`, `V2Hero`, `V2HowItWorks`, and `V2ToolGrid`. The V2 tool grid renders all 18 tools from `TOOL_REGISTRY` with each registry icon, name, description, and path.
- V2 is preview-only. Development accepts `?preview=v2`; a separate production-preview build additionally requires `VITE_ENABLE_V2_PREVIEW=true`. The default `/` route remains the existing Home page. Do not deploy the opt-in preview build as the normal production artifact.
- No V1 source file was changed. The 44px footer target requirement is applied in the V2 wrapper around the existing shared Footer.
- `npm.cmd test` passed 359/359 before changes and 363/363 after; V2 regression tests passed 4/4. The opt-in production build and HTTP preview succeeded with the existing buffer/chunk warnings.
- Browser verified the single H1, five categories, 18 tool cards, theme toggle state, default homepage fallback, and no horizontal overflow or visible targets below 44px at 320, 375, 414, 768, 1024, 1280, 1440, and 1920px. Contrast was calculated from the approved theme tokens. axe/WAVE, Lighthouse, 200% zoom, text-spacing overrides, and full manual keyboard testing remain outstanding; do not claim those checks.

## Task 5.1 — Variant 3 (Apple Bento Box)

- Added `VariantBento.jsx` and isolated V3 header, hero, and bento-grid components. The asymmetric grid is generated from `TOOL_CATEGORIES` and `TOOL_REGISTRY`; all 18 tools use their registry icons, names, descriptions, and paths.
- Decision: honor the existing 28px `rounded-2xl` radius token rather than hardcoding the initially requested 24px corner radius. This follows the user's resolution and Task 2.5 token-only rule.
- The V3 preview requires `?preview=v3` and, for production, `VITE_ENABLE_V3_PREVIEW=true`. The normal `/` route still renders `Home`; the V1/V2 source files were not touched.
- `npm.cmd test` passed 363/363 before implementation and 367/367 after; the V3-focused tests passed 4/4. The opt-in production build passed with existing `buffer` externalization and >500kB chunk warnings.
- Production-preview browser checks confirmed one H1, five categories, 18 tool cards, no horizontal overflow at eight widths, 44px focused skip-link height, 28px hero/category/tool-card corners, theme-toggle state change, hover styling, the default-home fallback, and no captured console errors/warnings. axe/WAVE, Lighthouse, 200% resize, text-spacing overrides, and full keyboard traversal remain outstanding; do not claim those results.
## Task 6.1 — Variant 4 (Command Center)

- Added the isolated `VariantCommandCenter` and V4 header, search, tool-grid, and ranked search-helper components. `TOOL_REGISTRY` remains the source for all 18 tool names, descriptions, icons, and paths.
- Kept the standard Home route unchanged; production preview requires `VITE_ENABLE_V4_PREVIEW=true` and `?preview=v4`.
- Decision: V4 uses native full-page links and `window.location.assign` for tool selection so the opt-in preview cannot remain mounted while the URL changes to a real tool route.
- Accessibility refinement: increased the search border to full `brand-500` and card borders to `brand-500/80`; measured ratios were 5.13:1 and 3.67:1 on their surfaces. The accent text/focus color is locally pinned to `#3B82F6` for 5.38:1 against black.
- Verification: full suite passed 371/371 (367/367 before implementation); V4-focused tests passed 4/4; production build passed with existing `buffer` externalization and >500kB chunk warnings. Production browser verified the responsive widths, search ranking, real `/ocr-pdf` navigation, and default homepage fallback.
- axe/WAVE and Lighthouse were not run. Keyboard verification was focused rather than a full traversal; see the V4 WCAG evidence table in `docs/main-page.md`.

## Task 7.1 — Variant 5 (Vibrant Consumer Homepage)

- Added the isolated V5 shell and components under `src/components/v5/`, plus the `?preview=v5` gate in `src/App.jsx`. Production review requires `VITE_ENABLE_V5_PREVIEW=true`; the normal homepage remains unchanged.
- Decision: honor the task's exact 24px radius inside V5 only; do not change the shared 28px radius token or earlier variants.
- Reused the site's `Card`, `Input`, `Badge`, `Button`, `Footer`, `AdSlot`, and registry data. Because shared `ToolCard`/`ToolSearch` presentation localizes labels and does not match the persistent hero search, V5 renders raw registry fields and reuses the existing registry-only `searchTools` helper.
- All five categories and 18 tools use `TOOL_CATEGORIES` / `TOOL_REGISTRY`; the cards preserve the registry icons, names, descriptions, and paths. Three explanatory paragraphs and supporting content appear after the tool directory; the ad slot remains below them.
- Verification: full suite passed 371/371 before Task 7.1 and 371/371 after; final opt-in production build passed with existing `buffer` externalization and large-chunk warnings. Main JS asset: 1,013.31 kB (344.48 kB gzip).
- Production preview `http://127.0.0.1:4177/?preview=v5` passed browser checks for one H1, five categories, 18 tools, search returning all 18 for `pdf`, outside-click close, OCR Enter navigation to `/ocr-pdf`, default-home fallback, 24px corners, visible sampled focus rings, and no overflow or targets below 44px at eight widths.
- Browser text contrast sampling found no visible text or placeholder below 4.5:1 (minimum 4.76:1 light and 6.64:1 dark). axe/WAVE, Lighthouse, 200% text resize, text-spacing overrides, and full keyboard traversal remain outstanding; see Task 7.1 evidence in `docs/main-page.md`.

## Task 8.1 — Variant 6 (True Light-Mode Editorial)

- Added the isolated V6 page and components under `src/components/v6/` and `src/components/VariantEditorialLight.jsx`; the V6 preview is opt-in for production with `VITE_ENABLE_V6_PREVIEW=true`.
- Decision: force the light surface locally using `data-theme="light"` and V6 tokens rather than changing the document theme or earlier variants. The input explicitly overrides the root-level dark-theme field rule after browser testing revealed that it otherwise became dark.
- The split-screen hero and asymmetrical bento use only `TOOL_CATEGORIES` and `TOOL_REGISTRY`; all 18 cards preserve the registry icon, name, description, and exact path. Three explanatory paragraphs appear below the tools, before the existing AdSlot.
- Verification: `npm.cmd test` passed 371/371 before and after; opt-in production build passed with existing `buffer` externalization and >500kB chunk warnings. Production browser verified no horizontal overflow and no visible controls below 44×44px at eight widths, 18 `pdf` search results, Escape/outside-click close, `/ocr-pdf` navigation, the unchanged default homepage, and light search colors under a simulated dark root.
- Production preview: `http://127.0.0.1:4178/?preview=v6`. Lighthouse, axe/WAVE, 200% text resize, text-spacing overrides, full keyboard traversal, and complete non-text contrast remain outstanding; see the V6 WCAG evidence table in `docs/main-page.md`.

## Task 9.1 — Variant 7 (Glassmorphism)

- Added the isolated V7 homepage in `src/components/VariantGlass.jsx` and `src/components/v7/`; the normal homepage and earlier variants remain unchanged.
- Decision: compose the search and tool directory from shared `ToolSearch`, `ToolCard`, `TOOL_CATEGORIES`, and `TOOL_REGISTRY`; keep glass styling and light surfaces scoped to V7.
- Preview is enabled in development or an explicitly opted-in production build with `VITE_ENABLE_V7_PREVIEW=true`, and only on `/`. Production browser checks confirmed the V7 route, default-home fallback, and no V7 rendering on `/privacy?preview=v7`.
- `npm.cmd test` passed 371/371 before and after. The production build passed with existing `buffer` externalization and large-chunk warnings. Browser checks confirmed one H1, five categories, 18 registry-derived cards, search/Escape behavior, no horizontal overflow, and no visible undersized controls at eight widths.
- Production preview: `http://127.0.0.1:4179/?preview=v7`. Lighthouse, axe/WAVE, 200% text resize, text-spacing overrides, full keyboard traversal, and complete contrast review remain outstanding; see the V7 evidence table in `docs/main-page.md`.

## Task 10.1 — Variant 8 (Neo-Brutalism)

- Added the isolated V8 homepage under `src/components/v8/` and `src/components/VariantBrutal.jsx`; earlier variants and tool workflows remain unchanged.
- Decision: use flat off-white/yellow/blue/pink blocks, 4px black borders, offset black shadows, and bold uppercase typography; reuse shared `ToolSearch`, `ToolCard`, `TOOL_CATEGORIES`, `TOOL_REGISTRY`, `Footer`, and `AdSlot`.
- Kept the `?preview=v8` gate strictly development-only as specified. This conflicts with the request for a production-preview URL; human chose `dev_only`, so use `http://127.0.0.1:5180/?preview=v8`. Do not enable a production flag without further approval.
- `npm.cmd test` passed 371/371 before and after. `npm.cmd run build` passed with existing buffer externalization and large-chunk warnings; the strict dev-only V8 gate is disabled in that build. Browser verified one H1, five categories, 18 registry-backed cards, no horizontal overflow or visible undersized controls at eight widths, 16px search input, Escape dismissal, hover press effect, visible skip link, and default-route fallback.
- Lighthouse, axe/WAVE, 200% text resize, text-spacing overrides, full keyboard traversal, and complete contrast review remain outstanding; see the V8 evidence table in `docs/main-page.md`.

## Task 11.1 — Variant 9 (Minimalist Zen)

- Added the isolated V9 page under `src/components/v9/` and `src/components/VariantZen.jsx`; prior variant directories and working tool routes remain unchanged.
- Decision: use a white canvas, dark slate type, one forest-green accent, generous vertical spacing, thin separators, and unboxed registry-linked tools. Shared ToolSearch, ToolCard, Footer, and AdSlot retain established behavior.
- Kept `?preview=v9` strictly development-only after the human approved that gate behavior despite the requested production-preview URL. Local review URL: `http://127.0.0.1:5180/?preview=v9`; no production preview is available without changing the gate.
- `npm.cmd test` passed 371/371 before and after. `npm.cmd run build` passed with existing buffer externalization and large-chunk warnings. Browser checks verified one H1, five categories, 18 registry-backed tools, no overflow or visible targets below 44×44px at eight widths, 16px search, Escape dismissal, understated hover, and default/non-home fallback.
- Lighthouse, axe/WAVE, 200% text resize, text-spacing overrides, complete contrast review, and full keyboard traversal remain outstanding; see the V9 evidence table in `docs/main-page.md`.

## Task 12.1 — Variant 10 (Cyberpunk)

- Added the isolated V10 homepage under `src/components/v10/` and `src/components/VariantCyberpunk.jsx`; V1–V9 source folders remain unchanged.
- Decision: use a near-black terminal surface, subtle cyan grid, cyan/magenta/lime details, sharp neon-bordered cards, and monospace technical labels. Shared ToolSearch, ToolCard, registry, Footer, and below-content AdSlot are reused.
- The `?preview=v10` request specified dev-only access and a production preview URL, which conflict. The human approved strict dev-only behavior; local review URL is `http://127.0.0.1:5180/?preview=v10`. No production opt-in is enabled.
- The pre-change `npm.cmd test` exited successfully, but its output was not retained; the preceding recorded suite baseline was 371/371. Post-change `npm.cmd test` confirmed 371/371 (no regression against that baseline). `npm.cmd run build` passed with existing large-chunk warnings. Browser checks verified one H1, five categories, 18 registry-backed tools, no horizontal overflow or visible targets below 44×44px at eight widths, 16px search, Escape dismissal, neon card hover, skip link, and default/non-home route fallback.
- Lighthouse, axe/WAVE, 200% text resize, text-spacing overrides, full contrast review, and complete keyboard traversal remain outstanding; see the V10 evidence table in `docs/main-page.md`.

## Task 6.1 — Day 6 Cleanup Pass: Deploy Variant 6 & Unify Tool Pages

- Promoted the V6 composition to the root Home route, removed all remaining preview gates, preserved homepage SEO metadata, and corrected the native search input and category-link accessible names.
- Removed V1–V5 and V7–V10 component folders, their `Variant*.jsx` wrappers, and the 19 old variant-specific tests. Added 19 V6/homepage/tool-page regression checks and updated affected Home assertions; the complete suite remains at 371 tests.
- Moved the existing registry-backed search matcher into `src/components/v6/searchTools.mjs` so V6 retains the search behavior without depending on the removed V4 directory. Localized category labels, tool names, and search results continue to use existing language helpers.
- Applied warm light surfaces, rounded workspace/detail cards, responsive workflow cards, light treatment under a dark root preference, and 44px minimum visible controls to ToolPage and its shared navigation/footer shell. Existing PDF tool workflow children remain unchanged.
- Verification: `npm.cmd test` passed 371/371 before and 371/371 after; `npm.cmd run build` passed with the existing `buffer` externalization and large-chunk warnings; `git diff --check` passed. Browser checks confirmed `/` and `/merge` each have one H1 and one main landmark and no horizontal overflow at 320, 375, 414, 768, 1024, 1280, 1440, and 1920px. At 320px, visible active targets on both pages measured at least 44×44px; homepage search is 16px, its label and unique category names are present, OCR search results render, Escape clears and returns focus to search, the ad slot is not rendered, and the main content has no running animation. Sampled homepage text contrast ratios ranged from 7.19:1 to 12.65:1.
- The tracker previously used Task 6.1 for Variant 4; that historical section remains intact while the current `docs/status.md` row follows this packet's reused ID. Lighthouse, axe/WAVE, complete keyboard traversal, text-resize, and text-spacing audits were not run. Build command: `npm run build`.
