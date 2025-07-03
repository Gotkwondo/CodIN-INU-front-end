// src/api/fcm/postSubscribe.ts
import apiClient from "../clients/apiClient";

export const PostSubscribe = async (): Promise<void> => {
    await apiClient.post("/fcm/subscribe");
};
