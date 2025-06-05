import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithErrorHandling, transformResponse, API_PATHS } from '../../services/apis';
import type { ResponseAPI } from '../../utils/apiErrorHandler';
import { getAuthHeaders } from '../../utils/apiHeaders';
import type { PaginationParams } from '../../utils/apiParams';
import { getPaginationParams } from '../../utils/apiParams';

export interface ChannelMember {
  userId: string;
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
  ownerId: string;
  url: string;
  tagList: string[];
  description: string;
  maxUsers: number;
  currentUsers: number;
  allowOthersToManageSongs: boolean;
  allowOthersToControlPlayback: boolean;
  isLocked: boolean;
  members: Array<{
    userId: string;
    displayName: string;
    avatarUrl: string | null;
    role: 'MEMBER' | 'OWNER';
  }>;
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

export interface JoinChannelRequest {
  url: string;
  password: string;
}

export interface VoteSongRequest {
  channelId: string;
  isUpvote: boolean;
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

    joinChannel: builder.mutation<ResponseAPI<void>, string>({
      query: (channelId) => {
        console.log('joinChannel mutation called with channelId:', channelId);
        const url = `${API_PATHS.CHANNELS}/${channelId}/join`;
        console.log('Join channel URL:', url);
        return {
          url,
          method: 'POST',
          headers: getAuthHeaders(),
        };
      },
      transformResponse,
      invalidatesTags: ['Channel'],
    }),

    joinChannelByUrl: builder.mutation<ResponseAPI<{ channelId: string }>, JoinChannelRequest>({
      query: (request) => ({
        url: `${API_PATHS.CHANNELS}/join-by-url`,
        method: 'POST',
        body: request,
        headers: getAuthHeaders(),
      }),
      transformResponse,
      invalidatesTags: ['Channel'],
    }),

    voteSong: builder.mutation<ResponseAPI<void>, { songId: number; request: VoteSongRequest }>({
      query: ({ songId, request }) => ({
        url: `${API_PATHS.SONGS}/${songId}/vote`,
        method: 'POST',
        body: request,
        headers: getAuthHeaders(),
      }),
      transformResponse,
      invalidatesTags: ['Channel'],
    }),

    leaveChannel: builder.mutation<ResponseAPI<void>, string>({
      query: (channelId) => ({
        url: `${API_PATHS.CHANNELS}/${channelId}/leave`,
        method: 'POST',
        headers: getAuthHeaders(),
      }),
      transformResponse,
      invalidatesTags: ['Channel'],
    }),

    deleteChannel: builder.mutation<ResponseAPI<void>, string>({
      query: (channelId) => ({
        url: `${API_PATHS.CHANNELS}/${channelId}`,
        method: 'DELETE',
        headers: getAuthHeaders(),
      }),
      transformResponse,
      invalidatesTags: ['Channel'],
    }),

    transferOwnership: builder.mutation<ResponseAPI<void>, { channelId: string; newOwnerId: string }>({
      query: ({ channelId, newOwnerId }) => ({
        url: `${API_PATHS.CHANNELS}/${channelId}/transfer-ownership?newOwnerId=${newOwnerId}`,
        method: 'POST',
        headers: getAuthHeaders(),
      }),
      transformResponse,
      invalidatesTags: ['Channel'],
    }),

    searchMembers: builder.query<ResponseAPI<ChannelMember[]>, { channelId: string; searchQuery?: string }>({
      query: ({ channelId, searchQuery }) => ({
        url: `${API_PATHS.CHANNELS}/${channelId}/members${searchQuery ? `?search=${searchQuery}` : ''}`,
        method: 'GET',
        headers: getAuthHeaders(),
      }),
      transformResponse,
    }),

    kickMember: builder.mutation<ResponseAPI<void>, { channelId: string; memberId: string }>({
      query: ({ channelId, memberId }) => ({
        url: `${API_PATHS.CHANNELS}/${channelId}/members/${memberId}/kick`,
        method: 'POST',
        headers: getAuthHeaders(),
      }),
      transformResponse,
      invalidatesTags: ['Channel'],
    }),

    updateChannel: builder.mutation<ResponseAPI<void>, {
      channelId: string;
      name: string;
      url: string;
      tagList: string[];
      description: string;
      maxUsers: number;
      allowOthersToManageSongs: boolean;
      allowOthersToControlPlayback: boolean;
      password?: string;
    }>({
      query: ({ channelId, ...data }) => ({
        url: `${API_PATHS.CHANNELS}/${channelId}`,
        method: 'PUT',
        body: data,
        headers: getAuthHeaders()
      }),
      transformResponse,
      invalidatesTags: ['Channel']
    }),
  }),
});

export const {
  useGetChannelsQuery,
  useGetChannelByIdQuery,
  useGetMyChannelQuery,
  useAddChannelMutation,
  useJoinChannelMutation,
  useJoinChannelByUrlMutation,
  useVoteSongMutation,
  useLeaveChannelMutation,
  useDeleteChannelMutation,
  useTransferOwnershipMutation,
  useSearchMembersQuery,
  useKickMemberMutation,
  useUpdateChannelMutation,
} = channelApi; 