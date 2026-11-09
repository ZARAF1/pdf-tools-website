import React from 'react';
import { ArrowDownRight, FileText, Image, ScanText, Sparkles } from 'lucide-react';
import EditorialLightSearch from './EditorialLightSearch';
import { useLanguage } from '../../i18n/useLanguage';

const EditorialLightHero = () => {
  const { translate } = useLanguage();

  return (
    <section className="v6-hero" aria-labelledby="v6-title">
      <div className="v6-hero-copy">
        <p className="v6-eyebrow">
          <Sparkles aria-hidden="true" />
          {translate('homeEyebrow')}
        </p>
        <h1 id="v6-title">{translate('homeTitle')}</h1>
        <p className="v6-hero-description">{translate('homeDescription')}</p>
        <EditorialLightSearch />
        <a className="v6-browse-cta" href="#v6-tools">
          {translate('homeExplore')}
          <ArrowDownRight aria-hidden="true" />
        </a>
      </div>

      <div className="v6-hero-art" aria-hidden="true">
        <div className="v6-art-orbit v6-art-orbit-one" />
        <div className="v6-art-orbit v6-art-orbit-two" />
        <div className="v6-art-sun" />
        <div className="v6-document-sheet">
          <div className="v6-document-topline">
            <span className="v6-document-mark"><FileText /></span>
            <span className="v6-document-menu"><i /><i /><i /></span>
          </div>
          <div className="v6-document-heading" />
          <div className="v6-document-subheading" />
          <div className="v6-document-lines"><i /><i /><i /><i /></div>
          <div className="v6-document-preview">
            <div className="v6-preview-shape" />
            <span><i /><i /><i /></span>
          </div>
          <div className="v6-document-foot"><i /><i /></div>
        </div>
        <div className="v6-art-sticker v6-art-sticker-image"><Image /></div>
        <div className="v6-art-sticker v6-art-sticker-scan"><ScanText /></div>
        <p className="v6-art-caption">A clearer page, at your pace.</p>
      </div>
    </section>
  );
};

export default EditorialLightHero;
