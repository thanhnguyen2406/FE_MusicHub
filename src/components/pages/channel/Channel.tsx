import React, { useEffect, useState, useMemo } from 'react';
import JoinableChannels from './JoinableChannels';
import JoinedChannel from './JoinedChannel';
import songThumbnail from '../../../assets/songThumbnail.jpg';
import type { ChannelDetails as ApiChannelDetails, ChannelSong } from '../../../redux/services/channelApi';

interface ChannelMember {
  displayName: string;
  avatarUrl: string | null;
  role: 'MEMBER' | 'OWNER';
}

interface ChannelDetails extends Omit<ApiChannelDetails, 'songs'> {
  songs: ChannelSong[];
}

interface CurrentChannel {
  name: string;
  splashIcon: string;
  moodTags: string[];
  description: string;
  canManageSongs: boolean;
  canPlayback: boolean;
  isPrivate: boolean;
  members: ChannelMember[];
  playlist: Array<{
    id: number;
    image: string;
    title: string;
    artist: string;
    duration: string;
    moodTags: string[];
    likes: number;
    dislikes: number;
  }>;
}

const API_BASE_URL = 'http://localhost:7000/api';

const decodeToken = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) throw new Error('Invalid JWT format');
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
    const parsed = JSON.parse(jsonPayload);
    const userId = parsed.sub;
    if (!userId || typeof userId !== 'string') throw new Error('No valid sub claim in token');
    return parsed;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

const Channel: React.FC = () => {
  const [hasJoinedChannel, setHasJoinedChannel] = useState(false);
  const [likedSongs, setLikedSongs] = useState<number[]>([]);
  const [dislikedSongs, setDislikedSongs] = useState<number[]>([]);
  const [currentChannel, setCurrentChannel] = useState<CurrentChannel | null>(null);
  const [myChannelId, setMyChannelId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const userId = useMemo(() => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      console.warn('No access token found in localStorage');
      return null;
    }
    const decodedToken = decodeToken(accessToken);
    console.log('Decoded token:', decodedToken);
    return decodedToken?.sub || null;
  }, []);

  // Get user's channel
  useEffect(() => {
    if (userId && typeof userId === 'string') {
      fetch(`${API_BASE_URL}/channels/my`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      })
        .then(response => response.json())
        .then((channelId: string) => {
          console.log('Fetched channel ID:', channelId);
          setMyChannelId(channelId);
          setHasJoinedChannel(true);
          setError(null);
        })
        .catch((error: Error) => {
          console.error('Failed to fetch my channel:', error);
          setError('No channel found. Join or create a channel to continue.');
        });
    }
  }, [userId]);

  // Subscribe to channel updates
  useEffect(() => {
    if (!myChannelId) return;

    const fetchChannelData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/channels/${myChannelId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        const channelData: ChannelDetails = await response.json();
        
        setCurrentChannel({
          name: channelData.name,
          splashIcon: '',
          moodTags: channelData.tagList,
          description: channelData.description || '',
          canManageSongs: channelData.allowOthersToManageSongs,
          canPlayback: channelData.allowOthersToControlPlayback,
          isPrivate: channelData.isLocked,
          members: channelData.members,
          playlist: (channelData.songs || []).map((song: ChannelSong) => {
            const minutes = Math.floor(song.duration / 60);
            const seconds = song.duration % 60;
            const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            return {
              id: Number(song.id),
              image: song.thumbnail || songThumbnail,
              title: song.title,
              artist: song.artist,
              duration: formattedDuration,
              moodTags: [song.moodTag],
              likes: song.totalUpVotes,
              dislikes: song.totalDownVotes,
            };
          }),
        });
        setError(null);
      } catch (error) {
        console.error('Channel fetch error:', error);
        setError('Failed to receive channel updates. Please try refreshing the page.');
      }
    };

    // Initial fetch
    fetchChannelData();

    // Poll for updates every 5 seconds
    const intervalId = setInterval(fetchChannelData, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, [myChannelId]);

  const handleJoinChannel = async (channelId: number) => {
    try {
      await fetch(`${API_BASE_URL}/channels/${channelId}/join`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      setHasJoinedChannel(true);
      setMyChannelId(channelId.toString());
      setError(null);
    } catch (error) {
      console.error('Failed to join channel:', error);
      setError('Failed to join channel. Please try again.');
    }
  };

  const handleLike = async (songId: number) => {
    if (!myChannelId) return;

    try {
      await fetch(`${API_BASE_URL}/songs/${songId}/vote`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          channelId: myChannelId,
          isUpvote: true
        })
      });

      setLikedSongs((prev) => {
        if (prev.includes(songId)) {
          return prev.filter((id) => id !== songId);
        } else {
          setDislikedSongs((prev) => prev.filter((id) => id !== songId));
          return [...prev, songId];
        }
      });
    } catch (error) {
      console.error('Failed to like song:', error);
    }
  };

  const handleDislike = async (songId: number) => {
    if (!myChannelId) return;

    try {
      await fetch(`${API_BASE_URL}/songs/${songId}/vote`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          channelId: myChannelId,
          isUpvote: false
        })
      });

      setDislikedSongs((prev) => {
        if (prev.includes(songId)) {
          return prev.filter((id) => id !== songId);
        } else {
          setLikedSongs((prev) => prev.filter((id) => id !== songId));
          return [...prev, songId];
        }
      });
    } catch (error) {
      console.error('Failed to dislike song:', error);
    }
  };

  if (!userId) {
    return <div className="min-h-screen bg-[#111] text-white p-20">Please log in to access channels.</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#111] text-white p-20">
        <p>{error}</p>
        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => {
            setError(null);
            setHasJoinedChannel(false);
          }}
        >
          Join a Channel
        </button>
      </div>
    );
  }

  if (!hasJoinedChannel) {
    return <JoinableChannels onJoinChannel={handleJoinChannel} />;
  }

  if (!currentChannel) {
    return <div className="min-h-screen bg-[#111] text-white p-20">Loading channel...</div>;
  }

  return (
    <JoinedChannel
      channel={currentChannel}
      playlist={currentChannel.playlist}
      likedSongs={likedSongs}
      dislikedSongs={dislikedSongs}
      onLike={handleLike}
      onDislike={handleDislike}
    />
  );
};

export default Channel;