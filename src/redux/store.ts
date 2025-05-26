import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { channelApi } from './services/channelApi';
import { authApi } from './services/authApi';
import { userApi } from './services/userApi';
import { enhancedApi } from '../services/apis';

export const store = configureStore({
  reducer: {
    [channelApi.reducerPath]: channelApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [enhancedApi.reducerPath]: enhancedApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      channelApi.middleware,
      authApi.middleware,
      userApi.middleware,
      enhancedApi.middleware
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 