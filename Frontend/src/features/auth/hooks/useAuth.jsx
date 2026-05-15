import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from '../state/authSlice';

export const useAuth = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();

  return {
    isAuthenticated,
    login: () => dispatch(login()),
    logout: () => dispatch(logout()),
  };
};
