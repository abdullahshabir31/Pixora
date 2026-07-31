// Story endpoints — placeholders to be wired up against the FastAPI backend.
import { api } from "./api";

export const StoriesAPI = {
  feed: () => api.get("/stories/feed"),
  get: (id) => api.get(`/stories/${id}`),
  create: (data) => api.post("/stories", data),
  remove: (id) => api.delete(`/stories/${id}`),
};

export default StoriesAPI;
