// src/api/notification/getNotificationDetail.ts
import apiClient from "../clients/apiClient";

export interface NotificationDetail {
    id: string;
    title: string;
    message: string;
    createdAt: string;
    isRead: boolean;
    // 필요에 따라 필드 추가
}

export interface GetNotificationDetailResponse {
    success: boolean;
    code: number;
    message: string;
    data: NotificationDetail;
}

export const GetNotificationDetail = async (notificationId: string): Promise<GetNotificationDetailResponse> => {
    const { data } = await apiClient.get<GetNotificationDetailResponse>(`/notification/${notificationId}`);
    return data;
};
