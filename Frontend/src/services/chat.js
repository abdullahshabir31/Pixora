// Direct message endpoints — wired up against the FastAPI backend.
import { api } from "./api";

export const ChatAPI = {
  conversations: () => api.get("/chat/conversations"),
  messages: (userId) => api.get(`/chat/${userId}`),
  send: (data) => api.post("/chat/send", data),
  sendFile: (receiverId, file) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post(`/chat/send-file?receiver_id=${receiverId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  unreadCount: () => api.get("/chat/unread/count"),
  unsend: (messageId) => api.delete(`/chat/message/${messageId}`),
};

export default ChatAPI;
