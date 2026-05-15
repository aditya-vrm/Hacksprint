import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Camera, Users, UserPlus, Save, Folder, FileText } from 'lucide-react';
import { useProfile } from '../../hooks/useProfile';
import { useAuth } from '../../../auth/hooks/useAuth';
import { useDispatch } from 'react-redux';
import { useCommunity } from '../../../community/hooks/useCommunity';
import { registerUser } from '../../../community/state/communitySlice';
import { formatUsername, isValidUsername } from '../../../../shared/utils/username';
import {
  GENDER_OPTIONS,
  GENDER_LABELS,
  formatDisplayDate,
  profileToForm,
} from '../../../../shared/constants/profileFields';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { profile, updateProfile } = useProfile();
  const { logout } = useAuth();
  const {
    totalProjects,
    totalBlogs,
    followersCount,
    followingCount,
  } = useCommunity();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState(() => profileToForm(profile));
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm(profileToForm(profile));
  }, [profile]);

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

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-in fade-in duration-500">
      <div className="relative flex items-start justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-mono text-primary uppercase tracking-widest mb-1">
            Account
          </p>
          <h1 className="text-3xl font-bold text-white tracking-tight">Profile</h1>
          <p className="text-sm text-text-muted mt-1">
            Your signup details and account information.
          </p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 shrink-0 px-4 py-2.5 rounded-lg text-sm font-medium text-red-400 border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 hover:text-red-300 transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-surface border border-border rounded-xl p-6 flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div className="w-32 h-32 rounded-full border-2 border-primary/30 overflow-hidden bg-background shadow-[0_0_30px_rgba(34,211,238,0.15)]">
                <img
                  src={form.avatarUrl}
                  alt={form.name}
                  className="w-full h-full object-cover"
                />
              </div>
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
            </div>
            <h2 className="text-xl font-bold text-white">{form.name || 'Your Name'}</h2>
            {displayUsername && (
              <p className="text-sm text-primary font-mono mt-1">{displayUsername}</p>
            )}
            <p className="text-xs text-text-muted mt-1">{form.email || 'No email set'}</p>
          </div>

          <div className="bg-surface border border-border rounded-xl p-5 space-y-3">
            <h3 className="text-xs font-mono text-text-muted uppercase tracking-wider">
              Signup Details
            </h3>
            <dl className="space-y-2.5 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-text-muted shrink-0">Full name</dt>
                <dd className="text-white text-right font-medium">{form.name || '—'}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-text-muted shrink-0">Username</dt>
                <dd className="text-white text-right font-mono">{displayUsername || '—'}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-text-muted shrink-0">Date of birth</dt>
                <dd className="text-white text-right">
                  {form.dateOfBirth ? formatDisplayDate(form.dateOfBirth) : '—'}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-text-muted shrink-0">Gender</dt>
                <dd className="text-white text-right">
                  {form.gender ? GENDER_LABELS[form.gender] : '—'}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-text-muted shrink-0">Email</dt>
                <dd className="text-white text-right break-all">{form.email || '—'}</dd>
              </div>
            </dl>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface border border-border rounded-xl p-4 text-center hover:border-primary/40 transition-colors">
              <Folder className="w-5 h-5 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{totalProjects}</p>
              <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider mt-1">
                Projects
              </p>
            </div>
            <div className="bg-surface border border-border rounded-xl p-4 text-center hover:border-primary/40 transition-colors">
              <FileText className="w-5 h-5 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{totalBlogs}</p>
              <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider mt-1">
                Blogs
              </p>
            </div>
            <div className="bg-surface border border-border rounded-xl p-4 text-center hover:border-primary/40 transition-colors">
              <Users className="w-5 h-5 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{followersCount}</p>
              <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider mt-1">
                Followers
              </p>
            </div>
            <div className="bg-surface border border-border rounded-xl p-4 text-center hover:border-primary/40 transition-colors">
              <UserPlus className="w-5 h-5 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{followingCount}</p>
              <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider mt-1">
                Following
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
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
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
