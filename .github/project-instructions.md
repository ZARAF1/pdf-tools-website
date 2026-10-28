# Project Instructions — PDF Utility Website

## 1. Project identity and workspace boundary

- Project root: `C:\Projects\pdf`.
- All coding, commands, tests, and file changes for this project must take place inside this project unless the user explicitly approves something else.
- Work on the existing application. Do not scaffold a new project, replace the app wholesale, or move the project to another directory.
- Treat the current source code and verified test results as authoritative. Any architectural details written in status notes are useful context, but verify them against the actual files before relying on them.
- The user is building the site incrementally, one PDF tool at a time. Do not try to implement every planned tool in one task unless explicitly asked.

## 2. Required memory and continuity workflow

At the beginning of EVERY new session, before modifying application files:

1. For Copilot work, use `.github/copilot-instructions.md` as the concise entry point; it directs Copilot to this procedure and the appropriate project documents.
2. Read this complete file: `.github/project-instructions.md`.
3. Read `.github/project-status.md` completely. If it is missing, create it only as part of the user's authorized setup task; otherwise do not recreate or overwrite an existing status file blindly.
4. Read `.github/TOOL_DEVELOPMENT_GUIDELINES.md` before PDF-tool or shared-component work. Read `.github/adsense-readiness-checklist.md` when the task affects its recorded accessibility, usability, site-quality, SEO, privacy, advertising, or tool-flow evidence.
5. Inspect the root OpenCode project configuration and verify its `instructions` paths. Inspect other existing Markdown files only when their content may be affected; do not create competing instruction documents.
6. Review the current session's available conversation/compaction summary and recent conversation where available. Extract the user's goal, decisions, unfinished work, and constraints. Do not claim to have accessed summaries or old sessions unless you actually did.
7. If prior OpenCode sessions are discoverable, inspect the session list and identify recent sessions relevant to this project. Use available session history or summaries where practical. Do not delete sessions, export sensitive information, or assume inaccessible history is available.
8. Inspect the current Git status and recent commits when Git is initialized. Use the working tree and source files to verify any remembered claims. Never reset, revert, commit, or discard user changes without explicit permission.
9. Inspect the relevant source files and `package.json` before planning a change.
10. Before coding, briefly state what you understand about the current state, the latest completed work, the next task, and any uncertainty or conflict between the status file, session summary, Git history, and actual files. Ask only if a real decision or permission is needed; otherwise make a cautious best effort.

At the end of EVERY meaningful implementation session:

1. Update `.github/project-status.md` so a future session can continue without depending on this conversation.
2. Record actual outcomes only: files changed, completed functionality, commands run and their results, manual tests performed, failures, known limitations, and the next concrete step. Distinguish verified facts from plans and unverified claims.
3. Keep the status document concise and current. Put the current state and next step near the top. Maintain a short dated change log; summarize older entries instead of allowing the file to grow without limit. Do not delete important decisions or unresolved issues.
4. If Git is in use, mention relevant commit IDs or changed-file summaries when available. Never make a commit unless asked.
5. Reread the updated status file and verify that it accurately describes the saved files and validation results.
6. In your final response, tell the user the status file was updated (only if it really was), summarize the work, list changed files and checks, and identify the next step.

Important: OpenCode's internal compaction summary is useful but may be lossy and may not follow the user into a separate new session. The project status file, current code, test results, and Git history are the durable continuity sources. Never promise perfect or permanent memory; use and reconcile these sources on every session.

## 3. Make the instructions and status load automatically

The project configuration should explicitly load the project instructions, current status, and permanent tool-development guidelines on each new OpenCode session. Include the implementation checklist when supported so tool and site-audit work can record evidence. Inspect the existing project configuration first (`opencode.json`, `opencode.jsonc`, or equivalent supported project config).

- Preserve every existing setting and merge the following paths into the existing `instructions` array rather than replacing the whole configuration:
  - `.github/project-instructions.md`
  - `.github/project-status.md`
  - `.github/TOOL_DEVELOPMENT_GUIDELINES.md`
  - `.github/adsense-readiness-checklist.md`
- If the project has no OpenCode project config, create the supported project config at the project root with the correct schema and those instruction paths.
- Do not change global OpenCode settings or provider/model settings as part of ordinary website tasks.
- Validate the config syntax after editing. If the current OpenCode version does not support this mechanism, explain the limitation and propose the smallest safe alternative.
- Configuring the paths makes their contents available as instructions, but still explicitly reread the status file and relevant checklist entries at session start so the current state is actively considered.
- Keep the documentation roles distinct: this file contains durable project rules; `.github/copilot-instructions.md` is only Copilot's short reading guide; `.github/project-status.md` records current implementation, evidence, limitations, and next steps; `.github/TOOL_DEVELOPMENT_GUIDELINES.md` contains reusable PDF/shared-UI standards; and `.github/adsense-readiness-checklist.md` is the evidence log for its listed checks.
- Update `.github/project-status.md` after every meaningful implementation attempt. Update the reusable guidelines only when a general standard changes, and update checklist evidence only for checks relevant to the work. Modify other Markdown files only when their contents are affected; avoid copying the same rules into multiple documents.

