import axiosInstance from '../../../app/config/axiosInstance';

export const fetchChatHistory = async (receiverId) => {
  try {
    const { data } = await axiosInstance.get(`/v1/chat/${receiverId}`);
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
