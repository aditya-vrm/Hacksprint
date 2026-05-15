import { io } from 'socket.io-client';

let SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

if (import.meta.env.PROD) {
  SOCKET_URL = 'https://hacksprint-n0uc.onrender.com';
} else {
  SOCKET_URL = SOCKET_URL || import.meta.env.VITE_API_BASE_URL?.replace(/\/api\/?$/, '') || 'http://localhost:3000';
}

let socket = null;

export const getChatSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      transports: ['websocket', 'polling'],
      withCredentials: true,
    });
  }
  return socket;
};

export const connectChatSocket = () => {
  const instance = getChatSocket();
  if (!instance.connected) {
    instance.connect();
  }
  return instance;
};

export const disconnectChatSocket = () => {
  if (socket?.connected) {
    socket.disconnect();
  }
};

/** Expected backend events (align with your friend's API) */
export const CHAT_EVENTS = {
  JOIN_ROOM: 'join_room',
  SEND_MESSAGE: 'send_message',
  RECEIVE_MESSAGE: 'receive_message',
  MESSAGE: 'message',
  NEW_MESSAGE: 'new_message',
  TYPING: 'typing',
  USER_TYPING: 'user_typing',
};

export const getRoomId = (userIdA, userIdB) => [userIdA, userIdB].sort().join('_');
