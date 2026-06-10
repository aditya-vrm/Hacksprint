import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LogOut, Camera, Users, UserPlus, UserCheck, Save, Folder, FileText, GitBranch, ExternalLink } from 'lucide-react';
import { useProfile } from '../../hooks/useProfile';
import { useAuth } from '../../../auth/hooks/useAuth';
import { useDispatch, useSelector } from 'react-redux';
import { incrementViews } from '../../state/profileSlice';
import { useCommunity } from '../../../community/hooks/useCommunity';
import { registerUser, cacheUser, CURRENT_USER_ID } from '../../../community/state/communitySlice';
import { formatUsername, isValidUsername } from '../../../../shared/utils/username';
import {
  GENDER_OPTIONS,
  GENDER_LABELS,
  formatDisplayDate,
  profileToForm,
} from '../../../../shared/constants/profileFields';
import axiosInstance from '../../../../app/config/axiosInstance';

const FollowersModal = ({ isOpen, onClose, title, usersList }) => {
  const navigate = useNavigate();
  if (!isOpen) return null;

  const handleUserClick = (userId) => {
    onClose();
    if (userId === CURRENT_USER_ID) {
      navigate('/dashboard/profile');
    } else {
      navigate(`/dashboard/profile/${userId}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0B1120]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#172237] border border-border rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-text-muted hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h3 className="text-xl font-bold text-white mb-4 tracking-tight">{title}</h3>

        <div className="max-h-60 overflow-y-auto space-y-2.5 pr-1">
          {usersList.length === 0 ? (
            <p className="text-sm text-text-muted text-center py-6">
              {title === 'Followers' ? 'No followers' : 'No following'}
            </p>
          ) : (
            usersList.map((usr) => (
              <button
                key={usr.id}
                onClick={() => handleUserClick(usr.id)}
                className="w-full flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-white/5 border-b border-border/10 last:border-b-0 transition-all duration-150 text-left focus:outline-none"
              >
                <img
                  src={usr.avatarUrl}
                  alt={usr.name}
                  className="w-10 h-10 rounded-full border border-border/40 object-cover shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-white truncate">{usr.name}</p>
                  <p className="text-xs text-text-muted font-mono truncate">{usr.username}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const ProfilePage = () => {
  const dispatch = useDispatch();
  const community = useSelector((state) => state.community);
  const { profile, updateProfile } = useProfile();
  const { logout } = useAuth();
  const {
    totalProjects,
    totalBlogs,
    followersCount,
    followingCount,
    isFollowing,
    toggleFollow,
  } = useCommunity();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState(() => profileToForm(profile));
  const [saved, setSaved] = useState(false);

  const { userId } = useParams();
  const [targetUser, setTargetUser] = useState(null);
  const [targetProjects, setTargetProjects] = useState([]);
  const [targetBlogs, setTargetBlogs] = useState([]);
  const [isLoadingUser, setIsLoadingUser] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalUsers, setModalUsers] = useState([]);

  const isSelf = !userId || (targetUser && targetUser.username === profile.username);

  useEffect(() => {
    setForm(profileToForm(profile));
  }, [profile]);

  useEffect(() => {
    if (isSelf) {
      dispatch(incrementViews());
    }
  }, [dispatch, isSelf]);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoadingUser(true);
      try {
        const url = userId ? `/v1/auth/users/${userId}` : '/v1/auth/me';
        const { data } = await axiosInstance.get(url);
        if (data) {
          const u = data.user;
          if (isSelf) {
            updateProfile({
              name: u.fullname || u.username,
              username: u.username,
              email: u.email,
              avatarUrl: u.profilePicture,
              dateOfBirth: u.dob,
              gender: u.gender,
              followers: u.followers ? u.followers.length : 0,
              following: u.following ? u.following.length : 0,
            });
            dispatch(registerUser({
              name: u.fullname || u.username,
              username: u.username,
              email: u.email,
              avatarUrl: u.profilePicture,
              dateOfBirth: u.dob,
              gender: u.gender,
              followers: u.followers || [],
              following: u.following || [],
            }));
            setTargetUser(u);
            setTargetProjects([]);
            setTargetBlogs([]);
          } else {
            setTargetUser(u);
            setTargetProjects(data.projects || []);
            setTargetBlogs(data.blogs || []);
            dispatch(cacheUser(u));
          }
        }
      } catch (err) {
        console.error('Failed to load user profile', err);
      } finally {
        setIsLoadingUser(false);
      }
    };

    fetchUserData();
  }, [userId, isSelf, dispatch]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setSaved(false);
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, avatarUrl: reader.result }));
      setSaved(false);
    };
    reader.readAsDataURL(file);
  };

  const usernameError = form.username !== '' && !isValidUsername(form.username);
  const displayUsername = form.username ? formatUsername(form.username) : '';

  const handleSave = (e) => {
    e.preventDefault();
    if (usernameError) return;

    const username = form.username ? formatUsername(form.username) : '';

    const payload = {
      name: form.name,
      username,
      email: form.email,
      phone: form.phone,
      dateOfBirth: form.dateOfBirth,
      gender: form.gender,
      avatarUrl: form.avatarUrl,
    };

    updateProfile(payload);
    dispatch(
      registerUser({
        ...payload,
        username,
      }),
    );
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleOpenFollowers = () => {
    const activeId = isSelf ? CURRENT_USER_ID : targetUser?.id;
    let list = [];
    if (activeId) {
      const ids = community.users[activeId]?.followerIds || [];
      list = ids.map(id => {
        if (id === CURRENT_USER_ID) {
          return {
            id: CURRENT_USER_ID,
            name: profile.name,
            username: profile.username || '@you',
            avatarUrl: profile.avatarUrl,
          };
        }
        return community.users[id];
      }).filter(Boolean);
    }
    setModalTitle('Followers');
    setModalUsers(list);
    setModalOpen(true);
  };

  const handleOpenFollowing = () => {
    const activeId = isSelf ? CURRENT_USER_ID : targetUser?.id;
    let list = [];
    if (activeId) {
      const ids = community.users[activeId]?.followingIds || [];
      list = ids.map(id => {
        if (id === CURRENT_USER_ID) {
          return {
            id: CURRENT_USER_ID,
            name: profile.name,
            username: profile.username || '@you',
            avatarUrl: profile.avatarUrl,
          };
        }
        return community.users[id];
      }).filter(Boolean);
    }
    setModalTitle('Following');
    setModalUsers(list);
    setModalOpen(true);
  };

  const displayUser = isSelf ? {
    name: form.name,
    username: displayUsername,
    email: form.email,
    avatarUrl: form.avatarUrl,
    dateOfBirth: form.dateOfBirth,
    gender: form.gender,
  } : {
    name: targetUser?.fullname || '',
    username: targetUser?.username || '',
    email: targetUser?.email || '',
    avatarUrl: targetUser?.profilePicture || '/logo.png',
    dateOfBirth: targetUser?.dob || '',
    gender: targetUser?.gender || '',
  };

  const displayStats = isSelf ? {
    projects: totalProjects,
    blogs: totalBlogs,
    followers: community.users[CURRENT_USER_ID]?.followerIds?.length || 0,
    following: community.users[CURRENT_USER_ID]?.followingIds?.length || 0,
  } : {
    projects: targetProjects.length,
    blogs: targetBlogs.length,
    followers: community.users[targetUser?.id]?.followerIds?.length || 0,
    following: community.users[targetUser?.id]?.followingIds?.length || 0,
  };

  if (isLoadingUser) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <span className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></span>
          <p className="text-sm font-mono text-text-muted uppercase tracking-wider animate-pulse">Loading Profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-in fade-in duration-500">
      <div className="relative flex items-start justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-mono text-primary uppercase tracking-widest mb-1">
            {isSelf ? 'Account' : 'User Profile'}
          </p>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            {isSelf ? 'Profile' : displayUser.name}
          </h1>
          <p className="text-sm text-text-muted mt-1">
            {isSelf ? 'Your signup details and account information.' : `Viewing ${displayUser.username || 'user'}'s public profile.`}
          </p>
        </div>
        {isSelf && (
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 shrink-0 px-4 py-2.5 rounded-lg text-sm font-medium text-red-400 border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 hover:text-red-300 transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-surface border border-border rounded-xl p-6 flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div className="w-32 h-32 rounded-full border-2 border-primary/30 overflow-hidden bg-background shadow-[0_0_30px_rgba(34,211,238,0.15)]">
                <img
                  src={displayUser.avatarUrl}
                  alt={displayUser.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {isSelf && (
                <>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-primary text-[#0B1120] flex items-center justify-center hover:bg-primary-hover transition-colors shadow-lg"
                    aria-label="Change profile picture"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                  />
                </>
              )}
            </div>
            <h2 className="text-xl font-bold text-white">{displayUser.name || 'Your Name'}</h2>
            {displayUser.username && (
              <p className="text-sm text-primary font-mono mt-1">{displayUser.username}</p>
            )}
            <p className="text-xs text-text-muted mt-1">{displayUser.email || 'No email set'}</p>

            {!isSelf && targetUser && (
              <button
                type="button"
                onClick={() => toggleFollow({
                  id: targetUser.id,
                  name: targetUser.fullname,
                  username: targetUser.username,
                  avatarUrl: targetUser.profilePicture
                })}
                className={`mt-4 w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isFollowing(targetUser.id)
                    ? 'bg-primary/15 text-primary border border-primary/30'
                    : 'bg-primary text-[#0B1120] font-bold hover:bg-primary-hover shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                }`}
              >
                {isFollowing(targetUser.id) ? (
                  <>
                    <UserCheck className="w-4 h-4" />
                    Following
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Follow
                  </>
                )}
              </button>
            )}
          </div>

          <div className="bg-surface border border-border rounded-xl p-5 space-y-3">
            <h3 className="text-xs font-mono text-text-muted uppercase tracking-wider">
              {isSelf ? 'Signup Details' : 'Details'}
            </h3>
            <dl className="space-y-2.5 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-text-muted shrink-0">Full name</dt>
                <dd className="text-white text-right font-medium">{displayUser.name || '—'}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-text-muted shrink-0">Username</dt>
                <dd className="text-white text-right font-mono">{displayUser.username || '—'}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-text-muted shrink-0">Date of birth</dt>
                <dd className="text-white text-right">
                  {displayUser.dateOfBirth ? formatDisplayDate(displayUser.dateOfBirth) : '—'}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-text-muted shrink-0">Gender</dt>
                <dd className="text-white text-right">
                  {displayUser.gender ? GENDER_LABELS[displayUser.gender] : '—'}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-text-muted shrink-0">Email</dt>
                <dd className="text-white text-right break-all">{displayUser.email || '—'}</dd>
              </div>
            </dl>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface border border-border rounded-xl p-4 text-center hover:border-primary/40 transition-colors">
              <Folder className="w-5 h-5 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{displayStats.projects}</p>
              <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider mt-1">
                Projects
              </p>
            </div>
            <div className="bg-surface border border-border rounded-xl p-4 text-center hover:border-primary/40 transition-colors">
              <FileText className="w-5 h-5 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{displayStats.blogs}</p>
              <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider mt-1">
                Blogs
              </p>
            </div>
            <div
              onClick={handleOpenFollowers}
              role="button"
              tabIndex={0}
              className="bg-surface border border-border rounded-xl p-4 text-center hover:border-primary/40 transition-colors cursor-pointer focus:outline-none"
            >
              <Users className="w-5 h-5 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{displayStats.followers}</p>
              <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider mt-1">
                Followers
              </p>
            </div>
            <div
              onClick={handleOpenFollowing}
              role="button"
              tabIndex={0}
              className="bg-surface border border-border rounded-xl p-4 text-center hover:border-primary/40 transition-colors cursor-pointer focus:outline-none"
            >
              <UserPlus className="w-5 h-5 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{displayStats.following}</p>
              <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider mt-1">
                Following
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {isSelf ? (
            <form
              onSubmit={handleSave}
              className="bg-surface border border-border rounded-xl p-6 md:p-8 space-y-5"
            >
              <h3 className="text-lg font-bold text-white border-b border-border/50 pb-4">
                Edit Signup Details
              </h3>

              <div>
                <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-text-muted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>

              <div>
                <label
                  className={`block text-xs font-mono uppercase tracking-wider mb-2 ${
                    usernameError ? 'text-red-500' : 'text-text-muted'
                  }`}
                >
                  Username
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-sm font-mono">
                    @
                  </span>
                  <input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="johndoe"
                    className={`w-full bg-background border rounded-lg pl-8 pr-4 py-2.5 text-sm text-white placeholder-text-muted/50 focus:outline-none focus:ring-1 transition-all ${
                      usernameError
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-border focus:border-primary focus:ring-primary'
                    }`}
                  />
                </div>
                {usernameError && (
                  <p className="text-red-500 text-xs mt-1.5">
                    3–20 characters, lowercase letters, numbers, and underscores only.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={form.dateOfBirth}
                  onChange={handleChange}
                  required
                  className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all [color-scheme:dark]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">
                  Gender
                </label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  required
                  className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all [color-scheme:dark]"
                >
                  {GENDER_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value} disabled={option.value === ''}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-text-muted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>

              <div className="pt-2 border-t border-border/50">
                <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider mb-3">
                  Optional
                </p>
                <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-text-muted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                {saved && (
                  <span className="text-xs text-primary font-mono animate-in fade-in">
                    Profile saved
                  </span>
                )}
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-[#0B1120] font-bold px-5 py-2.5 rounded-lg text-sm tracking-wide transition-all duration-300 shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)]"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="bg-surface border border-border rounded-xl p-6">
                <h3 className="text-lg font-bold text-white border-b border-border/50 pb-4 mb-4 flex items-center gap-2">
                  <Folder className="w-5 h-5 text-primary" />
                  Projects ({targetProjects.length})
                </h3>
                {targetProjects.length === 0 ? (
                  <p className="text-sm text-text-muted">No projects uploaded yet.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {targetProjects.map((project) => (
                      <div key={project._id} className="bg-background border border-border/50 rounded-lg p-4 hover:border-primary/20 transition-all">
                        <h4 className="font-bold text-white text-base mb-2">{project.projectName}</h4>
                        <div className="space-y-1">
                          {project.githubRepo && (
                            <a href={project.githubRepo} target="_blank" rel="noreferrer" className="flex items-center text-xs text-text-muted hover:text-primary transition-colors truncate">
                              <GitBranch className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                              Repository
                            </a>
                          )}
                          {project.deploymentLink && (
                            <a href={project.deploymentLink} target="_blank" rel="noreferrer" className="flex items-center text-xs text-text-muted hover:text-primary transition-colors truncate">
                              <ExternalLink className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                              Live Demo
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-surface border border-border rounded-xl p-6">
                <h3 className="text-lg font-bold text-white border-b border-border/50 pb-4 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Blogs ({targetBlogs.length})
                </h3>
                {targetBlogs.length === 0 ? (
                  <p className="text-sm text-text-muted">No blogs published yet.</p>
                ) : (
                  <div className="space-y-4">
                    {targetBlogs.map((blog) => (
                      <div key={blog._id} className="bg-background border border-border/50 rounded-lg p-4 hover:border-primary/20 transition-all text-left">
                        <h4 className="font-bold text-white text-base mb-1">{blog.title}</h4>
                        {blog.summary && <p className="text-sm text-text-muted mb-2 line-clamp-2 leading-relaxed">{blog.summary}</p>}
                        <p className="text-[10px] text-text-muted font-mono">{new Date(blog.createdAt).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <FollowersModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        usersList={modalUsers}
      />
    </div>
  );
};

export default ProfilePage;
