import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { DASHBOARD_PATH } from '../../../landing/hooks/useLandingNavigation';

const RegisterPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || DASHBOARD_PATH;

  const handleRegister = (e) => {
    e.preventDefault();
    login();
    navigate(redirectTo, { replace: true });
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
            required 
            placeholder="John Doe" 
            className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-text-muted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
          />
        </div>
        
        <div>
          <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Date of Birth</label>
          <input 
            type="date" 
            required 
            className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-text-muted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all [color-scheme:dark]" 
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Email</label>
          <input 
            type="email" 
            required 
            placeholder="john@example.com" 
            className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-text-muted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Password</label>
          <input 
            type="password" 
            required 
            placeholder="••••••••" 
            className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-text-muted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Confirm Password</label>
          <input 
            type="password" 
            required 
            placeholder="••••••••" 
            className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-text-muted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-primary hover:bg-primary-hover text-[#0B1120] font-bold py-3 rounded-lg text-sm tracking-wide transition-all duration-300 shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] mt-4"
        >
          SIGN UP
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
