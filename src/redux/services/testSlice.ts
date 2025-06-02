import { createApi } from '@reduxjs/toolkit/query/react';
import baseQuery from '../../rsocket/apiBaseQuery';
import { API_PATHS } from '../../services/apis';
import { getAuthHeaders } from '../../utils/apiHeaders';

const testReducer = createApi({
  reducerPath: 'testReducer',
  baseQuery,
  tagTypes: ['Channel'],
  endpoints: (builder) => ({
    testApi: builder.query({
      query: () => ({
        url: `${API_PATHS.CHANNELS}/my-channel`,
        method: 'GET',
        headers: getAuthHeaders(),
      })
    }),
  }),
});

export const { useTestApiQuery } = testReducer;
export default testReducer;