import React from 'react';
import JoinChannelCard from './JoinChannelCard';

interface JoinableChannelsProps {
  channels: Array<{
    id: number;
    name: string;
    moodTags: string[];
    membersCount: number;
    maxUsers: number;
    description: string;
    ownerAvatar: string;
    ownerName: string;
  }>;
  onJoinChannel: (channelId: number) => void;
}

const JoinableChannels: React.FC<JoinableChannelsProps> = ({ channels, onJoinChannel }) => {
  return (
    <div className="min-h-screen bg-[#111] text-white p-20">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Music Channels</h1>
        <h2 className="text-xl font-semibold mb-4 text-left pl-4">Join channels</h2>
        <div className="flex flex-col gap-4">
          {channels.map(channel => (
            <JoinChannelCard
              channelId={channel.id}
              key={channel.id}
              name={channel.name}
              moodTags={channel.moodTags}
              membersCount={channel.membersCount}
              maxUsers={channel.maxUsers}
              description={channel.description}
              ownerAvatar={channel.ownerAvatar}
              ownerName={channel.ownerName}
              onJoin={() => onJoinChannel(channel.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default JoinableChannels; 