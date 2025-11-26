import type { CookieOptions } from '@supabase/ssr';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const createAppServerClient = () => {
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
          const cookieStore = await cookies();
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error: unknown) {
            console.error(error);
            // The `set` method was called from a Server Component.
          }
        },
        async remove(name: string, options: CookieOptions) {
          const cookieStore = await cookies();
          try {
            cookieStore.delete({ name, ...options });
          } catch (error: unknown) {
            console.error(error);
            // The `delete` method was called from a Server Component.
          }
        },
      },
    },
  );
};
