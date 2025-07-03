// src/api/fcm/postUnsubscribe.ts
import apiClient from "../clients/apiClient";

export const PostUnsubscribe = async (): Promise<void> => {
    await apiClient.post("/fcm/unsubscribe");
};
