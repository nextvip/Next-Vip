import api from "../lib/api";

export const getPublications = () => api.get("/api/publications");

export const createPublication = (data) => api.post("/api/publications", data);
