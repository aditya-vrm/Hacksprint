import { Heart, GitBranch, ExternalLink, FileText, UserPlus, UserCheck, MessageCircle } from 'lucide-react';
import { CURRENT_USER_ID } from '../../state/communitySlice';

const FeedCard = ({ post, author, liked, following, onLike, onFollow, onChat, onOpenDetail }) => {
  const isProject = post.type === 'project';

  return (
    <article className="bg-surface border border-border rounded-xl p-5 hover:border-primary/30 transition-all duration-200">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={author.avatarUrl}
            alt={author.name}
            className="w-10 h-10 rounded-full border border-border object-cover shrink-0"
          />
          <div className="min-w-0">
            <p className="text-sm font-bold text-white truncate">{author.name}</p>
            <p className="text-xs text-text-muted font-mono truncate">{author.username}</p>
          </div>
        </div>

        {author.id !== CURRENT_USER_ID && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onChat?.(author)}
              title={`Message ${author.name}`}
              className="flex items-center justify-center w-9 h-9 rounded-lg text-text-muted border border-border hover:text-primary hover:border-primary/40 hover:bg-primary/10 transition-all duration-200"
              aria-label={`Chat with ${author.name}`}
            >
              <MessageCircle className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onFollow(author.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
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
          </div>
        )}
      </div>

      <div
        role="button"
        tabIndex={0}
        onClick={() => onOpenDetail?.(post)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onOpenDetail?.(post);
          }
        }}
        className="mb-4 w-full text-left rounded-lg -mx-1 px-1 py-1 hover:bg-surface-hover/50 transition-colors cursor-pointer"
      >
        <span
          className={`inline-block text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded mb-2 ${
            isProject
              ? 'bg-accent/10 text-accent border border-accent/20'
              : 'bg-primary/10 text-primary border border-primary/20'
          }`}
        >
          {isProject ? 'Project' : 'Blog'}
        </span>

        {isProject ? (
          <>
            <h3 className="text-lg font-bold text-white mb-2">{post.projectName}</h3>
            <div className="space-y-2">
              {post.githubRepo && (
                <a
                  href={post.githubRepo}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center text-sm text-text-muted hover:text-primary transition-colors truncate"
                >
                  <GitBranch className="w-4 h-4 mr-2 shrink-0" />
                  {post.githubRepo}
                </a>
              )}
              {post.deploymentLink && (
                <a
                  href={post.deploymentLink}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center text-sm text-text-muted hover:text-primary transition-colors truncate"
                >
                  <ExternalLink className="w-4 h-4 mr-2 shrink-0" />
                  {post.deploymentLink}
                </a>
              )}
            </div>
          </>
        ) : (
          <>
            <h3 className="text-lg font-bold text-white mb-2 flex items-start gap-2">
              <FileText className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              {post.title}
            </h3>
            {post.summary && (
              <p className="text-sm text-text-muted leading-relaxed line-clamp-2">{post.summary}</p>
            )}
            <p className="text-xs text-text-muted mt-2 font-mono">
              {post.date} · {post.readTime}
            </p>
          </>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border/50">
        <button
          type="button"
          onClick={() => onLike(post.id)}
          className={`flex items-center gap-2 text-sm font-medium transition-all duration-200 ${
            liked ? 'text-red-400' : 'text-text-muted hover:text-red-400'
          }`}
        >
          <Heart className={`w-4 h-4 ${liked ? 'fill-red-400' : ''}`} />
          {post.likes} {post.likes === 1 ? 'Like' : 'Likes'}
        </button>
        <span className="text-xs text-text-muted font-mono">
          {author.followers?.toLocaleString()} followers
        </span>
      </div>
    </article>
  );
};

export default FeedCard;
