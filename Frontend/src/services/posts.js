// Post-related endpoints — placeholders to be wired up against the FastAPI backend.
import { api } from "./api";

export const PostsAPI = {
  feed: () => api.get("/posts/feed"),
  list: () => api.get("/posts/"),
  create: (data) => api.post("/posts/", data),
  get: (id) => api.get(`/posts/${id}`),
  update: (id, data) => api.put(`/posts/${id}`, data),
  remove: (id) => api.delete(`/posts/${id}`),
};

export const LikesAPI = {
  like: (postId) => api.post(`/posts/${postId}/like`),
  unlike: (postId) => api.delete(`/posts/${postId}/like`),
};

export const CommentsAPI = {
  list: (postId) => api.get(`/posts/${postId}/comments`),
  create: (postId, data) => api.post(`/posts/${postId}/comments`, data),
  remove: (postId, commentId) => api.delete(`/posts/comments/${commentId}`),
};

export const SavedPostsAPI = {
  list: () => api.get("/users/me/saved-posts"),
  save: (postId) => api.post(`/users/me/saved-posts/${postId}`),
  unsave: (postId) => api.delete(`/users/me/saved-posts/${postId}`),
};

export default PostsAPI;
