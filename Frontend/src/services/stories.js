import { api } from "./api";

export const StoriesAPI = {
  // Get all active (non-expired) stories
  feed: () => api.get("/stories/"),

  // Get a specific user's active stories
  byUser: (userId) => api.get(`/stories/user/${userId}`),

  // Upload a new story (image)
  create: (formData) =>
    api.post("/stories/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  // Delete a story
  remove: (id) => api.delete(`/stories/${id}`),
};

export default StoriesAPI;
