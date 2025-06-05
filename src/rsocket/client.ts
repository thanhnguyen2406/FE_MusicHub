import {
  RSocketClient,
  JsonSerializers,
  encodeCompositeMetadata,
  encodeRoute,
  WellKnownMimeType,
} from 'rsocket-core';
import RSocketWebSocketClient from 'rsocket-websocket-client';
import { RSOCKET_URL } from './constants';
import { Buffer } from 'buffer';
import { getAuthHeaders } from '../utils/apiHeaders';

let rsocketInstance: any = null;

export const getRSocket = async () => {
  if (rsocketInstance) return rsocketInstance;

  const client = new RSocketClient({
    serializers: JsonSerializers,
    setup: {
      keepAlive: 30000,
      lifetime: 180000,
      dataMimeType: 'application/json',
      metadataMimeType: WellKnownMimeType.MESSAGE_RSOCKET_COMPOSITE_METADATA.string,
    },
    transport: new RSocketWebSocketClient({ url: RSOCKET_URL }),
  });

  rsocketInstance = await new Promise((resolve, reject) => {
    client.connect().subscribe({
      onComplete: resolve,
      onError: reject,
    });
  });

  return rsocketInstance;
};

interface RSocketPayload<T = any> {
  data: T;
  metadata?: Uint8Array;
}

export const rsocketBaseQuery = async ({ route, data }: { route: string; data: any }) => {
  const rsocket = await getRSocket();

  const routingMetadata = encodeRoute(route);

  const authHeaders = getAuthHeaders();
  const token = authHeaders?.Authorization?.replace('Bearer ', '') ?? '';
  const authMetadata = Buffer.from(token, 'utf-8');

  const metadata = encodeCompositeMetadata([
    [WellKnownMimeType.MESSAGE_RSOCKET_ROUTING, routingMetadata],
    [WellKnownMimeType.MESSAGE_RSOCKET_AUTHENTICATION, authMetadata],
  ]);

  return new Promise((resolve, reject) => {
    rsocket
      .requestResponse({
        data,
        metadata,
      })
      .subscribe({
        onComplete: (payload: RSocketPayload) => {
          resolve({ data: payload.data });
        },
        onError: (error: Error) => {
          reject({ error: error.message || 'RSocket error' });
        },
      });
  });
};