## 4. Project-specific baseline (verify against files)

The following is based on earlier user-reported inspection, not a substitute for checking the current files:

- Existing project directory: `C:\Projects\pdf`.
- The project is a React website. `react-router-dom` was installed; `pdf-lib`, `react-dropzone`, and `framer-motion` were reported as used by the current PDF merger.
- `src/components/PdfMerger.jsx` supports up to five PDF files, validates the selected PDFs before adding them, and supports reordering before merging. The merge and download flow remains browser-side.
- Use the central registry as the source for active category membership and ordering: Organize, Convert, Edit & Sign, Protect & Repair, and Extract & Analyze. Assign Image to PDF and PDF to Images to Convert. Add Image Tools only when at least one genuine image-manipulation tool is implemented; do not show empty categories, placeholders, or duplicates.
- `src/App.jsx` was reported to route `/` to Home and `/merge` to `PdfMerger`, with placeholder routes for `/split`, `/rotate`, `/protect`, and `/image-to-pdf`. Verify current route states before relying on this list.
- `src/components/Home.jsx` was reported to contain a malformed closing tag `</div}` inside `ToolCard`; verify whether it remains before changing it.
- The user wants a polished, professional, responsive PDF tools website, with fully working tools and clearly marked nonfunctional “Coming Soon” cards.
- A PDF-to-Word card is planned in addition to Split PDF, Rotate PDF, Protect PDF, Image to PDF, and the existing Merge PDF tool. Other planned tools include Compress PDF, PDF to JPG/PNG, Watermark PDF, Unlock PDF, and Organize PDF. Treat these as plans, not evidence that the tools exist or work.

## 5. Scope and user approval

- Implement only the requested task and the minimum supporting changes.
- Do not modify global settings, files outside `C:\Projects\pdf`, credentials, system permissions, or environment variables without explicit approval.
- Do not install dependencies or introduce a remote conversion service unless the user has approved it. If a new dependency is genuinely required, explain the reason, browser compatibility, license, and alternatives, then ask first.
- Do not add external upload APIs or send PDFs/passwords to a server unless the user explicitly approves this architecture.
- Do not remove existing features, design choices, files, routes, or dependencies just because a different approach seems easier. Inspect first and preserve unrelated work.
- Never claim a feature is working merely because a page or button exists. A tool is complete only when the underlying operation generates a valid output and has been tested to a reasonable degree.

## 6. File operation discipline

- Read the complete relevant file immediately before editing it.
- If a file exists, edit or replace it; do not run a create-file operation against that existing path.
- Before using targeted text replacement, confirm that the exact old text appears in the current file. Avoid fragile replacements against large JSX/TSX blocks.
- Never use truncated old-text strings or placeholders such as `...`, `rest of file`, or omitted code in a replacement operation.
- If a tool reports `path already exists`, stop trying to create that path and switch to an appropriate edit/update operation.
- If a tool reports `No match found`, reread the current file, inspect the exact attempted match, and reassess. Do not retry the same failing input.
- Prefer a verified whole-file replacement for a small source file when the tool supports it and you have prepared the complete valid replacement. Do not destroy unique existing behaviour by replacing a file without understanding it.
- Make changes sequentially, one file at a time. Do not make concurrent competing edits to the same file.
- After each write, reread the saved file and verify the intended content is present. If the saved file differs from the intended result, stop and diagnose.
- Stop after two failed attempts caused by the same unresolved problem. Report the exact operation, path, error, and what was attempted; do not loop.

### 6.1 Status updates and file-operation recovery

