// Post-related endpoints — placeholders to be wired up against the FastAPI backend.
import { api } from "./api";

export const PostsAPI = {
  feed: () => api.get("/posts/feed"),
  list: () => api.get("/posts"),
  create: (data) => api.post("/posts", data),
  get: (id) => api.get(`/posts/${id}`),
  update: (id, data) => api.patch(`/posts/${id}`, data),
  remove: (id) => api.delete(`/posts/${id}`),
};

export const LikesAPI = {
  like: (postId) => api.post(`/posts/${postId}/likes`),
  unlike: (postId) => api.delete(`/posts/${postId}/likes`),
};

export const CommentsAPI = {
  list: (postId) => api.get(`/posts/${postId}/comments`),
  create: (postId, data) => api.post(`/posts/${postId}/comments`, data),
  remove: (postId, commentId) => api.delete(`/posts/${postId}/comments/${commentId}`),
};

export const SavedPostsAPI = {
  list: () => api.get("/posts/saved"),
  save: (postId) => api.post(`/posts/${postId}/save`),
  unsave: (postId) => api.delete(`/posts/${postId}/save`),
};

export default PostsAPI;
