import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../features/auth/state/authSlice';
import errorReducer from '../../shared/state/errorSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    error: errorReducer,
  },
});
