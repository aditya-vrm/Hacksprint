import { useNavigate } from 'react-router-dom';

export const LOGIN_PATH = '/login';
export const DASHBOARD_PATH = '/dashboard';

export const useLandingNavigation = () => {
  const navigate = useNavigate();

  const goToLogin = () => navigate(LOGIN_PATH);

  return { goToLogin };
};
