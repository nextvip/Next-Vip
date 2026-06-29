import api from "../lib/api";

export const generateAiContent = (data) => api.post("/api/ai/generate", data);

export const getAiGenerations = (params) =>
  api.get("/api/ai/generations", { params });

export const getAiUsage = () => api.get("/api/ai/usage");

export const getVideoPlatformContents = (videoId) =>
  api.get(`/api/ai/videos/${videoId}/platform-content`);

export const saveVideoPlatformContent = (videoId, platform, data) =>
  api.put(`/api/ai/videos/${videoId}/platform-content/${platform}`, data);
