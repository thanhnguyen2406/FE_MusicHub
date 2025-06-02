import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
    baseUrl: 'ws://localhost:7000',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('access_token');
    
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    
      return headers;
    },
});

export default baseQuery;
