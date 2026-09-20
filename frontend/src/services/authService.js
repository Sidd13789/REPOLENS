import api from "./api";

export const signup = (payload) =>
  api.post("/auth/signup", payload).then((r) => r.data.data);

export const login = (payload) =>
  api.post("/auth/login", payload).then((r) => r.data.data);

export const logout = () => api.post("/auth/logout");

export const getMe = () => api.get("/auth/me").then((r) => r.data.data);

export const forgotPassword = (email) =>
  api.post("/auth/forgot-password", { email }).then((r) => r.data);

export const resetPassword = (payload) =>
  api.post("/auth/reset-password", payload).then((r) => r.data);
