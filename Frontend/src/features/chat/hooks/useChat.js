import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CURRENT_USER_ID } from '../../community/state/communitySlice';
import { fetchChatHistory } from '../api/chatApi';
import {
  CHAT_EVENTS,
  connectChatSocket,
  getChatSocket,
  getRoomId,
} from '../api/chatSocket';
import {
  addMessage,
  closeChatDialog,
  openChatDialog,
  setConnectionStatus,
  setRoomMessages,
  setTyping,
} from '../state/chatSlice';

const normalizeMessage = (payload, roomId) => ({
  id: payload.id || payload._id || `${Date.now()}-${Math.random()}`,
  roomId: payload.roomId || roomId,
  senderId: payload.senderId || payload.sender?.id || payload.from,
  text: payload.text || payload.message || payload.content || '',
  createdAt: payload.createdAt || payload.timestamp || Date.now(),
});

export const useChat = () => {
  const dispatch = useDispatch();
  const chat = useSelector((state) => state.chat);
  const profile = useSelector((state) => state.profile);
  const socketRef = useRef(null);

  const activeRoomId = useMemo(() => {
    if (!chat.activeUser) return null;
    return getRoomId(CURRENT_USER_ID, chat.activeUser.id);
  }, [chat.activeUser]);

  const activeMessages = useMemo(() => {
    if (!activeRoomId) return [];
    return chat.messagesByRoom[activeRoomId] || [];
  }, [activeRoomId, chat.messagesByRoom]);

  const handleIncomingMessage = useCallback(
    (payload) => {
      const roomId =
        payload.roomId ||
        (payload.senderId && payload.receiverId
          ? getRoomId(payload.senderId, payload.receiverId)
          : activeRoomId);

      if (!roomId) return;

      dispatch(
        addMessage({
          roomId,
          message: normalizeMessage(payload, roomId),
        }),
      );
    },
    [dispatch, activeRoomId],
  );

  useEffect(() => {
    socketRef.current = connectChatSocket();
    const socket = socketRef.current;

    const onConnect = () => dispatch(setConnectionStatus('connected'));
    const onDisconnect = () => dispatch(setConnectionStatus('disconnected'));
    const onConnectError = () => dispatch(setConnectionStatus('offline'));

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);

    [CHAT_EVENTS.RECEIVE_MESSAGE, CHAT_EVENTS.MESSAGE, CHAT_EVENTS.NEW_MESSAGE].forEach(
      (event) => {
        socket.on(event, handleIncomingMessage);
      },
    );

    socket.on(CHAT_EVENTS.USER_TYPING, () => dispatch(setTyping(true)));
    socket.on(CHAT_EVENTS.TYPING, () => dispatch(setTyping(true)));

    dispatch(setConnectionStatus(socket.connected ? 'connected' : 'connecting'));

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onConnectError);
      [CHAT_EVENTS.RECEIVE_MESSAGE, CHAT_EVENTS.MESSAGE, CHAT_EVENTS.NEW_MESSAGE].forEach(
        (event) => {
          socket.off(event, handleIncomingMessage);
        },
      );
    };
  }, [dispatch, handleIncomingMessage]);

  const openChat = useCallback(
    async (user) => {
      if (!user || user.id === CURRENT_USER_ID) return;

      dispatch(openChatDialog(user));
      const roomId = getRoomId(CURRENT_USER_ID, user.id);
      const socket = getChatSocket();

      if (socket.connected) {
        socket.emit(CHAT_EVENTS.JOIN_ROOM, {
          roomId,
          userId: CURRENT_USER_ID,
          peerId: user.id,
        });
      }

      const history = await fetchChatHistory(user.id);
      if (history?.length) {
        dispatch(
          setRoomMessages({
            roomId,
            messages: history.map((m) => normalizeMessage(m, roomId)),
          }),
        );
      }
    },
    [dispatch],
  );

  const closeChat = useCallback(() => {
    dispatch(closeChatDialog());
    dispatch(setTyping(false));
  }, [dispatch]);

  const sendMessage = useCallback(
    (text) => {
      const trimmed = text.trim();
      if (!trimmed || !chat.activeUser || !activeRoomId) return;

      const message = {
        id: `local-${Date.now()}`,
        roomId: activeRoomId,
        senderId: CURRENT_USER_ID,
        text: trimmed,
        createdAt: Date.now(),
      };

      dispatch(addMessage({ roomId: activeRoomId, message }));

      const socket = getChatSocket();
      const payload = {
        roomId: activeRoomId,
        senderId: CURRENT_USER_ID,
        receiverId: chat.activeUser.id,
        text: trimmed,
        senderName: profile.name,
        senderAvatar: profile.avatarUrl,
      };

      if (socket.connected) {
        socket.emit(CHAT_EVENTS.SEND_MESSAGE, payload);
      }
    },
    [chat.activeUser, activeRoomId, dispatch, profile],
  );

  return {
    isOpen: chat.isOpen,
    activeUser: chat.activeUser,
    activeMessages,
    connectionStatus: chat.connectionStatus,
    isTyping: chat.isTyping,
    openChat,
    closeChat,
    sendMessage,
  };
};
