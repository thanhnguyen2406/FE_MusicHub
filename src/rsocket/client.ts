import {
  RSocketClient,
  JsonSerializers,
} from 'rsocket-core';
import RSocketWebSocketClient from 'rsocket-websocket-client';
import { RSOCKET_URL } from './constants';
import { encodeCompositeMetadata, WellKnownMimeType } from 'rsocket-core';
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
      metadataMimeType: 'message/x.rsocket.composite-metadata.v0',
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

/**
 * rsocketBaseQuery dùng để gọi các route RSocket requestResponse
 * @param param0 route: string tên route, data: payload gửi (object hoặc null)
 */
export const rsocketBaseQuery = async ({ route, data }: { route: string; data: any }) => {
  const rsocket = await getRSocket();

  const routingMetadata = Buffer.from(route, 'utf8');
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
        metadataMimeType: 'message/x.rsocket.composite-metadata.v0',
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
