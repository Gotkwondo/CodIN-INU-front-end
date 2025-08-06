export interface SnackEvent { // 이벤트 상세
  eventId: number;
  eventTime: string;
  eventEndTime: string;
  eventImageUrls: string;
  eventTitle: string;
  locationInfo: string;
  quantity: number;
  currentQuantity: number;
  target: string;
  description: string;
}

export interface SnackDetailClientProps {
  event: SnackEvent;
}


export interface TicketEvent { // 이벤트 리스트
    id: number; 
    campus: string;
    eventTime: string;
    eventEndTime: string;
    eventImageUrl: string;
    title: string;
    locationInfo: string;
    stock: number;
    target: string;
    inquiryNumber: string;
    promotionLink?: string;
    status: string;
}
