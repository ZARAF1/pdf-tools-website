import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpenText, CircleHelp, Info, Mail, ShieldCheck } from 'lucide-react';
import FaqAccordion from './FaqAccordion';
import { getLocalizedFaq } from '../i18n/faqLocalization.mjs';
import { getLocalizedResources } from '../i18n/resourceLocalization.mjs';
import { getLocalizedTool } from '../i18n/toolTranslations.mjs';
import { TOOL_DETAIL_POINT_HEADINGS } from '../i18n/toolPageLocalization.mjs';
import { TOOL_CATEGORIES, TOOL_REGISTRY } from './toolRegistry';
import { GUIDE_ONLY_TOOLS, TOOL_GUIDES } from './toolGuides.mjs';
import ToolCard from './ToolCard';
import { useLanguage } from '../i18n/useLanguage';
import EditorialLightHeader from './v6/EditorialLightHeader';
import './v6/editorial-light.css';

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
  security: { title: 'Security Policy | PDF Merge Pro', description: 'How PDF Merge Pro handles local PDF processing, browser security, and responsible security reports.' },
  terms: { title: 'Terms of Use | PDF Merge Pro', description: 'Draft terms and limitations for using PDF Merge Pro browser-based document tools.' },
  cookies: { title: 'Cookie Policy | PDF Merge Pro', description: 'Cookie and browser-storage practices for the PDF Merge Pro website and local PDF tools.' },
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

const SitePageShell = ({ children }) => {
  const { translate } = useLanguage();

  return (
    <div className="v6-editorial v6-static-page" data-theme="light">
      <a className="v6-skip-link" href="#v6-main">{translate('skipToMainContent')}</a>
      <EditorialLightHeader />
      <div id="v6-main" className="v6-main v6-static-main" tabIndex={-1}>
        <div className="v6-static-page-content">{children}</div>
      </div>
    </div>
  );
};

const PageLayout = ({ title, intro, children, icon: Icon }) => (
  <article className="v6-static-article">
    <header className="v6-static-article-header">
      <div className="page-heading">
        {Icon && (
          <span className="page-heading-icon" aria-hidden="true">
            <Icon size={24} strokeWidth={2} />
          </span>
        )}
        <h1>{title}</h1>
      </div>
      <p className="v6-static-intro">{intro}</p>
    </header>
    <div className="v6-static-sections">{children}</div>
  </article>
);

const INFO_PAGE_ICONS = {
  privacy: ShieldCheck,
  security: ShieldCheck,
  cookies: Info,
  about: Info,
  contact: Mail,
  terms: ShieldCheck
};

const InfoPage = ({ page, pageKey }) => {
  const { title, description, intro, sections } = page;
  usePageMeta(title, description);
  return (
    <PageLayout title={title.split(' | ')[0]} intro={intro} icon={INFO_PAGE_ICONS[pageKey]}>
      {sections.map((section, index) => (
        <section key={section.title} className={`v6-static-card v6-static-card-${index % 4}`}>
          <h2>{section.title}</h2>
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
      <section className="v6-static-faq" aria-label={localizedFaq.sectionLabel}>
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
          <section key={heading} className="v6-static-card">
            <h2>{heading}</h2>
            <p>
              {text.split(/(\[[^\]]+\]\([^)]+\))/g).map((part, index) => {
                const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
                return match
                  ? <Link key={index} to={match[2]}>{match[1]}</Link>
                  : part;
              })}
            </p>
          </section>
        ))}
      </div>
      <Link to="/resources" className="v6-static-back-link">{resources.backToResources}</Link>
    </PageLayout>
  );
};

