import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../redux/store';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import type { ResponseAPI } from '../types/ResponseAPI';
import { useState } from 'react';

import { register } from '../redux/slices/authSlicer';

export interface RegisterInput {
  displayName: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export const useRegister = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleRegister = async (input: RegisterInput) => {
    setLoading(true);
    const resultAction = await dispatch(register(input));
    if (register.fulfilled.match(resultAction)) {
      const payload = resultAction.payload as ResponseAPI<any>;
      toast.success(payload.message ?? 'Registration successful', { position: 'top-right' });
      setTimeout(() => navigate('/login'), 1500);
      setLoading(false);
      return true;
    } else {
      const errorPayload = (resultAction.payload as ResponseAPI<any>) || resultAction.error;
      toast.error(errorPayload?.message ?? 'Registration failed', { position: 'top-right' });
      setLoading(false);
      return false;
    }
  };

  return { handleRegister, loading };
};