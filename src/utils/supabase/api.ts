import type { CookieOptions } from '@supabase/ssr';
import type { NextApiRequest, NextApiResponse } from 'next';
import { createServerClient } from '@supabase/ssr';

export const createApiClient = (req: NextApiRequest, res: NextApiResponse) => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies[name];
        },
        set(name: string, value: string, options: CookieOptions) {
          res.setHeader('Set-Cookie', `${name}=${value}; Path=${options.path || '/'}; ${options.httpOnly ? 'HttpOnly;' : ''} ${options.secure ? 'Secure;' : ''} ${options.maxAge ? `Max-Age=${options.maxAge};` : ''} ${options.domain ? `Domain=${options.domain};` : ''} ${options.sameSite ? `SameSite=${options.sameSite};` : ''}`);
        },
        remove(name: string, options: CookieOptions) {
          res.setHeader('Set-Cookie', `${name}=; Path=${options.path || '/'}; Expires=Thu, 01 Jan 1970 00:00:00 GMT; ${options.httpOnly ? 'HttpOnly;' : ''} ${options.secure ? 'Secure;' : ''} ${options.domain ? `Domain=${options.domain};` : ''} ${options.sameSite ? `SameSite=${options.sameSite};` : ''}`);
        },
      },
    },
  );
};
