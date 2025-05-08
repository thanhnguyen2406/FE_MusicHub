import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <header className="header bg-gray-400 px-[2vw] py-1 flex items-center justify-between w-full">
      <div className="logo flex items-center font-bold text-lg text-white">
        <span className="logo-icon mr-2 text-xl">🎵</span> MoodMix
      </div>
      <nav className="nav-links flex gap-6 justify-center flex-1">
        <Link to="/" className="text-white no-underline text-base hover:text-yellow-200">Home</Link>
        <Link to="/channels" className="text-white no-underline text-base hover:text-yellow-200">Channel</Link>
        <Link to="/search" className="text-white no-underline text-base hover:text-yellow-200">Search</Link>
        <Link to="/mood" className="text-white no-underline text-base hover:text-yellow-200">Mood</Link>
      </nav>
      <div className="header-right flex gap-2 min-w-[180px] justify-end">
        {isHomePage ? (
          <>
            <button className="login-btn bg-white text-gray-800 border-none rounded-full px-4 py-1 font-medium mr-2 cursor-pointer">Login</button>
            <button className="register-btn bg-red-600 text-white border-none rounded-full px-4 py-1 font-medium cursor-pointer">Register</button>
          </>
        ) : (
          <div className="w-full" />
        )}
      </div>
    </header>
  );
};

export default Header; 