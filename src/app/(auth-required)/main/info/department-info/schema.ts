export const schema: IPartner[] = [
  {
    name: '홍콩반점 송도점',
    tags: ['COMPUTER_SCI', 'EMBEDDED'],
    benefits: ['탕수육 주문 시, 탕수육 공짜 !', '평일 언제나 80% 대박 할인!'],
    start_date: new Date('2023-10-01'),
    end_date: new Date('2024-01-01'),
    location: '인천 연수구 송도동 3-2',
    img: {
      main: 'https://example.com/image1.jpg',
      sub: [
        'https://example.com/image2.jpg',
        'https://example.com/image3.jpg',
        'https://example.com/image4.jpg',
        'https://example.com/image5.jpg',
        'https://example.com/image6.jpg',
      ],
    },
  },
  {
    name: '홍콩반점 송도점',
    tags: ['INFO_COMM'],
    benefits: ['탕수육 주문 시, 탕수육 공짜 !', '평일 언제나 80% 대박 할인!'],
    start_date: new Date('2023-10-01'),
    end_date: new Date('2024-01-01'),
    location: '인천 연수구 송도동 3-2',
    img: {
      main: 'https://example.com/image1.jpg',
      sub: ['https://example.com/image2.jpg', 'https://example.com/image3.jpg'],
    },
  },
  {
    name: '홍콩반점 송도점',
    tags: ['COMPUTER_SCI', 'EMBEDDED', 'INFO_COMM'],
    benefits: ['탕수육 주문 시, 탕수육 공짜 !', '평일 언제나 80% 대박 할인!'],
    start_date: new Date('2023-10-01'),
    end_date: new Date('2024-01-01'),
    location: '인천 연수구 송도동 3-2',
    img: {
      main: 'https://example.com/image1.jpg',
      sub: ['https://example.com/image2.jpg', 'https://example.com/image3.jpg'],
    },
  },
];

export type Tag = 'COMPUTER_SCI' | 'EMBEDDED' | 'INFO_COMM';
export const tagsArray: Tag[] = ['COMPUTER_SCI', 'EMBEDDED', 'INFO_COMM'];
export interface IPartner {
  name: string;
  tags: Tag[];
  benefits: string[];
  start_date: Date;
  end_date: Date;
  location: string;
  img: {
    main: string;
    sub: string[];
  };
}
