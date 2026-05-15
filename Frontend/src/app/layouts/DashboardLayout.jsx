import { NavLink, Outlet } from 'react-router-dom';
import Sidebar from '../../features/dashboard/ui/components/Sidebar';
import UserSearchBar from '../../features/dashboard/ui/components/UserSearchBar';

const DashboardLayout = () => {
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden text-text-main font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <div className="absolute top-0 inset-x-0 h-[300px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

        <header className="h-16 flex items-center justify-between px-6 border-b border-border/50 bg-background/80 backdrop-blur-md z-10 shrink-0 gap-4">
          <NavLink
            to="/dashboard"
            end
            className="flex items-center space-x-3 md:hidden hover:opacity-90 transition-opacity"
            aria-label="Go to dashboard"
          >
            <img src="/logo.png" alt="DevHub Logo" className="w-10 h-10 rounded-lg" />
            <h1 className="text-xl font-bold tracking-tight text-white">DevHub</h1>
          </NavLink>
          <NavLink
            to="/dashboard"
            end
            className="hidden md:flex items-center space-x-3 shrink-0 hover:opacity-90 transition-opacity"
            aria-label="Go to dashboard"
          >
            <img src="/logo.png" alt="DevHub Logo" className="w-10 h-10 rounded-lg" />
            <h2 className="text-xl font-bold tracking-tight text-primary">DevHub</h2>
          </NavLink>

          <div className="flex-1 flex items-center justify-center px-4 max-w-xl md:ml-auto">
            <UserSearchBar />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto z-0 p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
