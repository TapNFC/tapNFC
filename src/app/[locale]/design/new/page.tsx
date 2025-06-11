'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { generateDesignId } from '@/lib/indexedDB';

type NewDesignPageProps = {
  params: {
    locale: string;
  };
};

export default function NewDesignPage({ params }: NewDesignPageProps) {
  const { locale } = params;
  const router = useRouter();

  useEffect(() => {
    // Generate a unique design ID using our utility function
    const designId = generateDesignId();

    // Redirect to the design editor with the new ID
    router.push(`/${locale}/design/${designId}`);
  }, [locale, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="animate-pulse text-center">
        <div className="text-xl font-medium">Creating your new design...</div>
        <div className="mt-2 text-sm text-gray-500">You will be redirected shortly</div>
      </div>
    </div>
  );
}

export async function generateMetadata() {
  return {
    title: 'Create New Design',
    description: 'Start creating a new design template',
  };
}
