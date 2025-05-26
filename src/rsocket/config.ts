export const RSOCKET_CONFIG = {
  url: 'ws://localhost:7000/rsocket',
  keepAlive: 60000,
  lifetime: 180000,
  dataMimeType: 'application/json',
  metadataMimeType: 'application/octet-stream',
  setup: {
    dataMimeType: 'application/json',
    metadataMimeType: 'application/octet-stream',
    keepAlive: 60000,
    lifetime: 180000,
  }
} as const;

export const ROUTES = {
  TEST: {
    TEST: 'test'
  },
  CHANNEL: {
    GET_MY_CHANNEL: 'channel.getMyChannel',
    SUBSCRIBE: 'channel.subscribe',
    JOIN: 'channel.join',
    GET_CHANNELS: 'channel.getChannels',
    CREATE: 'channel.create'
  },
  SONG: {
    VOTE: 'song.vote'
  }
} as const;

export interface RequestRsocket {
  payload: any;
} 