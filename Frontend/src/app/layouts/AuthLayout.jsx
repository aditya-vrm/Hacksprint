import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { DASHBOARD_PATH } from '../../features/landing/hooks/useLandingNavigation';

const AuthLayout = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={DASHBOARD_PATH} replace />;
  }

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* DevHub ambient glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="w-full max-w-[420px] relative z-10 mt-16">
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 flex items-center space-x-3 mb-6 w-full justify-center">
          <img src="/logo.png" alt="DevHub Logo" className="w-14 h-14 rounded-2xl" />
          <span className="text-3xl font-bold text-white tracking-tight">DevHub</span>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
