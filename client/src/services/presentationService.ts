import { api } from "@/lib/axios";

export const presentationService = {
  list: () => api.get("/presentations"),

  generate: (prompt: string, workspaceId: string) =>
    api.post("/presentations/generate", { prompt, workspaceId }),

  delete: (id: string) => api.delete(`/presentations/${id}`),

  share: (id: string) => api.post(`/presentations/${id}/share`),
};
