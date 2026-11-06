import { selectedStay } from '@/lib/stay';
import { NextResponse } from 'next/server';
import { emailConfigured, parseEnquiry, contactRecipient } from '@/lib/enquiry';
import { consumeLimit, getPublicWeeks } from '@/lib/db';
import { clientKey, readJson, sameOrigin } from '@/lib/http';
export const runtime = 'nodejs';
export async function POST(request: Request) {
  if (!sameOrigin(request))
    return NextResponse.json({ error: 'origin' }, { status: 403 });
  if (!consumeLimit('contact:' + clientKey(request), 5, 15 * 60 * 1000))
    return NextResponse.json({ error: 'rate' }, { status: 429 });
  let input;
  try {
    input = await readJson(request);
  } catch {
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  }
  const value = parseEnquiry(input);
  if (!value || value.website)
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  if (
    value.arrival &&
    !selectedStay(getPublicWeeks(), value.arrival, value.departure)
  )
    return NextResponse.json({ error: 'unavailable' }, { status: 409 });
  if (!emailConfigured())
    return NextResponse.json({ error: 'configuration' }, { status: 503 });
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(12000),
      body: JSON.stringify({
        from: process.env.MAIL_FROM,
        to: [process.env.CONTACT_EMAIL?.trim() || contactRecipient],
        reply_to: value.email,
        subject: `Demande de séjour — Villa Tai Bribosia${value.arrival ? ' — ' + value.arrival : ''}`,
        text: `Nom : ${value.name}\nE-mail : ${value.email}\nTéléphone : ${value.phone || 'Non renseigné'}\nLangue : ${value.locale}\nArrivée : ${value.arrival || 'À préciser'}\nDépart : ${value.departure || 'À préciser'}\nAdultes : ${value.adults}\nEnfants : ${value.children}\n\n${value.message}`,
      }),
    });
    if (!response.ok)
      return NextResponse.json({ error: 'delivery' }, { status: 502 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'delivery' }, { status: 502 });
  }
}
