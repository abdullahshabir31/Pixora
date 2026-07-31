// Reels endpoints — placeholders to be wired up against the FastAPI backend.
import { api } from "./api";

export const ReelsAPI = {
  feed: () => api.get("/reels/feed"),
  get: (id) => api.get(`/reels/${id}`),
  create: (data) => api.post("/reels", data),
  remove: (id) => api.delete(`/reels/${id}`),
};

export default ReelsAPI;
