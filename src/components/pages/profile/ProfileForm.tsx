import React from 'react';
import defaultAvatar from '../../../assets/defaultAvatar.png';
import emailIcon from '../../../assets/email.svg';

interface ProfileFormProps {
  editedUser: {
    displayName: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  avatarPreview: string | undefined;
  isChanged: boolean;
  updateLoading: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSave: () => void;
  handleCancel: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  editedUser,
  avatarPreview,
  isChanged,
  updateLoading,
  handleInputChange,
  handleAvatarChange,
  handleSave,
  handleCancel,
}) => {
  return (
    <div className="w-full max-w-4xl bg-[#222] rounded-2xl shadow-lg p-8 flex flex-col gap-8">
      {/* Top Row: Avatar and Info */}
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-6">
          <div className="relative group cursor-pointer">
            <label>
              <img
                src={avatarPreview || defaultAvatar}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover border-4 border-[#282828] shadow cursor-pointer"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = defaultAvatar;
                }}
              />
              <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </label>
          </div>
          <div className="text-left">
            <div className="text-2xl font-bold text-white">{editedUser.displayName}</div>
            <div className="text-gray-400">
              {editedUser.firstName} {editedUser.lastName}
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-4">
          <button
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              isChanged
                ? 'bg-purple-700 text-white hover:bg-purple-900'
                : 'bg-[#333] text-gray-500 cursor-not-allowed'
            }`}
            disabled={!isChanged || updateLoading}
            onClick={handleSave}
          >
            {updateLoading ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            className="px-6 py-2 rounded-lg font-semibold bg-[#222] text-gray-300 hover:bg-[#333] transition"
            disabled={!isChanged || updateLoading}
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1 text-left">First Name</label>
            <input
              name="firstName"
              value={editedUser.firstName}
              onChange={handleInputChange}
              className="w-full border border-[#333] bg-[#181818] text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300 mb-2"
              placeholder="First Name"
            />
            <label className="block text-gray-400 text-sm mb-1 mt-2 text-left">Last Name</label>
            <input
              name="lastName"
              value={editedUser.lastName}
              onChange={handleInputChange}
              className="w-full border border-[#333] bg-[#181818] text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
              placeholder="Last Name"
            />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1 text-left">Display Name</label>
            <input
              name="displayName"
              value={editedUser.displayName}
              onChange={handleInputChange}
              className="w-full border border-[#333] bg-[#181818] text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
              placeholder="Display Name"
            />
          </div>
        </div>
      </div>

      {/* Email Display */}
      <div className="flex flex-row items-center gap-3 mt-8">
        <div className="bg-gray-700 rounded-full p-3">
          <img src={emailIcon} alt="Email" className="w-6 h-6" />
        </div>
        <div className="text-white">{editedUser.email}</div>
      </div>
    </div>
  );
};

export default ProfileForm; 