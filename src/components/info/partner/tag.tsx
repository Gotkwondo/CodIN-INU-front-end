import type { Tag } from '@/app/(auth-required)/main/info/department-info/schema';

interface ITag {
  tag: string | Tag;
  other?: boolean;
}

export default function Tags(
  { tag, other }: ITag = {
    tag: 'undefined',
    other: false,
  }
) {
  return (
    <div
      className={`${
        !other ? 'bg-main text-white' : 'bg-sub text-normal '
      } min-w-fit px-[9px] pt-[2px] pb-[3px] rounded-[5px] text-[12px] leading-[1.45]`}
    >
      {!other && '#'} {tag}
    </div>
  );
}
