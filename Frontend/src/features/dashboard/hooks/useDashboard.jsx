import { useMemo } from 'react';

const DASHBOARD_STATS = {
  profileViews: '12.4k',
  repositoryStars: '1.2k',
  followers: '842',
};

const USER_NAME = 'Alex Morgan';

const getGreetingMessage = () => {
  const hour = new Date().getHours();

  if (hour < 12) return 'Good morning — ready to ship something great today?';
  if (hour < 17) return 'Good afternoon — your projects are waiting for you.';
  if (hour < 21) return 'Good evening — a perfect time to review your latest work.';
  return 'Good night — take it easy, or push one more commit.';
};

export const useDashboard = () => {
  const stats = useMemo(() => DASHBOARD_STATS, []);
  const greetingMessage = useMemo(() => getGreetingMessage(), []);

  return {
    stats,
    userName: USER_NAME,
    greetingMessage,
  };
};
