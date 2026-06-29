import api from "../lib/api";

export const getTemplateDefaults = () => api.get("/api/automation/templates/defaults");

export const getTemplates = () => api.get("/api/automation/templates");

export const createTemplate = (data) => api.post("/api/automation/templates", data);

export const updateTemplate = (id, data) => api.put(`/api/automation/templates/${id}`, data);

export const deleteTemplate = (id) => api.delete(`/api/automation/templates/${id}`);

export const previewTemplate = (data) => api.post("/api/automation/templates/preview", data);

export const getRules = () => api.get("/api/automation/rules");

export const createRule = (data) => api.post("/api/automation/rules", data);

export const updateRule = (id, data) => api.put(`/api/automation/rules/${id}`, data);

export const deleteRule = (id) => api.delete(`/api/automation/rules/${id}`);

export const getExecutions = (params) => api.get("/api/automation/executions", { params });

export const testCommentTrigger = (data) => api.post("/api/automation/test-comment", data);
