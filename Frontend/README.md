# DevHub Engine - Frontend

DevHub Engine is a professional, feature-rich web platform tailored for developers to share projects, write technical blogs, and connect in real-time. This directory contains the frontend portion of the application.

## 🚀 Tech Stack

- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit (Redux slices for Auth, Profile, Community, and Chat)
- **Routing**: React Router DOM (v6) with Protected Routes
- **API Communication**: Axios (with custom interceptors & credentials support)
- **Real-Time Communication**: Socket.io Client
- **Icons**: Lucide React

## 📁 Architecture (Feature-Sliced Design)

The project rigorously follows a modular, feature-sliced architecture. All features are self-contained inside `src/features/`, resulting in highly maintainable and scalable code.

```text
src/
├── app/                  # Application-wide configurations
│   ├── config/           # Axios instance, API configuration
│   └── store/            # Redux store configuration
├── features/             # Core features of the app
│   ├── auth/             # Login, Register (with dynamic gender avatars)
│   ├── chat/             # Socket.io real-time messaging, Chat Dialogs
│   ├── community/        # Explore Feed, Project/Blog Modals & Models
│   ├── dashboard/        # Dashboard stats, Project creation, Blog creation
│   ├── landing/          # Landing page navigation
│   └── profile/          # User Profile state and UI
├── shared/               # Reusable code across features
│   ├── components/       # Global UI components (Protected Routes, Layouts)
│   ├── constants/        # Standardized constants (e.g., gender options)
│   └── utils/            # Helper functions (LocalStorage, Username formatting)
└── main.jsx              # React Entry Point
```

## ✨ Core Features

### 1. Authentication System
- Secure login and registration.
- Dynamic Avatar assignment based on gender selection (Male/Female avatars).
- Tight validation ensuring usernames are formatted correctly.
- Integration with HTTP-only cookies via Axios.

### 2. Developer Dashboard
- **Dynamic Stats:** Profile views are dynamically calculated based on your total likes and feed length. Followers sync directly with the Redux state.
- **Creation Suite:** Create new open-source projects (GitHub links, deployments) and write rich markdown-style blog posts.
- **RESTful Integration:** Directly hooked into the MongoDB cloud backend `/api/projects/create` and `/api/blogs/create`.

### 3. Explore & Community Feed
- **Live Feed:** Bypasses mock data to pull real, active projects and blogs directly from the backend.
- **Rich Cards:** Feed cards intelligently populate with the real author's username, full name, and avatar directly from MongoDB references.

### 4. Real-Time Chat (Socket.io)
- **Live Connections:** Connects to the backend via `socket.io-client`.
- **Rooms:** Secure room creation based on user combinations.
- **Chat History:** Fetches previous chat messages dynamically via REST APIs before connecting to the socket stream.

## 🛠️ Environment Variables

The frontend relies on a `.env` file at the root of the `Frontend` directory:

```env
# API base URL (Routes through Vite Proxy for CORS & Cookies)
VITE_API_BASE_URL=/api

# Socket.IO server URL (Real-time chat)
VITE_SOCKET_URL=http://localhost:3000
```

## ⚙️ Vite Proxy Configuration

To gracefully handle CORS and allow browsers to pass HTTP-Only JWT tokens, `vite.config.js` is configured to proxy `/api` calls directly to the local backend:

```javascript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
```

## 🏃‍♂️ Getting Started

1. Ensure the Node dependencies are installed:
   ```bash
   npm install
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
3. Ensure the Backend Server is running simultaneously on port `3000` to handle APIs and Socket connections!
