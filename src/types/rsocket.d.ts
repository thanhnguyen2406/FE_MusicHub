declare module 'rsocket-websocket-client' {
  export class RSocketClient {
    constructor(options: {
      serializers: any;
      setup: {
        keepAlive: number;
        lifetime: number;
        dataMimeType: string;
        metadataMimeType: 'application/json',
      };
      transport: any;
    });

    connect(): Promise<RSocketClient>;
    requestResponse(options: {
      data: any;
      metadata: string;
    }): {
      subscribe: (callbacks: {
        onComplete: (response: any) => void;
        onError: (error: Error) => void;
      }) => void;
    };
    requestStream(options: {
      data: any;
      metadata: string;
    }): {
      subscribe: (callbacks: {
        onNext: (response: any) => void;
        onError: (error: Error) => void;
        onComplete?: () => void;
      }) => void;
    };
    fireAndForget(options: {
      data: any;
      metadata: string;
    }): {
      subscribe: (callbacks: {
        onComplete: () => void;
        onError: (error: Error) => void;
      }) => void;
    };
  }

  export default class WebSocketTransport {
    constructor(options: { url: string });
  }

  export const JsonSerializers: any;
} 