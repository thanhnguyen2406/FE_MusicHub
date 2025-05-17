import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import { useRegister } from '../../../hooks/useRegister';

const illustrationUrl = '/assets/login.png';
const logoUrl = '/assets/logo.png';

const Register: React.FC = () => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const { handleRegister, loading } = useRegister();

  const onSubmit = async () => {
    await handleRegister({ displayName, email, firstName, lastName, password });
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#181818]">
      <ToastContainer />
      <div className="basis-[60%] flex items-start justify-start p-5 max-w-fit">
        <div className="bg-gray-400 rounded-3xl p-12 flex items-start justify-start">
          <img src={illustrationUrl} alt="Music Illustration" className="w-full h-full object-contain" />
        </div>
      </div>

      <div className="basis-[40%] flex flex-col items-center justify-center h-full pl-10">
        <div className="flex flex-row items-center justify-center w-full">
          <img src={logoUrl} alt="MoodMix Logo" className="w-20 h-20 rounded-lg object-cover shadow-md" />
          <h1 className="text-4xl font-bold text-white text-center">MoodMix</h1>
        </div>
        <p className="text-lg text-gray-300 mb-8 text-center">Music Platform</p>
        <input
          type="text"
          placeholder="Display Name"
          value={displayName}
          onChange={e => setDisplayName(e.target.value)}
          className="mb-4 w-72 px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-white-400"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="mb-4 w-72 px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-white-400"
        />
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          className="mb-4 w-72 px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-white-400"
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          className="mb-4 w-72 px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-white-400"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="mb-6 w-72 px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-white-400"
        />
        <div className="flex flex-row w-72 gap-4">
          <button
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400 w-1/2"
            onClick={onSubmit}
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
          <Link to="/login" className="bg-white hover:bg-gray-200 text-black font-semibold px-8 py-3 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 w-1/2 flex items-center justify-center">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register; 