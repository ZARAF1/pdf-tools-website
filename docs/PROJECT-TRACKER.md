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

## Findings to Fix (F1–F8)

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

## Resolved

| ID | Item | Resolution | Resolved on |
|----|------|------------|-------------|
| Q1 | Skip-link destination | Change the target to `#main-content`. | Task 1.6 |
| Q2 | 20-language indexing strategy | Noindex `ar`, `hi`, `ja`, `ko`, and `zh-CN` during AdSense submission pending native QA. | Task 1.6 |
| Q3 | Native-language QA schedule | Schedule QA approximately two weeks after approval. | Task 1.6 |
