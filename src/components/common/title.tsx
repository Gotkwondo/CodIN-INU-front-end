export default function Title({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="text-[16px] font-bold ">
      <span className="relative before:absolute before:w-[6px] before:h-[6px] before:rounded-full before:bg-[#0D99FF] before:-right-2">
        {children}
      </span>
    </h1>
  );
}
