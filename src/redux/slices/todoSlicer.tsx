import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const token = ""

export const login = createAsyncThunk('auth/login', async ({ email, password }: { email: string, password: string }) => {
  const response = await fetch('http://localhost:8080/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  const data = await response.json();
  // Save token(s) to localStorage for caching
  if (data.token) {
    localStorage.setItem('authToken', data.token);
  }
  // If there are other tokens, save them as well
  if (data.refreshToken) {
    localStorage.setItem('refreshToken', data.refreshToken);
  }
  return data;
});

export const fetchTodo = createAsyncThunk('user/fetchMyInfo', async () => {
  const response = await fetch('http://localhost:8080/users/my-info', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`, 
      'Content-Type': 'application/json',
    },
  });
  

  if (!response.ok) {
    throw new Error("Failed to fetch user info");
  }

  const data = await response.json();
  return data.data;
});


const todoSlice = createSlice({
  name: 'todos',
  initialState: {
    isLoading: false,
    data: "",
    error: false,
    token: localStorage.getItem('authToken') || null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTodo.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(fetchTodo.fulfilled, (state, action) => {
      state.isLoading = false
      state.data = action.payload
    })
    builder.addCase(fetchTodo.rejected, (state, action) => {
      state.error = true
    })
    builder.addCase(login.fulfilled, (state, action) => {
      state.token = action.payload.token || null;
    })
  },
});

export default todoSlice.reducer; 