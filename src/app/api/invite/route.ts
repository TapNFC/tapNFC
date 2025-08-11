import { NextResponse } from 'next/server';
import { routing } from '@/libs/i18nNavigation';
import { getBaseUrl } from '@/utils/Helpers';
import { createAdminClient } from '@/utils/supabase/admin';
import { createAppServerClient } from '@/utils/supabase/server-app';

export async function POST(request: Request) {
  const supabase = createAppServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { email, locale } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const safeLocale = routing.locales.includes(locale) ? locale : routing.defaultLocale;

    const admin = createAdminClient();

    // Redirect directly to localized sign-in so it can parse the invite hash
    const redirectTo = `${getBaseUrl()}/${safeLocale}/sign-in`;

    const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
      redirectTo,
    });

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('Invite error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