- Always read the current `.github/project-status.md` from disk before planning or performing a status update. Never rely only on a remembered, cached, or previously generated copy.
- Update the status after every meaningful implementation attempt, including failed, partial, or blocked attempts. Record actual changes, the exact failure where useful, tests that were run and their results, unverified checks, unresolved issues, and the next concrete step.
- Distinguish clearly between **implemented**, **build-verified**, and **functionally tested**. Do not label a feature as working or verified merely because its files were written or the build passed.
- Prefer appending a concise, dated session entry with a supported shell operation (for example, PowerShell `Add-Content`) when a small status update is sufficient. Verify the status file exists and confirm the working directory before writing. Avoid `oldString`/`newString` replacement for routine status updates when an append-only operation is suitable.
- Before appending, inspect the recent entries and check whether the same update has already been recorded. Append a given update only once; do not create duplicate sections or duplicate log entries.
- Keep the current state and next step near the top of the status file, as required in Section 2. If the status file needs a full rewrite or consolidation to remain concise, prepare the complete updated Markdown first, preserve useful history and unresolved issues, write it using a supported whole-file operation, then reread it to verify persistence and accuracy.
- After a `Could not find oldString` or `No match found` error, stop that edit attempt, reread the current file and the exact attempted match, and choose a different supported method. Never retry identical arguments blindly.
- After a `path already exists` error, verify the exact working directory, destination path, and filesystem state; then edit or update the existing file instead of trying to create it again.
- If a write operation reports success, still verify that the intended file exists at the exact path, reread the saved content, and confirm the change persisted. A tool's success message alone is not proof.
- If the same underlying file operation or unresolved cause fails twice, stop. Report the exact tool/operation, path, error, prior attempts, and what evidence is available. Do not enter an automatic retry loop or keep making speculative changes.
- Never claim that a write, status update, test, or feature is successful without evidence from the saved files or actual command/test output.

## 7. Development workflow

1. Inspect the existing architecture, relevant components, routing, styles, dependencies, and scripts before changing code.
2. State the planned minimal change and files involved.
3. Implement one file at a time.
4. Validate the written source after each edit.
5. Use the project's existing package manager and scripts. Inspect `package.json` before selecting a command. On Windows PowerShell, if `npm` is blocked by execution policy, use `npm.cmd` rather than changing execution-policy settings.
6. Run the relevant build, lint, or test checks that are available. Do not install packages simply to run a check without approval.
7. Test actual user-visible behaviour when a browser/test setup is available. If manual browser verification is unavailable, explicitly say so and do not claim it was performed.
8. For PDF operations, verify the output file itself: it should open, contain the intended pages/content, and have the expected protection/format. Do not fake success with a renamed file or a cosmetic UI state.
9. Preserve client-side processing where feasible. Clearly disclose limitations for tasks such as scanned PDF OCR and complex PDF-to-Word layout conversion.
10. Recheck the diff and ensure unrelated files have not been changed.

## 8. PDF tool quality and safety

- Preserve the existing merger unless the user explicitly requests a change to it.
- Reuse suitable installed dependencies where practical; check actual APIs and browser compatibility rather than guessing.
- Validate file type, page ranges, selections, empty input, unsupported encryption, and large files. Provide usable errors and a reset/retry path.
- Keep the original file unchanged and generate a separate output.
- Do not claim PDF password protection unless real encryption is applied and independently verified by opening the result with correct and incorrect passwords. Do not implement password cracking.
- Do not promise a smaller compressed file; measure the actual output size.
- Do not promise faithful Word conversion for complex layouts or scanned pages unless tested. Explain when OCR is required.
- “Coming Soon” tools must not pretend to work or link to nonfunctional operations.
- Reserve AdSense space only if requested; never insert fake ad content or claim AdSense is configured when it is not.

## 9. Git and recovery

- Check `git status` before a substantial change if Git is initialized.
- Never use destructive commands such as `git reset --hard`, `git clean -fd`, or broad deletion commands without explicit user approval.
- Do not overwrite user changes with generated content. If a file has existing modifications, inspect and preserve them.
- Recommend a checkpoint commit before substantial changes, but do not create commits without permission.

## 10. Required final response for every implementation task

Provide a concise report containing:

- What was implemented.
- Files changed and why.
- Exact validation commands and results.
- What was actually tested manually versus not tested.
- Known limitations or blockers.
- The updated project status and the next recommended step.

Be direct and truthful. Never invent tool success, test results, files, routes, dependency state, previous conversations, or capabilities.

## 11. Persistent tool and site-quality standards

- Before creating, scaffolding, modifying, redesigning, or repairing any PDF tool, read `.github/TOOL_DEVELOPMENT_GUIDELINES.md` and the relevant tool section in `.github/adsense-readiness-checklist.md`.
- Treat `.github/TOOL_DEVELOPMENT_GUIDELINES.md` as the authoritative reusable standard for tool UX, accessibility, content, metadata, related links, privacy explanations, testing, and safe advertising.
- Read `.github/adsense-readiness-checklist.md` when performing site audits, advertising/SEO/privacy work, or tool-flow changes. Update its evidence and status as checks are performed; do not mark untested items complete.
- Read `.github/project-status.md` at the start of each session. Update it after every meaningful implementation session with verified changes, checks, blockers, and next actions; reread it before finishing.
- Update the tool-development guidelines only when the user's requirements or verified project-wide standards change; keep the checklist current as the implementation record.
