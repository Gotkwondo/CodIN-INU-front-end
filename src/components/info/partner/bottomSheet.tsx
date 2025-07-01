import { Tag } from '@/app/(auth-required)/main/info/department-info/schema';
import BackButton from '@/components/Layout/header/BackButton';
import MapLinkButton from '@/components/Layout/header/MapLinkButton';
import { Tags, OtherTag } from './tag';

interface BottomSheetProps {
  title: string;
  tags: Tag[];
  duration: [start: Date, end: Date];
  timeDescription: string;
  benefits: string[];
  img: string[];
}

export default function BottomSheet({
  title,
  tags,
  duration,
  timeDescription,
  benefits,
  img,
}: BottomSheetProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[25px] shadow-xl pb-[62px]">
      <div className="flex justify-center py-[12px] cursor-grab">
        <div className="bg-[#D0D9E4] w-[82px] h-[6px] rounded-[15px]"></div>
      </div>
      <div className="p-[18px] mb-[30px]">
        <div className="flex items-center justify-between">
          <BackButton />
          <h2 className="text-Lm font-bold">{title}</h2>
          <MapLinkButton />
        </div>
        <div className="mt-[22px] mb-[18px] ml-[6px]">
          <div className="flex gap-[3px]">
            {tags.map((tag, index) => (
              <Tags
                key={index}
                tag={tag}
              />
            ))}
            <OtherTag tags={tags} />
          </div>
        </div>
        <div className="flex flex-col gap-[15px] px-[12px] mb-[30px]">
          <div>
            <h2 className="text-Lm mb-[6px]">제휴기간</h2>
            <div className="text-Mr text-sub">
              {/* 2025.03 ~ 2026.03 (1학기 시작 전까지) */}
              {duration[0].toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: '2-digit',
              })}{' '}
              ~{' '}
              {duration[1].toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: '2-digit',
              })}
              {timeDescription}
            </div>
          </div>
          <div>
            <h2 className="text-Lm mb-[6px]">혜택</h2>
            <ul className="list-disc pl-[18px] text-Mr text-sub">
              {benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </div>
        </div>
        <div
          id="scrollbar-hidden"
          className="flex bg-sub p-[24px] gap-[11px] rounded-[15px] overflow-x-scroll"
        >
          {img.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`제휴 이미지 ${index + 1}`}
              className="w-[97px] min-w-[97px] bg-[#d0d0ff] aspect-square rounded-[15px]"
            />
          ))}
        </div>
        <div className="text-center text-sr text-sub mt-[12px]">
          업체에서 게시한 홍보 전단지입니다
        </div>
      </div>
    </div>
  );
}
