import { useCallback, useMemo, useState } from 'react';
import { Compass, Loader2 } from 'lucide-react';
import { useCommunity } from '../../hooks/useCommunity';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
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
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const {
    feed,
    hasMore,
    loadMoreFeed,
    getAuthor,
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

  const filteredFeed = useMemo(() => {
    if (filter === 'all') return feed;
    return feed.filter((post) => post.type === filter);
  }, [feed, filter]);

  const handleLoadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    loadMoreFeed();
    setTimeout(() => setLoadingMore(false), 500);
  }, [loadingMore, hasMore, loadMoreFeed]);

  const sentinelRef = useInfiniteScroll(handleLoadMore, hasMore, loadingMore);

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
        {filteredFeed.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border rounded-xl bg-surface/30">
            <p className="text-text-muted">No posts in this feed yet.</p>
          </div>
        ) : (
          filteredFeed.map((post) => {
            const author = getAuthor(post.authorId);
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

      <div ref={sentinelRef} className="flex justify-center py-8">
        {loadingMore && (
          <div className="flex items-center gap-2 text-text-muted text-sm">
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
            Loading more...
          </div>
        )}
        {!hasMore && filteredFeed.length > 0 && (
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
        author={selectedPost?.type === 'blog' ? getAuthor(selectedPost.authorId) : null}
      />

      <ProjectDetailModal
        project={selectedPost?.type === 'project' ? selectedPost : null}
        isOpen={selectedPost?.type === 'project'}
        onClose={() => setSelectedPost(null)}
        author={selectedPost?.type === 'project' ? getAuthor(selectedPost.authorId) : null}
      />
    </div>
  );
};

export default CommunityPage;
