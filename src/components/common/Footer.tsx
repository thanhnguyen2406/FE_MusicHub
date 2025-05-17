import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="footer bg-gray-400 text-white px-[2vw] py-4 flex items-center justify-between w-full mt-auto">
      <div className="footer-left flex flex-col items-start min-w-[120px]">
        <div className="footer-title font-bold text-base">MoodMix</div>
        <div className="footer-slogan text-sm">Discover music channels by mood.</div>
      </div>
      <div className="footer-center flex flex-col items-center flex-1">
        <div className="footer-policy-links flex gap-6 justify-center">
          <Link to="/privacy" className="text-white no-underline text-sm hover:text-yellow-200">Privacy Policy</Link>
          <Link to="/terms" className="text-white no-underline text-sm hover:text-yellow-200">Terms of Service</Link>
          <Link to="/contact" className="text-white no-underline text-sm hover:text-yellow-200">Contact Us</Link>
        </div>
      </div>
      <div className="footer-socials flex gap-3 ml-4">
        <a href="#" title="Facebook" className="text-white text-lg hover:text-yellow-200">ⓕ</a>
        <a href="#" title="Instagram" className="text-white text-lg hover:text-yellow-200">ⓘ</a>
        <a href="#" title="Twitter" className="text-white text-lg hover:text-yellow-200">ⓣ</a>
      </div>
    </footer>
  );
};

export default Footer; 