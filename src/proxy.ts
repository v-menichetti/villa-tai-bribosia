import { NextRequest, NextResponse } from 'next/server';
export function proxy(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.set(
    'x-site-language',
    /^\/en(?:\/|$)/.test(request.nextUrl.pathname) ? 'en' : 'fr',
  );
  return NextResponse.next({ request: { headers } });
}
export const config = {
  matcher: [
    '/((?!api|_next|images|icon.svg|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};
