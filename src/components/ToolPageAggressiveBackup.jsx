import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Download, FileStack, Upload } from 'lucide-react';
import AdSlot from './AdSlot';
import FaqAccordion from './FaqAccordion';
import RelatedToolsCarousel from './RelatedToolsCarousel';
import { TOOL_REGISTRY } from './toolRegistry';
import { getLocalizedTool } from '../i18n/toolTranslations.mjs';
import { getLocalizedToolPage } from '../i18n/toolPageLocalization.mjs';
import { useLanguage } from '../i18n/useLanguage';

const MERGE_TOOL_CONTENT = {
  title: 'Merge PDF',
  description: 'Combine PDFs, select individual pages, and preview their final order.',
  detailPoints: {
    what: 'Combine complete PDFs or selected pages from multiple files into one document.',
    how: 'Preview, select, and arrange pages, then merge them in your browser.',
    result: 'A separate PDF in your chosen order, with optional source bookmarks and blank separator pages.'
  },
  steps: [
    'Choose two or more PDFs (up to five).',
    'Keep Merge all pages to combine complete documents in file order, or choose Select pages.',
    'In Select pages, choose and arrange pages in the order you want them to appear.',
    'Choose an output filename and available options.',
    'Select Merge PDFs, then review and download the completed document.'
  ],
  faqs: [
    ['How many PDFs can I merge?', 'You can select up to five unencrypted PDF files.'],
    ['Will the original files change?', 'No. The merge creates a separate PDF and leaves your original files unchanged.'],
    ['Can I choose and arrange individual pages?', 'Yes. Choose Select pages to add pages to the live output in your preferred order.'],
    ['Are my files uploaded?', 'No. Your PDFs are processed in this browser and are not sent to an external PDF-processing service.']
  ]
};

const AGGRESSIVE_UPLOAD_CLASSES = [
  '[&_.merge-pdf-upload-zone]:!min-h-[320px]',
  '[&_.merge-pdf-upload-zone]:!border',
  '[&_.merge-pdf-upload-zone]:!border-solid',
  '[&_.merge-pdf-upload-zone]:!rounded-3xl',
  '[&_.merge-pdf-upload-zone]:!border-[#dfd2c2]',
  '[&_.merge-pdf-upload-zone]:!bg-[#fbf8f3]',
  '[&_.merge-pdf-upload-zone]:!p-6',
  '[&_.merge-pdf-upload-zone:hover]:!bg-[#f6f1e8]',
  '[&_.merge-pdf-upload-content]:!min-h-[240px]',
  '[&_.merge-pdf-upload-content]:!flex-col',
  '[&_.merge-pdf-upload-content]:!justify-center',
  '[&_.merge-pdf-upload-content]:!gap-4',
  '[&_.merge-pdf-upload-content]:!text-center',
  '[&_.pdf-upload-icon]:!h-16',
  '[&_.pdf-upload-icon]:!w-16',
  '[&_.pdf-upload-icon]:!basis-16',
  '[&_.pdf-upload-icon]:!rounded-2xl',
  '[&_.pdf-upload-icon]:!bg-[#fff0dd]',
  '[&_.pdf-upload-icon_.text-blue-600]:!text-[#7c2d12]',
  '[&_.pdf-upload-icon_svg]:!h-8',
  '[&_.pdf-upload-icon_svg]:!w-8',
  '[&_.merge-pdf-upload-copy]:!flex-none',
  '[&_.merge-pdf-upload-copy_h3]:!text-xl',
  '[&_.merge-pdf-upload-copy_p]:!text-base',
  '[&_.merge-pdf-upload-button]:!ml-0',
  '[&_.merge-pdf-upload-button]:!min-h-11',
  '[&_.merge-pdf-upload-button]:!w-full',
  '[&_.merge-pdf-upload-button]:!rounded-2xl',
  '[&_.merge-pdf-upload-button]:!bg-[#9a3412]',
  '[&_.merge-pdf-upload-button]:!px-6',
  '[&_.merge-pdf-upload-button]:!text-white',
  '[&_.merge-pdf-upload-button:hover]:!bg-[#7c2d12]',
  '[&_.merge-pdf-upload-button:focus-visible]:!outline',
  '[&_.merge-pdf-upload-button:focus-visible]:!outline-[3px]',
  '[&_.merge-pdf-upload-button:focus-visible]:!outline-offset-2',
  '[&_.merge-pdf-upload-button:focus-visible]:!outline-[#7c2d12]',
  '[&_.merge-process-button:not(:disabled)]:!bg-[#9a3412]',
  '[&_.merge-process-button:not(:disabled):hover]:!bg-[#7c2d12]',
  '[&_.merge-process-button:focus-visible]:!outline',
  '[&_.merge-process-button:focus-visible]:!outline-[3px]',
  '[&_.merge-process-button:focus-visible]:!outline-offset-2',
  '[&_.merge-process-button:focus-visible]:!outline-[#7c2d12]',
  'sm:[&_.merge-pdf-upload-button]:!w-auto'
].join(' ');

