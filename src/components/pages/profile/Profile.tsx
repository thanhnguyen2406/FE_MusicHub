import React from 'react';
import { useProfileForm } from './useProfileForm';
import ProfileForm from './ProfileForm';
import { ToastContainer } from 'react-toastify';

const Profile: React.FC = () => {
  const {
    editedUser,
    userLoading,
    updateLoading,
    avatarPreview,
    isChanged,
    handleInputChange,
    handleAvatarChange,
    handleSave,
    handleCancel,
  } = useProfileForm();

  if (!editedUser || userLoading) return <div className="text-white p-10">Loading profile...</div>;

  return (
    <div className="min-h-screen bg-[#181818] flex flex-col items-center justify-center py-10">
      <ToastContainer />
      <ProfileForm
        editedUser={editedUser}
        avatarPreview={avatarPreview}
        isChanged={isChanged}
        updateLoading={updateLoading}
        handleInputChange={handleInputChange}
        handleAvatarChange={handleAvatarChange}
        handleSave={handleSave}
        handleCancel={handleCancel}
      />
    </div>
  );
};

export default Profile;