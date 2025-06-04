import { redirect } from 'next/navigation';
import { generateDesignId } from '@/lib/indexedDB';

type NewDesignPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function NewDesignPage({ params }: NewDesignPageProps) {
  const { locale } = await params;

  // Generate a unique design ID using our utility function
  const designId = generateDesignId();

  // Redirect to the design editor with the new ID
  redirect(`/${locale}/design/${designId}`);
}

export async function generateMetadata() {
  return {
    title: 'Create New Design',
    description: 'Start creating a new design template',
  };
}