const ResourcesPage = () => {
  const { language, translate } = useLanguage();
  const resources = getLocalizedResources(language, ARTICLES);
  usePageMeta(`${resources.title} | PDF Merge Pro`, resources.intro);
  const guideTools = [...TOOL_REGISTRY, ...GUIDE_ONLY_TOOLS];
  return (
    <PageLayout title={resources.title} intro={resources.intro} icon={BookOpenText}>
      <div className="space-y-10">
        {TOOL_CATEGORIES.map((category) => {
          const categoryTools = guideTools.filter((tool) => tool.category === category.id);
          if (categoryTools.length === 0) return null;
          return (
            <section key={category.id} aria-labelledby={`guides-${category.id}`}>
              <h2 id={`guides-${category.id}`} className="v6-static-section-heading">
                {translate(`category.${category.id}`)}
              </h2>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {categoryTools.map((tool) => (
                  <ToolCard
                    key={tool.id}
                    tool={tool}
                    to={`/resources/tools/${tool.id}`}
                    actionLabel={resources.readMore}
                    className="resource-card"
                  />
                ))}
              </div>
            </section>
          );
        })}
        <section aria-labelledby="resource-topic-guides">
          <h2 id="resource-topic-guides" className="v6-static-section-heading">
            {resources.topicGuides}
          </h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {Object.entries(resources.articles).map(([slug, article]) => (
              <Link key={slug} to={`/resources/${slug}`} className="tool-card group resource-card">
                <span className="tool-card-icon resource-card-icon" aria-hidden="true">
                  <BookOpenText className="h-5 w-5" />
                </span>
                <span className="resource-card-content">
                  <span className="resource-card-title">{article.title}</span>
                  <span className="resource-card-description">{article.description}</span>
                  <span className="resource-card-read">{resources.readGuide}</span>
                </span>
                <ArrowRight className="tool-card-arrow h-4 w-4 shrink-0" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export const ToolGuidePage = ({ toolId }) => {
  const { language, translate } = useLanguage();
  const resources = getLocalizedResources(language, ARTICLES);
  const tool = [...TOOL_REGISTRY, ...GUIDE_ONLY_TOOLS].find((item) => item.id === toolId);
  const guide = TOOL_GUIDES[toolId];
  const localizedTool = tool ? getLocalizedTool(language, tool) : null;
  const headings = TOOL_DETAIL_POINT_HEADINGS[language] || TOOL_DETAIL_POINT_HEADINGS.en;
  const description = guide?.what || 'The requested tool guide could not be found.';
  usePageMeta(
    `${localizedTool?.name || 'Page Not Found'} Guide | PDF Merge Pro`,
    description
  );
  if (!tool || !guide || !localizedTool) {
    return (
      <SitePageShell>
        <PageLayout title="Page not found" intro="That guide may have moved or the address may be incorrect.">
          <Link to="/" className="v6-static-action-link">Browse PDF tools</Link>
        </PageLayout>
      </SitePageShell>
    );
  }

  const sections = [
    [headings.what, guide.what],
    [headings.how, guide.how],
    [headings.result, guide.result],
    [resources.applications, guide.applications]
  ];

  return (
    <SitePageShell>
      <PageLayout
        title={localizedTool.name}
        intro={localizedTool.description}
        icon={localizedTool.icon || BookOpenText}
      >
        <div className="flex flex-col gap-6">
          {sections.map(([heading, text], index) => (
            <section key={heading} className={`v6-static-card v6-static-card-${index % 4}`}>
              <h2>{heading}</h2>
              <p>{text}</p>
            </section>
          ))}
        </div>
        <div className="v6-static-actions">
          <Link to={localizedTool.path} className="v6-static-action-link">
            {localizedTool.name}
            <ArrowRight aria-hidden="true" />
          </Link>
          <Link to="/resources" className="v6-static-back-link">
            {resources.backToResources}
          </Link>
        </div>
      </PageLayout>
    </SitePageShell>
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
    intro: 'This notice describes the browser application as reviewed on 31 October 2026. Hosting-provider settings and legal operator details are not available in the project and must be confirmed before publication.',
    sections: [
      {
        title: 'PDF processing in the browser',
        content: <>
          <p>The inspected PDF tools read selected documents in the browser and create their outputs there; the app does not upload documents to an application conversion server. The app code does not deliberately store document contents or tool passwords in its persistent browser preferences. This is local processing, not a promise that the website itself works offline: opening a page requests the site and its assets from its hosting provider.</p>
          <p>The PDF ↔ PowerPoint tool uses a browser renderer that may request substitute font resources from Google Fonts when converting presentations. Font-family names used by the slides may be included in those requests; the presentation file, slide text, and images are not sent. See the <Link className="underline hover:text-blue-700" to="/pdf-to-powerpoint">PDF ↔ PowerPoint tool</Link> for its conversion limitations.</p>
          <p>PDF to Word and OCR PDF use Tesseract.js and bundled English OCR resources when a page has no readable text. Those supporting resources are part of the site; recognition runs in the browser. The selected document is not sent to a translation or OCR service.</p>
        </>
      },
      {
        title: 'Website requests, logs, analytics and advertising',
        content: <>
          <p>Opening or using the site sends page and asset requests to the web host. That provider may process connection details such as an IP address, request time, or browser information in server logs. The provider, its purposes, locations, and retention periods are not identified in this project.</p>
          <p>No analytics integration is configured in the inspected application. An optional AdSense loader is present in the codebase but its enable flag, consent state, publisher ID, and placements are unset. This code review cannot determine what a future hosting setup or browser extensions may collect.</p>
        </>
      },
      {
        title: 'Cookies and browser preferences',
        content: <>
          <p>The application stores the chosen theme and language in browser localStorage, not in cookies. The preference keys are <code>pdf-tools-theme</code> and <code>pdf-tools-language</code>; they do not contain PDF contents. Interface translations are bundled with the site, and no translation API receives the preference or document.</p>
          <p>See the <Link className="underline hover:text-blue-700" to="/cookies">Cookie Policy</Link> for the distinction between app storage and cookies that a host or future integration might set. Before enabling advertising or analytics, the operator must update this notice and configure any required consent controls.</p>
        </>
      },
      {
        title: 'Operator, retention and privacy requests',
        content: <>
          <p>The project does not identify a legal operator, contact address, hosting provider, jurisdiction, or server-log retention schedule. No document-retention period is claimed because documents are processed locally by the app and are not submitted to its conversion server.</p>
          <p>This draft is not legal advice. The operator must add accurate identity, hosting, retention, privacy-rights, and contact information and obtain jurisdiction-specific review before launch.</p>
          <p><Link className="underline hover:text-blue-700" to="/contact">Contact information status</Link></p>
        </>
      }
    ]
  },
  security: {
    ...PAGE_META.security,
    intro: 'This overview describes safeguards in the current browser application; it is not a security certification or a guarantee about the hosting environment.',
    sections: [
      {
        title: 'Documents are processed on your device',
        content: <>
          <p>For the supported PDF tools reviewed, file reading, transformations, and output creation run in the browser. The application does not send selected PDFs to a conversion server. The site itself must still be delivered by a host, and its request logs are outside this repository; see the <Link className="underline hover:text-blue-700" to="/privacy">Privacy Policy</Link>.</p>
          <p>PDF to Word and OCR PDF use OCR resources bundled with the website, with recognition running in the browser. This avoids sending document pages to an external OCR service in the inspected implementation.</p>
        </>
      },
      {
        title: 'Protect the device and browser',
        content: <>
          <p>Local processing means the document is available to the browser on your device. Keep your operating system and browser up to date, use a trusted device, and consider browser extensions, shared accounts, malware, screen capture, and other software that may access browser data.</p>
          <p>When working on a shared device, download outputs only to a location you control and clear downloads or temporary browser state when appropriate. The app does not control your device, browser profile, extensions, backups, or downloaded copies.</p>
        </>
      },
      {
        title: 'Passwords and generated files',
        content: <>
          <p>Use a strong, unique password when creating a protected PDF and keep it somewhere safe; the app cannot recover a forgotten password. Unlock PDF requires a correct supported password that you are authorized to use. Check important output files before relying on them and retain the original where needed.</p>
          <p>No browser-based tool can provide an absolute security guarantee. Local processing reduces document transfer to a conversion server, but it does not remove risks from the device, browser, network, or hosting environment.</p>
        </>
      },
      {
        title: 'Report a security concern',
        content: <>
          <p>A dedicated security contact is not configured in this project. The operator should publish a monitored security-reporting address before launch. The current <Link className="underline hover:text-blue-700" to="/contact">Contact page</Link> does not yet provide a verified reporting channel; do not include sensitive PDFs in a report.</p>
        </>
      }
    ]
  },
  terms: {
    ...PAGE_META.terms,
    intro: 'This product-specific terms template is a draft for review, not legal advice. The site operator must complete the missing identity and jurisdiction details and review it with qualified counsel before publication.',
    sections: [
      { title: 'Scope and changes', content: <p>These terms cover access to the PDF Merge Pro website and its browser-based document tools. Features and limits may change as the site is maintained. The operator should publish an effective date and explain how material changes will be communicated before putting this template into use.</p> },
      { title: 'Your documents and permitted use', content: <p>Use the tools only for documents you are authorized to process and for lawful purposes. You keep your rights to your own files. You are responsible for their contents, permissions, backups, and the decision to process a file in your browser, download an output, or share it with someone else.</p> },
      { title: 'Browser-side processing and privacy', content: <p>Supported tools process selected documents in the browser and do not send them to an application conversion server. This does not make the website fully offline or determine what a hosting provider logs. Review the <Link className="underline hover:text-blue-700" to="/privacy">Privacy Policy</Link> and <Link className="underline hover:text-blue-700" to="/cookies">Cookie Policy</Link> for current implementation notes and deployment details that remain to be supplied.</p> },
      { title: 'Output, limits, and backups', content: <p>PDF compatibility, device memory, encryption, OCR recognition, conversion layout, and output quality vary. Compression may produce a larger file; higher-compression settings may reduce image and text quality; conversions may need manual corrections. Review each result and keep an independent copy of important originals. Do not rely on a tool as your only backup.</p> },
      { title: 'Availability and warranty disclaimer', content: <p>The site is provided for general document tasks and may be changed or unavailable. The operator does not promise uninterrupted access, error-free processing, exact fidelity, or suitability for a particular purpose. Any disclaimer or limitation applies only to the extent allowed by applicable law and does not remove rights that cannot legally be excluded.</p> },
      { title: 'Acceptable use and intellectual property', content: <p>Do not use the site to violate law or another person’s rights, interfere with its operation, or attempt unauthorized access. The website’s software, design, and original site content remain with their respective rights holders; these terms do not transfer ownership of your documents or grant rights beyond ordinary use of the service.</p> },
      { title: 'Operator, governing law, and contact', content: <p>The legal operator, jurisdiction, dispute process, and contact method have not been supplied. The operator must fill in these details, add any locally required consumer terms, and obtain legal review before publication. Until then, this page is an incomplete template, not a finalized contract.</p> }
    ]
  },
  cookies: {
    ...PAGE_META.cookies,
    intro: 'This policy separates cookies from browser storage and reflects the application code reviewed on 31 October 2026. The actual hosting configuration has not been supplied.',
    sections: [
      {
        title: 'Cookies used by the application',
        content: <>
          <p>No application cookies are configured in the inspected client code. The app has no active analytics or advertising integration. An optional AdSense loader is present in the codebase but is not enabled in the current configuration.</p>
          <p>This source review cannot identify cookies that a production host, CDN, browser extension, or future third-party integration might set. The site operator must inspect the deployed site and update this policy with real cookie names, providers, purposes, durations, and consent choices before launch.</p>
        </>
      },
      {
        title: 'Preferences stored in your browser',
        content: <>
          <p>The app stores your selected theme and interface language in localStorage under <code>pdf-tools-theme</code> and <code>pdf-tools-language</code>. These are browser storage entries, not cookies, and do not contain document contents. They remain until changed or cleared through your browser’s site-data controls.</p>
          <p>If browser storage is unavailable or cleared, the app uses its default theme and language selection. PDF files are not saved to these preference keys.</p>
        </>
      },
      {
        title: 'Hosting, consent, and future changes',
        content: <>
          <p>The hosting provider is not identified in this project, so its cookie behavior and retention periods cannot be confirmed here. Browser and hosting requests may be handled under the provider’s own settings and policies.</p>
          <p>No cookie-consent interface is configured in the inspected app. If deployment adds cookies or similar storage that require notice or consent under applicable law, the operator must configure the appropriate controls and revise this policy before enabling them.</p>
        </>
      },
      {
        title: 'Managing browser data',
        content: <p>You can review or clear cookies and local storage using your browser’s site settings. Clearing local storage resets the site’s saved theme and language preferences; clearing a cookie does not delete a PDF saved to your device.</p>
      }
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
  if (page === 'faq') return <SitePageShell><FaqPage /></SitePageShell>;
  if (page === 'resources') {
    if (!article) return <SitePageShell><ResourcesPage /></SitePageShell>;
    return (
      <SitePageShell>
        {ARTICLES[article] ? <ResourcePage article={article} /> : <NotFoundPage />}
      </SitePageShell>
    );
  }
  return <SitePageShell><InfoPage page={INFO_PAGES[page]} pageKey={page} /></SitePageShell>;
};

export { NotFoundPage, SitePages };
