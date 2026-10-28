import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-slate-500 text-sm">
            © {new Date().getFullYear()} PDF Merge Pro. All rights reserved.
          </div>
          <nav aria-label="Footer navigation" className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link to="/" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">Home</Link>
            <Link to="/about" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">About</Link>
            <Link to="/contact" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">Contact</Link>
            <Link to="/faq" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">FAQ</Link>
            <Link to="/resources" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">Guides</Link>
            <Link to="/privacy" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">Privacy</Link>
            <Link to="/terms" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">Terms</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
