import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useLoginMutation } from '../../../redux/services/authApi';

export const useLoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, { isLoading }] = useLoginMutation();
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

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    onSubmit,
  };
}; 