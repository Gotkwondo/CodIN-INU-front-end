export interface CurrentTimePointerProps {
    minHour:number, maxHour:number, 
    widthOfBlock: number, gapBetweenBlocks: number,
    numOfBlocks: number,
    refOfParent: React.RefObject<HTMLDivElement>, 
    setShowNav: React.Dispatch<React.SetStateAction<string | null>>
}