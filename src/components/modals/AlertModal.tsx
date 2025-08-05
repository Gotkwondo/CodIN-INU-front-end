import { Dispatch, SetStateAction } from 'react';

type AlertModalType = {
  modalStateSetter: (text: string) => void;
  onClose: Dispatch<SetStateAction<boolean>>;
};

const AlertModal = ({ modalStateSetter, onClose }: AlertModalType) => {
  const onConfirm = (
    modalStateSetter: Dispatch<SetStateAction<string>>,
    onClose: Dispatch<SetStateAction<boolean>>
  ) => {
    modalStateSetter(
      '강의와 교재는? : \n과제는? : \n시험은? : \n조별 과제는? : \n\n\n나만의 꿀팁 : '
    );
    onClose(false);
  };

  return (
    <div
      className="fixed inset-0 w-screen h-screen bg-gray-500/50 flex justify-center items-center z-30"
      onClick={() => onClose(false)}
    >
      <div className="w-full mt-10 text-lg whitespace-pre-wrap">
        {'작성 중이던 리뷰는 모두 지워져요.\n템플릿을 적용할까요?'}
      </div>
      <div className="mt-9 flex flex-col">
        <button
          className="bg-[#0D99FF] rounded-lg h-10 text-white hover:bg-[#51b4fa]"
          onClick={() => onConfirm(modalStateSetter, onClose)}
        >
          확인
        </button>
        <button
          className="rounded-lg h-10"
          onClick={() => onClose(false)}
        >
          취소
        </button>
      </div>
    </div>
  );
};

export { AlertModal };
