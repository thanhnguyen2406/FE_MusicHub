import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLoginMutation } from '../../../redux/services/authApi';
import { Link, useNavigate } from 'react-router-dom';
import illustrationUrl from '../../../assets/login.png';
import logoUrl from '../../../assets/logo.png';
import { toast } from 'react-toastify';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, { isLoading: loading }] = useLoginMutation();
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }
    try {
      console.log('Attempting login with:', { email, password });
      const result = await login({ email, password }).unwrap();
      console.log('Login successful:', result);
      if (result.data?.access_token) {
        localStorage.setItem('access_token', result.data.access_token);
        toast.success('Login successful!');
        setTimeout(() => {
          navigate('/');
        }, 1500);
      }
    } catch (error) {
      console.error('Login failed:', error);
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
          <div className="flex flex-row w-72 gap-4">
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400 w-1/2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              Log in
            </button>
            <Link to="/register" className="bg-white hover:bg-gray-200 text-black font-semibold px-8 py-3 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 w-1/2 flex items-center justify-center">
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;