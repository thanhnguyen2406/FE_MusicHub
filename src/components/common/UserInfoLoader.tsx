import { useEffect } from 'react';
import { useGetMyInfoQuery } from '../../redux/services/userApi';
import { useAppDispatch } from '../../redux/store';
import { setUserInfo } from '../../redux/slices/userSlice';

const UserInfoLoader: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data: userInfo } = useGetMyInfoQuery(undefined, {
    skip: !localStorage.getItem('access_token')
  });

  useEffect(() => {
    if (userInfo?.data) {
      dispatch(setUserInfo(userInfo.data));
    }
  }, [userInfo, dispatch]);

  return null;
};

export default UserInfoLoader; 