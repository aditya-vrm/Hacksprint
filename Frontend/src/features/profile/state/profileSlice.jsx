import { createSlice } from '@reduxjs/toolkit';
import { getItem, setItem } from '../../../shared/utils/LocalStorage';

const PROFILE_STORAGE_KEY = 'devhub_profile';

const DEFAULT_PROFILE = {
  name: 'Alex Morgan',
  username: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  gender: '',
  avatarUrl:
    'https://i.pinimg.com/originals/ae/31/c8/ae31c8133ba753a0fd618a50bf78f56d.jpg',
  followers: 0,
  following: 0,
  profileViews: 0,
};

const loadProfile = () => {
  try {
    const stored = getItem(PROFILE_STORAGE_KEY);
    if (!stored) return DEFAULT_PROFILE;
    return { ...DEFAULT_PROFILE, ...JSON.parse(stored) };
  } catch {
    return DEFAULT_PROFILE;
  }
};

const persistProfile = (profile) => {
  setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
};

const profileSlice = createSlice({
  name: 'profile',
  initialState: loadProfile(),
  reducers: {
    updateProfile: (state, action) => {
      Object.assign(state, action.payload);
      persistProfile(state);
    },
    updateProfileField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
      persistProfile(state);
    },
    incrementViews: (state) => {
      state.profileViews = (state.profileViews || 0) + 1;
      persistProfile(state);
    },
  },
});

export const { updateProfile, updateProfileField, incrementViews } = profileSlice.actions;
export default profileSlice.reducer;
