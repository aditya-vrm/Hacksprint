import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hydrateFeed } from '../../features/community/state/communitySlice';
import { connectChatSocket } from '../../features/chat/api/chatSocket';

const AppInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    dispatch(hydrateFeed());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      connectChatSocket();
    }
  }, [isAuthenticated]);

  return children;
};

export default AppInitializer;
