import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { LOGIN_PATH } from '../../features/landing/hooks/useLandingNavigation';

const ProtectedRoutes = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={LOGIN_PATH} state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
