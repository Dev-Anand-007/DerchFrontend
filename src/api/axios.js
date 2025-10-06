import axios from 'axios';

const BASE_URL=import.meta.env.VITE_API_BASE_URL;

const api=axios.create({
    baseURL: BASE_URL,
    headers:{
        'Content-Type':'application/json',
    }
});

// ✅ Example Interceptor for adding token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // or Redux store
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Example Interceptor for handling errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized globally (optional: redirect to login)
      console.error("Unauthorized, redirecting...");
    }
    return Promise.reject(error);
  }
);

export default api;