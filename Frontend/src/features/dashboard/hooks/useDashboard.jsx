import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { CURRENT_USER_ID } from '../../community/state/communitySlice';


const getGreetingMessage = () => {
  const hour = new Date().getHours();

  if (hour < 12) return 'Good morning — ready to ship something great today?';
  if (hour < 17) return 'Good afternoon — your projects are waiting for you.';
  if (hour < 21) return 'Good evening — a perfect time to review your latest work.';
  return 'Good night — take it easy, or push one more commit.';
};

export const useDashboard = () => {
  const profile = useSelector((state) => state.profile);
  const feed = useSelector((state) => state.community.feed);
  const followerIds = useSelector((state) => state.community.followerIds);

  const totalLikes = useMemo(
    () =>
      feed
        .filter((post) => post.authorId === CURRENT_USER_ID)
        .reduce((sum, post) => sum + (post.likes ?? 0), 0),
    [feed],
  );

  const stats = useMemo(
    () => ({
      profileViews: (profile.profileViews || 0).toLocaleString(),
      totalLikes,
      followers: (profile.followers || 0) + (followerIds?.length || 0),
    }),
    [profile.followers, followerIds, totalLikes, profile.profileViews],
  );
  const greetingMessage = useMemo(() => getGreetingMessage(), []);

  return {
    stats,
    userName: profile.name,
    greetingMessage,
  };
};
