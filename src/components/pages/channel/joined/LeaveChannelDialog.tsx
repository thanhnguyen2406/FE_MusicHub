import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface LeaveChannelDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isOwner: boolean;
  onTransferOwnership?: () => void;
}

const LeaveChannelDialog: React.FC<LeaveChannelDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isOwner,
  onTransferOwnership
}) => {
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

        <h2 className="text-2xl font-bold text-black mb-6 text-center">Leave Channel</h2>
        
        <p className="text-gray-600 mb-6 text-center">
          {isOwner 
            ? "You are the owner of this channel. Would you like to transfer ownership to another member or quit the channel?"
            : "Are you sure you want to leave this channel?"}
        </p>

        <div className="flex flex-col gap-3">
          {isOwner && (
            <button
              onClick={onTransferOwnership}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-full transition-colors duration-200 font-semibold"
            >
              Transfer Ownership
            </button>
          )}
          <button
            onClick={onConfirm}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-8 rounded-full transition-colors duration-200 font-semibold"
          >
            {isOwner ? "Quit Channel" : "Leave Channel"}
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

export default LeaveChannelDialog; 