import React from 'react';
import { Link } from 'react-router-dom';
import LanguagePicker from './LanguagePicker';
import { useLanguage } from '../i18n/useLanguage';

const Footer = () => {
  const { translate } = useLanguage();

  return (
    <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-slate-500 text-sm">
            © {new Date().getFullYear()} PDF Merge Pro. {translate('allRightsReserved')}
          </div>
          <nav aria-label={translate('footerNavigation')} className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link to="/" className="footer-link">{translate('home')}</Link>
            <Link to="/about" className="footer-link">{translate('about')}</Link>
            <Link to="/contact" className="footer-link">{translate('contact')}</Link>
            <Link to="/faq" className="footer-link">{translate('faq')}</Link>
            <Link to="/resources" className="footer-link">{translate('guides')}</Link>
            <LanguagePicker placement="footer" />
            <Link to="/privacy" className="footer-link">{translate('privacy')}</Link>
            <Link to="/security" className="footer-link">{translate('security')}</Link>
            <Link to="/terms" className="footer-link">{translate('terms')}</Link>
            <Link to="/cookies" className="footer-link">{translate('cookiePolicy')}</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
