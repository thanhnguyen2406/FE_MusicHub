import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useGetMyInfoQuery, useUpdateUserMutation } from '../../../redux/services/userApi';
import type { UserInfo } from '../../../redux/services/userApi';
import defaultAvatar from '../../../assets/defaultAvatar.png';

export const useProfileForm = () => {
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

  const isChanged = Boolean(
    userResponse?.data &&
    editedUser &&
    (userResponse.data.firstName !== editedUser.firstName ||
      userResponse.data.lastName !== editedUser.lastName ||
      userResponse.data.displayName !== editedUser.displayName ||
      avatarPreview !== (userResponse.data.avatarUrl || defaultAvatar))
  );

  return {
    editedUser,
    userLoading,
    updateLoading,
    avatarPreview,
    isChanged,
    handleInputChange,
    handleAvatarChange,
    handleSave,
    handleCancel,
  };
}; 