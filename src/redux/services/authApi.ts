import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithErrorHandling, transformResponse } from './baseApi';
import type { ResponseAPI } from '../../types/ResponseAPI';

export interface AuthTokens {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  [key: string]: any;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  displayName: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    login: builder.mutation<ResponseAPI<AuthTokens>, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      transformResponse,
      invalidatesTags: ['Auth'],
    }),

    register: builder.mutation<ResponseAPI<any>, RegisterRequest>({
      query: (userData) => ({
        url: '/users',
        method: 'POST',
        body: userData,
      }),
      transformResponse,
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
} = authApi; 