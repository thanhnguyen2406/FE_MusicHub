import React, { useState, useEffect } from 'react';
import JoinChannelCard from './JoinChannelCard';
import JoinPopUp from './JoinPopUp';
import AddChannelPopUp from './AddPopUp';
import defaultAvatar from '../../../assets/defaultAvatar.png';
import addIcon from '../../../assets/add.svg';
import urlIcon from '../../../assets/url.svg';

interface Channel {
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
  locked?: boolean;
}

interface JoinableChannelsProps {
  onJoinChannel: (channelId: number) => void;
}

const API_BASE_URL = 'http://localhost:7000/api';

const JoinableChannels: React.FC<JoinableChannelsProps> = ({ onJoinChannel }) => {
  const [page, setPage] = useState<number>(0);
  const [size] = useState<number>(10);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/channels?page=${page}&size=${size}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        const data = await response.json();
        setChannels(data.content);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch channels'));
      } finally {
        setLoading(false);
      }
    };

    fetchChannels();
  }, [page, size]);

  const handleAddChannel = async (channelData: {
    name: string;
    url: string;
    tagList: string[];
    description: string;
    maxUsers: number;
    allowOthersToManageSongs: boolean;
    allowOthersToControlPlayback: boolean;
  }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/channels`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...channelData,
          locked: false
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create channel');
      }

      // Refresh channels list
      const updatedResponse = await fetch(`${API_BASE_URL}/channels?page=${page}&size=${size}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      const data = await updatedResponse.json();
      setChannels(data.content);
    } catch (err) {
      console.error('Failed to add channel:', err);
      throw err;
    }
  };

  const transformedChannels = channels.map((channel: Channel) => ({
    id: parseInt(channel.id),
    name: channel.name,
    url: channel.url,
    moodTags: channel.tagList,
    membersCount: channel.currentUsers,
    maxUsers: channel.maxUsers,
    description: channel.description || '',
    ownerAvatar: defaultAvatar,
    ownerName: channel.ownerDisplayName,
    locked: channel.locked ?? channel.isLocked
  }));

  const totalPages = Math.ceil(channels.length / size);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(0, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => setPage(i)}
          className={`px-3 py-1 rounded-lg ${
            page === i
              ? 'bg-white text-black'
              : 'bg-white/10 hover:bg-white/20 text-white'
          }`}
        >
          {i + 1}
        </button>
      );
    }
    return pageNumbers;
  };

  if (loading) {
    return <div className="min-h-screen bg-[#111] text-white p-20">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen bg-[#111] text-white p-20">Error loading channels</div>;
  }

  const handleJoinChannelByUrl = async (url: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/channels/join-by-url`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url, password })
      });

      if (!response.ok) {
        throw new Error('Failed to join channel');
      }

      const data = await response.json();
      onJoinChannel(parseInt(data.channelId));
    } catch (err) {
      console.error('Failed to join channel:', err);
      throw err;
    }
  };

  return (
    <div className="min-h-screen bg-[#111] text-white p-20">
      <JoinPopUp open={showJoinModal} onClose={() => setShowJoinModal(false)} onJoin={handleJoinChannelByUrl} />
      <AddChannelPopUp
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddChannel}
      />
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Music Channels</h1>
          <div className="flex gap-3">
            <button className="bg-white text-black px-5 py-2 rounded-full font-semibold transition hover:bg-gray-200 flex items-center gap-2" onClick={() => setShowAddModal(true)}>
              <img src={addIcon} alt="Add" className="w-4 h-4" />
              Add
            </button>
            <button 
              className="bg-white text-black px-5 py-2 rounded-full font-semibold transition hover:bg-gray-200 flex items-center gap-2" 
              onClick={() => setShowJoinModal(true)}
            >
              <img src={urlIcon} alt="Join" className="w-5 h-5" />
              Join
            </button>
          </div>
        </div>
        <h2 className="text-xl font-semibold mb-4 text-left pl-4">Join channels</h2>
        <div className="flex flex-col gap-4">
          {transformedChannels.map((channel, index) => (
            <JoinChannelCard
              channelId={channel.id}
              key={`${channel.id}-${index}`}
              name={channel.name}
              url={channel.url}
              moodTags={channel.moodTags}
              membersCount={channel.membersCount}
              maxUsers={channel.maxUsers}
              description={channel.description}
              ownerAvatar={channel.ownerAvatar}
              ownerName={channel.ownerName}
              locked={channel.locked}
              onJoin={() => onJoinChannel(channel.id)}
            />
          ))}
        </div>
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => setPage(prevPage => Math.max(0, prevPage - 1))}
              disabled={page === 0}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <div className="flex items-center gap-2">
              {renderPageNumbers()}
            </div>
            <button
              onClick={() => setPage(prevPage => Math.min(totalPages - 1, prevPage + 1))}
              disabled={page === totalPages - 1}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JoinableChannels; 