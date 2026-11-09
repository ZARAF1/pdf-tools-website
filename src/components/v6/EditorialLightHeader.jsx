import React from 'react';
import { ArrowDown, FileText } from 'lucide-react';

const EditorialLightHeader = () => (
  <header className="v6-header">
    <div className="v6-header-inner">
      <a className="v6-wordmark" href="/" aria-label="PDF Merge Pro home">
        <span className="v6-wordmark-icon" aria-hidden="true">
          <FileText />
        </span>
        <span>PDF Merge Pro</span>
      </a>
      <nav className="v6-header-nav" aria-label="Homepage navigation">
        <a className="v6-header-link" href="#v6-tools">
          Browse tools <ArrowDown aria-hidden="true" />
        </a>
        <span className="v6-privacy-note">
          <span aria-hidden="true" />
          Files stay on your device
        </span>
      </nav>
    </div>
  </header>
);

export default EditorialLightHeader;
