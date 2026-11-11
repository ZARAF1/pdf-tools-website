import React from 'react';
import Footer from '../Footer';
import { useLanguage } from '../../i18n/useLanguage';
import EditorialLightBento from './EditorialLightBento';
import EditorialLightHeader from './EditorialLightHeader';
import './editorial-light.css';

const EditorialLightToolsPage = () => {
  const { translate } = useLanguage();

  return (
    <div className="v6-editorial" data-theme="light">
      <a className="v6-skip-link" href="#v6-main">{translate('skipToMainContent')}</a>
      <EditorialLightHeader />
      <main id="v6-main" className="v6-main v6-tools-page" tabIndex={-1}>
        <div className="v6-tools-page-intro">
          <h1>{translate('allTools')}</h1>
        </div>
        <EditorialLightBento />
      </main>
      <div className="v6-footer">
        <Footer />
      </div>
    </div>
  );
};

export default EditorialLightToolsPage;
