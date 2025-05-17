import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../redux/store';
import { login } from '../redux/slices/authSlicer';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import type { ResponseAPI } from '../types/ResponseAPI';
import { useState } from 'react';

export const useLogin = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    const resultAction = await dispatch(login({ email, password }));
    if (login.fulfilled.match(resultAction)) {
      const payload = resultAction.payload as ResponseAPI<any>;
      toast.success(payload.message ?? 'Login successful', { position: 'top-right' });
      setTimeout(() => navigate('/'), 1500);
      setLoading(false);
      return true;
    } else {
      const errorPayload = (resultAction.payload as ResponseAPI<any>) || resultAction.error;
      toast.error(errorPayload?.message ?? 'Login failed', { position: 'top-right' });
      setLoading(false);
      return false;
    }
  };

  return { handleLogin, loading };
};