const ToolPageAggressive = ({ tool, children }) => {
  const { language, translate } = useLanguage();
  const localizedTool = getLocalizedTool(
    language,
    TOOL_REGISTRY.find((item) => item.id === tool)
  );
  const pageTitle = localizedTool?.name || MERGE_TOOL_CONTENT.title;
  const pageDescription = localizedTool?.description || MERGE_TOOL_CONTENT.description;
  const localizedContent = getLocalizedToolPage(
    language,
    tool,
    localizedTool,
    MERGE_TOOL_CONTENT,
    {
      title: pageTitle,
      rule: '2–5 unencrypted PDF files',
      ruleKey: 'pdf2To5',
      infoTitle: pageTitle,
      info: pageDescription
    }
  );
  const ToolIcon = localizedTool?.icon || FileStack;

  useEffect(() => {
    const previousTitle = document.title;
    const description = document.querySelector('meta[name="description"]');
    const previousDescription = description?.content;
    document.title = `${pageTitle} | PDF Merge Pro`;
    if (description) description.content = pageDescription;

    return () => {
      document.title = previousTitle;
      if (description && previousDescription !== undefined) {
        description.content = previousDescription;
      }
    };
  }, [pageDescription, pageTitle]);

  return (
    <article className="v6-tool-page aggressive-tool-page mx-auto w-full max-w-[1440px] space-y-5">
      <header className="tool-detail-hero v6-tool-detail-hero !rounded-2xl !border !border-[#d7b79a] !bg-[#fffaf3] !p-5">
        <div className="flex items-center gap-4">
          <span className="tool-detail-icon !rounded-2xl" aria-hidden="true">
            <ToolIcon className="h-6 w-6" />
          </span>
          <div className="min-w-0">
            <h1 className="tool-detail-title !m-0 !text-3xl">{pageTitle}</h1>
            <p className="tool-detail-description !mt-1">{pageDescription}</p>
          </div>
        </div>
      </header>

      <section
        aria-labelledby="aggressive-tool-workspace-heading"
        className="min-w-0 rounded-2xl border border-[#d7b79a] bg-[#fffaf3] p-3 shadow-sm sm:p-5"
      >
        <h2 id="aggressive-tool-workspace-heading" className="sr-only">
          {pageTitle} {translate('toolWorkspace')}
        </h2>
        <div className={`aggressive-upload-workflow ${AGGRESSIVE_UPLOAD_CLASSES}`}>
          {children}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <section
          aria-labelledby="aggressive-how-to-heading"
          className="v6-tool-info-card !rounded-2xl !border !border-[#65879b] !bg-[#edf5f8] !p-5 lg:col-span-2"
        >
          <h2 id="aggressive-how-to-heading" className="mb-3 text-xl font-bold text-slate-800">
            {translate('howToUse')} {pageTitle}
          </h2>
          <ol className="v6-tool-steps">
            {localizedContent.steps.map((step) => <li key={step}>{step}</li>)}
          </ol>
        </section>

        <section
          aria-labelledby="aggressive-how-it-works-heading"
          className="v6-tool-info-card !rounded-2xl !border !border-[#6d8b72] !bg-[#eef4ea] !p-5"
        >
          <h2 id="aggressive-how-it-works-heading" className="mb-3 text-xl font-bold text-slate-800">
            {translate('howItWorks')}
          </h2>
          <ol className="grid gap-3 text-base leading-relaxed text-slate-600">
            <li className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#9a3412] text-sm font-bold text-white" aria-hidden="true">
                1
              </span>
              <Upload className="h-5 w-5 shrink-0 text-[#9a4c24]" aria-hidden="true" />
              <span>{translate('uploadToTool')}</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#9a3412] text-sm font-bold text-white" aria-hidden="true">
                2
              </span>
              <ToolIcon className="h-5 w-5 shrink-0 text-[#9a4c24]" aria-hidden="true" />
              <span>{translate('processDocumentInBrowser')}</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#9a3412] text-sm font-bold text-white" aria-hidden="true">
                3
              </span>
              <Download className="h-5 w-5 shrink-0 text-[#9a4c24]" aria-hidden="true" />
              <span>{translate('download')}</span>
            </li>
          </ol>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            {translate('filesStayInBrowser')}{' '}
            <Link className="font-semibold text-[#7c2d12] underline hover:text-[#57210c]" to="/privacy">
              {translate('privacyPolicy')}
            </Link>
            .
          </p>
        </section>
      </div>

      {localizedContent.faqs.length > 0 && (
        <section aria-labelledby="aggressive-tool-faq-heading" className="space-y-3">
          <h2 id="aggressive-tool-faq-heading" className="text-xl font-bold text-slate-800">
            {translate('frequentlyAskedQuestions')}
          </h2>
          <FaqAccordion items={localizedContent.faqs} />
        </section>
      )}

      <RelatedToolsCarousel currentToolId={tool} />
      <AdSlot placement="toolSupportingContent" />
    </article>
  );
};

export default ToolPageAggressive;
