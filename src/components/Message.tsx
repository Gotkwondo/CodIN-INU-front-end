// 메시지 컴포넌트
'use client';
import React from 'react';
import '../app/(without-bottom-nav)/chatRoom/[chatRoomId]/chatRoom.css';

interface MessageProps {
    id: string;
    content: string;
    createdAt: string;
    contentType: string;
    myId: string;
}

const Message: React.FC<MessageProps> = ({ id, content, createdAt, contentType, myId }) => {
    const messageClass = id !== myId ? 'message-left' : 'message-right';
    return (
        <div className={messageClass}>
            {id === myId ? (
                <div className="modi" />
            ) : (
                <div id="profile"></div>
            )}
            <div id={id} className={`message_${messageClass}`}>
                <div className="message-text">
                    {contentType === 'IMAGE' ? (
                        <img src={content} alt="첨부된 이미지" className="message-image" />
                    ) : (
                        content
                    )}
                </div>
            </div>
            <div id="time">{createdAt}</div>
        </div>
    );
};

export default Message;
