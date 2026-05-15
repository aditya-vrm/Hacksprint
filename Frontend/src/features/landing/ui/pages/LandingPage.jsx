import { useState } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';
import Particles from '../components/Particles';
import { useLandingNavigation } from '../../hooks/useLandingNavigation';

const NAV_ITEMS = ['Discovery', 'Community', 'Projects', 'Blogs'];

const LandingPage = () => {
  const { goToLogin } = useLandingNavigation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = () => {
    setMobileMenuOpen(false);
    goToLogin();
  };

  return (
    <div className="min-h-screen bg-background text-text-main font-sans selection:bg-primary/30 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Particles
          particleColors={['#22d3ee', '#ffffff', '#818cf8']}
          particleCount={250}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover
          particleHoverFactor={4}
          alphaParticles
          disableRotation={false}
        />
      </div>

      <header className="relative z-10 flex items-center justify-between px-6 py-6 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <button
          type="button"
          onClick={goToLogin}
          className="flex items-center space-x-3 cursor-pointer"
          aria-label="Go to login"
        >
          <img src="/logo.png" alt="DevHub Logo" className="w-10 h-10 rounded-lg" />
          <h1 className="text-2xl font-bold tracking-tight text-white">DevHub</h1>
        </button>

        <nav className="hidden md:flex space-x-8" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={goToLogin}
              className="text-sm font-medium text-text-muted hover:text-white transition-colors uppercase tracking-wider"
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={goToLogin}
            className="hidden sm:inline-flex bg-primary/90 hover:bg-primary text-surface font-semibold px-5 py-2.5 rounded-md text-sm transition-all shadow-[0_0_15px_rgba(34,211,238,0.2)] hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]"
          >
            Get Started
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="md:hidden p-2 text-text-muted hover:text-white transition-colors"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {mobileMenuOpen && (
        <nav
          className="relative z-20 md:hidden border-b border-border/50 bg-background/95 backdrop-blur-md px-6 py-4 flex flex-col gap-3"
          aria-label="Mobile navigation"
        >
          {NAV_ITEMS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={handleNavClick}
              className="text-left text-sm font-medium text-text-muted hover:text-white transition-colors uppercase tracking-wider py-2"
            >
              {item}
            </button>
          ))}
          <button
            type="button"
            onClick={handleNavClick}
            className="mt-2 bg-primary/90 hover:bg-primary text-surface font-semibold px-5 py-2.5 rounded-md text-sm transition-all"
          >
            Get Started
          </button>
        </nav>
      )}

      <main className="relative z-10 max-w-4xl mx-auto px-6 pt-20 pb-32 flex flex-col items-center justify-center min-h-[calc(100vh-89px)] text-center">
        <div className="flex flex-col items-center space-y-8">
          <h2 className="text-5xl lg:text-[4rem] font-bold text-white leading-[1.1] tracking-tight">
            The Social Network
            <br />
            for Developers
          </h2>

          <p className="text-xl text-text-muted max-w-2xl leading-relaxed">
            Where Developers Build Their Presence
          </p>

          <div className="pt-2">
            <button
              type="button"
              onClick={goToLogin}
              className="flex items-center space-x-2 bg-primary/90 hover:bg-primary text-surface font-semibold px-8 py-3.5 rounded-md transition-all shadow-[0_0_15px_rgba(34,211,238,0.2)] hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
