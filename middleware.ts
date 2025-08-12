import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('accessToken')?.value;

  // 토큰이 없고, 현재 경로가 /login이 아니라면 리다이렉션
  if (!token && req.nextUrl.pathname !== '/login') {
    console.log('토큰없음');
    const loginUrl = new URL('/login', req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
