import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import ToolCard from './ToolCard';
import { TOOL_REGISTRY } from './toolRegistry';

const CategoryPage = ({ category }) => {
  const tools = TOOL_REGISTRY.filter((tool) => tool.category === category.id);
  const pageTitle = `${category.name} PDF Tools | PDF Merge Pro`;
  const metaDescription = category.description;

  useEffect(() => {
    const previousTitle = document.title;
    const descriptionTag = document.querySelector('meta[name="description"]');
    const previousDescription = descriptionTag?.content;

    document.title = pageTitle;
    if (descriptionTag) descriptionTag.content = metaDescription;

    return () => {
      document.title = previousTitle;
      if (descriptionTag && previousDescription !== undefined) {
        descriptionTag.content = previousDescription;
      }
    };
  }, [pageTitle, metaDescription]);

  return (
    <article className="category-page">
      <header className="category-page-hero">
        <Link to="/" className="category-page-back">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          All PDF tools
        </Link>
        <p className="category-page-eyebrow">PDF tool category</p>
        <h1 className="category-page-title">{category.name} PDF Tools</h1>
        <p className="category-page-description">{category.description}</p>
      </header>

      <section aria-labelledby="category-tools-heading" className="category-page-tools">
        <div className="category-page-tools-heading">
          <div>
            <h2 id="category-tools-heading">Tools in {category.name}</h2>
            <p>{tools.length} {tools.length === 1 ? 'tool' : 'tools'} to choose from</p>
          </div>
          <Link to="/" className="category-page-home-link">
            Browse all categories
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {tools.map((tool) => <ToolCard key={tool.id} tool={tool} />)}
        </div>
      </section>
    </article>
  );
};

export default CategoryPage;
