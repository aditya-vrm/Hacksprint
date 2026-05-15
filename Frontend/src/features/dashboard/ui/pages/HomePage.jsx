import {
  Eye,
  Star,
  Users,
  PlusCircle,
  FileEdit,
  Code,
  GitBranch,
  Pencil,
  Trash2,
} from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard';
import WelcomeHeader from '../components/WelcomeHeader';

const HomePage = () => {
  const { stats, userName, greetingMessage } = useDashboard();

  return (
    <div className="max-w-7xl mx-auto pb-12 animate-in fade-in duration-500 space-y-6">
      <WelcomeHeader userName={userName} greetingMessage={greetingMessage} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface border border-border p-4 rounded-xl flex flex-col justify-between hover:border-primary/50 transition-colors">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider">
              Profile Views
            </span>
            <Eye className="w-4 h-4 text-primary" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white mb-1">{stats.profileViews}</div>
            <div className="text-xs text-primary">+14% this month</div>
          </div>
        </div>

        <div className="bg-surface border border-border p-4 rounded-xl flex flex-col justify-between hover:border-primary/50 transition-colors">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider">
              Repository Stars
            </span>
            <Star className="w-4 h-4 text-primary" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white mb-1">{stats.repositoryStars}</div>
            <div className="text-xs text-primary">+32 since last deploy</div>
          </div>
        </div>

        <div className="bg-surface border border-border p-4 rounded-xl flex flex-col justify-between hover:border-primary/50 transition-colors">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider">
              Followers
            </span>
            <Users className="w-4 h-4 text-primary" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white mb-1">{stats.followers}</div>
            <div className="text-xs text-text-muted">Top 5% of DevHub</div>
          </div>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl p-6 relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Creation Suite</h2>
          <span className="text-xs font-mono text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
            Status: Ready
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            type="button"
            className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-xl hover:border-primary/50 hover:bg-surface-hover/50 transition-all group"
          >
            <PlusCircle className="w-8 h-8 text-text-muted group-hover:text-primary mb-4 transition-colors" />
            <h3 className="text-sm font-bold text-white mb-1">New Project</h3>
            <p className="text-xs text-text-muted text-center">
              Initialize from CLI or
              <br />
              Template
            </p>
          </button>

          <button
            type="button"
            className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-xl hover:border-primary/50 hover:bg-surface-hover/50 transition-all group"
          >
            <FileEdit className="w-8 h-8 text-text-muted group-hover:text-primary mb-4 transition-colors" />
            <h3 className="text-sm font-bold text-white mb-1">New Blog Post</h3>
            <p className="text-xs text-text-muted text-center">
              Write tech guide in
              <br />
              Markdown
            </p>
          </button>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xs font-mono text-text-muted uppercase tracking-wider">
            Active Projects
          </h3>
          <button type="button" className="text-xs text-primary hover:text-white transition-colors">
            View All (12)
          </button>
        </div>

        <div className="space-y-3">
          <div className="bg-surface border border-border rounded-xl p-4 flex items-center justify-between hover:bg-surface-hover transition-colors group">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-lg bg-background border border-border flex items-center justify-center">
                <Code className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="text-sm font-bold text-white">NeuralPath.ai</h4>
                  <span className="text-[10px] font-mono text-text-muted border border-border px-1.5 rounded bg-background">
                    v2.4.0
                  </span>
                </div>
                <p className="text-xs text-text-muted mt-0.5">
                  Decentralized inference engine for...
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-1">
                <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[8px] font-bold border border-blue-500/30">
                  TS
                </span>
                <span className="w-6 h-6 rounded-full bg-yellow-500/20 text-yellow-400 flex items-center justify-center text-[8px] font-bold border border-yellow-500/30">
                  PY
                </span>
              </div>
              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  className="p-1.5 text-text-muted hover:text-white hover:bg-background rounded-md transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className="p-1.5 text-text-muted hover:text-red-400 hover:bg-background rounded-md transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-surface border border-border rounded-xl p-4 flex items-center justify-between hover:bg-surface-hover transition-colors group">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-lg bg-background border border-border flex items-center justify-center">
                <GitBranch className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="text-sm font-bold text-white">Flux-Cache</h4>
                  <span className="text-[10px] font-mono text-text-muted border border-border px-1.5 rounded bg-background">
                    MIT
                  </span>
                </div>
                <p className="text-xs text-text-muted mt-0.5">Zero-latency distributed caching...</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-1">
                <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[8px] font-bold border border-cyan-500/30">
                  GO
                </span>
              </div>
              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  className="p-1.5 text-text-muted hover:text-white hover:bg-background rounded-md transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className="p-1.5 text-text-muted hover:text-red-400 hover:bg-background rounded-md transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
