import { createSlice } from '@reduxjs/toolkit';
import { getItem, setItem } from '../../../shared/utils/LocalStorage';

export const CURRENT_USER_ID = 'user-me';
const STORAGE_KEY = 'devhub_community';

const MOCK_USERS = [
  {
    id: 'u-sarah',
    name: 'Sarah Chen',
    username: '@sarah_dev',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    followers: 2,
    followerIds: ['u-marcus', 'u-priya'],
    followingIds: ['u-marcus', 'u-james'],
  },
  {
    id: 'u-marcus',
    name: 'Marcus Rivera',
    username: '@marcus_codes',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
    followers: 2,
    followerIds: ['u-sarah', 'u-james'],
    followingIds: ['u-sarah', 'u-priya'],
  },
  {
    id: 'u-priya',
    name: 'Priya Patel',
    username: '@priya_builds',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
    followers: 2,
    followerIds: ['u-marcus', 'u-lena'],
    followingIds: ['u-sarah', 'u-lena'],
  },
  {
    id: 'u-james',
    name: 'James Okonkwo',
    username: '@james_fullstack',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
    followers: 1,
    followerIds: ['u-sarah'],
    followingIds: ['u-marcus'],
  },
  {
    id: 'u-lena',
    name: 'Lena Vogel',
    username: '@lena_opensource',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lena',
    followers: 1,
    followerIds: ['u-priya'],
    followingIds: ['u-priya'],
  },
];

const MOCK_PROJECTS = [
  'NeuralPath.ai',
  'Flux-Cache',
  'EdgeDeploy CLI',
  'SynthDB',
  'Orbit UI Kit',
  'PacketStream',
];

const MOCK_BLOGS = [
  'Building Scalable React Apps in 2026',
  'Why Edge Functions Changed My Workflow',
  'A Guide to Monorepos with Vite',
  'Rust vs Go for Backend Services',
  'Designing Developer-First Dashboards',
  'From Side Project to Production',
];

