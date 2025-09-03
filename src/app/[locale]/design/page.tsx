import type { Metadata } from 'next';
import type { DesignPageWithSearchParams, UserProfile } from '@/types/design';
import { Suspense } from 'react';
import { DesignGallerySkeleton } from '@/components/design-editor/components/DesignGallerySkeleton';
import { DesignClient } from '@/components/design-editor/design-client';
import { createAppServerClient } from '@/utils/supabase/server-app';

export const metadata: Metadata = {
  title: 'Design Gallery',
  description: 'Browse and manage your design templates',
};

// Helper function to get user profile data
async function getUserProfile(): Promise<UserProfile | undefined> {
  const supabase = createAppServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return undefined;
  }

  return {
    name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
    email: user.email || '',
    avatar: user.user_metadata?.avatar_url,
  };
}

export default async function DesignPage({ params, searchParams }: DesignPageWithSearchParams) {
  const { locale } = await params;
  const { view = 'grid', search, category, tag } = await searchParams;

  // Get user profile for the header
  const userProfile = await getUserProfile();

  return (
    <Suspense fallback={<DesignGallerySkeleton view={view} />}>
      <DesignClient
        userProfile={userProfile}
        searchParams={{ view, search, category, tag }}
        locale={locale}
      />
    </Suspense>
  );
}
