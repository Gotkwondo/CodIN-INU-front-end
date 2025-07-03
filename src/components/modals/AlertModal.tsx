"use client";
import { useEffect, useState } from "react";
import { GetNotificationList } from "@/api/notification/getNotificationList";
import { GetNotificationDetail } from "@/api/notification/getNotificationDetail";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await GetNotificationList();
        setNotifications(res.dataList);
      } catch (error) {
        console.error(error);
      }
    };

    fetchNotifications();
  }, []);

  const handleReadNotification = async (id: string) => {
    try {
      const res = await GetNotificationDetail(id);
      setSelectedNotification(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
      <div className="p-4">
        <h1 className="text-lg font-semibold mb-4">알림 목록</h1>
        <ul>
          {notifications.map((notification) => (
              <li key={notification.id} className="border p-2 mb-2 cursor-pointer" onClick={() => handleReadNotification(notification.id)}>
                <div className="font-medium">{notification.title}</div>
                <div className="text-sm text-gray-600">{notification.message}</div>
              </li>
          ))}
        </ul>

        {selectedNotification && (
            <div className="mt-4 p-4 border rounded">
              <h2 className="text-md font-semibold">알림 상세</h2>
              <p>{selectedNotification.title}</p>
              <p>{selectedNotification.message}</p>
            </div>
        )}
      </div>
  );
};

export default NotificationPage;
