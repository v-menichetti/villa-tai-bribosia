import { NextResponse } from 'next/server';
import { authenticated } from '@/lib/auth';
import { getWeeks, updateWeek } from '@/lib/db';
import { validWeekUpdate } from '@/lib/availability';
import { readJson, sameOrigin } from '@/lib/http';
export async function PATCH(request: Request) {
  if (!sameOrigin(request) || !(await authenticated()))
    return NextResponse.json(
      { error: 'Votre session a expiré. Reconnectez-vous.' },
      { status: 401 },
    );
  let value;
  try {
    value = await readJson(request);
  } catch {
    return NextResponse.json({ error: 'Demande invalide.' }, { status: 400 });
  }
  if (!validWeekUpdate(value))
    return NextResponse.json(
      { error: 'Vérifiez le statut et le prix (1 à 20 000 €, ou vide).' },
      { status: 400 },
    );
  if (!updateWeek(value))
    return NextResponse.json(
      {
        error:
          'Cette semaine a été modifiée ailleurs. Rechargez la page avant de recommencer.',
      },
      { status: 409 },
    );
  return NextResponse.json(
    { weeks: getWeeks() },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
