import React from 'react';
import Song from './Song';
import Member from './Member';

interface JoinedChannelProps {
  channel: {
    name: string;
    splashIcon: string;
    moodTags: string[];
    description: string;
    canManageSongs: boolean;
    canPlayback: boolean;
    isPrivate: boolean;
  };
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
  members: Array<{
    name: string;
    avatar: string;
  }>;
  likedSongs: number[];
  dislikedSongs: number[];
  onLike: (songId: number) => void;
  onDislike: (songId: number) => void;
}

const JoinedChannel: React.FC<JoinedChannelProps> = ({
  channel,
  playlist,
  members,
  likedSongs,
  dislikedSongs,
  onLike,
  onDislike,
}) => {
  return (
    <main className="flex flex-1 bg-[#111] h-full flex-col md:flex-row">
      <section className="flex-1 p-6 md:p-10">
        <div className="mb-8 flex flex-col sm:flex-row items-start gap-6 bg-gradient-to-r from-[#1e293b] to-[#0f172a] p-6 rounded-2xl shadow-lg">
          <img 
            src={channel.splashIcon} 
            alt={`${channel.name} channel`}
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl object-cover shadow-md border-2 border-white/10"
          />
          <div className="flex-1">
            <h2 className="text-white text-3xl font-bold mb-3 leading-tight">
              {channel.name}
            </h2>
            <div className="flex gap-3 mb-4">
              {channel.canManageSongs && (
                <span className="bg-green-700/80 text-white text-xs font-semibold px-3 py-1 rounded-full">Allow user to manage song</span>
              )}
              {channel.canPlayback && (
                <span className="bg-green-700/80 text-white text-xs font-semibold px-3 py-1 rounded-full">Allow user to playback</span>
              )}
              {channel.isPrivate && (
                <span className="bg-red-700/80 text-white text-xs font-semibold px-3 py-1 rounded-full">This playlist is private</span>
              )}
            </div>
          </div>
        </div>
        <div className="mb-2 text-white text-base font-medium text-left pl-4">
          {channel.moodTags.map(tag => `#${tag}`).join(' ')}
        </div>
        <p className="text-gray-300 text-base leading-relaxed mb-2 text-left pl-4">
          {channel.description}
        </p>
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
              onLike={() => onLike(song.id)}
              onDislike={() => onDislike(song.id)}
            />
          ))}
        </ul>
      </section>
      <aside className="w-56 md:w-72 min-w-[180px] md:min-w-[220px] bg-[#181818] border-l-2 border-[#222] p-6 h-full">
        <h3 className="text-white text-lg font-semibold mb-2">Members</h3>
        <ul className="flex flex-col gap-4 flex-1 overflow-y-auto">
          {members.map((member, idx) => (
            <Member key={idx} name={member.name} avatar={member.avatar} />
          ))}
        </ul>
      </aside>
    </main>
  );
};

export default JoinedChannel; 