const createMockFeedItem = (index, user, type) => {
  const id = `mock-${type}-${index}`;
  const isProject = type === 'project';

  if (isProject) {
    return {
      id,
      type: 'project',
      authorId: user.id,
      createdAt: Date.now() - index * 3600000,
      likes: Math.floor(Math.random() * 80) + 5,
      likedBy: [],
      projectName: MOCK_PROJECTS[index % MOCK_PROJECTS.length],
      githubRepo: `https://github.com/${user.username.replace('@', '')}/${MOCK_PROJECTS[index % MOCK_PROJECTS.length].toLowerCase().replace(/\s/g, '-')}`,
      deploymentLink: `https://${MOCK_PROJECTS[index % MOCK_PROJECTS.length].toLowerCase().replace(/\s/g, '')}.dev`,
      status: 'Active',
    };
  }

  const title = MOCK_BLOGS[index % MOCK_BLOGS.length];
  return {
    id,
    type: 'blog',
    authorId: user.id,
    createdAt: Date.now() - index * 7200000,
    likes: Math.floor(Math.random() * 120) + 10,
    likedBy: [],
    title,
    summary: `Insights from ${user.name} on shipping better software.`,
    content: `Full article about ${title}.`,
    readTime: '5 min read',
    date: new Date(Date.now() - index * 86400000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
  };
};

const buildMockFeedPool = () => {
  const pool = [];
  let i = 0;
  for (let round = 0; round < 8; round += 1) {
    MOCK_USERS.forEach((user) => {
      pool.push(createMockFeedItem(i, user, 'project'));
      i += 1;
      pool.push(createMockFeedItem(i, user, 'blog'));
      i += 1;
    });
  }
  return pool.sort((a, b) => b.createdAt - a.createdAt);
};

const DEFAULT_STATE = {
  projects: [],
  blogs: [],
  feed: [],
  feedPool: buildMockFeedPool(),
  visibleCount: 8,
  likedIds: [],
  followedUserIds: [],
  followerIds: [],
  users: Object.fromEntries(MOCK_USERS.map((u) => [u.id, { ...u }])),
};

const loadState = () => {
  try {
    const stored = getItem(STORAGE_KEY);
    if (!stored) {
      const state = { ...DEFAULT_STATE };
      rebuildFeed(state);
      return state;
    }
    const parsed = JSON.parse(stored);
    const state = {
      ...DEFAULT_STATE,
      ...parsed,
      feedPool: parsed.feedPool?.length ? parsed.feedPool : DEFAULT_STATE.feedPool,
      users: { ...DEFAULT_STATE.users, ...parsed.users },
    };
    rebuildFeed(state);
    return state;
  } catch {
    const state = { ...DEFAULT_STATE };
    rebuildFeed(state);
    return state;
  }
};

const persist = (state) => {
  const { feedPool, ...toSave } = state;
  setItem(STORAGE_KEY, JSON.stringify({ ...toSave, feedPool }));
};

const rebuildFeed = (state) => {
  const userPosts = [
    ...state.projects.map((p) => ({
      id: `feed-project-${p.id}`,
      type: 'project',
      authorId: CURRENT_USER_ID,
      createdAt: p.createdAt || p.id,
      likes: p.likes ?? 0,
      likedBy: p.likedBy ?? [],
      ...p,
    })),
    ...state.blogs.map((b) => ({
      id: `feed-blog-${b.id}`,
      type: 'blog',
      authorId: CURRENT_USER_ID,
      createdAt: b.createdAt || b.id,
      likes: b.likes ?? 0,
      likedBy: b.likedBy ?? [],
      ...b,
    })),
  ];

  const merged = [...userPosts, ...state.feedPool].sort((a, b) => b.createdAt - a.createdAt);
  state.feed = merged;
};

const communitySlice = createSlice({
  name: 'community',
  initialState: loadState(),
  reducers: {
    hydrateFeed: (state) => {
      rebuildFeed(state);
    },
    addProject: (state, action) => {
      const project = {
        id: Date.now(),
        createdAt: Date.now(),
        likes: 0,
        likedBy: [],
        status: 'Active',
        updatedAt: new Date().toLocaleDateString(),
        ...action.payload,
      };
      state.projects.unshift(project);
      rebuildFeed(state);
      persist(state);
    },
    addBlog: (state, action) => {
      const blog = {
        id: Date.now(),
        createdAt: Date.now(),
        likes: 0,
        likedBy: [],
        ...action.payload,
      };
      state.blogs.unshift(blog);
      rebuildFeed(state);
      persist(state);
    },
    loadMoreFeed: (state) => {
      state.visibleCount = Math.min(state.visibleCount + 6, state.feed.length);
      persist(state);
    },
    toggleLike: (state, action) => {
      const postId = action.payload;
      const post = state.feed.find((p) => p.id === postId);
      if (!post) return;

      const liked = state.likedIds.includes(postId);
      if (liked) {
        state.likedIds = state.likedIds.filter((id) => id !== postId);
        post.likes = Math.max(0, post.likes - 1);
        post.likedBy = post.likedBy.filter((id) => id !== CURRENT_USER_ID);
      } else {
        state.likedIds.push(postId);
        post.likes += 1;
        if (!post.likedBy.includes(CURRENT_USER_ID)) {
          post.likedBy.push(CURRENT_USER_ID);
        }
      }
      persist(state);
    },
    toggleFollow: (state, action) => {
      const payload = action.payload;
      const userId = typeof payload === 'object' ? payload.id : payload;
      if (userId === CURRENT_USER_ID) return;

      const isFollowing = state.followedUserIds.includes(userId);

      // Make sure CURRENT_USER_ID user object is initialized
      if (!state.users[CURRENT_USER_ID]) {
        state.users[CURRENT_USER_ID] = {
          id: CURRENT_USER_ID,
          followerIds: [],
          followingIds: [],
        };
      }
      if (!state.users[CURRENT_USER_ID].followerIds) state.users[CURRENT_USER_ID].followerIds = [];
      if (!state.users[CURRENT_USER_ID].followingIds) state.users[CURRENT_USER_ID].followingIds = [];

      if (isFollowing) {
        state.followedUserIds = state.followedUserIds.filter((id) => id !== userId);
        state.users[CURRENT_USER_ID].followingIds = state.users[CURRENT_USER_ID].followingIds.filter((id) => id !== userId);

        if (state.users[userId]) {
          if (!state.users[userId].followerIds) state.users[userId].followerIds = [];
          state.users[userId].followerIds = state.users[userId].followerIds.filter((id) => id !== CURRENT_USER_ID);
          state.users[userId].followers = Math.max(0, (state.users[userId].followers || 0) - 1);
        }
      } else {
        state.followedUserIds.push(userId);
        if (!state.users[CURRENT_USER_ID].followingIds.includes(userId)) {
          state.users[CURRENT_USER_ID].followingIds.push(userId);
        }

        if (!state.users[userId] && typeof payload === 'object') {
          state.users[userId] = {
            id: payload.id,
            name: payload.fullname || payload.name || 'DevHub User',
            username: payload.username,
            avatarUrl: payload.profilePicture || payload.avatarUrl || '/logo.png',
            followers: 1,
            followerIds: [CURRENT_USER_ID],
            followingIds: [],
          };
        } else if (state.users[userId]) {
          if (!state.users[userId].followerIds) state.users[userId].followerIds = [];
          if (!state.users[userId].followerIds.includes(CURRENT_USER_ID)) {
            state.users[userId].followerIds.push(CURRENT_USER_ID);
          }
          state.users[userId].followers = (state.users[userId].followers || 0) + 1;
        }
      }
      persist(state);
    },
    registerUser: (state, action) => {
      const { name, email, avatarUrl, username, dateOfBirth, gender, followers, following } = action.payload;
      const handle =
        username?.replace(/^@/, '') ||
        email?.split('@')[0]?.toLowerCase().replace(/[^a-z0-9]/g, '') ||
        'dev';

      const followerIds = [];
      const followingIds = [];

      if (Array.isArray(followers)) {
        followers.forEach((f) => {
          const fId = f.id || f._id || f;
          if (typeof f === 'object' && fId) {
            followerIds.push(fId);
            if (!state.users[fId]) {
              state.users[fId] = {
                id: fId,
                name: f.fullname || f.name,
                username: f.username,
                avatarUrl: f.profilePicture || f.avatarUrl || '/logo.png',
              };
            }
          } else if (fId) {
            followerIds.push(fId);
          }
        });
      }

      if (Array.isArray(following)) {
        following.forEach((f) => {
          const fId = f.id || f._id || f;
          if (typeof f === 'object' && fId) {
            followingIds.push(fId);
            if (!state.users[fId]) {
              state.users[fId] = {
                id: fId,
                name: f.fullname || f.name,
                username: f.username,
                avatarUrl: f.profilePicture || f.avatarUrl || '/logo.png',
              };
            }
          } else if (fId) {
            followingIds.push(fId);
          }
        });
      }

      state.users[CURRENT_USER_ID] = {
        id: CURRENT_USER_ID,
        name,
        email,
        username: username?.startsWith('@') ? username : `@${handle}`,
        avatarUrl: avatarUrl || state.users[CURRENT_USER_ID]?.avatarUrl || '/logo.png',
        dateOfBirth: dateOfBirth ?? state.users[CURRENT_USER_ID]?.dateOfBirth ?? '',
        gender: gender ?? state.users[CURRENT_USER_ID]?.gender ?? '',
        followerIds,
        followingIds,
      };

      state.followedUserIds = followingIds;
      state.followerIds = followerIds;

      persist(state);
    },
    clearSessionStats: (state) => {
      state.followerIds = [];
      state.followedUserIds = [];
      // Clean up 'user-me' from all cached users' lists
      Object.keys(state.users).forEach((userId) => {
        if (state.users[userId]) {
          state.users[userId].followerIds = (state.users[userId].followerIds || []).filter(
            (id) => id !== CURRENT_USER_ID
          );
          state.users[userId].followingIds = (state.users[userId].followingIds || []).filter(
            (id) => id !== CURRENT_USER_ID
          );
        }
      });
      persist(state);
    },
    cacheUser: (state, action) => {
      const payload = action.payload;
      if (!payload || (!payload.id && !payload._id)) return;
      const userId = payload.id || payload._id;
      if (userId === CURRENT_USER_ID) return;

      const followerIds = [];
      const followingIds = [];

      if (Array.isArray(payload.followers)) {
        payload.followers.forEach((f) => {
          const fId = f.id || f._id || f;
          if (typeof f === 'object' && fId) {
            const cacheId = fId === CURRENT_USER_ID ? CURRENT_USER_ID : fId;
            followerIds.push(cacheId);
            if (cacheId !== CURRENT_USER_ID) {
              if (!state.users[cacheId]) {
                state.users[cacheId] = {
                  id: cacheId,
                  name: f.fullname || f.name,
                  username: f.username,
                  avatarUrl: f.profilePicture || f.avatarUrl || '/logo.png',
                };
              }
            }
          } else if (fId) {
            followerIds.push(fId === CURRENT_USER_ID ? CURRENT_USER_ID : fId);
          }
        });
      }

      if (Array.isArray(payload.following)) {
        payload.following.forEach((f) => {
          const fId = f.id || f._id || f;
          if (typeof f === 'object' && fId) {
            const cacheId = fId === CURRENT_USER_ID ? CURRENT_USER_ID : fId;
            followingIds.push(cacheId);
            if (cacheId !== CURRENT_USER_ID) {
              if (!state.users[cacheId]) {
                state.users[cacheId] = {
                  id: cacheId,
                  name: f.fullname || f.name,
                  username: f.username,
                  avatarUrl: f.profilePicture || f.avatarUrl || '/logo.png',
                };
              }
            }
          } else if (fId) {
            followingIds.push(fId === CURRENT_USER_ID ? CURRENT_USER_ID : fId);
          }
        });
      }

      if (!state.users[userId]) {
        state.users[userId] = {
          id: userId,
          name: payload.fullname || payload.name || 'DevHub User',
          username: payload.username,
          avatarUrl: payload.profilePicture || payload.avatarUrl || '/logo.png',
          followerIds,
          followingIds,
          followers: followerIds.length,
        };
      } else {
        state.users[userId].name = payload.fullname || payload.name || state.users[userId].name;
        state.users[userId].username = payload.username || state.users[userId].username;
        state.users[userId].avatarUrl = payload.profilePicture || payload.avatarUrl || state.users[userId].avatarUrl;
        state.users[userId].followerIds = followerIds;
        state.users[userId].followingIds = followingIds;
        state.users[userId].followers = followerIds.length;
      }
      persist(state);
    },
  },
});

export const {
  hydrateFeed,
  addProject,
  addBlog,
  loadMoreFeed,
  toggleLike,
  toggleFollow,
  registerUser,
  clearSessionStats,
  cacheUser,
} =
  communitySlice.actions;

export default communitySlice.reducer;
