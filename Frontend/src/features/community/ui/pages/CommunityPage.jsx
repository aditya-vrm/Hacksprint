import { useCallback, useMemo, useState, useEffect } from 'react';
import { Compass, Loader2 } from 'lucide-react';
import { useCommunity } from '../../hooks/useCommunity';
import axiosInstance from '../../../../app/config/axiosInstance';
import FeedCard from '../components/FeedCard';
import BlogDetailModal from '../components/BlogDetailModal';
import ProjectDetailModal from '../components/ProjectDetailModal';
import ChatDialog from '../../../chat/ui/components/ChatDialog';
import { useChat } from '../../../chat/hooks/useChat';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'project', label: 'Projects' },
  { id: 'blog', label: 'Blogs' },
];

const CommunityPage = () => {
  const [filter, setFilter] = useState('all');
  const [realFeed, setRealFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);

  const {
    isLiked,
    isFollowing,
    toggleLike,
    toggleFollow,
  } = useCommunity();

  const {
    isOpen: isChatOpen,
    activeUser: chatUser,
    activeMessages,
    connectionStatus,
    isTyping,
    openChat,
    closeChat,
    sendMessage,
  } = useChat();

  useEffect(() => {
    const fetchRealData = async () => {
      try {
        const [projectsRes, blogsRes] = await Promise.all([
          axiosInstance.get('/projects'),
          axiosInstance.get('/blogs'),
        ]);
        
        const projectsData = projectsRes.data.projects.map(p => ({
          ...p,
          id: p._id,
          type: 'project',
          likes: p.likes || Math.floor(Math.random() * 50),
          realAuthor: {
            id: p.owner?._id,
            name: p.owner?.fullname || 'Unknown',
            username: p.owner?.username ? `@${p.owner.username}` : '@unknown',
            avatarUrl: p.owner?.profilePicture || '/logo.png',
            followers: Math.floor(Math.random() * 100) + 10,
          }
        }));

        const blogsData = blogsRes.data.blogs.map(b => ({
          ...b,
          id: b._id,
          type: 'blog',
          likes: b.likes || Math.floor(Math.random() * 50),
          date: new Date(b.createdAt).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
          }),
          readTime: `${Math.max(1, Math.ceil((b.content?.length || 0) / 1000))} min read`,
          realAuthor: {
            id: b.author?._id,
            name: b.author?.fullname || 'Unknown',
            username: b.author?.username ? `@${b.author.username}` : '@unknown',
            avatarUrl: b.author?.profilePicture || '/logo.png',
            followers: Math.floor(Math.random() * 100) + 10,
          }
        }));

        const combined = [...projectsData, ...blogsData].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setRealFeed(combined);
      } catch (err) {
        console.error('Failed to fetch real explore feed', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRealData();
  }, []);

  const filteredFeed = useMemo(() => {
    if (filter === 'all') return realFeed;
    return realFeed.filter((post) => post.type === filter);
  }, [realFeed, filter]);

  return (
    <div className="max-w-3xl mx-auto pb-16 animate-in fade-in duration-500">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Compass className="w-7 h-7 text-primary" />
          <h1 className="text-3xl font-bold text-white tracking-tight">Explore</h1>
        </div>
        <p className="text-sm text-text-muted">
          Discover projects and blogs from developers. Like posts and follow creators.
        </p>
      </div>

      <div className="flex gap-2 mb-6">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              filter === f.id
                ? 'bg-primary/15 text-primary border border-primary/30'
                : 'bg-surface text-text-muted border border-border hover:text-white hover:border-border/80'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredFeed.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border rounded-xl bg-surface/30">
            <p className="text-text-muted">No posts in this feed yet.</p>
          </div>
        ) : (
          filteredFeed.map((post) => {
            const author = post.realAuthor;
            return (
              <FeedCard
                key={post.id}
                post={post}
                author={author}
                liked={isLiked(post.id)}
                following={isFollowing(author.id)}
                onLike={toggleLike}
                onFollow={toggleFollow}
                onChat={openChat}
                onOpenDetail={setSelectedPost}
              />
            );
          })
        )}
      </div>

      <div className="flex justify-center py-8">
        {!loading && filteredFeed.length > 0 && (
          <p className="text-xs text-text-muted font-mono">You&apos;re all caught up</p>
        )}
      </div>

      <ChatDialog
        isOpen={isChatOpen}
        activeUser={chatUser}
        messages={activeMessages}
        connectionStatus={connectionStatus}
        isTyping={isTyping}
        onClose={closeChat}
        onSend={sendMessage}
      />

      <BlogDetailModal
        blog={selectedPost?.type === 'blog' ? selectedPost : null}
        isOpen={selectedPost?.type === 'blog'}
        onClose={() => setSelectedPost(null)}
        author={selectedPost?.type === 'blog' ? selectedPost.realAuthor : null}
      />

      <ProjectDetailModal
        project={selectedPost?.type === 'project' ? selectedPost : null}
        isOpen={selectedPost?.type === 'project'}
        onClose={() => setSelectedPost(null)}
        author={selectedPost?.type === 'project' ? selectedPost.realAuthor : null}
      />
    </div>
  );
};

export default CommunityPage;
