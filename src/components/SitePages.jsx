import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpenText, CircleHelp, Info, Mail, ShieldCheck } from 'lucide-react';
import FaqAccordion from './FaqAccordion';
import { getLocalizedFaq } from '../i18n/faqLocalization.mjs';
import { getLocalizedResources } from '../i18n/resourceLocalization.mjs';
import { useLanguage } from '../i18n/useLanguage';

const ARTICLES = {
  'pdf-compression': {
    title: 'What PDF compression can and cannot do',
    description: 'Understand PDF compression, image-heavy files, and quality tradeoffs.',
    sections: [
      ['Why a PDF may already be compact', 'PDF files can contain compressed image streams and fonts. Rewriting the document structure may save little when most bytes belong to images that are already compressed.'],
      ['Standard optimization versus rasterization', 'A structural rewrite can reorganize PDF objects without converting every page to an image. This usually preserves selectable text, although file size may not decrease. Rasterizing pages and re-encoding them as JPEG images can reduce size, but it sacrifices text search, selection, vector sharpness, and interactive form behavior.'],
      ['Check the result, not the label', 'Compare the original and output sizes, then inspect important pages at normal and high zoom. Keep the original until the output quality is acceptable. The [Compress PDF](/compress) tool does not offer a larger output as a compression result.']
    ]
  },
  'local-pdf-processing': {
    title: 'What local PDF processing means',
    description: 'Learn what browser-side PDF processing protects and what it does not.',
    sections: [
      ['The selected document', 'A browser-side PDF library can read a file selected through a file picker and generate a new file without uploading the PDF to a conversion server. This describes the transformation path, not every request made by the website.'],
      ['Website and resource requests', 'The browser requests the website and its assets from the host, including locally bundled Tesseract.js OCR resources used by PDF to Word and OCR PDF. Hosting providers may keep request logs under their own policies.'],
      ['Make a privacy decision with the full picture', 'Do not enter sensitive content unless the processing and deployment behavior suit your needs. See the [Privacy Policy](/privacy) for the current implementation notes and outstanding operator/hosting details.']
    ]
  },
  'scanned-pdf-to-word': {
    title: 'Converting scanned PDFs to Word',
    description: 'Understand OCR, scan quality, and layout limitations when converting PDFs.',
    sections: [
      ['Text PDFs and scanned PDFs differ', 'A PDF with a text layer can expose selectable characters. A scan may contain only page images, so the converter has to recognize characters using OCR.'],
      ['OCR quality depends on the scan', 'Resolution, skew, contrast, language, handwriting, and page damage can affect recognition. This tool currently requests English OCR for pages without readable text; review the resulting Word document for missed or misread content.'],
      ['Layout needs review', 'The converter reconstructs text positions and simple aligned rows, not a perfect replica of every PDF layout. Complex columns, tables, and forms may need manual editing. See the [PDF to Word tool](/pdf-to-word).']
    ]
  }
};

const PAGE_META = {
  privacy: { title: 'Privacy Policy | PDF Merge Pro', description: 'Privacy and processing disclosures for the PDF Merge Pro website and browser-based PDF tools.' },
  terms: { title: 'Terms of Use | PDF Merge Pro', description: 'Terms and limitations for using the PDF Merge Pro website and PDF tools.' },
  about: { title: 'About | PDF Merge Pro', description: 'About the PDF Merge Pro browser-based PDF utility website.' },
  contact: { title: 'Contact | PDF Merge Pro', description: 'Contact information availability for PDF Merge Pro.' },
  resources: { title: 'PDF Guides and Resources | PDF Merge Pro', description: 'Practical guides to PDF compression, local processing, and scanned PDF conversion.' }
};

const usePageMeta = (title, description) => {
  useEffect(() => {
    const previousTitle = document.title;
    const meta = document.querySelector('meta[name="description"]');
    const previousDescription = meta?.content;
    document.title = title;
    if (meta) meta.content = description;
    return () => {
      document.title = previousTitle;
      if (meta && previousDescription !== undefined) meta.content = previousDescription;
    };
  }, [title, description]);
};

const PageLayout = ({ title, intro, children, icon: Icon }) => (
  <article className="mx-auto max-w-4xl space-y-8">
    <header className="text-center">
      <div className="page-heading">
        {Icon && (
          <span className="page-heading-icon" aria-hidden="true">
            <Icon size={24} strokeWidth={2} />
          </span>
        )}
        <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
      </div>
      <p className="text-slate-600 max-w-3xl mx-auto">{intro}</p>
    </header>
    <div className="space-y-6">{children}</div>
  </article>
);

const INFO_PAGE_ICONS = {
  privacy: ShieldCheck,
  about: Info,
  contact: Mail,
  terms: ShieldCheck
};

