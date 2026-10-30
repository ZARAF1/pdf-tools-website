import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import ToolCard from './ToolCard';
import { TOOL_REGISTRY } from './toolRegistry';
import { useLanguage } from '../i18n/useLanguage';

const CategoryPage = ({ category }) => {
  const { translate } = useLanguage();
  const tools = TOOL_REGISTRY.filter((tool) => tool.category === category.id);
  const categoryName = translate(`category.${category.id}`);
  const pageTitle = `${categoryName} | PDF Merge Pro`;
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
          {translate('allPdfTools')}
        </Link>
        <p className="category-page-eyebrow">{translate('categoryEyebrow')}</p>
        <h1 className="category-page-title">{categoryName}</h1>
        <p className="category-page-description">{category.description}</p>
      </header>

      <section aria-labelledby="category-tools-heading" className="category-page-tools">
        <div className="category-page-tools-heading">
          <div>
            <h2 id="category-tools-heading">{translate('toolsIn')} {categoryName}</h2>
            <p>{tools.length} {translate('toolsToChooseFrom')}</p>
          </div>
          <Link to="/" className="category-page-home-link">
            {translate('browseAllCategories')}
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
