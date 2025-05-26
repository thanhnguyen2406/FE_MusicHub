import React from 'react';
import { Link } from 'react-router-dom';
import logoUrl from '../../../assets/logo.png';

interface RegisterFormProps {
  displayName: string;
  setDisplayName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  firstName: string;
  setFirstName: (name: string) => void;
  lastName: string;
  setLastName: (name: string) => void;
  password: string;
  setPassword: (password: string) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  displayName,
  setDisplayName,
  email,
  setEmail,
  firstName,
  setFirstName,
  lastName,
  setLastName,
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
      <p className="text-lg text-gray-300 mb-8 text-center">Music Platform</p>
      <input
        type="text"
        placeholder="Display Name"
        value={displayName}
        onChange={e => setDisplayName(e.target.value)}
        className="mb-4 w-72 px-4 py-3 rounded-full border text-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-white-400"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="mb-4 w-72 px-4 py-3 rounded-full border text-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-white-400"
      />
      <input
        type="text"
        placeholder="First Name"
        value={firstName}
        onChange={e => setFirstName(e.target.value)}
        className="mb-4 w-72 px-4 py-3 rounded-full border text-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-white-400"
      />
      <input
        type="text"
        placeholder="Last Name"
        value={lastName}
        onChange={e => setLastName(e.target.value)}
        className="mb-4 w-72 px-4 py-3 rounded-full border text-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-white-400"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="mb-6 w-72 px-4 py-3 rounded-full border text-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-white-400"
      />
      <button
        type="submit"
        disabled={isLoading}
        className="w-72 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
      >
        {isLoading ? 'Registering...' : 'Register'}
      </button>
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-purple-600 hover:text-purple-500">
            Sign in
          </Link>
        </p>
      </div>
    </form>
  );
};

export default RegisterForm; 