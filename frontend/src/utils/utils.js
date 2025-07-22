import { api } from "./auth_handler";

export async function updateProfilePic(data){
    await api.post("/api/update-profile", {
        ...data
    })
}