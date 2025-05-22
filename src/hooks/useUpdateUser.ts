import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../redux/store';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { updateUserInfo } from '../redux/slices/userSlicer';
import type { ResponseAPI } from '../types/ResponseAPI';
import type { UserInfo } from '../types/UserInfo';

interface UpdateUserInput {
  id: string;
  firstName: string;
  lastName?: string;
  displayName?: string;
  avatar?: File; 
}

export const useUpdateUser = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const accessToken = useSelector((state: RootState) => state.auth.tokens?.access_token);
  const user = useSelector((state: RootState) => state.user.user);

  const handleUpdateUser = async (input: UpdateUserInput) => {
    if (!accessToken || !user) {
      toast.error('Authentication required. Please log in again.', {
        position: 'top-right',
      });
      return false;
    }

    setLoading(true);
    try {
      const resultAction = await dispatch(
        updateUserInfo({
          input: {
            id: input.id,
            firstName: input.firstName,
            lastName: input.lastName || '',
            displayName: input.displayName || '',
          },
          accessToken,
        })
      );

      if (updateUserInfo.fulfilled.match(resultAction)) {
        const payload = resultAction.payload as ResponseAPI<null>;
        toast.success(payload.message ?? 'Profile updated successfully', {
          position: 'top-right',
        });
        return true;
      } else {
        const errorPayload = resultAction.payload as ResponseAPI<any>;
        throw new Error(errorPayload?.message || 'Failed to update profile');
      }
    } catch (error: any) {
      console.error('Update user error:', error);
      toast.error(error.message || 'An unexpected error occurred', {
        position: 'top-right',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { handleUpdateUser, loading };
};