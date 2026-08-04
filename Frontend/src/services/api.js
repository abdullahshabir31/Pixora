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

// If the token is missing/expired/invalid, the backend replies 401 —
// clear it and bounce to /login instead of leaving the app in a broken state.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("pixora-token");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
