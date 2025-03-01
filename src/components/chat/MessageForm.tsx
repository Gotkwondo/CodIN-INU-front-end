// components/ChatRoom/MessageForm.tsx
'use client';
import { FormEvent, useState, useRef } from 'react';

interface Message {
    content: string;
    senderId: string;
    id: string;
    createdAt: string;
    contentType: string;
    me: boolean;
    unread: number;
}

interface MessageFormProps {
    onMessageSubmit: (message: Message) => void;
    myId: string;
    imageFile: File | null;
    setImageFile: React.Dispatch<React.SetStateAction<File | null>>;
}

const MessageForm = ({ onMessageSubmit, myId, imageFile, setImageFile }: MessageFormProps) => {
    const [messageContent, setMessageContent] = useState<string>('');
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        const getCurrentTime = (date:Date) => {
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 월은 0부터 시작하므로 1을 더해야 함
            const day = date.getDate().toString().padStart(2, '0');
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const seconds = date.getSeconds().toString().padStart(2, '0');
        
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        };
        const currentTime = new Date();

        const formattedTime = getCurrentTime(currentTime)


        const message: Message = {
            content: messageContent,
            me: true,
            senderId: myId,
            id: '',
            createdAt: formattedTime,
            contentType: 'TEXT',
            unread: 1
        };

        if (imageFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const imageBase64 = reader.result as string;
                const imageMessage: Message = {
                    ...message,
                    content: imageBase64,
                    contentType: 'IMAGE',
                };
                onMessageSubmit(imageMessage); // 이미지 메시지 전송
                setImageFile(null); // 이미지 파일 상태 초기화
                setImagePreview(null);
            };
            reader.readAsDataURL(imageFile);
        } else {
            onMessageSubmit(message); // 일반 텍스트 메시지 전송
        }
        setMessageContent('');
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
          const file = e.target.files[0]; 
          setImageFile(file); // 선택한 파일 상태 업데이트

          // Base64 변환하여 미리보기 설정
          const reader = new FileReader();
          reader.onloadend = () => {
              setImagePreview(reader.result as string);
          };
          reader.readAsDataURL(file);
        }    
      };


    return (
        <div id='imagePrevCont'>
        {imagePreview && (   
<div className="image-preview">
    <button id='imgPrevDelete' onClick={() => {setImagePreview(null); setImageFile(null)}}>x</button> {/* 미리보기 제거 버튼 */}
 <img id='imagePrev' src={imagePreview} alt="미리보기 이미지" />
 </div>
)}
<div id='inputCont'>

     <input
type="file"
accept="image/*"
onChange={handleImageUpload}
style={{ display: 'none' }}
ref={inputRef}
/>
<button
id="imageSubmit"
onClick={() => inputRef.current?.click()} // 이미지 파일 선택
></button>
<form onSubmit={handleSubmit} id='messagesendForm' autoComplete='off'>
    <input
        id='messageInput'
        type="text"
        value={messageContent}
        onChange={(e) => setMessageContent(e.target.value)}
        placeholder="메시지를 입력하세요"
        autoFocus
       
    />
    <button type="submit" id='sendBtn'></button>
</form>
</div>
</div>
);

};

export default MessageForm;
