import { createSlice } from '@reduxjs/toolkit';
import { getItem, setItem } from '../../../shared/utils/LocalStorage';

const CHAT_STORAGE_KEY = 'devhub_chat_messages';

const loadMessages = () => {
  try {
    const stored = getItem(CHAT_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

const persistMessages = (messagesByRoom) => {
  setItem(CHAT_STORAGE_KEY, JSON.stringify(messagesByRoom));
};

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    isOpen: false,
    activeUser: null,
    messagesByRoom: loadMessages(),
    connectionStatus: 'idle',
    isTyping: false,
  },
  reducers: {
    openChatDialog: (state, action) => {
      state.isOpen = true;
      state.activeUser = action.payload;
    },
    closeChatDialog: (state) => {
      state.isOpen = false;
      state.activeUser = null;
      state.isTyping = false;
    },
    setConnectionStatus: (state, action) => {
      state.connectionStatus = action.payload;
    },
    setTyping: (state, action) => {
      state.isTyping = action.payload;
    },
    setRoomMessages: (state, action) => {
      const { roomId, messages } = action.payload;
      state.messagesByRoom[roomId] = messages;
      persistMessages(state.messagesByRoom);
    },
    addMessage: (state, action) => {
      const { roomId, message } = action.payload;
      if (!state.messagesByRoom[roomId]) {
        state.messagesByRoom[roomId] = [];
      }
      const exists = state.messagesByRoom[roomId].some((m) => m.id === message.id);
      if (!exists) {
        state.messagesByRoom[roomId].push(message);
        persistMessages(state.messagesByRoom);
      }
    },
  },
});

export const {
  openChatDialog,
  closeChatDialog,
  setConnectionStatus,
  setTyping,
  setRoomMessages,
  addMessage,
} = chatSlice.actions;

export default chatSlice.reducer;
