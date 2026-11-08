import { NextResponse } from 'next/server';
import {
  authenticated,
  verifyPassword,
  changePassword,
  createSession,
  cookieName,
  sessionSeconds,
} from '@/lib/auth';
import { consumeLimit } from '@/lib/db';
import { sameOrigin, readJson, clientKey } from '@/lib/http';
export async function POST(request: Request) {
  if (!sameOrigin(request) || !(await authenticated()))
    return NextResponse.json(
      { error: 'Reconnectez-vous pour modifier votre mot de passe.' },
      { status: 401 },
    );
  if (
    !(await consumeLimit('password:' + clientKey(request), 5, 15 * 60 * 1000))
  )
    return NextResponse.json(
      { error: 'Réessayez dans 15 minutes.' },
      { status: 429 },
    );
  let body;
  try {
    body = (await readJson(request)) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Demande invalide.' }, { status: 400 });
  }
  if (
    !body ||
    typeof body.currentPassword !== 'string' ||
    typeof body.newPassword !== 'string' ||
    body.newPassword.length < 8 ||
    body.newPassword.length > 256 ||
    body.newPassword !== body.confirmPassword
  )
    return NextResponse.json(
      {
        error:
          'Utilisez au moins 8 caractères et confirmez le même nouveau mot de passe.',
      },
      { status: 400 },
    );
  if (!(await verifyPassword(body.currentPassword)))
    return NextResponse.json(
      { error: 'Le mot de passe actuel est incorrect.' },
      { status: 400 },
    );
  await changePassword(body.newPassword);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(cookieName, await createSession(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: sessionSeconds,
  });
  return response;
}
