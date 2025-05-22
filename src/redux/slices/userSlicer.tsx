import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ResponseAPI } from '../../types/ResponseAPI';

interface UserInfo {
  id: string;
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

interface UpdateUserInput {
  id: string;
  firstName: string;
  lastName?: string;
  displayName?: string;
  avatar?: string;
}

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
      const responseData = await res.json();

      if (!res.ok) {
        return rejectWithValue(responseData.message || 'Failed to fetch user info');
      }

      
      return responseData.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Unexpected error');
    }
  }
);

export const updateUserInfo = createAsyncThunk<
  ResponseAPI<null>, // vì response không trả `data`, chỉ có `code` và `message`
  { input: UpdateUserInput; accessToken: string }
>(
  'user/updateUserInfo',
  async ({ input, accessToken }, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:8080/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(input),
      });

      const data: ResponseAPI<null> = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to update user');
      }

      return data;
    } catch (error: any) {
      console.error('Update user error:', error);
      return rejectWithValue({
        code: 500,
        message: error.message || 'Unexpected error',
        data: null,
      } as ResponseAPI<null>);
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
        state.error = (action.payload as ResponseAPI<any>)?.message || 'Failed to fetch user info';
      })
      .addCase(updateUserInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserInfo.fulfilled, (state, action: PayloadAction<ResponseAPI<null>>) => {
        state.loading = false;
      })
      .addCase(updateUserInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as ResponseAPI<any>)?.message || 'Failed to update user info';
      });
  },
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;