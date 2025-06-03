import React, { useState } from 'react';
import Song from './Song';
import Member from './Member';
import defaultAvatar from '../../../../assets/defaultAvatar.png';
import channelAvatar from '../../../../assets/channelAvatar.jpg';
import type { ChannelMember } from '../../../../redux/services/channelApi';
import { 
  useVoteSongMutation, 
  useLeaveChannelMutation, 
  useTransferOwnershipMutation,
  useDeleteChannelMutation 
} from '../../../../redux/services/channelApi';
import { useAddSongMutation, useDeleteSongMutation } from '../../../../redux/services/songApi';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import AddSongForm from './AddSongForm';
import LeaveChannelDialog from './LeaveChannelDialog';
import TransferOwnershipDialog from './TransferOwnershipDialog';
import { API_PATHS } from '../../../../services/apis';

interface JoinedChannelProps {
  channel: {
    id: string;
    name: string;
    splashIcon: string;
    moodTags: string[];
    description: string;
    canManageSongs: boolean;
    canPlayback: boolean;
    isPrivate: boolean;
    members: ChannelMember[];
    isOwner: boolean;
  };
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
  onSongAdded: () => void;
  onLeaveChannel: () => void;
}

const JoinedChannel: React.FC<JoinedChannelProps> = ({
  channel,
  playlist: initialPlaylist,
  onSongAdded,
  onLeaveChannel
}) => {
  const [likedSongs, setLikedSongs] = useState<string[]>([]);
  const [dislikedSongs, setDislikedSongs] = useState<string[]>([]);
  const [isAddSongFormOpen, setIsAddSongFormOpen] = useState(false);
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [playlist, setPlaylist] = useState(initialPlaylist);
  const [voteSong] = useVoteSongMutation();
  const [addSong] = useAddSongMutation();
  const [deleteSong] = useDeleteSongMutation();
  const [leaveChannel] = useLeaveChannelMutation();
  const [deleteChannel] = useDeleteChannelMutation();
  const [transferOwnership] = useTransferOwnershipMutation();

  const handleLike = async (songId: string) => {
    try {
      await voteSong({
        songId: Number(songId),
        request: {
          channelId: channel.id,
          isUpvote: true
        }
      }).unwrap();

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

  const handleDislike = async (songId: string) => {
    try {
      await voteSong({
        songId: Number(songId),
        request: {
          channelId: channel.id,
          isUpvote: false
        }
      }).unwrap();

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

  const handleAddSong = async (songData: {
    title: string;
    artist: string;
    url: string;
    moodTag: string;
    thumbnail: string;
    duration: number;
  }) => {
    try {
      await addSong({ channelId: channel.id, song: songData }).unwrap();
      setIsAddSongFormOpen(false);
      onSongAdded();
    } catch (error) {
      console.error('Failed to add song:', error);
    }
  };

  const handleDeleteSong = async (songId: string) => {
    try {
      console.log('Deleting song with ID:', songId);
      console.log('Channel ID:', channel.id);
      console.log('Delete API URL:', `${API_PATHS.CHANNELS}/${channel.id}/songs/${songId}`);
      
      await deleteSong({ channelId: channel.id, songId }).unwrap();
      console.log('Song deleted successfully');
      
      setPlaylist((prev) => prev.filter((song) => song.id !== songId));
    } catch (error) {
      console.error('Failed to delete song:', error);
    }
  };

  const handleLeaveChannel = async () => {
    try {
      if (channel.isOwner) {
        await deleteChannel(channel.id).unwrap();
      } else {
        await leaveChannel(channel.id).unwrap();
      }
      onLeaveChannel();
    } catch (error) {
      console.error('Failed to leave channel:', error);
    }
  };

  const handleTransferOwnership = async (newOwnerId: string) => {
    try {
      await transferOwnership({ channelId: channel.id, newOwnerId }).unwrap();
      setIsTransferDialogOpen(false);
      setIsLeaveDialogOpen(false);
      onLeaveChannel();
    } catch (error) {
      console.error('Failed to transfer ownership:', error);
    }
  };

  return (
    <main className="flex flex-1 bg-[#111] h-full flex-col md:flex-row">
      <section className="flex-1 p-6 md:p-10">
        <div className="mb-8 flex flex-col sm:flex-row items-start gap-6 bg-gradient-to-r from-[#1e293b] to-[#0f172a] p-6 rounded-2xl shadow-lg">
          <img 
            src={channel.splashIcon || channelAvatar}
            alt={`${channel.name} channel`}
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl object-cover shadow-md border-2 border-white/10"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = channelAvatar;
            }}
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
              <span className={`${channel.isPrivate ? 'bg-red-700/80' : 'bg-green-700/80'} text-white text-xs font-semibold px-3 py-1 rounded-full`}>
                {channel.isPrivate ? 'Private Channel' : 'Public Channel'}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-start justify-between mb-2">
          <div className="text-white text-base font-medium text-left pl-4">
            {channel.moodTags.map(tag => `#${tag}`).join(' ')}
          </div>
          {channel.isOwner && (
            <button
              className="flex items-center gap-2 bg-white hover:bg-gray-100 text-black px-4 py-2 rounded-lg transition-colors duration-200 font-semibold"
              onClick={() => setIsAddSongFormOpen(true)}
            >
              <PlusCircleIcon className="w-5 h-5 stroke-2" />
              <span>Add Song</span>
            </button>
          )}
        </div>
        <p className="text-gray-300 text-base leading-relaxed mb-2 text-left pl-4">
          {channel.description}
        </p>
        <ul className="flex flex-col pl-8">
          {playlist.map((song, idx) => (
            <Song
              key={song.id}
              index={idx + 1}
              image={song.image || defaultAvatar}
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
              isOwner={channel.isOwner}
              onPause={() => console.log('Pause song', song.id)}
              onSkip={() => console.log('Skip song', song.id)}
              onDelete={() => handleDeleteSong(song.id)}
            />
          ))}
        </ul>
      </section>
      <aside className="w-56 md:w-72 min-w-[180px] md:min-w-[220px] bg-[#181818] border-l-2 border-[#222] p-6 h-full flex flex-col">
        <h3 className="text-white text-lg font-semibold mb-2">Members</h3>
        <ul className="flex flex-col gap-4 flex-1 overflow-y-auto">
          {(channel.members || []).map((member, idx) => (
            <li key={idx} className="flex items-center justify-between">
              <Member 
                name={member.displayName} 
                avatar={member.avatarUrl || defaultAvatar}
              />
              {member.role === 'OWNER' && (
                <span className="ml-2 text-yellow-400 text-xl" title="Owner">👑</span>
              )}
            </li>
          ))}
        </ul>
        <button
          onClick={() => setIsLeaveDialogOpen(true)}
          className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 font-semibold"
        >
          Leave Channel
        </button>
      </aside>

      <AddSongForm
        isOpen={isAddSongFormOpen}
        onClose={() => setIsAddSongFormOpen(false)}
        onSubmit={handleAddSong}
      />

      <LeaveChannelDialog
        isOpen={isLeaveDialogOpen}
        onClose={() => setIsLeaveDialogOpen(false)}
        onConfirm={handleLeaveChannel}
        isOwner={channel.isOwner}
        onTransferOwnership={() => {
          setIsLeaveDialogOpen(false);
          setIsTransferDialogOpen(true);
        }}
      />

      <TransferOwnershipDialog
        isOpen={isTransferDialogOpen}
        onClose={() => setIsTransferDialogOpen(false)}
        onConfirm={handleTransferOwnership}
        members={channel.members.filter(member => member.role === 'MEMBER')}
      />
    </main>
  );
};

export default JoinedChannel; 