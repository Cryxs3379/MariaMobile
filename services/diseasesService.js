import { api } from "./api";

export async function getDiseases() {
  const response = await api.get("/api/diseases");
  return response.data.diseases || [];
}
