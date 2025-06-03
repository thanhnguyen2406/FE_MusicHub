import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import testReducer from './services/testSlice';
import { channelApi } from './services/channelApi';
import { authApi } from './services/authApi';
import { userApi } from './services/userApi';
import { songApi } from './services/songApi';
import { enhancedApi } from '../services/apis';
import { rsocketApi } from '../rsocket/helpers';
import userReducer from './slices/userSlice';

const reducers = combineReducers({
  [testReducer.reducerPath]: testReducer.reducer,
  [channelApi.reducerPath]: channelApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [songApi.reducerPath]: songApi.reducer,
  [enhancedApi.reducerPath]: enhancedApi.reducer,
  [rsocketApi.reducerPath]: rsocketApi.reducer,
  user: userReducer,
});

export const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(
      channelApi.middleware,
      authApi.middleware,
      userApi.middleware,
      songApi.middleware,
      enhancedApi.middleware,
      rsocketApi.middleware,
      testReducer.middleware
    ),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;