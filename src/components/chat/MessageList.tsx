// components/chat/MessageList.tsx

import React, { useEffect, useRef } from 'react';
import Message from './Message';

interface MessageListProps {
    messages: any[];
    myId: string;
}

const MessageList: React.FC<MessageListProps> = ({ messages, myId }) => {
    const messagesEndRef = useRef<HTMLDivElement | null>(null); // 맨 아래에 위치한 div 참조

    const renderMessagesWithDateSeparators = () => {
        const result: JSX.Element[] = [];
        let lastDate: string | null = null;

        const formatCustomDate = (customDate: string) => {
            try {
                const [datePart, timePart] = customDate.split(' ');
                const [hours, minutes] = timePart.split(':').map(Number);
    
                const period = hours >= 12 ? '오후' : '오전';
                const formattedHours = hours % 12 || 12; // 12시간제 변환
                return `${period} ${formattedHours}:${minutes.toString().padStart(2, '0')}`;
            } catch (error) {
                console.error('날짜 변환 오류:', error);
                return customDate; // 변환 실패 시 원래 값 반환
            }
        };

        messages.forEach((message, i) => {
            const messageDate = message.createdAt.split(' ')[0];
            if (messageDate !== lastDate) {
                result.push(
                    <div id="date" key={`date-${messageDate}-${i}`} className="date-separator">
                        {messageDate}
                    </div>
                );
                lastDate = messageDate;
            }

            result.push(
                <Message
                    key={i}
                    id={message.senderId}
                    content={message.content}
                    createdAt={formatCustomDate(message.createdAt)}
                    contentType={message.contentType}
                    myId={myId}
                />
            );
        });

        return result;
    };

    // 메시지가 업데이트될 때마다 자동으로 맨 아래로 스크롤
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]); // 메시지가 갱신될 때마다 실행

    return (
        <div className="messages">
            {renderMessagesWithDateSeparators()}
            {/* 마지막 메시지 뒤에 빈 div 추가하여 스크롤 끝으로 이동 */}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default MessageList;
