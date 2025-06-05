import React, { useState, useRef, useEffect } from 'react';
import defaultAvatar from '../../../../assets/defaultAvatar.png';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';

interface MemberProps {
  userId: string;
  name: string;
  avatar: string;
  role: 'MEMBER' | 'OWNER';
  isOwner: boolean;
  currentUserId: string;
  onKick: (userId: string) => void;
  onTransferOwnership: (userId: string) => void;
}

const Member: React.FC<MemberProps> = ({ 
  userId, 
  name, 
  avatar, 
  role,
  isOwner,
  currentUserId,
  onKick,
  onTransferOwnership 
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const showSettings = isOwner && userId !== currentUserId;

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-3">
        <img
          src={avatar}
          alt={name}
          className="w-8 h-8 rounded-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = defaultAvatar;
          }}
        />
        <span className="text-white text-sm">{name}</span>
        {role === 'OWNER' && (
          <span className="ml-2 text-yellow-400 text-xl" title="Owner">👑</span>
        )}
      </div>
      
      {showSettings && (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <EllipsisVerticalIcon className="w-5 h-5" />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[#222] rounded-lg shadow-lg py-1 z-10">
              <button
                onClick={() => {
                  onTransferOwnership(userId);
                  setIsDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-white hover:bg-[#333] transition-colors"
              >
                Transfer Ownership
              </button>
              <button
                onClick={() => {
                  onKick(userId);
                  setIsDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-[#333] transition-colors"
              >
                Kick Member
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Member; 