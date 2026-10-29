import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { closeDisclosureOnEscape } from '../lib/detailsEscape';

const FAQ_ITEMS = [
  ['Are my PDF files uploaded?', 'PDF operations process the selected document in your browser; the app does not upload documents to a conversion server. PDF to Word and OCR PDF may download Tesseract OCR worker, core software, and English language data from jsDelivr when scanned-page recognition is needed. These are supporting resources, not your document; OCR recognition runs in your browser. The website also requests its pages and assets, and hosting log practices depend on the deployment provider.'],
  ['How many PDF files can I merge?', 'You can merge up to five PDF files at a time. At least two files are required.'],
  ['Why might a PDF fail to open?', 'The file may be corrupt, use unsupported encryption or PDF features, or exceed the available memory. If it is password-protected, use Unlock PDF with a correct password you are authorized to use; otherwise try a readable copy or a smaller file.'],
  ['Will compression always reduce file size?', 'No. PDFs may already be compressed or be dominated by embedded images. The compressor reports actual sizes and avoids offering a larger output. Higher compression rasterizes pages and reduces text/image quality.'],
  ['Will PDF to Word preserve the layout?', 'Not exactly. Text positions and simple aligned rows are reconstructed. Complex columns, tables, forms, and scanned text may need manual correction.'],
  ['How do I save a generated file?', 'Use the tool’s Download button and choose a destination in your browser’s save dialog. If downloads are blocked, check the browser’s download permissions and try again.'],
  ['Do you use analytics or advertising cookies?', 'No analytics integration or active advertising configuration is present in the inspected app. An optional AdSense loader exists but its global enable flag, consent state, publisher ID, and placements are all unset. The deployment host and external resources can still receive requests; review their applicable policies.'],
  ['Can I use a password-protected PDF?', 'Yes. Unlock PDF can remove supported opening-password encryption when you provide the correct password you are authorized to use. It supports AES-256 R6 and legacy RC4 R2/R3; other tools continue to reject encrypted inputs. Password guessing or recovery is not available. Protect PDF can create a password-protected output copy.']
];

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
      ['Website and resource requests', 'The browser still requests the website and its assets from the host. PDF to Word and OCR PDF can use Tesseract.js worker, core, and English language resources from jsDelivr for scanned pages. Hosting providers may keep request logs under their own policies.'],
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
  faq: { title: 'Frequently Asked Questions | PDF Merge Pro', description: 'Answers about PDF tools, processing, downloads, compatibility, and privacy.' },
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

const PageLayout = ({ title, intro, children }) => (
  <article className="mx-auto max-w-4xl space-y-8">
    <header className="text-center">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">{title}</h1>
      <p className="text-slate-600 max-w-3xl mx-auto">{intro}</p>
    </header>
    <div className="space-y-6">{children}</div>
  </article>
);

const InfoPage = ({ page }) => {
  const { title, description, intro, sections } = page;
  usePageMeta(title, description);
  return (
    <PageLayout title={title.split(' | ')[0]} intro={intro}>
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
  usePageMeta(PAGE_META.faq.title, PAGE_META.faq.description);
  return (
    <PageLayout title="Frequently Asked Questions" intro="Practical answers about using the PDF tools, their limits, and how the website processes files.">
      <section className="space-y-3" aria-label="Frequently asked questions">
        {FAQ_ITEMS.map(([question, answer]) => (
          <details
            key={question}
            className="group bg-white rounded-xl border border-slate-200 p-4"
            onKeyDown={closeDisclosureOnEscape}
          >
            <summary className="cursor-pointer font-semibold text-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
              {question}
            </summary>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">{answer}</p>
          </details>
        ))}
      </section>
      <p className="text-sm text-slate-600">Looking for a specific operation? Browse the <Link className="underline hover:text-blue-700" to="/">PDF tools</Link> or the <Link className="underline hover:text-blue-700" to="/resources">PDF guides</Link>.</p>
    </PageLayout>
  );
};

const ResourcePage = ({ article }) => {
  const content = ARTICLES[article];
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
    <PageLayout title={content.title} intro={content.description}>
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
      <Link to="/resources" className="inline-block text-blue-700 font-medium hover:underline">Back to all resources</Link>
    </PageLayout>
  );
};

const ResourcesPage = () => {
  usePageMeta(PAGE_META.resources.title, PAGE_META.resources.description);
  return (
    <PageLayout title="PDF Guides and Resources" intro="Short, practical explanations of PDF workflows, output quality, and browser processing.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {Object.entries(ARTICLES).map(([slug, article]) => (
          <Link
            key={slug}
            to={`/resources/${slug}`}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-lg transition-shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <h2 className="text-lg font-bold text-slate-800 mb-2">{article.title}</h2>
            <p className="text-sm text-slate-600">{article.description}</p>
            <span className="mt-4 inline-block text-sm font-semibold text-blue-700">Read guide</span>
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
          <p>PDF to Word and OCR PDF use Tesseract.js for English OCR when a page has no readable text. Their configuration may download the OCR worker, core software, and English language data from jsDelivr when needed. These are supporting resources; scanned-page recognition is performed in the browser. Styling is built into the website assets; no Tailwind CSS CDN is used.</p>
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
      { title: 'Who operates the site', content: <p>No business name, individual operator, or history was supplied in the project. This page intentionally does not invent an identity. See the <Link className="underline hover:text-blue-700" to="/contact">Contact</Link> page for the current contact-information status.</p> }
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
  return <InfoPage page={INFO_PAGES[page]} />;
};

export { NotFoundPage, SitePages };
