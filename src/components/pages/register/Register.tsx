import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import { useRegisterMutation } from '../../../redux/services/authApi';
import illustrationUrl from '../../../assets/login.png';
import logoUrl from '../../../assets/logo.png';
import { toast } from 'react-toastify';

const Register: React.FC = () => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [register, { isLoading: loading }] = useRegisterMutation();
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName || !email || !firstName || !lastName || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    try {
      console.log('Attempting registration with:', { displayName, email, firstName, lastName });
      const result = await register({ displayName, email, firstName, lastName, password }).unwrap();
      console.log('Registration successful:', result);
      toast.success('Registration successful!');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error) {
      console.error('Registration failed:', error);
    }
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
        <form onSubmit={onSubmit} className="flex flex-col items-center">
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
          <div className="flex flex-row w-72 gap-4">
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400 w-1/2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              Register
            </button>
            <Link to="/login" className="bg-white hover:bg-gray-200 text-black font-semibold px-8 py-3 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 w-1/2 flex items-center justify-center">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register; 