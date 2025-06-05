import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { ChannelMember } from '../../../../redux/services/channelApi';

interface TransferOwnershipDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (memberId: string) => void;
  members: ChannelMember[];
  selectedMemberId: string;
}

const TransferOwnershipDialog: React.FC<TransferOwnershipDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  members,
  selectedMemberId
}) => {
  const selectedMember = members.find(member => member.userId === selectedMemberId);

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
          Are you sure you want to transfer ownership to {selectedMember?.displayName}?
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => onConfirm(selectedMemberId)}
            className="w-full py-3 px-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200 font-semibold"
          >
            Confirm Transfer
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