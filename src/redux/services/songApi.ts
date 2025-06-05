import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithErrorHandling, transformResponse, API_PATHS } from '../../services/apis';
import type { ResponseAPI } from '../../utils/apiErrorHandler';
import { getAuthHeaders } from '../../utils/apiHeaders';

export interface SongDTO {
  title: string;
  artist: string;
  url: string;
  moodTag: string;
  thumbnail: string;
  duration: number;
}

export interface VoteSongDTO {
  songId: string;
  channelId: string;
  voteType: 'like' | 'dislike';
}

export const songApi = createApi({
  reducerPath: 'songApi',
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ['Song'],
  endpoints: (builder) => ({
    addSong: builder.mutation<ResponseAPI<void>, { channelId: string; song: SongDTO }>({
      query: ({ channelId, song }) => ({
        url: `${API_PATHS.CHANNELS}/${channelId}/songs`,
        method: 'POST',
        body: song,
        headers: getAuthHeaders(),
      }),
      transformResponse,
      invalidatesTags: ['Song'],
    }),
    deleteSong: builder.mutation<ResponseAPI<void>, { channelId: string; songId: string }>({
      query: ({ channelId, songId }) => ({
        url: `${API_PATHS.CHANNELS}/${channelId}/songs/${songId}`,
        method: 'DELETE',
        headers: getAuthHeaders(),
      }),
      transformResponse,
      invalidatesTags: ['Song'],
    }),
    likeSong: builder.mutation<ResponseAPI<VoteSongDTO>, { channelId: string; songId: string }>({
      query: ({ channelId, songId }) => ({
        url: `${API_PATHS.CHANNELS}/${channelId}/songs/${songId}/like`,
        method: 'POST',
        headers: getAuthHeaders(),
      }),
      transformResponse,
      invalidatesTags: ['Song'],
    }),
    dislikeSong: builder.mutation<ResponseAPI<VoteSongDTO>, { channelId: string; songId: string }>({
      query: ({ channelId, songId }) => ({
        url: `${API_PATHS.CHANNELS}/${channelId}/songs/${songId}/dislike`,
        method: 'POST',
        headers: getAuthHeaders(),
      }),
      transformResponse,
      invalidatesTags: ['Song'],
    }),
  }),
});

export const {
  useAddSongMutation,
  useDeleteSongMutation,
  useLikeSongMutation,
  useDislikeSongMutation,
} = songApi; 