import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithErrorHandling, transformResponse, API_PATHS } from '../../services/apis';
import type { ResponseAPI } from '../../utils/apiErrorHandler';
import { getDefaultHeaders } from '../../utils/apiHeaders';

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

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    login: builder.mutation<ResponseAPI<AuthTokens>, LoginRequest>({
      query: (credentials) => ({
        url: `${API_PATHS.AUTH}/login`,
        method: 'POST',
        body: credentials,
        headers: getDefaultHeaders(),
      }),
      transformResponse,
      invalidatesTags: ['Auth'],
    })
  }),
});

export const {
  useLoginMutation
} = authApi; 