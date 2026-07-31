// Base Axios instance. Points at your FastAPI backend via VITE_API_URL.
// All other service files (auth.js, posts.js, users.js, ...) reuse this instance.
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: false,
});

// Attach bearer token if present.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("pixora-token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
