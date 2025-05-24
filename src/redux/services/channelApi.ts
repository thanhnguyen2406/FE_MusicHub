import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithErrorHandling, transformResponse } from './baseApi';
import type { ResponseAPI } from '../../types/ResponseAPI';

export interface ChannelMember {
  displayName: string;
  avatarUrl: string | null;
  role: 'MEMBER' | 'OWNER';
}

export interface ChannelSong {
  id: string;
  title: string;
  artist: string;
  url: string;
  moodTag: string;
  thumbnail: string;
  duration: number;
  status: 'WAITING' | 'PLAYING' | 'PLAYED';
  totalUpVotes: number;
  totalDownVotes: number;
}

export interface ChannelDetails {
  id: string;
  name: string;
  url: string;
  tagList: string[];
  description?: string;
  maxUsers: number;
  currentUsers: number;
  allowOthersToManageSongs: boolean;
  allowOthersToControlPlayback: boolean;
  isLocked: boolean;
  members: ChannelMember[];
  songs: ChannelSong[];
}

export interface Channel {
  id: string;
  name: string;
  url: string;
  tagList: string[];
  description?: string;
  maxUsers: number;
  currentUsers: number;
  ownerDisplayName: string;
  allowOthersToManageSongs: boolean;
  allowOthersToControlPlayback: boolean;
  isLocked: boolean;
}

interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
}

export interface AddChannelRequest {
  name: string;
  url: string;
  tagList: string[];
  description: string;
  maxUsers: number;
  allowOthersToManageSongs: boolean;
  allowOthersToControlPlayback: boolean;
  locked: boolean;
}

interface GetChannelsParams {
  page?: number;
  size?: number;
}

export const channelApi = createApi({
  reducerPath: 'channelApi',
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ['Channel'],
  endpoints: (builder) => ({
    getChannels: builder.query<ResponseAPI<PaginatedResponse<Channel>>, GetChannelsParams>({
      query: (params) => ({
        url: '/channels',
        params: {
          page: params.page ?? 0,
          size: params.size ?? 10,
        },
      }),
      transformResponse,
      providesTags: ['Channel'],
    }),

    getChannelById: builder.query<ResponseAPI<ChannelDetails>, string>({
      query: (channelId) => `/channels/${channelId}`,
      transformResponse
    }),

    getMyChannel: builder.query<ResponseAPI<string>, void>({
      query: () => '/channels/my-channel',
      transformResponse,
      providesTags: ['Channel'],
    }),

    addChannel: builder.mutation<ResponseAPI<String>, AddChannelRequest>({
      query: (channel) => ({
        url: '/channels',
        method: 'POST',
        body: channel,
      }),
      transformResponse,
      invalidatesTags: ['Channel'],
    }),

  }),
});

export const {
  useGetChannelsQuery,
  useGetChannelByIdQuery,
  useGetMyChannelQuery,
  useAddChannelMutation,
} = channelApi; 