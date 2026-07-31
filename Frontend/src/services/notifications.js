// Notifications & explore endpoints — placeholders to be wired up against the FastAPI backend.
import { api } from "./api";

export const NotificationsAPI = {
  list: () => api.get("/notifications"),
  markRead: (id) => api.patch(`/notifications/${id}/read`),
};

export const ExploreAPI = {
  list: () => api.get("/explore"),
};

export default NotificationsAPI;
