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

export const handleApiError = (error: any): { error: FetchError } => {
  const errorMessage = error?.message || 'Network error occurred';
  toast.error(errorMessage, {
    position: 'top-right',
  });
  
  return {
    error: {
      status: error?.status || 500,
      data: {
        message: errorMessage,
      },
    },
  };
};

export const handleApiResponse = (result: any) => {
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
};

export const createErrorHandler = (baseQuery: BaseQueryFn): BaseQueryFn => {
  return async (args, api, extraOptions) => {
    try {
      const result = await baseQuery(args, api, extraOptions);
      return handleApiResponse(result);
    } catch (error: any) {
      return handleApiError(error);
    }
  };
}; 