const InfoPage = ({ page, pageKey }) => {
  const { title, description, intro, sections } = page;
  usePageMeta(title, description);
  return (
    <PageLayout title={title.split(' | ')[0]} intro={intro} icon={INFO_PAGE_ICONS[pageKey]}>
      {sections.map((section) => (
        <section key={section.title} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-3">{section.title}</h2>
          <div className="space-y-3 text-slate-600 leading-relaxed">{section.content}</div>
        </section>
      ))}
    </PageLayout>
  );
};

const FaqPage = () => {
  const { language } = useLanguage();
  const localizedFaq = getLocalizedFaq(language);
  usePageMeta(localizedFaq.pageTitle, localizedFaq.description);
  return (
    <PageLayout title={localizedFaq.title} intro={localizedFaq.intro} icon={CircleHelp}>
      <section aria-label={localizedFaq.sectionLabel}>
        <FaqAccordion items={localizedFaq.items} />
      </section>
      <p className="text-sm text-slate-600"><Link className="underline hover:text-blue-700" to="/">{localizedFaq.toolsLabel}</Link> · <Link className="underline hover:text-blue-700" to="/resources">{localizedFaq.guidesLabel}</Link></p>
    </PageLayout>
  );
};

const ResourcePage = ({ article }) => {
  const { language } = useLanguage();
  const resources = getLocalizedResources(language, ARTICLES);
  const content = resources.articles[article];
  const title = content ? `${content.title} | PDF Merge Pro` : 'Page Not Found | PDF Merge Pro';
  const description = content?.description || 'The requested page could not be found.';
  usePageMeta(title, description);

  if (!content) {
    return (
      <PageLayout title="Page not found" intro="That page may have moved or the address may be incorrect.">
        <Link to="/" className="inline-flex rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
          Browse PDF tools
        </Link>
      </PageLayout>
    );
  }

  return (
    <PageLayout title={content.title} intro={content.description} icon={BookOpenText}>
      <div className="flex flex-col gap-6">
        {content.sections.map(([heading, text]) => (
          <section key={heading} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-3">{heading}</h2>
            <p className="text-slate-600 leading-relaxed">
              {text.split(/(\[[^\]]+\]\([^)]+\))/g).map((part, index) => {
                const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
                return match
                  ? <Link key={index} className="underline hover:text-blue-700" to={match[2]}>{match[1]}</Link>
                  : part;
              })}
            </p>
          </section>
        ))}
      </div>
      <Link to="/resources" className="inline-block text-blue-700 font-medium hover:underline">{resources.backToResources}</Link>
    </PageLayout>
  );
};

const ResourcesPage = () => {
  const { language } = useLanguage();
  const resources = getLocalizedResources(language, ARTICLES);
  usePageMeta(`${resources.title} | PDF Merge Pro`, resources.intro);
  return (
    <PageLayout title={resources.title} intro={resources.intro} icon={BookOpenText}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {Object.entries(resources.articles).map(([slug, article]) => (
          <Link
            key={slug}
            to={`/resources/${slug}`}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-lg transition-shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <h2 className="text-lg font-bold text-slate-800 mb-2">{article.title}</h2>
            <p className="text-sm text-slate-600">{article.description}</p>
            <span className="mt-4 inline-block text-sm font-semibold text-blue-700">{resources.readGuide}</span>
          </Link>
        ))}
      </div>
    </PageLayout>
  );
};

const NotFoundPage = () => {
  usePageMeta('Page Not Found | PDF Merge Pro', 'The requested page could not be found.');
  return (
    <PageLayout title="Page not found" intro="That page may have moved or the address may be incorrect.">
      <Link to="/" className="inline-flex rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
        Browse PDF tools
      </Link>
    </PageLayout>
  );
};

