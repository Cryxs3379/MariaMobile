import { api } from "./api";

export async function getEvents() {
  const response = await api.get("/api/events");
  return response.data.events || [];
}

export async function createEvent(data) {
  const response = await api.post("/api/events", data);
  return response.data.event;
}

export async function getEventById(id) {
  const response = await api.get(`/api/events/${id}`);
  return response.data.event;
}

export async function updateEvent(id, data) {
  const response = await api.put(`/api/events/${id}`, data);
  return response.data.event;
}

export async function deleteEvent(id) {
  const response = await api.delete(`/api/events/${id}`);
  return response.data;
}
