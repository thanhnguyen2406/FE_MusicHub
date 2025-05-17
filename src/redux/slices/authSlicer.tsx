import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { ResponseAPI } from '../../types/ResponseAPI';

export const login = createAsyncThunk<ResponseAPI<any>, { email: string, password: string }>('auth/login', async ({ email, password }: { email: string, password: string }) => {
  const res = await fetch('http://localhost:8080/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error('Login failed');
  const data: ResponseAPI<any> = await res.json();
  localStorage.setItem('authToken', data.token || data.data?.access_token || '');
  return data;
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('authToken'),
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(login.pending, state => { state.loading = true; state.error = null });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.token = action.payload.token || action.payload.data?.access_token;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = 'Login failed';
    });
  },
});

export default authSlice.reducer;