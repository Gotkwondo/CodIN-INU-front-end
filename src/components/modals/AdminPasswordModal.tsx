'use client';
import { FC, useState } from 'react';

interface AdminPasswordModalProps {
  onClose: () => void;
  onSubmit: () => void; // 인증 성공 시 동작
}

const AdminPasswordModal: FC<AdminPasswordModalProps> = ({ onClose, onSubmit }) => {
  const [password, setPassword] = useState('');
  const [attempts, setAttempts] = useState(0);
  const maxAttempts = 3;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    if (/^\d{0,4}$/.test(input)) {
      setPassword(input);
    }
  };

  const handleConfirm = () => {
    const ADMIN_PASSWORD = '1234'; // 테스트용 비밀번호
    if (password === ADMIN_PASSWORD) {
      onSubmit();
      onClose();
    } else {
      setAttempts((prev) => prev + 1);
      if (attempts + 1 >= maxAttempts) {
        alert('최대 시도 횟수를 초과했습니다.');
        onClose();
      } else {
        alert('비밀번호가 틀렸습니다.');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 backdrop-blur-sm z-50 flex justify-center items-center">
      <div className="bg-white w-[270px] rounded-xl shadow-lg p-6 relative text-center">
        {/* 닫기 버튼 */}
        <button className="absolute top-3 right-3 text-gray-400" onClick={onClose}>
          ✕
        </button>

        <p className="text-[13px] font-medium mb-4">관리자 비밀번호를 입력하세요. ({attempts}/{maxAttempts})</p>

        {/* 점 표시 */}
        <div className="flex justify-center gap-2 mb-5">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${i < password.length ? 'bg-blue-500' : 'bg-gray-300'}`}
            />
          ))}
        </div>

        <input
          type="password"
          inputMode="numeric"
          maxLength={4}
          value={password}
          onChange={handleChange}
          className="invisible h-0 w-0 absolute"
          autoFocus
        />

        {/* 확인 버튼 */}
        <button
          className="w-full h-10 mt-2 bg-[#E8EDF3] text-[#8B8B8B] font-bold text-[14px] rounded"
          onClick={handleConfirm}
        >
          확인
        </button>
      </div>
    </div>
  );
};

export default AdminPasswordModal;
