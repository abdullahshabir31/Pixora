// User-related endpoints — wired up against the FastAPI backend.
import { api } from "./api";

export const UsersAPI = {
  search: (q) => api.get("/users/search", { params: { username: q } }),
  profile: (username) => api.get(`/users/${username}`),
  getById: (id) => api.get(`/users/profile/${id}`),
  update: (formData) =>
    api.put("/users/me", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  followers: (userId) => api.get(`/users/${userId}/followers`),
  following: (userId) => api.get(`/users/${userId}/following`),
  follow: (userId) => api.post(`/users/${userId}/follow`),
  unfollow: (userId) => api.delete(`/users/${userId}/follow`),
  blockedList: () => api.get("/users/me/blocked-users"),
  block: (userId) => api.post(`/users/${userId}/block`),
  unblock: (userId) => api.delete(`/users/${userId}/block`),
};

export default UsersAPI;
