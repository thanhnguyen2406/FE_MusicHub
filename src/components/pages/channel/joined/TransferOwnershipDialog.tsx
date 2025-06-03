import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { ChannelMember } from '../../../../redux/services/channelApi';

interface TransferOwnershipDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (memberId: string) => void;
  members: ChannelMember[];
}

const TransferOwnershipDialog: React.FC<TransferOwnershipDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  members
}) => {
  const [selectedMember, setSelectedMember] = useState<string>('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (selectedMember) {
      onConfirm(selectedMember);
    }
  };

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
          Select a member to transfer channel ownership to:
        </p>

        <div className="mb-6 max-h-60 overflow-y-auto">
          {members.map((member) => (
            <div
              key={member.displayName}
              className={`p-4 rounded-full cursor-pointer mb-2 transition-colors duration-200 ${
                selectedMember === member.displayName
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-black'
              }`}
              onClick={() => setSelectedMember(member.displayName)}
            >
              <div className="flex items-center">
                <span className="font-medium">{member.displayName}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleConfirm}
            disabled={!selectedMember}
            className={`w-full py-3 px-8 rounded-full transition-colors duration-200 font-semibold ${
              selectedMember
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            Transfer Ownership
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

export default TransferOwnershipDialog; 