import {
  encodeCompositeMetadata,
  encodeRoute,
  WellKnownMimeType,
} from 'rsocket-core';
import { getRSocket } from './client';
import { getAuthHeaders } from '../utils/apiHeaders';
import { createApi } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import { Buffer } from 'buffer';

interface RSocketPayload<T = any> {
  data: T;
  metadata?: Uint8Array;
}

interface ErrorResponse {
  error: string;
}

interface TestResponse {
  data: string;
}

interface RSocketQueryArgs {
  route: string;
  data: any;
}

function buildCompositeMetadata(route: string): Uint8Array {
  const routingMetadata = encodeRoute(route);
  const token = getAuthHeaders()?.Authorization?.replace('Bearer ', '') ?? '';
  const authMetadata = Buffer.from(token, 'utf-8'); // ✅ Explicit encoding

  return encodeCompositeMetadata([
    [WellKnownMimeType.MESSAGE_RSOCKET_ROUTING, routingMetadata], // ✅ Correct WellKnownMimeType
    [WellKnownMimeType.MESSAGE_RSOCKET_AUTHENTICATION, authMetadata],
  ]);
}

export const rsocketBaseQuery: BaseQueryFn<RSocketQueryArgs, unknown, ErrorResponse> = async ({
  route,
  data,
}) => {
  try {
    const rsocket = await getRSocket();
    if (!rsocket) throw new Error('No RSocket client');

    const metadata = buildCompositeMetadata(route);

    return await new Promise((resolve, reject) => {
      rsocket
        .requestResponse({
          data,
          metadata,
        })
        .subscribe({
          onComplete: (payload: RSocketPayload) => {
            if (!payload?.data) {
              reject({ error: 'Invalid response from server' });
              return;
            }
            resolve({ data: payload.data });
          },
          onError: (error: Error) =>
            reject({ error: error.message || 'RSocket error' }),
        });
    });
  } catch (error: any) {
    return { error: error?.message || 'RSocket connection failed' };
  }
};

// RTK Query API
export const rsocketApi = createApi({
  reducerPath: 'rsocketApi',
  baseQuery: rsocketBaseQuery,
  endpoints: (builder) => ({
    test: builder.query<TestResponse, void>({
      query: () => ({
        route: 'test', // ✅ Will be encoded properly now
        data: null,
      }),
    }),
  }),
});

export const { useTestQuery } = rsocketApi;

// General request-response (outside of RTK Query)
export async function rsocketRequestResponse<T = unknown>(
  route: string,
  data: any
): Promise<T> {
  const rsocket = await getRSocket();
  const metadata = buildCompositeMetadata(route);

  return await new Promise((resolve, reject) => {
    rsocket
      .requestResponse({
        data,
        metadata,
      })
      .subscribe({
        onComplete: (payload: RSocketPayload<T | ErrorResponse>) => {
          if ((payload.data as ErrorResponse)?.error) {
            reject(payload.data);
          } else {
            resolve(payload.data as T);
          }
        },
        onError: (error: Error) =>
          reject({ error: error.message || 'RSocket error' }),
      });
  });
}

// Stream request (e.g., live data)
export async function rsocketRequestStream(
  route: string,
  data: any,
  onNext: (data: any) => void,
  onComplete?: () => void,
  onError?: (error: Error) => void
): Promise<void> {
  const rsocket = await getRSocket();
  const metadata = buildCompositeMetadata(route);

  rsocket
    .requestStream({
      data,
      metadata,
    })
    .subscribe({
      onNext: (payload: RSocketPayload) => onNext(payload.data),
      onComplete: onComplete ?? (() => {}),
      onError: onError ?? console.error,
    });
}
