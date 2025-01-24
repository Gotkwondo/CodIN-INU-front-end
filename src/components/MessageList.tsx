'use client';

import React from 'react';
import Message from './Message';
import '../app/(without-bottom-nav)/chatRoom/[chatRoomId]/chatRoom.css';

interface MessageListProps {
    messages: any[];
    myId: string;
}

const MessageList: React.FC<MessageListProps> = ({ messages, myId }) => {
    const renderMessagesWithDateSeparators = () => {
        const result: JSX.Element[] = [];
        let lastDate: string | null = null;

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
                    createdAt={message.createdAt}
                    contentType={message.contentType}
                    myId={myId}
                />
            );
        });

        return result;
    };

    return (
        <div className="messages">
            {renderMessagesWithDateSeparators()}
        </div>
    );
};

export default MessageList;
