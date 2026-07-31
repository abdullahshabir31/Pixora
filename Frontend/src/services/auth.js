// Auth endpoints — placeholders to be wired up against the FastAPI backend.
import { api } from "./api";

export const AuthAPI = {
  login: (data) => api.post("/auth/login", data),
  register: (data) => api.post("/auth/register", data),
  logout: () => api.post("/auth/logout"),
  me: () => api.get("/auth/me"),
  changePassword: (data) => api.post("/auth/change-password", data),
};

export default AuthAPI;
