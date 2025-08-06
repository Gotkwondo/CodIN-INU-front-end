export interface SnackEvent { // 이벤트 리스트
  eventId: number;
  eventDate: string;
  eventImageUrl: string;
  eventTitle: string;
  locationInfo: string;
  quantity: number;
  currentQuantity: number;
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
}

export interface FetchSnackResponse {
  success: boolean;
  code: number;
  message: string;
  data: {
    eventList: SnackEvent[];
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
