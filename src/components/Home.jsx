import React, { useEffect } from 'react';
import { ArrowDown, FileText, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import AdSlot from './AdSlot';
import ToolCard from './ToolCard';
import { TOOL_CATEGORIES, TOOL_REGISTRY } from './toolRegistry';

const Home = () => {
  useEffect(() => {
    const previousTitle = document.title;
    const metaDescription = document.querySelector('meta[name="description"]');
    const previousDescription = metaDescription?.content;
    document.title = 'Free Online PDF Tools | PDF Merge Pro';
    if (metaDescription) {
      metaDescription.content = 'Organize, convert, optimize, redact, sign, and protect PDFs with browser-based tools.';
    }

    return () => {
      document.title = previousTitle;
      if (metaDescription && previousDescription !== undefined) {
        metaDescription.content = previousDescription;
      }
    };
  }, []);

  return (
    <div className="space-y-16">
      <section className="home-hero">
        <div className="home-hero-copy">
          <p className="home-hero-eyebrow">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            PDF tools, made simple
          </p>
          <h1 className="home-hero-title">
            Powerful <span>PDF Tools</span>
          </h1>
          <p className="home-hero-tagline">All in one place.</p>
          <p className="home-hero-description">
            Browser-based tools for everyday PDF tasks. Processing details and limitations are explained on each tool page.
          </p>
          <a className="home-hero-link" href="#toolbox">
            Explore PDF tools
            <ArrowDown className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
        <nav className="home-hero-art" aria-label="Browse tool categories">
          <div className="home-hero-orbit home-hero-orbit-outer" aria-hidden="true" />
          <div className="home-hero-orbit home-hero-orbit-inner" aria-hidden="true" />
          <div className="home-hero-paper home-hero-paper-back" aria-hidden="true" />
          <div className="home-hero-paper home-hero-paper-middle" aria-hidden="true" />
          <div className="home-hero-document" aria-hidden="true">
            <div className="home-hero-document-heading">
              <span className="home-hero-document-icon"><FileText className="h-7 w-7" /></span>
              <span className="home-hero-document-label">PDF</span>
            </div>
            <span className="home-hero-document-line home-hero-document-line-long" />
            <span className="home-hero-document-line" />
            <span className="home-hero-document-line home-hero-document-line-short" />
            <span className="home-hero-document-block" />
          </div>
          <div className="home-hero-category-orbit">
            {TOOL_CATEGORIES.map((category, index) => (
              <a
                key={category.id}
                className="home-hero-category-badge"
                href={`#category-${category.id}`}
                style={{ '--badge-angle': `${index * 72}deg` }}
              >
                <span className="home-hero-category-counter">
                  <span className="home-hero-category-label">
                    <span className="home-hero-category-chip">
                      <span className="home-hero-category-text">{category.name}</span>
                    </span>
                  </span>
                </span>
              </a>
            ))}
          </div>
        </nav>
      </section>

      <section id="toolbox" className="scroll-mt-6">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Our Toolbox</h2>
            <p className="text-slate-500">Select a tool to get started</p>
          </div>
        </div>
        
        <div className="space-y-7">
          {TOOL_CATEGORIES.map((category) => {
            const tools = TOOL_REGISTRY.filter((tool) => tool.category === category.id);
            if (!tools.length) return null;
            return (
              <section id={`category-${category.id}`} key={category.id} aria-labelledby={`category-heading-${category.id}`} className="border-t border-slate-200 pt-7 first:border-t-0 first:pt-0">
                <h3 id={`category-heading-${category.id}`} className="mb-4 text-lg font-bold text-slate-800">
                  <Link className="category-section-link" to={category.path}>{category.name}</Link>
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {tools.map((tool) => <ToolCard key={tool.id} tool={tool} />)}
                </div>
              </section>
            );
          })}
        </div>
        <AdSlot placement="homeBelowTools" />
      </section>
    </div>
  );
};

export default Home;
