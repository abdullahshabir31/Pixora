// User-related endpoints — placeholders to be wired up against the FastAPI backend.
import { api } from "./api";

export const UsersAPI = {
  search: (q) => api.get("/users/search", { params: { q } }),
  profile: (username) => api.get(`/users/${username}`),
  getById: (id) => api.get(`/users/profile/${id}`),
  update: (formData) =>
    api.put("/users/me", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  followers: (username) => api.get(`/users/${username}/followers`),
  following: (username) => api.get(`/users/${username}/following`),
  follow: (username) => api.post(`/users/${username}/follow`),
  unfollow: (username) => api.delete(`/users/${username}/follow`),
  blockedList: () => api.get("/users/me/blocked"),
  block: (username) => api.post(`/users/${username}/block`),
  unblock: (username) => api.delete(`/users/${username}/block`),
};

export default UsersAPI;
