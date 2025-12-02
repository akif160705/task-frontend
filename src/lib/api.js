import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
});

// add token automatically in every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;