import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useGetMyInfoQuery, useUpdateUserMutation } from '../../../redux/services/userApi';
import type { UserInfo } from '../../../redux/services/userApi';
import defaultAvatar from '../../../assets/defaultAvatar.png';
import emailIcon from '../../../assets/email.svg';

const Profile: React.FC = () => {
  const { data: userResponse, isLoading: userLoading } = useGetMyInfoQuery();
  const [updateUser, { isLoading: updateLoading }] = useUpdateUserMutation();

  const [editedUser, setEditedUser] = useState<UserInfo | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (userResponse?.data) {
      setEditedUser(userResponse.data);
      setAvatarPreview(userResponse.data.avatarUrl || defaultAvatar);
    }
  }, [userResponse]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editedUser) {
      setEditedUser({ ...editedUser, [name]: value });
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!editedUser || !userResponse?.data) return;
  
    try {
      const success = await updateUser({
        id: userResponse.data.id,
        firstName: editedUser.firstName,
        lastName: editedUser.lastName,
        displayName: editedUser.displayName,
        avatar: avatarFile || undefined, 
      }).unwrap();
  
      if (success) {
        setAvatarFile(null);
        setAvatarPreview(userResponse.data.avatarUrl || defaultAvatar);
      }
    } catch (error) {
      console.error("Error in handleSave:", error);
      toast.error('Failed to save changes', { position: 'top-right' });
    }
  };

  const handleCancel = () => {
    if (userResponse?.data) {
      setEditedUser(userResponse.data);
      setAvatarPreview(userResponse.data.avatarUrl || defaultAvatar);
      setAvatarFile(null);
    }
  };

  const isChanged =
    userResponse?.data &&
    editedUser &&
    (userResponse.data.firstName !== editedUser.firstName ||
      userResponse.data.lastName !== editedUser.lastName ||
      userResponse.data.displayName !== editedUser.displayName ||
      avatarPreview !== (userResponse.data.avatarUrl || defaultAvatar));

  if (!editedUser || userLoading) return <div className="text-white p-10">Loading profile...</div>;

  return (
    <div className="min-h-screen bg-[#181818] flex flex-col items-center justify-center py-10">
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
                  ? 'bg-orange-500 text-white hover:bg-orange-600'
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
                className="w-full border border-[#333] bg-[#181818] text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 mb-2"
                placeholder="First Name"
              />
              <label className="block text-gray-400 text-sm mb-1 mt-2 text-left">Last Name</label>
              <input
                name="lastName"
                value={editedUser.lastName}
                onChange={handleInputChange}
                className="w-full border border-[#333] bg-[#181818] text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
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
                className="w-full border border-[#333] bg-[#181818] text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
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
    </div>
  );
};

export default Profile;