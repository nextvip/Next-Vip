import api from "../lib/api";

export const getPlans = () => api.get("/api/subscriptions/plans");

export const getMySubscription = () => api.get("/api/subscriptions/me");
