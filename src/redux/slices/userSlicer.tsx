import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';// Adjust the path as needed

interface UserInfo {
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  displayName: string;
  avatarUrl?: string;
}

interface UserState {
  user: UserInfo | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

export const fetchUserInfo = createAsyncThunk<UserInfo, string>(
  'user/fetchUserInfo',
  async (accessToken, { rejectWithValue }) => {
    try {
      const token = accessToken;
      const res = await fetch('http://localhost:8080/users/my-info', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        return rejectWithValue(errorData.message || 'Failed to fetch user info');
      }

      const responseData = await res.json();
      return responseData.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Unexpected error');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser: (state) => {
      state.user = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserInfo.fulfilled, (state, action: PayloadAction<UserInfo>) => {
        state.loading = false;
        state.user = {
          ...action.payload,
          avatarUrl: action.payload.avatarUrl || "/assets/default-avatar.png",
        };
      })
      .addCase(fetchUserInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;