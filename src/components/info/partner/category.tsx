interface ICategory {
  category: string;
  others: boolean;
}

export default function Category(
  { category, others }: ICategory = {
    category: 'undefined',
    others: false,
  },
) {
  return (
    <div
      className={`${
        others ? 'bg-main text-white' : 'bg-sub text-sub'
      } min-w-fit px-[9px] pt-[2px] pb-[3px] rounded-[5px] text-[12px] leading-[1.45]`}
    >
      {others && '#'}
      {category}
    </div>
  );
}
