'use client';
import { ReactNode, useEffect, useRef, useState } from 'react';
import ReportModal from '../modals/ReportModal'; // ReportModal 컴포넌트 임포트
import { PostChatRoom } from '@/api/chat/postChatRoom';
import { boardData } from '@/data/boardData';
import { PostBlockUser } from '@/api/user/postBlockUser';
import { useReportModal } from '@/hooks/useReportModal';
import { Post } from '@/interfaces/Post'; // Post 인터페이스 가져오기
import Header from '../Layout/header/Header';
import DefaultBody from '../Layout/Body/defaultBody';
import { DeletePost } from '@/api/boards/deletePost'; // deletePost 임포트
import MenuItem from '../common/Menu/MenuItem';

const PageHeaderModal = ({
  children,
  onClose,
  // ✅ `Post` 인터페이스에 정의된 필드만 포함하여 기본값 설정
  post = {
    _id: '', // postId 대신 사용됨
    title: '',
    content: '',
    postCategory: '',
    createdAt: '',
    anonymous: false,
    commentCount: 0,
    likeCount: 0,
    scrapCount: 0,
    postImageUrl: [], // 이미지 URL 배열
    userId: '',
    nickname: '', // 닉네임 (익명 여부와 상관없이)
    userImageUrl: '', // 사용자 프로필 이미지 (옵션)
    authorName: '', // 작성자 이름 (익명일 경우 빈 문자열)
    viewCount: 0, // 조회수
    hits: 0, // 조회수 (대체 가능)
    userInfo: {
      like: false, // 사용자가 좋아요를 눌렀는지 여부
      scrap: false, // 사용자가 북마크했는지 여부
      mine: false,
    },
  },
}: {
  children: ReactNode;
  onClose: () => void;
  post?: Post;
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const {
    isOpen: isReportModalOpen,
    openModal: openReportModal,
    closeModal: closeReportModal,
    getModalComponent: getReportModalComponent,
  } = useReportModal();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false); // 외부 클릭 시 메뉴 닫기
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const startChat = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await PostChatRoom(post.title, post.userId, post._id);

      console.log('채팅방 생성이 완료되었습니다');
      if (response?.data.data.chatRoomId) {
        window.location.href = `/chat`;
      } else {
        throw new Error('Chat room ID is missing in the response.');
      }
    } catch (error) {
      console.log('채팅방 생성에 실패하였습니다.', error);
    }
  };

  const blockUser = async () => {
    try {
      if (
        confirm(
          '해당 유저의 게시물이 목록에 노출되지 않으며, 다시 해제하실 수 없습니다.'
        )
      ) {
        await PostBlockUser(post.userId);
        alert('유저를 차단하였습니다');
      }
    } catch (error) {
      console.log('유저 차단에 실패하였습니다.', error);
      const message = error.response?.data?.message;
      alert(message);
    }
  };

  const deletePostAction = async () => {
    try {
      if (confirm('정말로 게시물을 삭제하시겠습니까?')) {
        await DeletePost(post._id);
        alert('게시물이 삭제되었습니다.');
        onClose(); // 게시물 삭제 후 모달 닫기
      }
    } catch (error) {
      console.log('게시물 삭제에 실패하였습니다.', error);
      const message = error.response?.data?.message;
      alert(message);
    }
  };

  const handleMenuAction = (action: string) => {
    if (action === 'chat') {
      const userConfirmed = confirm('채팅하시겠습니까?');
      if (userConfirmed) {
        startChat();
      } else {
        // 사용자가 취소를 선택한 경우에 수행할 동작
        console.log('채팅을 취소했습니다.');
      }
    } else if (action === 'report') {
      openReportModal('POST', post._id);
    } else if (action === 'block') {
      blockUser();
    } else if (action === 'delete') {
      deletePostAction();
    }
    setMenuOpen(false);
  };

  const getBoardNameByPostCategory = (category: string): string | null => {
    for (const key in boardData) {
      const board = boardData[key];
      const matchingTab = board.tabs.find(tab => tab.postCategory === category);
      if (matchingTab) {
        return board.name;
      }
    }
    return null;
  };

  return (
    <div
      id="scrollbar-hidden"
      className=" fixed inset-0 bg-white z-50 overflow-y-scroll"
    >
      <Header
        showBack
        backOnClick={onClose}
        title={getBoardNameByPostCategory(post.postCategory) || ''}
        MenuItems={() => (
          <>
            {post.userInfo.mine ? (
              <MenuItem onClick={() => handleMenuAction('delete')}>
                삭제하기
              </MenuItem>
            ) : (
              <>
                <MenuItem onClick={() => handleMenuAction('chat')}>
                  채팅하기
                </MenuItem>
                <MenuItem onClick={() => handleMenuAction('report')}>
                  신고하기
                </MenuItem>
                <MenuItem onClick={() => handleMenuAction('block')}>
                  차단하기
                </MenuItem>
              </>
            )}
          </>
        )}
      />
      <DefaultBody hasHeader={1}>
        {/* 본문 컨텐츠 */}
        <div className="pt-[18px] overflow-y-auto">{children}</div>
        {/* 신고 모달 */}
        {isReportModalOpen && (
          <ReportModal
            onClose={closeReportModal}
            reportTargetType="USER"
            reportTargetId={post.userId}
          />
        )}
      </DefaultBody>
    </div>
  );
};

export default PageHeaderModal;
