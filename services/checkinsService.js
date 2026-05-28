import { api } from "./api";

export async function getCheckins(params) {
  const response = await api.get("/api/checkins", { params });
  return response.data.checkins || [];
}

export async function getTodayCheckin() {
  const response = await api.get("/api/checkins/today");
  return response.data;
}

export async function getCheckinByDate(date) {
  const response = await api.get(`/api/checkins/${date}`);
  return response.data.checkin;
}

export async function createCheckin(data) {
  const response = await api.post("/api/checkins", data);
  return response.data.checkin;
}

export async function updateCheckin(id, data) {
  const response = await api.put(`/api/checkins/${id}`, data);
  return response.data.checkin;
}

export async function deleteCheckin(id) {
  const response = await api.delete(`/api/checkins/${id}`);
  return response.data;
}
