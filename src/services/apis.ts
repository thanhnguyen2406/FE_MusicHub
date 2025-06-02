import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import { createErrorHandler } from '../utils/apiErrorHandler';
import type { ResponseAPI } from '../utils/apiErrorHandler';

const BASE_URL = 'http://localhost:8080';

export const API_PATHS = {
  AUTH: '/auth',
  USERS: '/users',
  CHANNELS: '/channels',
  TEST: '/test',
} as const;

export const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
}) as BaseQueryFn;

export const baseQueryWithErrorHandling = createErrorHandler(baseQuery);

export const transformResponse = <T>(response: ResponseAPI<T>) => {
  return response;
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ['Auth', 'Channel', 'User'],
  endpoints: () => ({}),
});

export const enhancedApi = api.enhanceEndpoints({
  endpoints: () => ({}),
}); 