import axiosInstance from '../../../app/config/axiosInstance';

export const fetchChatHistory = async (roomId) => {
  try {
    const { data } = await axiosInstance.get(`/v1/chat/messages/${roomId}`);
    return data?.data?.messages ?? data?.messages ?? [];
  } catch {
    return null;
  }
};

export const fetchConversations = async () => {
  try {
    const { data } = await axiosInstance.get('/v1/chat/conversations');
    return data?.data ?? data ?? [];
  } catch {
    return null;
  }
};
