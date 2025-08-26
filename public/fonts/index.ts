import localFont from 'next/font/local';

export const notoSansKR = localFont({
  variable: '--font-noto-sans-kr',
  display: 'swap',
  preload: true,
  src: [
    {
      path: './NotoSansKR-Thin.ttf',
      weight: '100',
      style: 'normal',
    },
    {
      path: './NotoSansKR-ExtraLight.ttf',
      weight: '200',
      style: 'normal',
    },
    {
      path: './NotoSansKR-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: './NotoSansKR-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './NotoSansKR-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: './NotoSansKR-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: './NotoSansKR-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: './NotoSansKR-ExtraBold.ttf',
      weight: '800',
      style: 'normal',
    },
    {
      path: './NotoSansKR-Black.ttf',
      weight: '900',
      style: 'normal',
    },
  ],
});
