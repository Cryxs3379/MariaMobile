import { api } from "./api";

export async function getSymptoms() {
  const response = await api.get("/api/symptoms");
  return response.data.symptoms || [];
}

export async function createSymptom(data) {
  const response = await api.post("/api/symptoms", data);
  return response.data.symptom;
}

export async function getSymptomById(id) {
  const response = await api.get(`/api/symptoms/${id}`);
  return response.data.symptom;
}

export async function updateSymptom(id, data) {
  const response = await api.put(`/api/symptoms/${id}`, data);
  return response.data.symptom;
}

export async function deleteSymptom(id) {
  const response = await api.delete(`/api/symptoms/${id}`);
  return response.data;
}
