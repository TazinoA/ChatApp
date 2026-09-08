import { api } from "./auth_handler";

export async function updateProfilePic(data){
    await api.post("/api/update-profile", {
        ...data
    })
}

export async function getMessages(receiverId, before) {
    return await api.get(`/api/get-messages/${receiverId}`, {
        params: before ? { before } : undefined,
    })
    .then(response => response.data)
}

export async function getContacts() {
    return await api.get("/api/get-contacts")
    .then(response => response.data.contacts)
    .catch(error => error)
}
