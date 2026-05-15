import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import AuthLayout from '../layouts/AuthLayout';
import ProtectedRoutes from './ProtectedRoutes';
import PublicRoutes from './PublicRoutes';
import HomePage from '../../features/dashboard/ui/pages/HomePage';
import ProjectsPage from '../../features/dashboard/ui/pages/ProjectsPage';
import BlogsPage from '../../features/dashboard/ui/pages/BlogsPage';
import ProfilePage from '../../features/profile/ui/pages/ProfilePage';
import CommunityPage from '../../features/community/ui/pages/CommunityPage';
import LoginPage from '../../features/auth/ui/pages/LoginPage';
import RegisterPage from '../../features/auth/ui/pages/RegisterPage';
import LandingPage from '../../features/landing/ui/pages/LandingPage';

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
        <Route path="community" element={<CommunityPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="blogs" element={<BlogsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
    </Route>

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes;
