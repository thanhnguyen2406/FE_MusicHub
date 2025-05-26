import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithErrorHandling, transformResponse, API_PATHS } from '../../services/apis';
import type { ResponseAPI } from '../../utils/apiErrorHandler';
import { getAuthHeaders } from '../../utils/apiHeaders';
import type { PaginationParams } from '../../utils/apiParams';
import { getPaginationParams } from '../../utils/apiParams';

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

export const channelApi = createApi({
  reducerPath: 'channelApi',
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ['Channel'],
  endpoints: (builder) => ({
    getChannels: builder.query<ResponseAPI<PaginatedResponse<Channel>>, PaginationParams>({
      query: (params) => ({
        url: `${API_PATHS.CHANNELS}`,
        method: 'GET',
        params: getPaginationParams(params),
        headers: getAuthHeaders(),
      }),
      transformResponse,
      providesTags: ['Channel'],
    }),

    getChannelById: builder.query<ResponseAPI<ChannelDetails>, string>({
      query: (channelId) => ({
        url: `${API_PATHS.CHANNELS}/${channelId}`,
        method: 'GET',
        headers: getAuthHeaders(),
      }),
      transformResponse,
      providesTags: ['Channel'],
    }),

    getMyChannel: builder.query<ResponseAPI<string>, void>({
      query: () => ({
        url: `${API_PATHS.CHANNELS}/my-channel`,
        method: 'GET',
        headers: getAuthHeaders(),
      }),
      transformResponse,
      providesTags: ['Channel'],
    }),

    addChannel: builder.mutation<ResponseAPI<String>, AddChannelRequest>({
      query: (channel) => ({
        url: `${API_PATHS.CHANNELS}`,
        method: 'POST',
        body: channel,
        headers: getAuthHeaders(),
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