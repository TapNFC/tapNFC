import { Suspense } from 'react';
import { DesignFilters } from '@/components/design-editor/components/DesignFilters';
import { DesignGallerySkeleton } from '@/components/design-editor/components/DesignGallerySkeleton';
import { DesignPageHeader } from '@/components/design-editor/components/DesignPageHeader';
import { DesignGallery } from '@/components/design-editor/DesignGallery';

type DesignPageProps = {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    view?: 'grid' | 'list';
    search?: string;
    category?: string;
  }>;
};

export default async function DesignPage({ params, searchParams }: DesignPageProps) {
  const { locale } = await params;
  const { view = 'grid', search, category } = await searchParams;

  return (
    <div className="min-h-screen bg-transparent">
      {/* Header */}
      <DesignPageHeader locale={locale} />

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Filters and Search */}
        <DesignFilters
          view={view}
          search={search}
          category={category}
        />

        {/* Design Gallery */}
        <Suspense fallback={<DesignGallerySkeleton view={view} />}>
          <DesignGallery
            view={view}
            search={search}
            category={category}
            locale={locale}
          />
        </Suspense>
      </div>
    </div>
  );
}

export async function generateMetadata() {
  return {
    title: 'Design Gallery',
    description: 'Browse and manage your design templates',
  };
}
