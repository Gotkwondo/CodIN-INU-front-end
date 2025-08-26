export interface CurrentTimePointerProps {
  minHour: number;
  maxHour: number;
  width: number;
  height: number;
  refOfParent: React.RefObject<HTMLDivElement>;
  setShowNav: React.Dispatch<React.SetStateAction<string | null>>;
}
