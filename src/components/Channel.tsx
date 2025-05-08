import React, { useEffect, useState } from 'react';
import Song from './Song.tsx';

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
  { name: 'User4', avatar: 'https://randomuser.me/api/portraits/women/4.jpg' }
];

const Channel: React.FC = () => {
  // State to check if user has joined a channel
  const [hasJoinedChannel, setHasJoinedChannel] = useState(true);
  // State to track liked and disliked songs
  const [likedSongs, setLikedSongs] = useState<number[]>([]);
  const [dislikedSongs, setDislikedSongs] = useState<number[]>([]);

  useEffect(() => {
    // TODO: Call backend API here to check if user has joined a channel
    // Example:
    // fetch('/api/check-channel-membership').then(...)
    // setHasJoinedChannel(response.joined)
  }, []);

  const handleLike = (songId: number) => {
    setLikedSongs(prev => {
      if (prev.includes(songId)) {
        return prev.filter(id => id !== songId);
      } else {
        // Remove from disliked if it was disliked
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
        // Remove from liked if it was liked
        setLikedSongs(prev => prev.filter(id => id !== songId));
        return [...prev, songId];
      }
    });
  };

  return (
    <>
      {!hasJoinedChannel ? (
        // Join channel UI
        <div className="min-h-screen bg-[#111] text-white">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Music Channels</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Channel cards will be added here */}
              <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors">
                <h2 className="text-xl font-semibold mb-2">Energetic Vibes</h2>
                <p className="text-gray-400 mb-4">Feel the energy with these upbeat tunes.</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">128 members</span>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full">
                    Join Channel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Joined channel UI
        <main className="flex flex-1 bg-[#111] min-h-0 flex-col md:flex-row">
          <section className="flex-1 p-6 md:p-10">
            <h2 className="text-white text-xl font-semibold mb-6 text-left">Current Playlist - Mood: Chill</h2>
            <ul className="flex flex-col pl-8">
              {playlist.map((song, idx) => (
                <Song
                  key={song.id}
                  index={idx + 1}
                  image={song.image}
                  title={song.title}
                  artist={song.artist}
                  duration={song.duration}
                  moodTags={song.moodTags}
                  likes={song.likes}
                  dislikes={song.dislikes}
                  liked={likedSongs.includes(song.id)}
                  disliked={dislikedSongs.includes(song.id)}
                  onLike={() => handleLike(song.id)}
                  onDislike={() => handleDislike(song.id)}
                />
              ))}
            </ul>
          </section>
          <aside className="w-56 md:w-72 min-w-[180px] md:min-w-[220px] bg-[#181818] border-l-2 border-[#222] p-6 flex flex-col flex-shrink-0">
            <h3 className="text-white text-lg font-semibold mb-5">Members</h3>
            <ul className="flex flex-col gap-4">
              {members.map((member, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full object-cover bg-[#222]" />
                  <span className="text-white text-base font-medium">{member.name}</span>
                </li>
              ))}
            </ul>
          </aside>
        </main>
      )}
    </>
  );
};

export default Channel;
