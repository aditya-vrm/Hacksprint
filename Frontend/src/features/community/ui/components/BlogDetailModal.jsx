import { Calendar, Clock, FileText } from 'lucide-react';
import DetailModal from '../../../../shared/components/DetailModal';

const BlogDetailModal = ({ blog, isOpen, onClose, author }) => {
  if (!blog) return null;

  const subtitle = [blog.date, blog.readTime].filter(Boolean).join(' · ');

  return (
    <DetailModal
      isOpen={isOpen}
      onClose={onClose}
      title={blog.title}
      subtitle={subtitle}
      maxWidth="max-w-4xl"
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

      {blog.summary && (
        <p className="text-base text-text-muted leading-relaxed mb-6 font-medium">{blog.summary}</p>
      )}

      <div className="prose prose-invert max-w-none">
        <div className="text-sm text-white leading-relaxed whitespace-pre-wrap">
          {blog.content || 'No content available.'}
        </div>
      </div>

      <div className="flex items-center gap-4 mt-8 pt-6 border-t border-border/50 text-xs text-text-muted">
        {blog.date && (
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {blog.date}
          </span>
        )}
        {blog.readTime && (
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {blog.readTime}
          </span>
        )}
        <span className="flex items-center gap-1.5 ml-auto">
          <FileText className="w-3.5 h-3.5 text-primary" />
          Blog post
        </span>
      </div>
    </DetailModal>
  );
};

export default BlogDetailModal;
