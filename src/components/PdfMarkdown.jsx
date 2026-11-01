import React, { useState } from 'react';
import { AlertCircle, FileText, Loader2, Upload } from 'lucide-react';
import { useToolExitGuard } from './ToolExitGuard';
import DownloadReadyCard from './DownloadReadyCard';
import { validateUnencryptedPdf } from '../lib/pdfValidation';
import pdfjsLib from '../lib/pdfjsClient';
import {
  buildMarkdownFromPages,
  createPdfFromMarkdown,
  parseMarkdownPageSelection
} from '../lib/markdownConversion.mjs';

const PdfMarkdown = () => {
  const [direction, setDirection] = useState('pdf-to-markdown');
  const [file, setFile] = useState(null);
  const [markdown, setMarkdown] = useState('');
  const [pageSelection, setPageSelection] = useState('');
  const [includePageBreaks, setIncludePageBreaks] = useState(true);
  const [pageSize, setPageSize] = useState('a4');
  const [orientation, setOrientation] = useState('portrait');
  const [fontSize, setFontSize] = useState('medium');
  const [outputBlob, setOutputBlob] = useState(null);
  const [outputName, setOutputName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const markOutputDownloaded = useToolExitGuard(Boolean(file || markdown.trim()), outputBlob);

  const clearOutput = () => {
    setOutputBlob(null);
    setOutputName('');
    setError('');
  };

  const selectPdf = async (selectedFile) => {
    clearOutput();
    setFile(null);
    if (!selectedFile) return;
    try {
      await validateUnencryptedPdf(selectedFile);
      setFile(selectedFile);
      setDirection('pdf-to-markdown');
    } catch (validationError) {
      console.error('Unable to validate PDF for Markdown conversion:', validationError);
      setError(validationError.message || 'Choose a valid, unencrypted PDF.');
    }
  };

  const selectMarkdownFile = async (selectedFile) => {
    clearOutput();
    setFile(null);
    if (!selectedFile) return;
    if (!/\.md$/i.test(selectedFile.name) && !['text/markdown', 'text/plain'].includes(selectedFile.type)) {
      setError('Choose a Markdown (.md) or plain-text file.');
      return;
    }
    try {
      setMarkdown(await selectedFile.text());
      setFile(selectedFile);
      setDirection('markdown-to-pdf');
    } catch (readError) {
      console.error('Unable to read Markdown file:', readError);
      setError('The selected Markdown file could not be read.');
    }
  };

  const extractPdfText = async () => {
    const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
    try {
      const selectedPages = parseMarkdownPageSelection(pageSelection, pdf.numPages);
      const pages = [];
      for (const pageIndex of selectedPages) {
        const page = await pdf.getPage(pageIndex + 1);
        const content = await page.getTextContent();
        const items = content.items.filter((item) => typeof item.str === 'string' && item.str.trim());
        if (items.length === 0) {
          pages.push('');
          continue;
        }
        const lines = [];
        for (const item of items) {
          const y = item.transform?.[5] ?? 0;
          let line = lines.find((candidate) => Math.abs(candidate.y - y) < 3);
          if (!line) {
            line = { y, items: [] };
            lines.push(line);
          }
          line.items.push(item);
        }
        pages.push(lines
          .sort((a, b) => b.y - a.y)
          .map((line) => line.items.sort((a, b) => a.transform[4] - b.transform[4])
            .map((item) => item.str).join(' ').replace(/\s+/g, ' ').trim())
          .filter(Boolean)
          .join('\n'));
      }
      const extracted = buildMarkdownFromPages(pages, { includePageBreaks });
      if (!extracted) {
        throw new Error('No selectable text was found in the selected pages. Scanned PDFs need OCR before they can be converted to Markdown.');
      }
      return extracted;
    } finally {
      await pdf.destroy();
    }
  };

  const convert = async () => {
    clearOutput();
    setIsProcessing(true);
    try {
      if (direction === 'pdf-to-markdown') {
        if (!file) throw new Error('Choose a PDF before converting.');
        const extracted = await extractPdfText();
        setMarkdown(extracted);
        setOutputBlob(new Blob([extracted], { type: 'text/markdown;charset=utf-8' }));
        setOutputName(`${file.name.replace(/\.pdf$/i, '')}_converted.md`);
      } else {
        const bytes = await createPdfFromMarkdown(markdown, { pageSize, orientation, fontSize });
        setOutputBlob(new Blob([bytes], { type: 'application/pdf' }));
        setOutputName(`${(file?.name || 'document.md').replace(/\.md$/i, '')}_converted.pdf`);
      }
    } catch (conversionError) {
      console.error('Unable to convert PDF and Markdown:', conversionError);
      setError(conversionError.message || 'The conversion could not be completed.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadOutput = (downloadFileName) => {
    if (!outputBlob) return;
    const url = URL.createObjectURL(outputBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = downloadFileName || outputName;
    link.click();
    markOutputDownloaded();
    window.setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  const changeDirection = (nextDirection) => {
    setDirection(nextDirection);
    setFile(null);
    clearOutput();
    setPageSelection('');
  };

  return (
    <div className="pdf-tool-workflow mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Conversion direction">
        <button type="button" aria-pressed={direction === 'pdf-to-markdown'}
          onClick={() => changeDirection('pdf-to-markdown')} className="pdf-editor-secondary-button">
          PDF to Markdown
        </button>
        <button type="button" aria-pressed={direction === 'markdown-to-pdf'}
          onClick={() => changeDirection('markdown-to-pdf')} className="pdf-editor-secondary-button">
          Markdown to PDF
        </button>
      </div>

      {direction === 'pdf-to-markdown' ? (
        <section className="space-y-4">
          <label className="block space-y-2 font-semibold" htmlFor="markdown-pdf-input">
            <span>Choose a PDF to convert</span>
            <input id="markdown-pdf-input" type="file" accept="application/pdf,.pdf"
              onChange={(event) => selectPdf(event.target.files?.[0])}
              className="block w-full rounded-xl border border-slate-300 p-3" />
          </label>
          {file && <p className="text-sm text-slate-600">{file.name}</p>}
          <label className="block space-y-2 font-semibold" htmlFor="markdown-page-selection">
            <span>Pages to convert (optional)</span>
            <input id="markdown-page-selection" type="text" value={pageSelection}
              onChange={(event) => setPageSelection(event.target.value)} placeholder="All pages or 1-3,5"
              className="block w-full rounded-xl border border-slate-300 p-3" />
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={includePageBreaks}
              onChange={(event) => setIncludePageBreaks(event.target.checked)} />
            Add Markdown separators between pages
          </label>
          <label className="block space-y-2 font-semibold" htmlFor="markdown-upload">
            <span>Or upload a Markdown file</span>
            <input id="markdown-upload" type="file" accept=".md,text/markdown,text/plain"
              onChange={(event) => selectMarkdownFile(event.target.files?.[0])}
              className="block w-full rounded-xl border border-slate-300 p-3" />
          </label>
        </section>
      ) : (
        <section className="space-y-4">
          <label className="block space-y-2 font-semibold" htmlFor="markdown-upload-pdf">
            <span>Upload a Markdown file, or paste and edit Markdown below</span>
            <input id="markdown-upload-pdf" type="file" accept=".md,text/markdown,text/plain"
              onChange={(event) => selectMarkdownFile(event.target.files?.[0])}
              className="block w-full rounded-xl border border-slate-300 p-3" />
          </label>
          <textarea value={markdown} onChange={(event) => { setMarkdown(event.target.value); clearOutput(); }}
            rows={12} aria-label="Markdown content" placeholder="# Document title"
            className="block w-full rounded-xl border border-slate-300 p-3 font-mono text-sm" />
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="space-y-2 font-semibold">Page size
              <select value={pageSize} onChange={(event) => setPageSize(event.target.value)}
                className="block w-full rounded-xl border border-slate-300 p-3">
                <option value="a4">A4</option><option value="letter">US Letter</option>
              </select>
            </label>
            <label className="space-y-2 font-semibold">Orientation
              <select value={orientation} onChange={(event) => setOrientation(event.target.value)}
                className="block w-full rounded-xl border border-slate-300 p-3">
                <option value="portrait">Portrait</option><option value="landscape">Landscape</option>
              </select>
            </label>
            <label className="space-y-2 font-semibold">Text size
              <select value={fontSize} onChange={(event) => setFontSize(event.target.value)}
                className="block w-full rounded-xl border border-slate-300 p-3">
                <option value="small">Small</option><option value="medium">Medium</option><option value="large">Large</option>
              </select>
            </label>
          </div>
        </section>
      )}

      {error && <div role="alert" className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
        <AlertCircle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" /><span>{error}</span>
      </div>}
      <button type="button" onClick={convert} disabled={isProcessing || (direction === 'pdf-to-markdown' && !file)}
        className="pdf-editor-primary-button inline-flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-60">
        {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : <FileText className="h-5 w-5" aria-hidden="true" />}
        {isProcessing ? 'Converting…' : 'Convert'}
      </button>
      {outputBlob && <DownloadReadyCard fileName={outputName} sizeBytes={outputBlob.size}
        onDownload={downloadOutput} downloadLabel="Download" />}
      <p className="flex items-start gap-2 text-sm text-slate-600">
        <Upload className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        Files are processed in your browser. PDF text extraction does not include scanned image text; use OCR first.
      </p>
    </div>
  );
};

export default PdfMarkdown;
