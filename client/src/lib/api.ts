import axios from "axios";

const apiClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  config.headers = config.headers ?? {};

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

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

export const authAPI = {
  register: (email: string, password: string) =>
    apiClient.post("/auth/register", { email, password }),

  login: (email: string, password: string) =>
    apiClient.post("/auth/login", { email, password }),

  me: () => apiClient.get("/auth/me"),
};

export const usageAPI = {
  status: () => apiClient.get("/usage"),
};

export const presentationAPI = {
  generate: (prompt: string, workspaceId?: string) =>
    apiClient.post("/presentations/generate", { prompt, workspaceId }),

  list: () => apiClient.get("/presentations"),

  get: (id: string) => apiClient.get(`/presentations/${id}`),

  update: (id: string, data: any) => apiClient.put(`/presentations/${id}`, data),

  delete: (id: string) => apiClient.delete(`/presentations/${id}`),

  share: (id: string) => apiClient.post(`/presentations/${id}/share`),
};

export default apiClient;
