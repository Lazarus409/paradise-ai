import axios from "axios";

/* 
   BASE API CLIENT
 */

export const api = axios.create({
  baseURL: "/api",
});
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/* 
   REQUEST INTERCEPTOR
   (Attach JWT)
 */

apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* 
   RESPONSE INTERCEPTOR
 */

apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

/* 
   AUTH API
 */

export const authAPI = {
  register: (email: string, password: string) =>
    apiClient.post("/api/auth/register", {
      email,
      password,
    }),

  login: (email: string, password: string) =>
    apiClient.post("/api/auth/login", {
      email,
      password,
    }),
};

/* 
   BILLING API
 */

export const billingAPI = {
  checkout: () => apiClient.post("/api/billing/checkout"),
  usage: () => apiClient.get("/api/usage"),
};

/* 
   PRESENTATIONS API
 */

export const presentationAPI = {
  generate: (prompt: string) =>
    apiClient.post("/api/presentations/generate", { prompt }),

  list: () => apiClient.get("/api/presentations"),

  get: (id: string) => apiClient.get(`/api/presentations/${id}`),

  update: (id: string, data: any) =>
    apiClient.put(`/api/presentations/${id}`, data),

  delete: (id: string) => apiClient.delete(`/api/presentations/${id}`),
};

export default apiClient;
