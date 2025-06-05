import React from 'react';
import { Link } from 'react-router-dom';
import logoUrl from '../../../assets/logo.png';

interface LoginFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  isLoading,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className="flex flex-col items-center">
      <Link to="/" className="flex flex-row items-center justify-center w-full hover:opacity-80 transition">
        <img src={logoUrl} alt="MoodMix Logo" className="w-20 h-20 rounded-lg object-cover shadow-md" />
        <h1 className="text-4xl font-bold text-white text-center">MoodMix</h1>
      </Link>
      <p className="text-lg text-white mb-8 text-center">Music Platform</p>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="mb-4 w-72 px-4 py-3 rounded-full border text-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-white-400"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="mb-6 w-72 px-4 py-3 rounded-full border text-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-white-400"
      />
      <div className="w-72 flex flex-col gap-4">
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </button>
        <div className="mt-2 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-purple-600 hover:text-purple-500">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </form>
  );
};

export default LoginForm; 