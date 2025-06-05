import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import JoinableChannels from './joinable/JoinableChannels';
import JoinedChannel from './joined/JoinedChannel';
import songThumbnail from '../../../assets/songThumbnail.jpg';
import type { ChannelDetails as ApiChannelDetails, ChannelSong, ChannelMember } from '../../../redux/services/channelApi';
import { 
  useGetMyChannelQuery,
  useGetChannelByIdQuery,
  useJoinChannelMutation
} from '../../../redux/services/channelApi';
import { useAppSelector } from '../../../redux/store';

interface ChannelDetails extends Omit<ApiChannelDetails, 'songs'> {
  songs: ChannelSong[];
}

interface CurrentChannel {
  id: string;
  name: string;
  splashIcon: string;
  moodTags: string[];
  description: string;
  canManageSongs: boolean;
  canPlayback: boolean;
  isPrivate: boolean;
  members: ChannelMember[];
  playlist: Array<{
    id: string;
    image: string;
    title: string;
    artist: string;
    duration: string;
    moodTags: string[];
    likes: number;
    dislikes: number;
  }>;
  isOwner: boolean;
  url?: string;
  maxUsers?: number;
}

interface ApiError {
  code: number;
  message: string;
  data: any;
}

const Channel: React.FC = () => {
  const navigate = useNavigate();
  const { channelId } = useParams<{ channelId: string }>();
  const [hasJoinedChannel, setHasJoinedChannel] = useState(false);
  const [currentChannel, setCurrentChannel] = useState<CurrentChannel | null>(null);
  const [error, setError] = useState<string | null>(null);
  const userInfo = useAppSelector(state => state.user.userInfo);

  const token = localStorage.getItem('access_token');

  const { data: myChannelData, error: myChannelError, refetch: refetchMyChannel } = useGetMyChannelQuery();

  const { data: channelDetails, error: channelDetailsError, refetch: refetchChannel } = useGetChannelByIdQuery(channelId || '', {
    skip: !channelId || !hasJoinedChannel,
    pollingInterval: 2000
  });

  const [joinChannel] = useJoinChannelMutation();

  useEffect(() => {
    if (myChannelData?.data) {
      setHasJoinedChannel(true);
      navigate(`/channels/${myChannelData.data}`);
    } else if (myChannelData === null) {
      setHasJoinedChannel(false);
      setCurrentChannel(null);
    }
  }, [myChannelData, navigate]);

  useEffect(() => {
    if (channelDetails?.data) {
      const isOwner = userInfo?.id === channelDetails.data.ownerId;
      setCurrentChannel({
        id: channelDetails.data.id,
        name: channelDetails.data.name,
        splashIcon: '',
        moodTags: channelDetails.data.tagList,
        description: channelDetails.data.description || '',
        canManageSongs: channelDetails.data.allowOthersToManageSongs,
        canPlayback: channelDetails.data.allowOthersToControlPlayback,
        isPrivate: channelDetails.data.isLocked,
        members: channelDetails.data.members,
        isOwner,
        url: channelDetails.data.url,
        maxUsers: channelDetails.data.maxUsers,
        playlist: (channelDetails.data.songs || []).map((song: ChannelSong) => {
          const minutes = Math.floor(song.duration / 60);
          const seconds = song.duration % 60;
          const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;
          return {
            id: song.id.toString(),
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
      setHasJoinedChannel(true);
      setError(null);
    }
  }, [channelDetails, userInfo]);

  useEffect(() => {
    if (channelDetailsError) {
      console.error('Channel fetch error:', channelDetailsError);
      const error = channelDetailsError as ApiError;
      if (error.code === 500) {
        setHasJoinedChannel(false);
        setCurrentChannel(null);
      } else {
        setError('Failed to receive channel updates. Please try refreshing the page.');
      }
    }
  }, [channelDetailsError]);

  const handleJoinChannel = async (channelId: string) => {
    try {
      const result = await joinChannel(channelId).unwrap();
      setHasJoinedChannel(true);
      navigate(`/channels/${channelId}`);
    } catch (error) {
      console.error('Failed to join channel:', error);
      setError('Failed to join channel. Please try again.');
    }
  };

  const handleLeaveChannel = async () => {
    try {
      setHasJoinedChannel(false);
      setCurrentChannel(null);
      setError(null);
      navigate('/channels');
    } catch (error) {
      console.error('Error during leave channel navigation:', error);
    }
  };

  if (!token) {
    return <JoinableChannels onJoinChannel={handleJoinChannel} />;
  }

  if (error) {
    if (
      error.includes('No channel found') ||
      error.includes('Join or create a channel')
    ) {
      return <JoinableChannels onJoinChannel={handleJoinChannel} />;
    }
    return (
      <div className="min-h-screen bg-[#111] text-white p-20">
        <p>{error}</p>
      </div>
    );
  }

  if (!hasJoinedChannel || !channelDetails?.data) {
    return <JoinableChannels onJoinChannel={handleJoinChannel} />;
  }

  if (!currentChannel) {
    return <div className="min-h-screen bg-[#111] text-white p-20">Loading channel...</div>;
  }

  return (
    <JoinedChannel
      channel={currentChannel}
      playlist={currentChannel.playlist}
      onSongAdded={refetchChannel}
      onLeaveChannel={handleLeaveChannel}
    />
  );
};

export default Channel;