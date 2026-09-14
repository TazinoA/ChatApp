import { api } from "./auth_handler";

export async function updateProfilePic(data) {
  const response = await api.post("/api/update-profile", data);
  return response.data;
}

export async function getMessages(receiverId, cursor) {
  const params = {};
  if (cursor) {
    if (cursor.beforeTimestamp) params.beforeTimestamp = cursor.beforeTimestamp;
    if (cursor.beforeId) params.beforeId = cursor.beforeId;
  }
  const response = await api.get(`/api/get-messages/${receiverId}`, { params });
  return response.data;
}

export async function getContacts(search = "") {
  const params = search ? { search } : {};
  const response = await api.get("/api/get-contacts", { params });
  return response.data.contacts || [];
}
