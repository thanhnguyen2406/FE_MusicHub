import { RSocketClient, JsonSerializer } from 'rsocket-core';
import WebSocketTransport from 'rsocket-websocket-client';
import { Buffer } from 'buffer';

let rsocketClient: any = null;
let isConnecting = false;
const MAX_RECONNECT_ATTEMPTS = 3;
let reconnectAttempts = 0;

export const getRSocketConnection = async (): Promise<any> => {
  if (rsocketClient) return rsocketClient;

  if (isConnecting) {
    return new Promise((resolve, reject) => {
      const check = setInterval(() => {
        if (!isConnecting) {
          clearInterval(check);
          if (rsocketClient) resolve(rsocketClient);
          else reject(new Error('Failed to get RSocket client'));
        }
      }, 100);
    });
  }

  isConnecting = true;
  try {
    const BinaryMetadataSerializer = {
      serialize: (metadata: string): Buffer => {
        const buffer = Buffer.from(metadata);
        console.log('Serialized metadata:', buffer, 'as string:', buffer.toString());
        return buffer;
      },
      deserialize: (buffer: Buffer): string => {
        const str = buffer.toString();
        console.log('Deserialized metadata:', str);
        return str;
      },
    };

    const client = new RSocketClient({
      serializers: {
        data: JsonSerializer,
        metadata: BinaryMetadataSerializer,
      },
      setup: {
        keepAlive: 60000,
        lifetime: 180000,
        dataMimeType: 'application/json',
        metadataMimeType: 'application/octet-stream',
      },
      transport: new WebSocketTransport({ url: 'ws://localhost:7000/rsocket' }),
    });

    const rsocket = await client.connect();
    rsocketClient = rsocket;

    if (rsocket.connection) {
      rsocket.connection.onClose().subscribe({
        onComplete: () => {
          console.warn('RSocket connection closed.');
          rsocketClient = null;
          reconnectAttempts = 0;
        },
        onError: (err: Error) => {
          console.error('RSocket connection error:', err);
          rsocketClient = null;
          reconnectAttempts = 0;
        },
      });
    }

    return rsocketClient;
  } catch (err) {
    console.error('Failed to establish RSocket connection:', err);
    reconnectAttempts++;
    if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      isConnecting = false;
      return getRSocketConnection();
    }
    throw new Error('Failed to establish RSocket connection after multiple attempts');
  } finally {
    isConnecting = false;
  }
};

class RSocketService {
  async requestResponse<T>(route: any, data: string | Record<string, any> | null): Promise<T> {
    const rsocket = await getRSocketConnection();
    return new Promise((resolve, reject) => {
      let subscription: any = null;
      let hasSubscribed = false;

      const request = rsocket.requestResponse({
        data: data,
        metadata: route,
      });

      request.subscribe({
        onComplete: (response: any) => {
          console.log('Raw response:', response, 'Type:', typeof response);
          try {
            if (typeof response === 'string') {
              resolve(JSON.parse(response) as T);
            } else if (response && typeof response === 'object' && 'data' in response) {
              resolve(response.data as T);
            } else {
              resolve(response as T);
            }
          } catch (error) {
            reject(error);
          }
        },
        onError: (error: Error) => {
          console.error('RSocket error:', error);
          reject(error);
        },
        onSubscribe: (sub: any) => {
          if (hasSubscribed) {
            console.warn('Duplicate subscription detected, ignoring');
            return;
          }
          hasSubscribed = true;
          subscription = sub;
          console.log('Subscribed to requestResponse');
          sub.request(1);
        },
      });
    });
  }
}

export const rsocketService = new RSocketService();