import type { DesignPageProps, UserProfile } from '@/types/design';
import { Suspense } from 'react';
import { DESIGN_EDITOR_CONFIG } from '@/components/design-editor/constants';
import { QrCodeGenerator } from '@/components/design-editor/QrCodeGenerator';
import { QrCodeGeneratorSkeleton } from '@/components/design-editor/QrCodeGeneratorSkeleton';
import { ModernHeader } from '@/components/layout/modern-header';
import { createAppServerClient } from '@/utils/supabase/server-app';

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

export default async function QrCodePage({ params }: DesignPageProps) {
  const { locale, id } = await params;

  // Get user profile for the header
  const userProfile = await getUserProfile();

  return (
    <div className="min-h-screen bg-transparent">
      {/* Header with User Info */}
      <ModernHeader
        className="relative z-20"
        user={userProfile}
      />

      <div className={DESIGN_EDITOR_CONFIG.BACKGROUND_CLASSES.PAGE}>
        <Suspense fallback={<QrCodeGeneratorSkeleton />}>
          <QrCodeGenerator designId={id} locale={locale} />
        </Suspense>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: DesignPageProps) {
  const { id } = await params;

  return {
    title: `Generate QR Code - ${id}`,
    description: 'Generate a QR code for your design to share with others',
  };
}
