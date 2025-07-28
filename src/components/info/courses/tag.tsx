export default function CourseTag({ tag }: { tag: string }) {
  return (
    <div className="min-w-fit px-[8px] py-[2px] bg-[#EBF0F7] text-[11px] text-[#808080] rounded-[20px]">
      {tag}
    </div>
  );
}
