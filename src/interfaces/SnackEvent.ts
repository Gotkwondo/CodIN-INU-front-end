export interface SnackEvent { // 이벤트 리스트
  eventId: number;
  eventDate: string;
  eventImageUrl: string;
  eventTitle: string;
  locationInfo: string;
  quantity: number;
  currentQuantity: number;
  eventStatus: string;

}

export interface SnackDetailClientProps {
  event: SnackEvent;
}


export interface TicketEvent { // 이벤트 상세
    eventId: number; 
    currentQuantity: number;
    description: string;
    campus: string;
    eventTime: string;
    eventEndTime: string;
    eventImageUrls: string;
    eventTitle: string;
    locationInfo: string;
    quantity: string;
    target: string;
    inquiryNumber: string;
    promotionLink?: string;
    existParticipationData:boolean;
    status:string;
}

export interface FetchSnackResponse {
  success: boolean;
  code: number;
  message: string;
  data: {
    eventList: SnackEvent[] | AdminSnackEvent[];
    lastPage: number;
    nextPage: number;
  };
}

export interface FetchSnackDetailResponse {
  success: boolean;
  code: number;
  message: string;
  data: TicketEvent;
}


//관리자 페이지 인터페이스

export interface AdminSnackEvent { // 이벤트 리스트
  eventId: number;
  eventDate: string;
  eventImageUrl: string;
  eventTitle: string;
  locationInfo: string;
  quantity: number;
  currentQuantity: number;
  eventStatus: string;
}

export interface FetchUserResponse {
  success: boolean;
  code: number;
  message: string;
  data: {
    eventParticipationProfileResponseList: eventParticipationProfileResponseList[];
    lastPage: number;
    nextPage: number;
  };
}

export interface eventParticipationProfileResponseList { // 참여 유저 리스트
  userId: number;
  name: string;
  studentId: string;
  department: string;
  imageURL: string;
}