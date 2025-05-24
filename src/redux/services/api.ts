import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseApi';
import { channelApi } from './channelApi';

export const api = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['Channel'],
  endpoints: () => ({}),
});

export const enhancedApi = api.enhanceEndpoints({
  endpoints: () => ({
    ...channelApi.endpoints,
  }),
}); 