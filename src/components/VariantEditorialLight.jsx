import React, { useEffect } from 'react';
import AdSlot from './AdSlot';
import Footer from './Footer';
import EditorialLightHeader from './v6/EditorialLightHeader';
import EditorialLightHero from './v6/EditorialLightHero';
import EditorialLightBento from './v6/EditorialLightBento';
import { useLanguage } from '../i18n/useLanguage';
import './v6/editorial-light.css';

const VariantEditorialLight = () => {
  const { translate } = useLanguage();

  useEffect(() => {
    const previousTitle = document.title;
    const description = document.querySelector('meta[name="description"]');
    const previousDescription = description?.content;
    document.title = 'Free PDF Tools | PDF Merge Pro';
    if (description) {
      description.content = translate('homeDescription');
    }

    return () => {
      document.title = previousTitle;
      if (description && previousDescription !== undefined) {
        description.content = previousDescription;
      }
    };
  }, [translate]);

  return (
    <div className="v6-editorial" data-theme="light">
      <a className="v6-skip-link" href="#v6-main">{translate('skipToMainContent')}</a>
      <EditorialLightHeader />
      <main id="v6-main" className="v6-main" tabIndex={-1}>
        <EditorialLightHero />
        <EditorialLightBento />
        <section className="v6-why" aria-labelledby="v6-why-title">
          <div className="v6-why-label">
            <p className="v6-eyebrow">{translate('v6WhyEyebrow')}</p>
          </div>
          <article className="v6-why-article">
            <h2 id="v6-why-title">{translate('homeBottomTitle')}</h2>
            <div className="v6-article-copy">
              <p>{translate('homeBottomPara1')}</p>
              <p>{translate('homeBottomPara2')}</p>
              <p>{translate('homeBottomPara3')}</p>
            </div>
          </article>
        </section>
        <AdSlot placement="homeBelowTools" />
      </main>
      <div className="v6-footer">
        <Footer />
      </div>
    </div>
  );
};

export default VariantEditorialLight;
