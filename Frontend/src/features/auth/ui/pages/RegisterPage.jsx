import { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useAuth } from '../../hooks/useAuth';
import { useProfile } from '../../../profile/hooks/useProfile';
import { registerUser } from '../../../community/state/communitySlice';
import { DASHBOARD_PATH } from '../../../landing/hooks/useLandingNavigation';
import { formatUsername, isValidUsername } from '../../../../shared/utils/username';
import { GENDER_OPTIONS } from '../../../../shared/constants/profileFields';
import axiosInstance from '../../../../app/config/axiosInstance';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const { login } = useAuth();
  const { profile, updateProfile } = useProfile();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || DASHBOARD_PATH;

  const [form, setForm] = useState({
    name: '',
    username: '',
    dateOfBirth: '',
    gender: '',
    email: '',
  });
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const passwordError = password !== '' && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);
  const confirmPasswordError = confirmPassword !== '' && password !== confirmPassword;
  const usernameError =
    form.username !== '' && !isValidUsername(form.username);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (
      passwordError ||
      confirmPasswordError ||
      usernameError ||
      password === '' ||
      !form.gender ||
      !form.username ||
      isLoading
    ) {
      return;
    }

    const username = formatUsername(form.username);
    const avatarUrl = form.gender === 'male' 
      ? '/male-avatar.avif' 
      : (form.gender === 'female' ? '/female-avatar.png' : profile.avatarUrl);

    setIsLoading(true);
    try {
      const response = await axiosInstance.post('/v1/auth/register', {
        fullname: form.name,
        username,
        email: form.email,
        dob: form.dateOfBirth,
        gender: form.gender,
        password: password,
        confirmPassword: confirmPassword,
      });

      updateProfile({
        name: form.name,
        username,
        email: form.email,
        dateOfBirth: form.dateOfBirth,
        gender: form.gender,
        followers: 0,
        following: 0,
        profileViews: 0,
      });

      dispatch(
        registerUser({
          name: form.name,
          username,
          email: form.email,
          dateOfBirth: form.dateOfBirth,
          gender: form.gender,
          avatarUrl,
        }),
      );
      login();
      navigate(redirectTo, { replace: true });
    } catch (error) {
      console.error('Registration failed:', error);
      alert(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-surface border border-border rounded-2xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-500">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">Create an Account</h1>
        <p className="text-sm text-text-muted">Join DevHub Engine to start deploying.</p>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Full Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="John Doe"
            className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-text-muted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
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
              required
              placeholder="johndoe"
              autoComplete="username"
              className={`w-full bg-background border rounded-lg pl-8 pr-4 py-2.5 text-sm text-white placeholder-text-muted/50 focus:outline-none focus:ring-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                usernameError
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-border focus:border-primary focus:ring-primary'
              }`}
              disabled={isLoading}
            />
          </div>
          {usernameError ? (
            <p className="text-red-500 text-xs mt-1.5">
              3–20 characters, lowercase letters, numbers, and underscores only.
            </p>
          ) : (
            <p className="text-text-muted text-xs mt-1.5 font-mono">
              Your handle: {form.username ? formatUsername(form.username) : '@username'}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Date of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            value={form.dateOfBirth}
            onChange={handleChange}
            required
            className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-text-muted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all [color-scheme:dark] disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Gender</label>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            required
            className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all [color-scheme:dark] disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {GENDER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value} disabled={option.value === ''}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="john@example.com"
            className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-text-muted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className={`block text-xs font-mono uppercase tracking-wider mb-2 ${passwordError ? 'text-red-500' : 'text-text-muted'}`}>Password</label>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              required 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full bg-background border rounded-lg px-4 py-2.5 text-sm text-white placeholder-text-muted/50 focus:outline-none focus:ring-1 transition-all pr-10 disabled:opacity-50 disabled:cursor-not-allowed ${
                passwordError 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                  : 'border-border focus:border-primary focus:ring-primary'
              }`} 
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors focus:outline-none disabled:opacity-50"
              disabled={isLoading}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {passwordError && (
            <p className="text-red-500 text-xs mt-1.5">
              Must be at least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 symbol.
            </p>
          )}
        </div>

        <div>
          <label className={`block text-xs font-mono uppercase tracking-wider mb-2 ${confirmPasswordError ? 'text-red-500' : 'text-text-muted'}`}>Confirm Password</label>
          <div className="relative">
            <input 
              type={showConfirmPassword ? "text" : "password"} 
              required 
              placeholder="••••••••" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full bg-background border rounded-lg px-4 py-2.5 text-sm text-white placeholder-text-muted/50 focus:outline-none focus:ring-1 transition-all pr-10 disabled:opacity-50 disabled:cursor-not-allowed ${
                confirmPasswordError 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                  : 'border-border focus:border-primary focus:ring-primary'
              }`} 
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors focus:outline-none disabled:opacity-50"
              disabled={isLoading}
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {confirmPasswordError && (
            <p className="text-red-500 text-xs mt-1.5">
              Passwords do not match.
            </p>
          )}
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-primary hover:bg-primary-hover disabled:bg-primary/50 disabled:cursor-not-allowed text-[#0B1120] font-bold py-3 rounded-lg text-sm tracking-wide transition-all duration-300 shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] disabled:shadow-none mt-4 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#0B1120]" />
              SIGNING UP...
            </>
          ) : (
            'SIGN UP'
          )}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm text-text-muted">
          Already have an account? <Link to="/login" className="text-primary hover:text-primary-hover font-medium transition-colors ml-1">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
