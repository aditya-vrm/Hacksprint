import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useProfile } from '../../../profile/hooks/useProfile';
import {
  LayoutDashboard,
  Compass,
  Folder,
  FileText,
  Plus,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { getItem, setItem } from '../../../../shared/utils/LocalStorage';
import { useAuth } from '../../../auth/hooks/useAuth';

const SIDEBAR_STORAGE_KEY = 'sidebar_expanded';

export const SIDEBAR_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', end: true },
  { icon: Compass, label: 'Explore', path: '/dashboard/community' },
  { icon: Folder, label: 'Projects', path: '/dashboard/projects' },
  { icon: FileText, label: 'Blogs', path: '/dashboard/blogs' },
];

const Sidebar = () => {
  const [expanded, setExpanded] = useState(() => {
    const stored = getItem(SIDEBAR_STORAGE_KEY);
    return stored === null ? true : stored === 'true';
  });
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const { logout } = useAuth();
  const { profile } = useProfile();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setExpanded((prev) => {
      const next = !prev;
      setItem(SIDEBAR_STORAGE_KEY, String(next));
      return next;
    });
  };

  return (
    <aside
      className={`bg-surface border-r border-border flex flex-col justify-between shrink-0 hidden md:flex overflow-hidden transition-[width] duration-300 ease-in-out ${
        expanded ? 'w-64' : 'w-[4.75rem]'
      }`}
      aria-expanded={expanded}
    >
      <div className="min-h-0 flex-1 flex flex-col overflow-hidden">
        {/* Header: toggle + logo */}
        <div className={`border-b border-border/50 shrink-0 ${expanded ? 'p-4' : 'p-3'}`}>
          <div
            className={`flex mb-3 ${expanded ? 'justify-start' : 'justify-center'}`}
          >
            <button
              type="button"
              onClick={toggleSidebar}
              aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
              className="flex items-center justify-center w-8 h-8 rounded-lg text-text-muted hover:text-primary hover:bg-surface-hover border border-border/50 transition-all duration-300 shrink-0"
            >
              <span
                className={`inline-flex transition-transform duration-300 ease-in-out ${
                  expanded ? 'rotate-0' : 'rotate-180'
                }`}
              >
                {expanded ? (
                  <ChevronLeft className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </span>
            </button>
          </div>

          <NavLink
            to="/dashboard"
            end
            aria-label="Go to dashboard"
            className={`flex items-center transition-all duration-300 hover:opacity-90 ${
              expanded ? 'space-x-3' : 'justify-center'
            }`}
          >
            <img
              src="/logo.png"
              alt="DevHub Logo"
              className={`rounded-lg shrink-0 transition-all duration-300 ${
                expanded ? 'w-10 h-10' : 'w-9 h-9'
              }`}
            />
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                expanded ? 'opacity-100 max-w-[12rem]' : 'opacity-0 max-w-0'
              }`}
            >
              <h1 className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
                DevHub
              </h1>
            </div>
          </NavLink>
        </div>

        {/* Main nav */}
        <nav
          className={`mt-3 space-y-1 flex-1 overflow-y-auto overflow-x-hidden ${
            expanded ? 'px-3' : 'px-2'
          }`}
          aria-label="Dashboard sidebar"
        >
          {SIDEBAR_ITEMS.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              end={item.end}
              title={!expanded ? item.label : undefined}
              className={({ isActive }) =>
                `flex items-center rounded-lg text-sm font-medium transition-all duration-200 group ${
                  expanded ? 'px-3 py-2.5' : 'px-0 py-2.5 justify-center'
                } ${
                  isActive
                    ? expanded
                      ? 'bg-surface-hover text-primary border-l-2 border-primary'
                      : 'bg-surface-hover text-primary'
                    : 'text-text-muted hover:bg-surface-hover hover:text-text-main'
                }`
              }
            >
              <item.icon
                className={`w-5 h-5 shrink-0 opacity-70 group-hover:opacity-100 transition-all duration-300 ${
                  expanded ? 'mr-3' : 'mr-0'
                }`}
              />
              <span
                className={`whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${
                  expanded ? 'opacity-100 max-w-[10rem]' : 'opacity-0 max-w-0'
                }`}
              >
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className={`shrink-0 border-t border-border/50 ${expanded ? 'p-4' : 'p-2'}`}>
        <button
          type="button"
          onClick={() => navigate('/dashboard/projects')}
          title={!expanded ? 'Create New Project' : undefined}
          className={`flex items-center bg-primary/10 text-primary hover:bg-primary hover:text-surface border border-primary/20 rounded-lg text-sm font-medium transition-all duration-300 shadow-[0_0_15px_rgba(34,211,238,0.1)] hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] mb-4 ${
            expanded
              ? 'w-full justify-center space-x-2 py-2.5 px-3'
              : 'w-full justify-center py-2.5'
          }`}
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span
            className={`whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${
              expanded ? 'opacity-100 max-w-[10rem]' : 'opacity-0 max-w-0'
            }`}
          >
            Create New Project
          </span>
        </button>

        <div
          className={`space-y-1 mt-2 ${expanded ? '' : 'flex flex-col items-center'}`}
          aria-label="Account"
        >
          <button
            type="button"
            title={!expanded ? 'Settings' : undefined}
            onClick={() => setShowSettingsMenu(!showSettingsMenu)}
            className={`flex items-center rounded-lg text-sm text-text-muted hover:text-primary hover:bg-surface-hover transition-all duration-200 ${
              expanded ? 'w-full px-2 py-2' : 'w-10 h-10 justify-center'
            }`}
          >
            <Settings className={`w-4 h-4 shrink-0 ${expanded ? 'mr-3' : ''}`} />
            <span
              className={`whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${
                expanded ? 'opacity-100 max-w-[8rem]' : 'opacity-0 max-w-0'
              }`}
            >
              Settings
            </span>
          </button>

          {showSettingsMenu && (
            <div className={`mt-1 overflow-hidden transition-all duration-300 ease-in-out ${expanded ? 'px-2' : 'flex flex-col items-center'}`}>
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                title={!expanded ? 'Logout' : undefined}
                className={`flex items-center rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 ${
                  expanded ? 'w-full px-2 py-2' : 'w-10 h-10 justify-center'
                }`}
              >
                <LogOut className={`w-4 h-4 shrink-0 ${expanded ? 'mr-3' : ''}`} />
                <span
                  className={`whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${
                    expanded ? 'opacity-100 max-w-[8rem]' : 'opacity-0 max-w-0'
                  }`}
                >
                  Logout
                </span>
              </button>
            </div>
          )}

          <NavLink
            to="/dashboard/profile"
            title={!expanded ? 'Profile' : undefined}
            className={({ isActive }) =>
              `flex items-center rounded-lg transition-all duration-200 group ${
                expanded ? 'w-full px-2 py-2' : 'w-10 h-10 justify-center'
              } ${
                isActive
                  ? 'bg-surface-hover text-primary'
                  : 'hover:bg-surface-hover text-text-main'
              }`
            }
          >
            <div
              className={`rounded-full bg-surface-hover border border-border overflow-hidden shrink-0 transition-all duration-300 ${
                expanded ? 'w-8 h-8 mr-3' : 'w-8 h-8'
              }`}
            >
              <img
                src={profile.avatarUrl}
                alt="User profile"
                className="w-full h-full object-cover"
              />
            </div>
            <span
              className={`text-sm font-medium group-hover:text-white truncate transition-all duration-300 ease-in-out ${
                expanded ? 'opacity-100 max-w-[8rem]' : 'opacity-0 max-w-0'
              }`}
            >
              Profile
            </span>
          </NavLink>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
