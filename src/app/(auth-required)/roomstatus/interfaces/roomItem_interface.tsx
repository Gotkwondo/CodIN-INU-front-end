import { Lecture } from "./page_interface";

export interface roomItemProps {
    RoomName: string;
    LectureList: Lecture[];
    RoomStatusList: number[];
    BoundaryList: number[];
}