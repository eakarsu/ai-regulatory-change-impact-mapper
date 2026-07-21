import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE } from '@/lib/auth';
import { authenticateUser, createSession } from '@/lib/authServer';

export async function POST(request: NextRequest) {
  if(process.env.ALLOW_LOCAL_PASSWORD_LOGIN!=='true')return NextResponse.json({error:'Local password login is disabled; configure the approved OIDC callback'},{status:501});
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === 'string' ? body.email : '';
  const password = typeof body?.password === 'string' ? body.password : '';

  const user = await authenticateUser(email, password);
  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = await createSession(user);
  const response = NextResponse.json({ user });
  response.cookies.set(AUTH_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    path: '/',
    maxAge: 60 * 60 * 8,
  });
  return response;
}
