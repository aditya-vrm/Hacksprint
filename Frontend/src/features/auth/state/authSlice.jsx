import { createSlice } from '@reduxjs/toolkit';
import { getItem, setItem, removeItem } from '../../../shared/utils/LocalStorage';

const AUTH_KEY = 'auth_token';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: getItem(AUTH_KEY) === 'true',
  },
  reducers: {
    login: (state) => {
      state.isAuthenticated = true;
      setItem(AUTH_KEY, 'true');
    },
    logout: (state) => {
      state.isAuthenticated = false;
      removeItem(AUTH_KEY);
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
