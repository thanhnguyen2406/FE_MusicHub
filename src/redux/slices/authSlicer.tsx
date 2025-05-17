import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { ResponseAPI } from '../../types/ResponseAPI';

export interface AuthTokens {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  [key: string]: any;
}

interface AuthState {
  tokens: AuthTokens | null;
  loading: boolean;
  error: string | null;
}

// Helper function to save tokens to localStorage
const saveTokensToStorage = (tokens: AuthTokens) => {
  localStorage.setItem('authTokens', JSON.stringify(tokens));
};

// Helper function to get tokens from localStorage
const getTokensFromStorage = (): AuthTokens | null => {
  const tokens = localStorage.getItem('authTokens');
  return tokens ? JSON.parse(tokens) : null;
};

const initialState: AuthState = {
  tokens: getTokensFromStorage(),
  loading: false,
  error: null,
};

export const login = createAsyncThunk<
  ResponseAPI<any>,
  {
    email: string;
    password: string;
  }
>('auth/login', async ({ email, password }) => {
  const res = await fetch('http://localhost:8080/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error('Login failed');
  const data: ResponseAPI<any> = await res.json();
  return data;
});

export const register = createAsyncThunk<
  ResponseAPI<any>,
  {
    displayName: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  }
>('auth/register', async ({ displayName, email, firstName, lastName, password }) => {
  const res = await fetch('http://localhost:8080/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ displayName, email, firstName, lastName, password }),
  });
  if (!res.ok) throw new Error('Register failed');
  const data: ResponseAPI<any> = await res.json();
  return data;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.tokens = null;
      localStorage.removeItem('authTokens');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        const tokens = action.payload.data as AuthTokens;
        state.tokens = tokens;
        saveTokensToStorage(tokens);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = 'Login failed';
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;