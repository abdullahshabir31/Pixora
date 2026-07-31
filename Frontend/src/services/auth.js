import { api } from "./api";

export const AuthAPI = {
  login: (data) => {
    const formData = new URLSearchParams();

    formData.append("username", data.email);
    formData.append("password", data.password);

    return api.post("/login/", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
  },

  register: (data) =>
    api.post("/users/", {
      username: data.username,
      email: data.email,
      password: data.password,
      full_name: data.fullName,
    }),

  me: () => api.get("/users/me"),

  changePassword: (data) => api.put("/users/change-password", data),
};

export default AuthAPI;
