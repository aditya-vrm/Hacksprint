import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../features/auth/state/authSlice';
import errorReducer from '../../shared/state/errorSlice';
import profileReducer from '../../features/profile/state/profileSlice';
import communityReducer from '../../features/community/state/communitySlice';
import chatReducer from '../../features/chat/state/chatSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    error: errorReducer,
    profile: profileReducer,
    community: communityReducer,
    chat: chatReducer,
  },
});
