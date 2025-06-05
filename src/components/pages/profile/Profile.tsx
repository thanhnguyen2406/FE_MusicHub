import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { useProfileForm } from './useProfileForm';
import ProfileForm from './ProfileForm';

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

  if (userLoading || !editedUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Profile Settings</h1>
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