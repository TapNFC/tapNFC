'use client';

import type { UserProfile } from '@/types/design';
import { DesignPageHeader } from '@/components/design-editor/components/DesignPageHeader';
import { DesignGallery } from '@/components/design-editor/DesignGallery';
import { ModernHeader } from '@/components/layout/modern-header';

type DesignClientProps = {
  userProfile?: UserProfile;
  searchParams: {
    view?: 'grid' | 'list';
    search?: string;
    category?: string;
    tag?: string;
  };
  locale: string;
};

export function DesignClient({ userProfile, searchParams, locale }: DesignClientProps) {
  const { view = 'grid', search, category, tag } = searchParams;

  return (
    <div className="min-h-screen bg-transparent">
      {/* Header with User Info */}
      <ModernHeader
        className="relative z-20"
        user={userProfile}
      />

      {/* Header */}
      <DesignPageHeader locale={locale} />

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-6 pt-2 sm:px-6 lg:px-8">
        {/* Design Gallery */}
        <DesignGallery
          view={view}
          search={search}
          category={category}
          tag={tag}
          locale={locale}
        />
      </div>
    </div>
  );
}
