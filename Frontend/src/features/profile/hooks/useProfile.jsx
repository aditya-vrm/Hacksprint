import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, updateProfileField } from '../state/profileSlice';

export const useProfile = () => {
  const profile = useSelector((state) => state.profile);
  const dispatch = useDispatch();

  return {
    profile,
    updateProfile: (data) => dispatch(updateProfile(data)),
    updateField: (field, value) => dispatch(updateProfileField({ field, value })),
  };
};
