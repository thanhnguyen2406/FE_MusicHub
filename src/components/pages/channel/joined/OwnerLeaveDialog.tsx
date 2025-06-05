import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { ChannelMember } from '../../../../redux/services/channelApi';
import { useSearchMembersQuery } from '../../../../redux/services/channelApi';

interface OwnerLeaveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newOwnerId: string) => void;
  members: ChannelMember[];
  channelId: string;
}

const OwnerLeaveDialog: React.FC<OwnerLeaveDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  members,
  channelId
}) => {
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: searchResults, isLoading } = useSearchMembersQuery(
    { channelId, searchQuery },
    { skip: !isOpen }
  );

  // Filter out members with OWNER role from search results
  const eligibleMembers = searchResults?.filter(member => member.role === 'MEMBER') || [];

  const handleConfirm = () => {
    if (selectedMemberId) {
      onConfirm(selectedMemberId);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-black mb-6 text-center">Transfer Ownership</h2>
        
        <p className="text-gray-600 mb-4 text-center">
          Select a member to transfer channel ownership to before leaving:
        </p>

        <div className="relative mb-4">
          <input
            type="text"
            className="block w-full pl-4 pr-3 py-2 border border-gray-300 rounded-full text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="mb-6 max-h-60 overflow-y-auto">
          {isLoading ? (
            <p className="text-gray-500 text-center py-4">Searching...</p>
          ) : eligibleMembers.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No eligible members found</p>
          ) : (
            eligibleMembers.map((member) => (
              <div
                key={member.userId}
                className={`p-4 rounded-full cursor-pointer mb-2 transition-colors duration-200 ${
                  selectedMemberId === member.userId
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-black'
                }`}
                onClick={() => setSelectedMemberId(member.userId)}
              >
                <div className="flex items-center">
                  <span className="font-medium">{member.displayName}</span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleConfirm}
            disabled={!selectedMemberId}
            className={`w-full py-3 px-8 rounded-full transition-colors duration-200 font-semibold ${
              selectedMemberId
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            Transfer & Leave
          </button>
          <button
            onClick={onClose}
            className="w-full bg-gray-100 hover:bg-gray-200 text-black py-3 px-8 rounded-full transition-colors duration-200 font-semibold"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default OwnerLeaveDialog; 