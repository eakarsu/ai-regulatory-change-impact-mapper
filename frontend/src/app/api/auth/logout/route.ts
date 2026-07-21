import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE } from '@/lib/auth';
import { revokeSession } from '@/lib/authServer';

export async function POST(request: NextRequest) {
  await revokeSession(request.cookies.get(AUTH_COOKIE)?.value);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(AUTH_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
  return response;
}
