import api from "../lib/api";

export const getVideos = () => api.get("/api/videos");

export const getVideo = (id) => api.get(`/api/videos/${id}`);

export const uploadVideo = (formData) =>
  api.post("/api/videos/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const createVideoLink = (data) => api.post("/api/videos/link", data);

export const updateVideo = (id, data) => api.put(`/api/videos/${id}`, data);

export const deleteVideo = (id) => api.delete(`/api/videos/${id}`);
