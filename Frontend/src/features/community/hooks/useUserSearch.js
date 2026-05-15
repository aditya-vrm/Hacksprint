import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { CURRENT_USER_ID } from '../state/communitySlice';

const normalize = (value) => value.toLowerCase().trim();

export const useUserSearch = () => {
  const users = useSelector((state) => state.community.users);
  const followedUserIds = useSelector((state) => state.community.followedUserIds);

  const registeredUsers = useMemo(
    () => Object.values(users).filter((user) => user.id !== CURRENT_USER_ID),
    [users],
  );

  const searchUsers = useCallback(
    (query) => {
      const q = normalize(query);
      if (!q) return [];

      return registeredUsers.filter((user) => {
        const name = normalize(user.name || '');
        const username = normalize(user.username || '');
        const email = normalize(user.email || '');
        return name.includes(q) || username.includes(q) || email.includes(q);
      });
    },
    [registeredUsers],
  );

  const isFollowing = useCallback(
    (userId) => followedUserIds.includes(userId),
    [followedUserIds],
  );

  return { searchUsers, isFollowing, registeredUsers };
};
