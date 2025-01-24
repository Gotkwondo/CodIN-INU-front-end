// Message.tsx
'use client'
interface MessageProps {
    id: string;
    content: string;
    createdAt: string;
    contentType: string;
    myId: string;
  }
  
  const Message = ({ id, content, createdAt, contentType, myId }: MessageProps) => {
    const messageClass = id !== myId ? 'message-left' : 'message-right';
    
    return (
      <div className={messageClass}>
        {id !== myId ? (
          <div id="profile"></div> // 프로필을 나타내는 div, 필요에 따라 수정 가능
        ) : (
          <div className="modi" />
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
  