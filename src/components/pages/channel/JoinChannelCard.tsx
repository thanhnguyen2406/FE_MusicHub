import React, { useState } from 'react';
import { FaMusic, FaShareAlt, FaLock, FaLockOpen } from 'react-icons/fa';

interface JoinChannelCardProps {
  channelId: number;
  name: string;
  url: string;
  moodTags: string[];
  membersCount: number;
  maxUsers: number;
  description: string;
  ownerAvatar: string;
  ownerName: string;
  locked: boolean;
  onJoin: () => void;
}

const JoinChannelCard: React.FC<JoinChannelCardProps> = ({ channelId, name, url: channelUrl, moodTags, membersCount, maxUsers, description, ownerAvatar, ownerName, locked, onJoin }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(channelUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="relative flex items-center bg-gray-800 rounded-3xl p-4 mb-4 shadow hover:bg-gray-700 transition-colors">
      <div className="flex items-center justify-center w-12 h-12 bg-red-500 rounded-full mr-4">
        <FaMusic className="text-white text-xl" />
      </div>
      <div className="flex-1 flex flex-col justify-center">
        <div className="font-semibold text-lg text-white text-left mb-0.5 ml-0.5">{name}</div>
        <div className="flex gap-2 mb-1 text-left">
          {moodTags.map((tag, idx) => (
            <span
              key={idx}
              className="bg-blue-900 text-blue-300 text-xs px-2 py-0.5 rounded-full font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="text-gray-300 text-xs text-left mb-1 ml-0.5">{description}</div>
      </div>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center z-10">
        <img src={ownerAvatar} alt="Owner Avatar" className="w-9 h-9 rounded-full shadow-lg object-cover" />
        <span className="ml-2 text-sm text-gray-200 font-light whitespace-nowrap">{ownerName}</span>
      </div>
      <div className="flex items-center justify-center ml-auto mr-8 relative" style={{ zIndex: 5 }}>
        <span className="mr-3 text-lg  text-gray-300" title={locked ? 'Private channel' : 'Public channel'}>
          {locked ? <FaLock /> : <FaLockOpen />}
        </span>
        <span
          onClick={handleShare}
          title="Share channel"
        >
          <FaShareAlt className="text-white text-lg" />
          {copied && (
            <span className="absolute right-0 top-[-1.5rem] bg-gray-900 text-white text-xs px-2 py-1 rounded shadow z-20">Copied!</span>
          )}
        </span>
      </div>
      <div className="flex items-center min-w-[120px]">
        <div className="text-gray-400 text-xs text-left mr-3">
          {membersCount} / {maxUsers} members
        </div>
        <button
          className="bg-orange-600 px-4 py-2 rounded-full text-white-600"
          onClick={onJoin}
        >
          Join
        </button>
      </div>
    </div>
  );
};

export default JoinChannelCard; 