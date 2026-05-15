import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useProfile } from '../../../profile/hooks/useProfile';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { DASHBOARD_PATH } from '../../../landing/hooks/useLandingNavigation';
import axiosInstance from '../../../../app/config/axiosInstance';

const LoginPage = () => {
  const { login } = useAuth();
  const { updateProfile } = useProfile();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || DASHBOARD_PATH;
  
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // The backend uses $or: [{ email }, { username }], so we can safely send the same for both
      const res = await axiosInstance.post('/v1/auth/login', {
        username: identifier,
        email: identifier,
        password: password,
      });

      if (res.data && res.data.user) {
        updateProfile({
          name: res.data.user.fullname || res.data.user.username,
          username: res.data.user.username,
          email: res.data.user.email,
          avatarUrl: res.data.user.profilePicture,
          dateOfBirth: res.data.user.dob,
          gender: res.data.user.gender,
        });

        login(); // update frontend redux state
        navigate(redirectTo, { replace: true });
      }
    } catch (err) {
      console.error('Login failed', err);
      setError(err.response?.data?.message || 'Failed to login');
    }
  };

  return (
    <div className="bg-surface border border-border rounded-2xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-500">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">Welcome Back</h1>
        <p className="text-sm text-text-muted">Log in to your DevHub Engine account.</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Email or Username</label>
          <input
            type="text"
            placeholder="you@example.com or username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-text-muted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Password</label>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-text-muted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors focus:outline-none"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full bg-primary hover:bg-primary-hover text-[#0B1120] font-bold py-3 rounded-lg text-sm tracking-wide transition-all duration-300 shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] mt-4"
        >
          LOG IN
        </button>
      </form>

      {/* Divider */}
      <div className="relative flex items-center justify-center my-6">
        <div className="absolute inset-x-0 h-px bg-border"></div>
        <span className="relative bg-surface px-4 text-xs font-mono text-text-muted uppercase tracking-wider">or</span>
      </div>

      {/* Social Logins */}
      <div className="flex flex-col space-y-3">
        <button className="flex items-center justify-center w-full bg-background border border-border hover:border-primary/50 text-text-main hover:text-white py-2.5 rounded-lg text-sm font-medium transition-all group relative">
          {/* Custom Google SVG */}
          <svg className="w-4 h-4 absolute left-4 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0112 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115z"/>
            <path fill="#34A853" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 01-6.723-4.823l-4.04 3.067A11.965 11.965 0 0012 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987z"/>
            <path fill="#4A90E2" d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558l3.794 2.987z"/>
            <path fill="#FBBC05" d="M5.277 14.268A7.12 7.12 0 014.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 000 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067z"/>
          </svg>
          Continue with Google
        </button>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-text-muted">
          Don't have an account? <Link to="/register" className="text-primary hover:text-primary-hover font-medium transition-colors ml-1">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
