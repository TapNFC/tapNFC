import type { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './libs/i18nNavigation';
import { createMiddlewareClient } from './utils/supabase/middleware';

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
  // Create the Supabase middleware client
  const { supabase, response } = createMiddlewareClient(request);

  // Refresh session if expired - required for Server Components
  await supabase.auth.getSession();

  // Apply i18n middleware
  const i18nResponse = await intlMiddleware(request);

  // Copy over the cookies from the Supabase response to the i18n response
  response.headers.forEach((value, key) => {
    if (key.toLowerCase() === 'set-cookie') {
      i18nResponse.headers.append(key, value);
    }
  });

  return i18nResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!api/|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
