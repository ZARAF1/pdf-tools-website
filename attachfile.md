# Attachment Section — Empty State

This document describes how the PDF attachment section looks before any files have been selected.

## Layout

The section is a large, rounded panel with a dark navy surface, a thin bright-blue outline, and a soft blue glow. It contains three stacked areas:

1. **Attachment heading:** A blue rounded-square upload icon sits to the left of the heading, “Attach PDFs Here.” Beneath it, smaller blue text states the requirement: “2–5 unencrypted PDF files.” A subtle horizontal divider separates the heading from the content below.
2. **Tool guidance:** A rounded, slightly lighter card is inset from the panel edges. It has the heading “Merge PDF” and the description: “Merge whole files, or choose individual pages and arrange their final output order.”
3. **File chooser:** A wide, rounded drop zone with a dashed blue border. An upload icon appears on the left, followed by “Choose or drop PDFs to merge” and the helper text “Combine PDFs into a single document in your chosen order.” A blue “Choose Files” button is aligned on the right.

## Empty-state behavior

No selected-file rows or file-specific actions appear in this state. The drop zone invites the user to click **Choose Files** or drop PDFs into it. After files are selected, the file list and its available actions can take the place of this empty-state chooser.

## When files are attached

The attachment heading and the **Merge PDF** guidance card remain at the top. The empty drop zone is replaced by the file list, and the merge settings appear beneath it.

### Files to Merge

A rounded, inset panel is headed **Files to Merge**, with helper text prompting the user to drag files to arrange their order. A count badge at the upper right shows the number selected and the five-file limit (for example, **Files: 4/5**).

Each PDF appears as a horizontal rounded row. From left to right, the row shows its two-digit position, a document icon, the filename, and its page count and file size. Controls on the right let the user move the file up or down, replace it, or remove it. The first file’s up control and the last file’s down control are disabled when those moves are not possible. An **Add More Files (n/5)** button is aligned at the bottom right of the list.

### Settings > Selection > Preview

A separate rounded panel follows the file list. Its heading says **Settings > Selection > Preview**, with a short description about combining PDFs and customizing the output. Below it are two mode buttons: **Merge All** and **Select Pages**. The active mode is highlighted.

### Choose Settings

This subsection is a darker inset card with a blue-accented **Choose Settings** heading and a short explanation. Its controls are arranged in two columns on wider screens:

- **Output Filename:** A text field prefilled with a PDF name, followed by a note that the `.pdf` extension is added automatically when needed.
- **Page Size:** A dropdown offering original page sizes, US Letter, or A4, with supporting text explaining how fitting works.
- **Bookmark Each Source File:** A checkbox option with a brief explanation.
- **Insert a Blank Page Between Source Files:** A checkbox option with a note that it applies in Select Pages mode when the output changes source files.

### Select Pages

This subsection appears when **Select Pages** mode is active. Its header explains that clicking page previews adds them to the output in order, and a count at the upper right shows how many pages are selected. Each attached PDF gets its own bordered preview group, labeled with its filename and page/selection counts. **Select All** and **Clear** controls sit beside the group’s **Preview** label. Page thumbnails are displayed as tiles with page numbers; selecting a tile adds or removes it from the output.

### Live Output Preview

Below the page groups is a bordered **Live Output Preview** subsection. Its description says pages are shown in output order and can be dragged or moved with buttons. A count at the upper right reports the output page total. Before any pages are selected, a centered message invites the user to select a page above. Once pages are selected, the preview shows ordered page thumbnails, their source filename and page number, and controls for reordering or removing pages. When enabled, blank-page separators are shown between source files.
