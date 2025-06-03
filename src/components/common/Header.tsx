import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import defaultAvatar from '../../assets/defaultAvatar.png';
import { useAppSelector } from '../../redux/store';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const userInfo = useAppSelector(state => state.user.userInfo);

  const hasToken =
    !!localStorage.getItem('authTokens') ||
    !!localStorage.getItem('access_token') ||
    !!localStorage.getItem('refresh_token');

  const handleLogout = () => {
    localStorage.removeItem('authTokens');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    sessionStorage.removeItem('authTokens');
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
    navigate('/');
    window.location.reload(); 
  };

  return (
    <header
      className="header bg-gray-400 px-4 py-2 flex items-center justify-between w-full shadow-md"
    >
      <div className="logo flex items-center font-bold text-lg text-white gap-2">
        <img src={logo} alt="Logo" className="w-12 h-12 object-contain" />
        <span className="hidden sm:inline">MoodMix</span>
      </div>
      <nav className="nav-links flex gap-4 md:gap-6 justify-center flex-1">
        <Link to="/" className="text-white no-underline text-base hover:text-purple-900">Home</Link>
        <Link to="/channels" className="text-white no-underline text-base hover:text-purple-900">Channel</Link>
        <Link to="/search" className="text-white no-underline text-base hover:text-purple-900">Search</Link>
        <Link to="/mood" className="text-white no-underline text-base hover:text-purple-900">Mood</Link>
      </nav>
      <div className="header-right flex gap-2 min-w-[120px] justify-end items-center">
        {hasToken ? (
          <>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/profile')}>
              <img
                src={defaultAvatar}
                alt="User Avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="text-white font-medium hidden sm:inline">{userInfo?.displayName}</span>
            </div>
            <button
              className="bg-red-600 text-white border-none rounded-2xl px-4 py-1 font-medium cursor-pointer ml-2 hover:bg-red-700 transition"
              onClick={handleLogout}
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="bg-white text-gray-800 border-none rounded-full px-4 py-1 font-medium mr-2 cursor-pointer">Log in</Link>
            <Link to="/register" className="bg-purple-700 text-white border-none rounded-full px-4 py-1 font-medium cursor-pointer">Sign up</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header; 