import React, { useEffect, useState } from 'react';
import JoinableChannels from './JoinableChannels';
import JoinedChannel from './JoinedChannel';

const playlist = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=80&q=80',
    title: 'Song Title 1',
    artist: 'Artist Name',
    duration: '3:53',
    moodTags: ['Chill', 'Relax'],
    votes: 15,
    likes: 10,
    dislikes: 2
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=80&q=80',
    title: 'Song Title 2',
    artist: 'Artist Name',
    duration: '3:31',
    moodTags: ['Jazz'],
    votes: 10,
    likes: 7,
    dislikes: 1
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=80&q=80',
    title: 'Song Title 3',
    artist: 'Artist Name',
    duration: '3:21',
    moodTags: ['Acoustic', 'Chill'],
    votes: 8,
    likes: 5,
    dislikes: 0
  }
];

const members = [
  { name: 'User1', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
  { name: 'User2', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
  { name: 'User3', avatar: 'https://randomuser.me/api/portraits/men/3.jpg' },
  { name: 'User4', avatar: 'https://randomuser.me/api/portraits/women/4.jpg' },
  { name: 'User5', avatar: 'https://randomuser.me/api/portraits/men/5.jpg' },
  { name: 'User6', avatar: 'https://randomuser.me/api/portraits/women/6.jpg' },
  { name: 'User7', avatar: 'https://randomuser.me/api/portraits/men/7.jpg' },
  { name: 'User8', avatar: 'https://randomuser.me/api/portraits/women/8.jpg' },
  { name: 'User9', avatar: 'https://randomuser.me/api/portraits/men/9.jpg' },
  { name: 'User10', avatar: 'https://randomuser.me/api/portraits/women/10.jpg' }
];

const joinableChannels = [
  {
    id: 1,
    name: 'Chill vibes',
    moodTags: ['Chill', 'Relax'],
    membersCount: 120,
    maxUsers: 200,
    description: '120 tracks of relaxing, chill music for any mood.',
    splashIcon: 'https://cdn-icons-png.flaticon.com/512/727/727245.png',
    ownerAvatar: 'https://randomuser.me/api/portraits/men/11.jpg',
    ownerName: 'Alex',
    canManageSongs: true,
    canPlayback: true,
    isPrivate: true,
  },
  {
    id: 2,
    name: 'Party anthems',
    moodTags: ['Party', 'Upbeat'],
    membersCount: 85,
    maxUsers: 150,
    description: 'Get the party started with these anthems!',
    splashIcon: 'https://cdn-icons-png.flaticon.com/512/727/727245.png',
    ownerAvatar: 'https://randomuser.me/api/portraits/women/12.jpg',
    ownerName: 'Jamie',
    canManageSongs: false,
    canPlayback: true,
    isPrivate: false,
  },
  {
    id: 3,
    name: 'Feel-good tunes',
    moodTags: ['Feel-good', 'Happy'],
    membersCount: 60,
    maxUsers: 100,
    description: 'Uplifting songs to brighten your day.',
    splashIcon: 'https://cdn-icons-png.flaticon.com/512/727/727245.png',
    ownerAvatar: 'https://randomuser.me/api/portraits/men/13.jpg',
    ownerName: 'Taylor',
    canManageSongs: true,
    canPlayback: false,
    isPrivate: false,
  },
  {
    id: 4,
    name: 'Relaxing',
    moodTags: ['Relax', 'Calm'],
    membersCount: 40,
    maxUsers: 80,
    description: 'Create playlists and unwind with calming tracks.',
    splashIcon: 'https://cdn-icons-png.flaticon.com/512/727/727245.png',
    ownerAvatar: 'https://randomuser.me/api/portraits/women/14.jpg',
    ownerName: 'Morgan',
    canManageSongs: false,
    canPlayback: false,
    isPrivate: true,
  },
];

const Channel: React.FC = () => {
  const [hasJoinedChannel, setHasJoinedChannel] = useState(false);
  const [likedSongs, setLikedSongs] = useState<number[]>([]);
  const [dislikedSongs, setDislikedSongs] = useState<number[]>([]);
  const [currentChannel, setCurrentChannel] = useState<typeof joinableChannels[0] | null>(null);

  useEffect(() => {
    // TODO: Call backend API here to check if user has joined a channel
    // Example:
    // fetch('/api/check-channel-membership').then(...)
    // setHasJoinedChannel(response.joined)
  }, []);

  const handleJoinChannel = (channelId: number) => {
    const channel = joinableChannels.find(c => c.id === channelId);
    if (channel) {
      setCurrentChannel(channel);
      setHasJoinedChannel(true);
    }
  };

  const handleLike = (songId: number) => {
    setLikedSongs(prev => {
      if (prev.includes(songId)) {
        return prev.filter(id => id !== songId);
      } else {
        setDislikedSongs(prev => prev.filter(id => id !== songId));
        return [...prev, songId];
      }
    });
  };

  const handleDislike = (songId: number) => {
    setDislikedSongs(prev => {
      if (prev.includes(songId)) {
        return prev.filter(id => id !== songId);
      } else {
        setLikedSongs(prev => prev.filter(id => id !== songId));
        return [...prev, songId];
      }
    });
  };

  if (!hasJoinedChannel) {
    return <JoinableChannels channels={joinableChannels} onJoinChannel={handleJoinChannel} />;
  }

  if (!currentChannel) {
    return null;
  }

  return (
    <JoinedChannel
      channel={currentChannel}
      playlist={playlist}
      members={members}
      likedSongs={likedSongs}
      dislikedSongs={dislikedSongs}
      onLike={handleLike}
      onDislike={handleDislike}
    />
  );
};

export default Channel;