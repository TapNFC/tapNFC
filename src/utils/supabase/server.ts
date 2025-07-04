import type { CookieOptions } from '@supabase/ssr';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const createClient = async () => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          const cookieStore = await cookies();
          return cookieStore.get(name)?.value;
        },
        async set(name: string, value: string, options: CookieOptions) {
          try {
            const cookieStore = await cookies();
            cookieStore.set({ name, value, ...options });
          } catch (error: unknown) {
            console.error('Error setting cookie:', error);
          }
        },
        async remove(name: string, _options: CookieOptions) {
          try {
            const cookieStore = await cookies();
            cookieStore.delete(name);
          } catch (error: unknown) {
            console.error('Error removing cookie:', error);
          }
        },
      },
    },
  );
};
