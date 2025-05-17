import { configureStore } from '@reduxjs/toolkit';
import todoReducer from './slices/todoSlicer';
import authReducer from './slices/authSlicer';
import userReducer from './slices/userSlicer';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    todo: todoReducer,
    user: userReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;