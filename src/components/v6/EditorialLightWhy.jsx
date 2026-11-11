import React from 'react';
import { useLanguage } from '../../i18n/useLanguage';

const EditorialLightWhy = () => {
  const { translate } = useLanguage();

  return (
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
  );
};

export default EditorialLightWhy;
