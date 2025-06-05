import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import Song from './Song';
import Member from './Member';
import defaultAvatar from '../../../../assets/defaultAvatar.png';
import channelAvatar from '../../../../assets/channelAvatar.jpg';
import type { ChannelMember } from '../../../../redux/services/channelApi';
import { 
  useVoteSongMutation, 
  useLeaveChannelMutation, 
  useTransferOwnershipMutation,
  useDeleteChannelMutation,
  useSearchMembersQuery,
  useKickMemberMutation,
  useUpdateChannelMutation
} from '../../../../redux/services/channelApi';
import { useAddSongMutation, useDeleteSongMutation } from '../../../../redux/services/songApi';
import { PlusCircleIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import AddSongForm from './AddSongForm';
import LeaveChannelDialog from './LeaveChannelDialog';
import TransferOwnershipDialog from './TransferOwnershipDialog';
import OwnerLeaveDialog from './OwnerLeaveDialog';
import UpdateChannelForm from './UpdateChannelForm';
import { API_PATHS } from '../../../../services/apis';
import { useAppSelector } from '../../../../redux/store';

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
    url?: string;
    maxUsers?: number;
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
  const { channelId } = useParams<{ channelId: string }>();
  const [likedSongs, setLikedSongs] = useState<string[]>([]);
  const [dislikedSongs, setDislikedSongs] = useState<string[]>([]);
  const [isAddSongFormOpen, setIsAddSongFormOpen] = useState(false);
  const [isUpdateChannelFormOpen, setIsUpdateChannelFormOpen] = useState(false);
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
  const [isOwnerLeaveDialogOpen, setIsOwnerLeaveDialogOpen] = useState(false);
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [playlist, setPlaylist] = useState(initialPlaylist);
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const userInfo = useAppSelector(state => state.user.userInfo);
  const [voteSong] = useVoteSongMutation();
  const [addSong] = useAddSongMutation();
  const [deleteSong] = useDeleteSongMutation();
  const [leaveChannel] = useLeaveChannelMutation();
  const [deleteChannel] = useDeleteChannelMutation();
  const [transferOwnership] = useTransferOwnershipMutation();
  const [kickMember] = useKickMemberMutation();
  const [updateChannel] = useUpdateChannelMutation();

  const { data: searchResults, isLoading: isSearching } = useSearchMembersQuery(
    { channelId: channel.id, searchQuery: memberSearchQuery },
    { skip: !memberSearchQuery }
  );

  const displayedMembers = memberSearchQuery ? searchResults || [] : channel.members;

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
      setIsOwnerLeaveDialogOpen(false);
      if (isOwnerLeaveDialogOpen) {
        onLeaveChannel();
      }
    } catch (error) {
      console.error('Failed to transfer ownership:', error);
    }
  };

  const handleKickMember = async (memberId: string) => {
    try {
      await kickMember({ channelId: channel.id, memberId }).unwrap();
    } catch (error) {
      console.error('Failed to kick member:', error);
    }
  };

  const handleUpdateChannel = async (data: {
    name: string;
    url: string;
    tagList: string[];
    description: string;
    maxUsers: number;
    allowOthersToManageSongs: boolean;
    allowOthersToControlPlayback: boolean;
    password?: string;
  }) => {
    try {
      await updateChannel({ channelId: channel.id, ...data }).unwrap();
      setIsUpdateChannelFormOpen(false);
      onSongAdded(); // Refresh channel data
    } catch (error) {
      console.error('Failed to update channel:', error);
    }
  };

  const filteredMembers = useMemo(() => {
    return channel.members.filter(member =>
      member.displayName.toLowerCase().includes(memberSearchQuery.toLowerCase())
    );
  }, [channel.members, memberSearchQuery]);

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
            <div className="flex gap-3">
              <button
                className="flex items-center gap-2 bg-white hover:bg-gray-100 text-black px-4 py-2 rounded-lg transition-colors duration-200 font-semibold"
                onClick={() => setIsAddSongFormOpen(true)}
              >
                <PlusCircleIcon className="w-5 h-5 stroke-2" />
                <span>Add Song</span>
              </button>
              <button
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-semibold"
                onClick={() => setIsUpdateChannelFormOpen(true)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                <span>Update Channel</span>
              </button>
            </div>
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
        
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 bg-[#222] border border-[#333] rounded-full text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Search members..."
            value={memberSearchQuery}
            onChange={(e) => setMemberSearchQuery(e.target.value)}
          />
        </div>

        <ul className="flex flex-col gap-4 flex-1 overflow-y-auto">
          {isSearching ? (
            <li className="text-gray-400 text-center">Searching...</li>
          ) : displayedMembers.length === 0 ? (
            <li className="text-gray-400 text-center">No members found</li>
          ) : (
            displayedMembers.map((member) => (
              <li key={member.userId} className="flex items-center justify-between">
                <Member 
                  userId={member.userId}
                  name={member.displayName} 
                  avatar={member.avatarUrl || defaultAvatar}
                  role={member.role}
                  isOwner={channel.isOwner}
                  currentUserId={userInfo?.id || ''}
                  onKick={handleKickMember}
                  onTransferOwnership={() => {
                    setIsTransferDialogOpen(true);
                    setSelectedMemberId(member.userId);
                  }}
                />
              </li>
            ))
          )}
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
          setIsOwnerLeaveDialogOpen(true);
        }}
      />

      <TransferOwnershipDialog
        isOpen={isTransferDialogOpen}
        onClose={() => {
          setIsTransferDialogOpen(false);
          setSelectedMemberId('');
        }}
        onConfirm={handleTransferOwnership}
        members={channel.members}
        selectedMemberId={selectedMemberId}
      />

      <OwnerLeaveDialog
        isOpen={isOwnerLeaveDialogOpen}
        onClose={() => {
          setIsOwnerLeaveDialogOpen(false);
          setSelectedMemberId('');
        }}
        onConfirm={handleTransferOwnership}
        members={channel.members}
        channelId={channel.id}
      />

      <UpdateChannelForm
        isOpen={isUpdateChannelFormOpen}
        onClose={() => setIsUpdateChannelFormOpen(false)}
        onSubmit={handleUpdateChannel}
        initialData={{
          name: channel.name,
          url: channel.url || '',
          tagList: channel.moodTags,
          description: channel.description,
          maxUsers: channel.maxUsers || 10,
          allowOthersToManageSongs: channel.canManageSongs,
          allowOthersToControlPlayback: channel.canPlayback,
          isPrivate: channel.isPrivate
        }}
      />
    </main>
  );
};

export default JoinedChannel; 