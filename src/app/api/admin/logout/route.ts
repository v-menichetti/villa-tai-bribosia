import { NextResponse } from 'next/server';
import { cookieName, endSession } from '@/lib/auth';
import { sameOrigin } from '@/lib/http';
export async function POST(request: Request) {
  if (!sameOrigin(request))
    return NextResponse.json({ error: 'origin' }, { status: 403 });
  await endSession();
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(cookieName);
  return response;
}
