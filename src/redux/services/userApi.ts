import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithErrorHandling, transformResponse } from './baseApi';
import type { ResponseAPI } from '../../types/ResponseAPI';

export interface UserInfo {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  displayName: string;
  avatarUrl?: string;
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
    getMyInfo: builder.query<ResponseAPI<UserInfo>, void>({
      query: () => ({
        url: '/users/my-info',
        method: 'GET',
      }),
      transformResponse,
      providesTags: ['User'],
    }),

    updateUser: builder.mutation<ResponseAPI<null>, UpdateUserInput>({
      query: (input) => ({
        url: '/users',
        method: 'PUT',
        body: input,
      }),
      transformResponse,
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGetMyInfoQuery,
  useUpdateUserMutation,
} = userApi; 