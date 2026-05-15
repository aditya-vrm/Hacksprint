import { NavLink, Outlet } from 'react-router-dom';
import { Search } from 'lucide-react';
import Sidebar from '../../features/dashboard/ui/components/Sidebar';

const TOP_NAV_LINKS = [
  { label: 'Community', path: '/dashboard/community' },
  { label: 'Projects', path: '/dashboard/projects' },
  { label: 'Blogs', path: '/dashboard/blogs' },
];

const DashboardLayout = () => {
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden text-text-main font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <div className="absolute top-0 inset-x-0 h-[300px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

        <header className="h-16 flex items-center justify-between px-6 border-b border-border/50 bg-background/80 backdrop-blur-md z-10 shrink-0 gap-4">
          <div className="flex items-center space-x-3 md:hidden">
            <img src="/logo.png" alt="DevHub Logo" className="w-10 h-10 rounded-lg" />
            <h1 className="text-xl font-bold tracking-tight text-white">DevHub</h1>
          </div>
          <div className="hidden md:flex items-center space-x-6 shrink-0">
            <div className="flex items-center space-x-3 mr-4">
              <img src="/logo.png" alt="DevHub Logo" className="w-10 h-10 rounded-lg" />
              <h2 className="text-xl font-bold tracking-tight text-primary">DevHub</h2>
            </div>
            <nav className="flex space-x-6">
              {TOP_NAV_LINKS.map((link) => (
                <NavLink
                  key={link.label}
                  to={link.path}
                  className="text-sm font-medium text-text-muted hover:text-white transition-colors"
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex-1 flex items-center justify-center px-4 max-w-xl md:ml-auto">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Search projects and blogs..."
                className="w-full bg-surface/50 border border-border/50 rounded-lg pl-10 pr-4 py-2 text-sm text-text-main placeholder:text-text-muted focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
              />
            </div>
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
