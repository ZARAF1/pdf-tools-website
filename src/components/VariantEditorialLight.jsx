import React from 'react';
import AdSlot from './AdSlot';
import Footer from './Footer';
import EditorialLightHeader from './v6/EditorialLightHeader';
import EditorialLightHero from './v6/EditorialLightHero';
import EditorialLightBento from './v6/EditorialLightBento';
import EditorialLightWhy from './v6/EditorialLightWhy';
import './v6/editorial-light.css';

const VariantEditorialLight = () => (
  <div className="v6-editorial" data-theme="light">
    <a className="v6-skip-link" href="#v6-main">Skip to main content</a>
    <EditorialLightHeader />
    <main id="v6-main" className="v6-main" tabIndex={-1}>
      <EditorialLightHero />
      <EditorialLightBento />
      <EditorialLightWhy />
      <AdSlot placement="homeBelowTools" />
    </main>
    <div className="v6-footer">
      <Footer />
    </div>
  </div>
);

export default VariantEditorialLight;