const INFO_PAGES = {
  privacy: {
    ...PAGE_META.privacy,
    intro: 'This notice describes the current website code as inspected on 28 October 2026. Hosting configuration and legal operator details have not been supplied, so those parts require owner review before publication.',
    sections: [
      {
        title: 'PDF processing in the browser',
        content: <>
          <p>The inspected PDF tools read selected documents in the browser and create their outputs there; the app does not upload documents to an application conversion server. This describes document processing, not a fully offline website: opening a page requests website files from its hosting provider.</p>
          <p>PDF to Word and OCR PDF use Tesseract.js for English OCR when a page has no readable text. Their worker, core software, and English language data are bundled with the website as local assets. These are supporting resources; scanned-page recognition is performed in the browser. Styling is built into the website assets; no Tailwind CSS CDN is used.</p>
        </>
      },
      {
        title: 'Website requests, logs, analytics and advertising',
        content: <>
          <p>Opening the site sends ordinary requests for pages and assets to the hosting provider. The provider may record connection or request information under its own terms; the provider and retention periods are not identified in this project.</p>
          <p>No analytics integration is configured in the inspected application. An optional AdSense loader is present, but its global enable flag, consent state, publisher ID, and placements are unset, so it does not load ads. This statement does not establish what the hosting provider, browser, or future deployment configuration records.</p>
        </>
      },
      {
        title: 'Cookies and third parties',
        content: <>
          <p>No application analytics or advertising cookies are intentionally configured in the inspected source. Third-party resources, browser settings, or deployment services may have their own request and storage behavior.</p>
          <p>The selected interface language is stored in this browser's localStorage as <code>pdf-tools-language</code>. Translated interface strings come from dictionaries bundled with the site; no translation API receives this preference or page content.</p>
          <p>Before enabling Google AdSense, the site owner must update this notice for the real advertising setup, review Google's current disclosure requirements, and configure appropriate consent tools for the site's audience and regions.</p>
        </>
      },
      {
        title: 'Operator, retention and privacy requests',
        content: <>
          <p>The project does not provide a legal operator name, contact address, hosting provider, retention schedule, or jurisdiction. These details must be supplied by the site owner; none are invented here.</p>
          <p>This draft is not legal advice. The owner should obtain jurisdiction-specific review and publish accurate contact and data-rights procedures before launch.</p>
          <p><Link className="underline hover:text-blue-700" to="/contact">Contact information status</Link></p>
        </>
      }
    ]
  },
  terms: {
    ...PAGE_META.terms,
    intro: 'These draft terms describe general use of the tools. The site owner must review them with qualified counsel for the applicable jurisdiction before relying on them.',
    sections: [
      { title: 'Use of the tools', content: <p>Use the tools only for documents you are authorized to process. You are responsible for checking generated output before relying on, sharing, or submitting it.</p> },
      { title: 'Technical limits', content: <p>PDF compatibility, available device memory, encryption, OCR accuracy, conversion layout, and output quality vary. Compression is not guaranteed to reduce file size; conversion may require manual corrections. Do not rely on any tool as the only copy of an important document.</p> },
      { title: 'No professional advice or service guarantee', content: <p>The website provides general document utilities, not legal, financial, or professional advice. No uptime, output fidelity, or fitness for a particular purpose is promised by this draft.</p> },
      { title: 'Operator and governing terms', content: <p>The legal operator, jurisdiction, contact method, and dispute terms have not been supplied. The site owner must provide and legally review these details before publication.</p> }
    ]
  },
  about: {
    ...PAGE_META.about,
    intro: 'PDF Merge Pro is an existing browser-based utility website with tools for common PDF tasks.',
    sections: [
      { title: 'What the site offers', content: <p>The current project includes tools to merge, split, rotate, protect, compress, watermark, convert images to PDF, and convert PDF text to Word. Each tool's page describes its current workflow and limitations.</p> },
      {
        title: 'Our story',
        content: <>
          <p>PDF Merge Pro began with a perfectly ordinary PDF, a second PDF, and the completely unreasonable belief that combining them should not require opening seventeen browser tabs. The small collection of tools grew one practical problem at a time, with no dramatic boardroom origin story and only a polite amount of debugging.</p>
          <p>The product is owned and developed entirely by a full stack engineer and product manager, who handles the product decisions, engineering, design, and occasional conversation with a stubborn line of code. The goal is simple: useful PDF tools that stay approachable, respect the documents being processed, and do not take themselves more seriously than a PDF merger reasonably should.</p>
        </>
      },
      { title: 'Who operates the site', content: <p>The site is owned and operated by the product's full stack engineer and product manager. A business name, legal operator details, and support contact method have not yet been supplied; the <Link className="underline hover:text-blue-700" to="/contact">Contact</Link> page shows the current status.</p> }
    ]
  },
  contact: {
    ...PAGE_META.contact,
    intro: 'Contact details have not been configured in the project.',
    sections: [
      { title: 'Contact the site operator', content: <p>No verified support email, business address, contact form endpoint, or operator identity is present in the project. The site owner must provide a real contact method before publishing this page as a support channel.</p> },
      { title: 'Privacy requests', content: <p>Do not send confidential documents through an unconfigured contact channel. The site owner must establish and publish a way to receive privacy or legal requests.</p> }
    ]
  }
};

const SitePages = ({ page, article }) => {
  if (page === 'faq') return <FaqPage />;
  if (page === 'resources') {
    if (!article) return <ResourcesPage />;
    return ARTICLES[article] ? <ResourcePage article={article} /> : <NotFoundPage />;
  }
  return <InfoPage page={INFO_PAGES[page]} pageKey={page} />;
};

export { NotFoundPage, SitePages };
