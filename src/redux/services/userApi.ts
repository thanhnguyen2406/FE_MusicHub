import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithErrorHandling, transformResponse, API_PATHS } from '../../services/apis';
import type { ResponseAPI } from '../../utils/apiErrorHandler';
import { getDefaultHeaders, getAuthHeaders } from '../../utils/apiHeaders';

export interface UserInfo {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  displayName: string;
  avatarUrl?: string;
}

interface RegisterRequest {
  displayName: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

interface UpdateUserInput {
  id: string;
  firstName: string;
  lastName?: string;
  displayName?: string;
  avatar?: File;
}

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ['User'],
  endpoints: (builder) => ({
    register: builder.mutation<ResponseAPI<any>, RegisterRequest>({
      query: (userData) => ({
        url: `${API_PATHS.USERS}`,
        method: 'POST',
        body: userData,
        headers: getDefaultHeaders(),
      }),
      transformResponse,
    }),

    getMyInfo: builder.query<ResponseAPI<UserInfo>, void>({
      query: () => ({
        url: `${API_PATHS.USERS}/my-info`,
        method: 'GET',
        headers: getAuthHeaders(),
      }),
      transformResponse,
      providesTags: ['User'],
    }),

    updateUser: builder.mutation<ResponseAPI<null>, UpdateUserInput>({
      query: (input) => ({
        url: `${API_PATHS.USERS}`,
        method: 'PUT',
        body: input,
        headers: getAuthHeaders(),
      }),
      transformResponse,
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useRegisterMutation,
  useGetMyInfoQuery,
  useUpdateUserMutation,
} = userApi; 