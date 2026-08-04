// Reels endpoints
import { api } from "./api";

export const ReelsAPI = {
  // All reels, latest first
  feed: () => api.get("/reels/"),

  // Reels by a specific user
  byUser: (userId) => api.get(`/reels/user/${userId}`),

  // Upload a new reel (video)
  create: (formData) =>
    api.post("/reels/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  remove: (id) => api.delete(`/reels/${id}`),
};

export default ReelsAPI;
