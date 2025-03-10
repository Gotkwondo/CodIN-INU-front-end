import React, { createContext, useContext, useState } from "react";
import { Client } from '@stomp/stompjs'; // Stomp 네임스페이스 대신 Client 클래스를 import

interface WebSocketContextType {
  stompClient: Client | null;
  connectStompClient: () => void;
  subscribeToChatRoom: (chatRoomId: string, onMessageReceived: (message: any) => void) => void;
  unsubscribeFromChatRoom: (chatRoomId: string) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stompClient, setStompClient] = useState<Client | null>(null); // Client 타입으로 설정
  const [subscriptions, setSubscriptions] = useState<{ [key: string]: any }>({}); // Stomp.Subscription 대신 구독 정보를 일반 객체로 관리

  // WebSocket 연결 함수
  const connectStompClient = () => {
    const client = new Client({
      brokerURL: 'https://your-socket-url', // WebSocket 서버 URL
      onConnect: (frame) => {
        console.log("✅ WebSocket Connected:", frame);
        setStompClient(client);
      },
      onDisconnect: (frame) => {
        console.log("❌ WebSocket Disconnected:", frame);
      },
      debug: (str) => console.log(str), // 디버깅 정보 출력
    });

    client.activate(); // WebSocket 연결 활성화
  };

  // 채팅방 구독 함수
  const subscribeToChatRoom = (chatRoomId: string, onMessageReceived: (message: any) => void) => {
    if (!stompClient) {
      console.warn("WebSocket 클라이언트가 연결되지 않았습니다.");
      return;
    }

    console.log(`📩 Subscribing to chat room: ${chatRoomId}`);
    const subscription = stompClient.subscribe(`/queue/${chatRoomId}`, (message) => {
      const receivedMessage = JSON.parse(message.body);
      console.log("📥 Received message:", receivedMessage);
      onMessageReceived(receivedMessage); // 메시지를 콜백 함수로 전달
    });

    setSubscriptions((prev) => ({ ...prev, [chatRoomId]: subscription }));
  };

  // 채팅방 구독 해제 함수
  const unsubscribeFromChatRoom = (chatRoomId: string) => {
    if (subscriptions[chatRoomId]) {
      console.log(`❌ Unsubscribing from chat room: ${chatRoomId}`);
      subscriptions[chatRoomId].unsubscribe();
      setSubscriptions((prev) => {
        const updatedSubscriptions = { ...prev };
        delete updatedSubscriptions[chatRoomId];
        return updatedSubscriptions;
      });
    } else {
      console.warn(`해당 채팅방(${chatRoomId})은 구독되지 않았습니다.`);
    }
  };

  return (
    <WebSocketContext.Provider value={{ stompClient, connectStompClient, subscribeToChatRoom, unsubscribeFromChatRoom }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};
