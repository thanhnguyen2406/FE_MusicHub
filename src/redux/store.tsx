import { configureStore } from '@reduxjs/toolkit';
import todoReducer from './slices/todoSlicer';
import authReducer from './slices/authSlicer';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    todo: todoReducer,
  },
});

export type AppDispatch = typeof store.dispatch;