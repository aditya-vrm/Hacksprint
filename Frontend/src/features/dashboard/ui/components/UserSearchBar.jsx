import { useEffect, useRef, useState } from 'react';
import { Search, UserPlus, UserCheck } from 'lucide-react';
import { useUserSearch } from '../../../community/hooks/useUserSearch';
import { useCommunity } from '../../../community/hooks/useCommunity';
import axiosInstance from '../../../../app/config/axiosInstance';

const UserSearchBar = () => {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef(null);

  const { isFollowing } = useUserSearch();
  const { toggleFollow } = useCommunity();

  const showDropdown = open && query.trim().length > 0;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    const delayDebounceFn = setTimeout(async () => {
      try {
        const { data } = await axiosInstance.get(`/v1/auth/users?search=${encodeURIComponent(query)}`);
        if (data && data.users) {
          setResults(data.users);
        }
      } catch (err) {
        console.error('Failed to search users', err);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <div ref={containerRef} className="relative w-full">
      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none z-10" />
      <input
        type="search"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder="Search users..."
        aria-label="Search users"
        aria-expanded={showDropdown}
        aria-controls="user-search-results"
        className="w-full bg-surface/50 border border-border/50 rounded-lg pl-10 pr-4 py-2 text-sm text-text-main placeholder:text-text-muted focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
      />

      {showDropdown && (
        <ul
          id="user-search-results"
          role="listbox"
          className="absolute top-full left-0 right-0 mt-2 max-h-80 overflow-y-auto bg-surface border border-border rounded-xl shadow-2xl z-50 py-2 animate-in fade-in slide-in-from-top-1 duration-200"
        >
          {isLoading ? (
            <li className="px-4 py-3 text-sm text-text-muted text-center flex items-center justify-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
              Searching...
            </li>
          ) : results.length === 0 ? (
            <li className="px-4 py-3 text-sm text-text-muted text-center">No users found</li>
          ) : (
            results.map((user) => {
              const following = isFollowing(user.id);
              return (
                <li
                  key={user.id}
                  role="option"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-surface-hover transition-colors"
                >
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-10 h-10 rounded-full border border-border object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-white truncate">{user.name}</p>
                    <p className="text-xs text-text-muted font-mono truncate">{user.username}</p>
                    <p className="text-[10px] text-text-muted mt-0.5">
                      {user.followers?.toLocaleString() ?? 0} followers
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleFollow(user.id)}
                    className={`flex items-center gap-1.5 shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                      following
                        ? 'bg-primary/15 text-primary border border-primary/30'
                        : 'bg-surface-hover text-text-muted border border-border hover:text-white hover:border-primary/40'
                    }`}
                  >
                    {following ? (
                      <>
                        <UserCheck className="w-3.5 h-3.5" />
                        Following
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3.5 h-3.5" />
                        Follow
                      </>
                    )}
                  </button>
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
};

export default UserSearchBar;
