// src/api/notification/getNotificationList.ts
import apiClient from "../clients/apiClient";

export interface Notification {
    id: string;
    title: string;
    message: string;
    createdAt: string;
    isRead: boolean;
    // 필요에 따라 필드 추가
}

export interface GetNotificationListResponse {
    success: boolean;
    code: number;
    message: string;
    dataList: Notification[];
}

export const GetNotificationList = async (): Promise<GetNotificationListResponse> => {
    const { data } = await apiClient.get<GetNotificationListResponse>("/notification");
    return data;
};
