# Task status tracker

| Task | Title | Status | npm test | axe | LH Mobile Perf | LH Mobile A11y | Screenshots | Notes |
|------|-------|--------|----------|-----|----------------|----------------|-------------|------|
| 1.1 | Scaffolding | Complete | 352/352 | — | — | — | — | Initial docs scaffold created. |
| 1.2 | Current Homepage Audit | Fixed — Ready for Review | 352/352 | — | — | — | — | Homepage component tree, preserved tool routes, and audit sections reconciled. |
| 1.3 | AdSlot Audit | Ready for Review | 352/352 | — | — | — | — | Read-only audit completed; no code changes. |
| 1.4 | i18n Quality Audit | Ready for Review | 352/352 | — | — | — | — | Read-only audit completed; no translation content or app code changed. |
| 1.5 | Baseline Metrics | Ready for Review | 352/352 | WAVE: 0 errors; 28 contrast errors | 92 | 100 | 8/8 | Local preview baseline: Lighthouse SEO 92, Best Practices 100; axe injection failed, WAVE used; console 0 errors/warnings. |
| 2.1 | Design Tokens | Ready for Review | 352/352 | — | — | — | — | Added theme-aware Tailwind/CSS tokens; 27 contrast pairs checked; production build passed with existing warnings. |
| 2.2 | Interactive Primitives | Ready for Review | 352/352 | — | — | — | Keyboard focus captured | Added five accessible UI primitives; keyboard, target-size, responsive-fixture, and contrast evidence recorded in `docs/main-page.md`; production build passed with existing warnings. |
| 2.3 | Typography & Spacing | Ready for Review | 352/352 | — | — | — | 2 browser captures | `npm.cmd test` passed 352/352 before (1,702.5382ms) and after (1,685.2089ms); audit findings and emulated 200% reflow evidence are recorded in `docs/main-page.md`. |
| 2.4 | Dark Mode | Ready for Review | 352/352 | — | — | — | — | Audited 17 documented token contrast pairs and Home/Merge/Privacy in dark mode; added `aria-pressed` with a stable toggle name. `npm.cmd test` passed 352/352 before and after; production build passed with existing warnings. |
| 2.5 | Design System Summary | Ready for Review | 352/352 | — | — | — | — | Canonical light/dark palette, typography, spacing, radii, shadows, primitive usage, and 11 variant rules documented in `docs/main-page.md`; 5 design questions await human decision. `npm.cmd test` passed 352/352 before (1,326.2039ms) and after (1,257.0957ms). Documentation-only; no code changed. |
| 3.1 | Variant 1 — Scannable Grid Homepage | In Progress — awaiting user input | 358/358 | Pending — human WAVE scan | — | — | — | Dev-only preview: `http://localhost:5173/?preview=v1`. Eight widths, input contrast/size, visible targets, search, theme persistence, and focus visibility verified; hover rendering and Lighthouse/WAVE evidence remain pending. |
| 3.2 | Variant 1 | Planned | — | — | — | — | — | — |
| 3.3 | Variant 1 | Planned | — | — | — | — | — | — |
| 3.4 | Variant 1 | Planned | — | — | — | — | — | — |
| 4.1 | Variant 2 — Bold Editorial Homepage | Ready for Review | 363/363 | Not run | — | — | — | 18 registry-derived tool cards; responsive checks passed at eight widths; production preview `http://127.0.0.1:4174/?preview=v2` requires opt-in build flag. |
| 4.2 | Variant 2 | Planned | — | — | — | — | — | — |
| 4.3 | Variant 2 | Planned | — | — | — | — | — | — |
| 4.4 | Variant 2 | Planned | — | — | — | — | — | — |
| 5.1 | Variant 3 — Apple Bento Box | Ready for Review | 367/367 | Not run | — | — | — | 18 registry-derived cards; responsive checks passed at eight widths; production preview `http://127.0.0.1:4175/?preview=v3` requires `VITE_ENABLE_V3_PREVIEW=true`. Human axe/WAVE and Lighthouse scans remain outstanding. |
| 5.2 | Variant 3 | Planned | — | — | — | — | — | — |
| 5.3 | Variant 3 | Planned | — | — | — | — | — | — |
| 5.4 | Variant 3 | Planned | — | — | — | — | — | — |
| 6.1 | Day 6 Cleanup Pass — Deploy Variant 6 & Unify Tool Pages | Ready for Review | 371/371 before and after | Not run | Not run | Not run | — | Promoted V6 to `/`, fixed search/category accessible names, removed V1–V5/V7–V10 sources and tests, and applied warm light styling to ToolPage. Browser checks: `/` and `/merge` at 320–1920px with no horizontal overflow; one H1/main each; visible targets at 320px were at least 44×44px. Search dismissal works. Build passes with existing buffer/chunk warnings; Lighthouse and axe/WAVE remain unrun. |
| 6.1b | ToolPage V6 Layout Fix & Hide Sidebar | Ready for Review | 371/371 before and after | Not run | Not run | Not run | — | Tool routes hide the sidebar and use a V6 contextual top header with Back to All Tools, tool name, and search. Workspace upload area and instruction cards use the warm-light Bento styling with consistent 32px spacing. Browser verified `/merge` at eight widths: no horizontal overflow, sidebar absent, one H1/main, and visible back/search targets at least 44px high; dark-root surfaces remain warm/light. Excel tool-route title and retained category sidebar also verified. Build passes with existing buffer/chunk warnings; Lighthouse and axe/WAVE remain unrun. |
| 6.1c | Apply V6 Visual Styling to Shared Tool Components | Ready for Review | 371/371 before and after | Not run | Not run | Not run | — | Shared file actions, download controls, upload states, and workspace controls use warm V6 styling and visible blue focus rings; tool behavior and the accessible dropzone hook remain unchanged. Browser verified `/merge` at 320–1920px with no horizontal overflow, warm drag-active styles under a dark root, and a visible keyboard focus outline. Production build passes with existing buffer/chunk warnings; Lighthouse and axe/WAVE remain unrun. |
| 6.1d | Skill-Driven ToolPage Layout & Search Focus Ring | Ready for Review | 371/371 before and after | Not run | Not run | Not run | — | Tool pages use a full-width hero, 2/3 workspace, stacked 1/3 instructions, and full-width FAQ/related content. Header search uses a terracotta focus ring and 16px text; expanded mobile search stays within the viewport. Browser verified 320–1920px layouts, no horizontal overflow, one H1/main, and correct desktop workspace/instructions placement. Build passes with existing buffer/chunk warnings; Lighthouse and axe/WAVE remain unrun. |
| 6.1e | Restore Dashboard Layout | Reverted — Ready for Review | 371/371 before and after | Not run | Not run | Not run | — | Restored `src/components/ToolPage.jsx` byte-for-byte from `ToolPageDashboard.jsx` (matching SHA-256). Browser verified `/merge` at 1440px with a 899px workspace beside 438px instructions (2.05:1), one H1/main, and no horizontal overflow. Build passes with existing buffer/chunk warnings; Lighthouse and axe/WAVE remain unrun. This row supersedes the earlier 6.1e empty-state result below in the tracker. |
| 6.2 | Selection & Final Homepage | Planned | — | — | — | — | — | — |
| 6.3 | Selection & Final Homepage | Planned | — | — | — | — | — | — |
| 6.4 | Selection & Final Homepage | Planned | — | — | — | — | — | — |
| 7.1 | Variant 5 — Vibrant Consumer Homepage | Ready for Review | 371/371 | Not run | Not run | Not run | — | Opt-in production preview: `http://127.0.0.1:4177/?preview=v5` (`VITE_ENABLE_V5_PREVIEW=true`); 18 registry-backed tools, eight responsive widths, search/navigation and default-home fallback verified. Lighthouse and axe/WAVE remain pending. |
| 7.2 | SEO & Performance | Planned | — | — | — | — | — | — |
| 7.3 | SEO & Performance | Planned | — | — | — | — | — | — |
| 7.4 | SEO & Performance | Planned | — | — | — | — | — | — |
| 8.1 | Variant 6 — True Light-Mode Editorial (Bento Box) | Ready for Review | 371/371 | Not run | Not run | Not run | — | Opt-in production preview: `http://127.0.0.1:4178/?preview=v6` (`VITE_ENABLE_V6_PREVIEW=true`); 18 registry-backed tools, eight responsive widths, forced-light dark-root check, search dismissal, default-home fallback, and OCR navigation verified. Lighthouse and axe/WAVE remain pending. |
| 8.2 | TBD | Planned | — | — | — | — | — | — |
| 8.3 | TBD | Planned | — | — | — | — | — | — |
| 8.4 | TBD | Planned | — | — | — | — | — | — |
| 9.1 | Variant 7 — Glassmorphism Homepage | Ready for Review | 371/371 | Not run | Not run | Not run | — | Opt-in production preview: `http://127.0.0.1:4179/?preview=v7` (`VITE_ENABLE_V7_PREVIEW=true`); 18 registry-derived tool cards, eight responsive widths, 44px targets, search/Escape, and unchanged default homepage verified. Lighthouse and axe/WAVE remain pending. |
| 9.2 | TBD | Planned | — | — | — | — | — | — |
| 9.3 | TBD | Planned | — | — | — | — | — | — |
| 10.1 | Variant 8 — Neo-Brutalism Homepage | Ready for Review | 371/371 | Not run | Not run | Not run | — | Dev-only preview: `http://127.0.0.1:5180/?preview=v8`; 18 registry-derived tool cards, eight responsive widths, 44px targets, search/Escape, hard-shadow hover and unchanged default homepage verified. Production build passes, but the strict dev-only gate intentionally excludes V8 from production builds. Lighthouse and axe/WAVE remain pending. |
| 10.2 | TBD | Planned | — | — | — | — | — | — |
| 10.3 | TBD | Planned | — | — | — | — | — | — |
| 10.4 | TBD | Planned | — | — | — | — | — | — |
| 11.1 | Variant 9 — Minimalist Zen Homepage | Ready for Review | 371/371 | Not run | Not run | Not run | — | Dev-only preview: `http://127.0.0.1:5180/?preview=v9`; 18 registry-derived tools, eight widths, 44px targets, search/Escape, understated hover, and unchanged default homepage verified. Production preview unavailable by approved dev-only gate. Lighthouse and axe/WAVE remain pending. |
| 12.1 | Variant 10 — Cyberpunk Neon Homepage | Ready for Review | 371/371 after; 371 prior recorded baseline | Not run | Not run | Not run | — | Pre-change `npm test` exited successfully, but its count output was not retained; prior recorded baseline was 371/371 and post-change run confirmed 371/371. Dev-only preview: `http://127.0.0.1:5180/?preview=v10`; 18 registry-backed tools, eight widths, 44px visible targets, 16px search, Escape, neon hover, and default-route fallback verified. Production preview unavailable by approved dev-only gate. Lighthouse and axe/WAVE remain pending. |
| 1.6 | Project Tracker | Ready for Review | 352/352 | — | — | — | — | Created `docs/PROJECT-TRACKER.md` with decisions, amendments, findings, handover backlog, and Task 1.5 baseline. |
