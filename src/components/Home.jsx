import React, { useEffect } from 'react';
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
      <section className="text-center py-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
          Powerful <span className="text-blue-600">PDF Tools</span> <br />
          <span className="text-slate-400 text-3xl md:text-4xl font-semibold">All in one place.</span>
        </h1>
        <p className="text-lg text-slate-500 mt-4 max-w-2xl mx-auto">
          Browser-based tools for everyday PDF tasks. Processing details and limitations are explained on each tool page.
        </p>
      </section>

      <section>
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
              <section key={category.id} aria-labelledby={`category-${category.id}`} className="border-t border-slate-200 pt-7 first:border-t-0 first:pt-0">
                <h3 id={`category-${category.id}`} className="mb-4 text-lg font-bold text-slate-800">{category.name}</h3>
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
