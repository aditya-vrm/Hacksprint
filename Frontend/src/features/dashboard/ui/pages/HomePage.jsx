import { Eye, Heart, Users, PlusCircle, FileEdit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '../../hooks/useDashboard';
import WelcomeHeader from '../components/WelcomeHeader';

const HomePage = () => {
  const { stats, userName, greetingMessage } = useDashboard();
  const navigate = useNavigate();

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
          <div className="text-2xl font-bold text-white">{stats.profileViews}</div>
        </div>

        <div className="bg-surface border border-border p-4 rounded-xl flex flex-col justify-between hover:border-primary/50 transition-colors">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider">
              Total Likes
            </span>
            <Heart className="w-4 h-4 text-primary" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white mb-1">{stats.totalLikes.toLocaleString()}</div>
            <div className="text-xs text-primary">On your posts</div>
          </div>
        </div>

        <div className="bg-surface border border-border p-4 rounded-xl flex flex-col justify-between hover:border-primary/50 transition-colors">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider">
              Followers
            </span>
            <Users className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.followers}</div>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-6">Creation Suite</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            type="button"
            onClick={() => navigate('/dashboard/projects')}
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
            onClick={() => navigate('/dashboard/blogs')}
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
    </div>
  );
};

export default HomePage;
