export interface CurrentTimePointerProps {
    minHour:number, maxHour:number, 
    refOfParent: React.RefObject<HTMLDivElement>, 
    setShowNav: React.Dispatch<React.SetStateAction<string | null>>
}