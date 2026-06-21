import api from "../lib/api";

export const registerUser = (data) => api.post("/api/auth/register", data);

export const activateUser = (data) => api.post("/api/auth/activate-user", data);

export const loginUser = (data) => api.post("/api/auth/login", data);

export const logoutUser = () => api.get("/api/auth/logout");

export const getMe = () => api.get("/api/auth/me");

export const updateProfile = (data) => api.put("/api/auth/update-user-info", data);

export const updatePassword = (data) => api.put("/api/auth/update-user-password", data);

export const forgotPassword = (data) => api.post("/api/auth/password/reset", data);

export const resetPassword = (token, data) =>
  api.post(`/api/auth/password/reset/${token}`, data);

export const resendVerification = (data) =>
  api.post("/api/auth/request/token/new", data);
