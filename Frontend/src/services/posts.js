// Post-related endpoints
import { api } from "./api";

export const PostsAPI = {
  // Feed
  feed: () => api.get("/posts/feed"),

  // All Posts
  list: () => api.get("/posts/"),

  // Create Post (Image Upload)
  create: (formData) =>
    api.post("/posts/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  // Single Post
  get: (id) => api.get(`/posts/${id}`),

  // Update Post
  update: (id, data) => api.put(`/posts/${id}`, data),

  // Delete Post
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
