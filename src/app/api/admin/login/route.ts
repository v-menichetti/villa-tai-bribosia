import { NextResponse } from 'next/server';
import {
  adminConfigured,
  cookieName,
  createSession,
  sessionSeconds,
  verifyPassword,
} from '@/lib/auth';
import { consumeLimit } from '@/lib/db';
import { clientKey, readJson, sameOrigin } from '@/lib/http';
export async function POST(request: Request) {
  if (!sameOrigin(request))
    return NextResponse.json(
      { error: 'Origine non autorisée.' },
      { status: 403 },
    );
  if (!adminConfigured())
    return NextResponse.json(
      { error: 'L’accès administrateur reste à configurer.' },
      { status: 503 },
    );
  if (!consumeLimit('login:' + clientKey(request), 5, 15 * 60 * 1000))
    return NextResponse.json(
      { error: 'Trop de tentatives. Réessayez dans 15 minutes.' },
      { status: 429 },
    );
  let body;
  try {
    body = (await readJson(request)) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Demande invalide.' }, { status: 400 });
  }
  if (
    typeof body?.password !== 'string' ||
    !(await verifyPassword(body.password))
  )
    return NextResponse.json(
      { error: 'Mot de passe incorrect.' },
      { status: 401 },
    );
  const response = NextResponse.json({ ok: true });
  response.cookies.set(cookieName, createSession(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: sessionSeconds,
  });
  return response;
}
