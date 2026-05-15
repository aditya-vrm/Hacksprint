import { GitBranch, ExternalLink, Calendar } from 'lucide-react';
import DetailModal from '../../../../shared/components/DetailModal';

const ProjectDetailModal = ({ project, isOpen, onClose, author }) => {
  if (!project) return null;

  const subtitle = project.updatedAt ? `Updated ${project.updatedAt}` : undefined;

  return (
    <DetailModal
      isOpen={isOpen}
      onClose={onClose}
      title={project.projectName}
      subtitle={subtitle}
      maxWidth="max-w-2xl"
    >
      {author && (
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border/50">
          <img
            src={author.avatarUrl}
            alt={author.name}
            className="w-10 h-10 rounded-full border border-border object-cover"
          />
          <div>
            <p className="text-sm font-bold text-white">{author.name}</p>
            <p className="text-xs text-text-muted font-mono">{author.username}</p>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 mb-6">
        <span className="px-3 py-1 text-xs font-medium bg-green-500/10 text-green-400 rounded-full border border-green-500/20">
          {project.status || 'Active'}
        </span>
      </div>

      <div className="space-y-4">
        {project.githubRepo && (
          <div className="bg-background/50 border border-border rounded-xl p-4">
            <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider mb-2">
              GitHub Repository
            </p>
            <a
              href={project.githubRepo}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm text-primary hover:text-primary-hover break-all"
            >
              <GitBranch className="w-4 h-4 shrink-0" />
              {project.githubRepo}
            </a>
          </div>
        )}

        {project.deploymentLink && (
          <div className="bg-background/50 border border-border rounded-xl p-4">
            <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider mb-2">
              Live Deployment
            </p>
            <a
              href={project.deploymentLink}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm text-primary hover:text-primary-hover break-all"
            >
              <ExternalLink className="w-4 h-4 shrink-0" />
              {project.deploymentLink}
            </a>
          </div>
        )}

        {!project.githubRepo && !project.deploymentLink && (
          <p className="text-sm text-text-muted">No links added for this project yet.</p>
        )}
      </div>

      {project.updatedAt && (
        <div className="flex items-center gap-1.5 mt-8 pt-6 border-t border-border/50 text-xs text-text-muted">
          <Calendar className="w-3.5 h-3.5" />
          Last updated {project.updatedAt}
        </div>
      )}
    </DetailModal>
  );
};

export default ProjectDetailModal;
