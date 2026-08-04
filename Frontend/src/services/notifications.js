// Notifications & explore endpoints — wired up against the FastAPI backend.
import { api } from "./api";

export const NotificationsAPI = {
  list: () => api.get("/notifications/"),
  unreadCount: () => api.get("/notifications/unread/count"),
  markRead: (id) => api.put(`/notifications/read/${id}`),
  markAllRead: () => api.put("/notifications/read-all"),
};

export const ExploreAPI = {
  list: (params) => api.get("/explore/", { params }),
  searchUsers: (q) => api.get("/explore/users", { params: { q } }),
  searchPosts: (q) => api.get("/explore/posts", { params: { q } }),
};

export default NotificationsAPI;
