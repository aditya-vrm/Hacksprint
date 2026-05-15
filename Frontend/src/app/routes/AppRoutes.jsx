import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import AuthLayout from '../layouts/AuthLayout';
import ProtectedRoutes from './ProtectedRoutes';
import PublicRoutes from './PublicRoutes';
import HomePage from '../../features/dashboard/ui/pages/HomePage';
import SupportPage from '../../features/dashboard/ui/pages/SupportPage';
import DeploymentsPage from '../../features/dashboard/ui/pages/DeploymentsPage';
import LoginPage from '../../features/auth/ui/pages/LoginPage';
import RegisterPage from '../../features/auth/ui/pages/RegisterPage';
import LandingPage from '../../features/landing/ui/pages/LandingPage';

const Placeholder = ({ title }) => (
  <div className="flex items-center justify-center h-[60vh] text-center">
    <div>
      <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
      <p className="text-text-muted">This page is under construction.</p>
    </div>
  </div>
);

const AppRoutes = () => (
  <Routes>
    <Route element={<PublicRoutes />}>
      <Route path="/" element={<LandingPage />} />

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
    </Route>

    <Route path="/dashboard" element={<ProtectedRoutes />}>
      <Route element={<DashboardLayout />}>
        <Route index element={<HomePage />} />
        <Route path="support" element={<SupportPage />} />
        <Route path="deployments" element={<DeploymentsPage />} />
        <Route path="repositories" element={<Placeholder title="Repositories" />} />
        <Route path="community" element={<Placeholder title="Community" />} />
        <Route path="projects" element={<Placeholder title="Projects" />} />
        <Route path="blogs" element={<Placeholder title="Blogs" />} />
      </Route>
    </Route>

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes;
