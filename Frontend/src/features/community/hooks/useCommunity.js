import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  hydrateFeed,
  addProject,
  addBlog,
  loadMoreFeed,
  toggleLike,
  toggleFollow,
  CURRENT_USER_ID,
} from '../state/communitySlice';

export const useCommunity = () => {
  const dispatch = useDispatch();
  const community = useSelector((state) => state.community);
  const profile = useSelector((state) => state.profile);

  const visibleFeed = useMemo(
    () => community.feed.slice(0, community.visibleCount),
    [community.feed, community.visibleCount],
  );

  const hasMore = community.visibleCount < community.feed.length;

  const getAuthor = useCallback(
    (authorId) => {
      if (authorId === CURRENT_USER_ID) {
        return {
          id: CURRENT_USER_ID,
          name: profile.name,
          username: profile.username || '@you',
          avatarUrl: profile.avatarUrl,
          followers: community.followerIds.length + (profile.followers || 0),
        };
      }
      return community.users[authorId] || {
        id: authorId,
        name: 'Unknown',
        username: '@unknown',
        avatarUrl: '/logo.png',
        followers: 0,
      };
    },
    [community.users, community.followerIds, profile.name, profile.username, profile.avatarUrl],
  );

  const isLiked = useCallback(
    (postId) => community.likedIds.includes(postId),
    [community.likedIds],
  );

  const isFollowing = useCallback(
    (userId) => community.followedUserIds.includes(userId),
    [community.followedUserIds],
  );

  const followingCount = community.followedUserIds.length;
  const followersCount = community.followerIds.length + (profile.followers || 0);

  return {
    projects: community.projects,
    blogs: community.blogs,
    feed: visibleFeed,
    hasMore,
    totalProjects: community.projects.length,
    totalBlogs: community.blogs.length,
    followingCount,
    followersCount,
    getAuthor,
    isLiked,
    isFollowing,
    hydrateFeed: useCallback(() => dispatch(hydrateFeed()), [dispatch]),
    addProject: useCallback((data) => dispatch(addProject(data)), [dispatch]),
    addBlog: useCallback((data) => dispatch(addBlog(data)), [dispatch]),
    loadMoreFeed: useCallback(() => dispatch(loadMoreFeed()), [dispatch]),
    toggleLike: useCallback((postId) => dispatch(toggleLike(postId)), [dispatch]),
    toggleFollow: useCallback((userId) => dispatch(toggleFollow(userId)), [dispatch]),
  };
};
