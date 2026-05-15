import { useState } from 'react';
import { Plus, X, Calendar, Clock, BookOpen } from 'lucide-react';
import { useCommunity } from '../../../community/hooks/useCommunity';
import BlogDetailModal from '../../../community/ui/components/BlogDetailModal';

const BlogsPage = () => {
  const { blogs, addBlog } = useCommunity();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePublish = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;
    
    addBlog({
      ...formData,
      readTime: `${Math.max(1, Math.ceil(formData.content.length / 1000))} min read`,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    });

    setIsModalOpen(false);
    setFormData({ title: '', summary: '', content: '' });
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      <div className="flex items-center justify-between p-6 lg:px-8 border-b border-border/50 bg-surface/50 backdrop-blur-sm sticky top-0 z-10">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">My Blogs</h1>
          <p className="text-sm text-text-muted mt-1">Write, manage, and share your thoughts.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 bg-primary hover:bg-primary-hover text-[#0B1120] font-bold px-4 py-2 rounded-lg text-sm tracking-wide transition-all duration-300 shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)]"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Blog</span>
        </button>
      </div>

      <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
        {blogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center border border-dashed border-border/50 rounded-2xl bg-surface/30 p-12 min-h-[400px]">
            <div className="w-16 h-16 rounded-2xl bg-surface flex items-center justify-center mb-4 border border-border">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Blogs Found</h3>
            <p className="text-text-muted max-w-sm">
              You haven't published any blogs yet. Click the button to start writing your first post!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <button
                key={blog.id}
                type="button"
                onClick={() => setSelectedBlog(blog)}
                className="text-left bg-surface border border-border rounded-xl p-6 hover:border-primary/50 transition-colors group flex flex-col h-full cursor-pointer"
              >
                <div className="mb-4 flex-1">
                  <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors mb-2 line-clamp-2">
                    {blog.title}
                  </h3>
                  {blog.summary && (
                    <p className="text-sm text-text-muted line-clamp-3 leading-relaxed">
                      {blog.summary}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center text-xs text-text-muted pt-4 border-t border-border/50 gap-4 mt-auto">
                  <div className="flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                    <span>{blog.date}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                    <span>{blog.readTime}</span>
                  </div>
                  <span className="text-primary font-medium ml-auto group-hover:text-primary-hover">
                    Read more
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface border border-border rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-border/50 shrink-0">
              <h2 className="text-xl font-bold text-white">Write a Blog Post</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-text-muted hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handlePublish} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Blog Title *</label>
                <input 
                  type="text" 
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required 
                  placeholder="How I built DevHub IDE..." 
                  className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-text-muted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Short Summary</label>
                <input 
                  type="text" 
                  name="summary"
                  value={formData.summary}
                  onChange={handleChange}
                  placeholder="A brief overview of your blog post..." 
                  className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-text-muted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Content *</label>
                <textarea 
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  required
                  rows="10"
                  placeholder="Write your amazing content here... (Markdown supported)" 
                  className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm text-white placeholder-text-muted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none" 
                />
              </div>

              <div className="pt-4 flex gap-3 sticky bottom-0 bg-surface">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-surface-hover hover:bg-border text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-primary hover:bg-primary-hover text-[#0B1120] font-bold py-2.5 rounded-lg text-sm tracking-wide transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                >
                  Publish Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <BlogDetailModal
        blog={selectedBlog}
        isOpen={Boolean(selectedBlog)}
        onClose={() => setSelectedBlog(null)}
      />
    </div>
  );
};

export default BlogsPage;
