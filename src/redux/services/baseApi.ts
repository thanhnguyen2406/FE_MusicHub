import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import { toast } from 'react-toastify';

export interface ResponseAPI<T> {
  code: number;
  message: string;
  data: T;
}

interface FetchError {
  status: number;
  data: { message?: string };
}

export const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:8080',
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
}) as BaseQueryFn;

export const baseQueryWithErrorHandling: BaseQueryFn = async (args, api, extraOptions) => {
  try {
    const result = await baseQuery(args, api, extraOptions);

    if (result.error) {
      const errorData = (result.error as FetchError).data;
      toast.error(errorData?.message || 'An error occurred', {
        position: 'top-right',
      });
      return result;
    }

    if (result.data) {
      const response = result.data as ResponseAPI<any>;
      if (response.code >= 400) {
        toast.error(response.message || 'An unexpected error occurred', {
          position: 'top-right',
        });
        return {
          error: {
            status: response.code,
            data: {
              message: response.message || 'An error occurred',
            },
          },
        };
      }
    }

    return result;
  } catch (error: any) {
    toast.error(error?.message || 'Network error occurred', {
      position: 'top-right',
    });
    return {
      error: {
        status: 500,
        data: {
          message: error?.message || 'Network error occurred',
        },
      },
    };
  }
};

export const transformResponse = <T>(response: ResponseAPI<T>) => {
  return response;
}; 