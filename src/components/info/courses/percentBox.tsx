export default function PercentBox({
  percent,
  text,
}: {
  percent: number;
  text: string;
}) {
  return (
    <div className="flex flex-col items-center gap-[4px]">
      <div className="text-[10px] font-bold p-[1.5px_7px]">{percent}%</div>
      <div className="w-[10.7603px] h-[60px] bg-[#CDCDCD] rounded-full">
        <div className="rounded-full"></div>
      </div>
      <div className="text-[10px] font-medium">{text}</div>
    </div>
  );
}
