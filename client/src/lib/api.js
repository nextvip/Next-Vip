import axios from "axios";
import store from "../store/store";
import { clearUser } from "../store/auth/authSlice";

const api = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers["access-token"] = token;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 400) {
      const message = error.response?.data?.message || "";
      if (message.toLowerCase().includes("login")) {
        store.dispatch(clearUser());
      }
    }
    return Promise.reject(error);
  }
);

export default api;
