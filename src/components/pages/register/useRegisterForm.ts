import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useRegisterMutation } from '../../../redux/services/userApi';

export const useRegisterForm = () => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [register, { isLoading }] = useRegisterMutation();
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

  return {
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
  };
}; 