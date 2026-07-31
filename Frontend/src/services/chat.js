// Direct message endpoints — placeholders to be wired up against the FastAPI backend.
import { api } from "./api";

export const ChatAPI = {
  conversations: () => api.get("/chats"),
  messages: (conversationId) => api.get(`/chats/${conversationId}/messages`),
  send: (conversationId, data) => api.post(`/chats/${conversationId}/messages`, data),
};

export default ChatAPI;
