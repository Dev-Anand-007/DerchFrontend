import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const apiAdmin = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

apiAdmin.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken"); // Admin token
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default apiAdmin;