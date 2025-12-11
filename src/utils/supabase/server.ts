import type { CookieOptions } from '@supabase/ssr';
import { createServerClient as createSupabaseServerClient } from '@supabase/ssr';

// Create a version that doesn't use next/headers
export const createClient = () => {
  // Return a dummy client that will be replaced by the actual client in middleware
  return createSupabaseServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (_name: string) => {
          // This will be replaced by the actual cookie in middleware
          return undefined;
        },
        set: (_name: string, _value: string, _options: CookieOptions) => {
          // This will be replaced by the actual cookie setter in middleware
        },
        remove: (_name: string, _options: CookieOptions) => {
          // This will be replaced by the actual cookie remover in middleware
        },
      },
    },
  );
};
