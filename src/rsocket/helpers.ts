import { encodeCompositeMetadata, WellKnownMimeType } from 'rsocket-core';
import { getRSocket } from './client';
import { COMPOSITE_METADATA } from './constants';
import { Buffer } from 'buffer';
import { getAuthHeaders } from '../utils/apiHeaders';
import { createApi } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn } from '@reduxjs/toolkit/query';

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

const createRouteBuffer = (route: string): Buffer => {
  return Buffer.from(route, 'utf8');
};

const encodeRoutingMetadata = (route: string): Buffer => {
    const routeBuffer = createRouteBuffer(route);
    console.log('Route:', route, 'Route buffer:', routeBuffer, 'Length:', routeBuffer.length);
    const metadataSize = 1 + 2 + routeBuffer.length;
    const buffer = Buffer.alloc(metadataSize);
    buffer.writeUInt8(WellKnownMimeType.ROUTING, 0);
    buffer.writeUInt16BE(routeBuffer.length, 1);
    routeBuffer.copy(buffer, 3);
    console.log('Encoded metadata:', buffer);
    return buffer;
  };

export const rsocketBaseQuery = async ({ route, data }: RSocketQueryArgs) => {
  try {
    console.log('RSocket base query starting...', { route, data });
    const rsocket = await getRSocket();
    if (!rsocket) {
      console.error('RSocket connection failed - no client returned');
      throw new Error('Failed to establish RSocket connection');
    }

    console.log('RSocket client obtained, preparing request...');
    const routingMetadata = Buffer.from(route, 'utf8');
    const authHeaders = getAuthHeaders();
    const authMetadata = Buffer.from(JSON.stringify(authHeaders));
    
    const metadata = encodeCompositeMetadata([
      [WellKnownMimeType.ROUTING, routingMetadata],
      [WellKnownMimeType.APPLICATION_JSON, authMetadata]
    ]);

    console.log('RSocket request prepared, sending...');
    return new Promise((resolve, reject) => {
      rsocket
        .requestResponse({
          data: { payload: data },
          metadata,
          dataMimeType: 'application/json',
          metadataMimeType: 'message/x.rsocket.composite-metadata.v0',
        })
        .subscribe({
          onComplete: (payload: RSocketPayload) => {
            console.log('RSocket response received:', payload);
            if (!payload || !payload.data) {
              console.error('Invalid payload received:', payload);
              reject({ error: 'Invalid response from server' });
              return;
            }
            resolve({ data: payload.data });
          },
          onError: (error: Error) => {
            console.error('RSocket request error:', error);
            reject({ error: error.message || 'RSocket error' });
          },
        });
    });
  } catch (error) {
    console.error('RSocket base query error:', error);
    return { 
      error: error instanceof Error 
        ? error.message 
        : 'Failed to connect to RSocket' 
    };
  }
};

export const rsocketApi = createApi({
  reducerPath: 'rsocketApi',
  baseQuery: rsocketBaseQuery as BaseQueryFn<RSocketQueryArgs, unknown, unknown>,
  endpoints: (builder) => ({
    test: builder.query<{ data: string }, void>({
      query: () => ({
        route: 'test',
        data: null,
      }),
    }),
  }),
});

export const { useTestQuery } = rsocketApi;

export const rsocketRequestResponse = async <T = TestResponse>(route: string, data: any): Promise<T> => {
  const rsocket = await getRSocket();

  const routingMetadata = encodeRoutingMetadata(route);
  const authHeaders = getAuthHeaders();
  const authMetadata = Buffer.from(JSON.stringify(authHeaders));
  
  const metadata = encodeCompositeMetadata([
    [WellKnownMimeType.ROUTING, routingMetadata],
    [WellKnownMimeType.APPLICATION_JSON, authMetadata]
  ]);

  return new Promise((resolve, reject) => {
    rsocket
      .requestResponse({
        data: { payload: data },
        metadata,
        dataMimeType: 'application/json',
        metadataMimeType: COMPOSITE_METADATA,
      })
      .subscribe({
        onComplete: (payload: RSocketPayload<T | ErrorResponse>) => {
          const response = payload.data;
          if ((response as ErrorResponse).error) {
            reject(response);
          } else {
            resolve(response as T);
          }
        },
        onError: (error: Error) => reject({ error: error.message || 'RSocket error' }),
      });
  });
};

export const rsocketRequestStream = async (
  route: string,
  data: any,
  onNext: (data: any) => void,
  onComplete?: () => void,
  onError?: (error: Error) => void
): Promise<void> => {
  const rsocket = await getRSocket();

  const routingMetadata = encodeRoutingMetadata(route);
  const authHeaders = getAuthHeaders();
  const authMetadata = Buffer.from(JSON.stringify(authHeaders));
  
  const metadata = encodeCompositeMetadata([
    [WellKnownMimeType.ROUTING, routingMetadata],
    [WellKnownMimeType.APPLICATION_JSON, authMetadata]
  ]);

  rsocket
    .requestStream({
      data,
      metadata,
      dataMimeType: 'application/json',
      metadataMimeType: COMPOSITE_METADATA,
    })
    .subscribe({
      onNext: (payload: RSocketPayload) => onNext(payload.data),
      onComplete: onComplete ?? (() => {}),
      onError: onError ?? console.error,
    });
};