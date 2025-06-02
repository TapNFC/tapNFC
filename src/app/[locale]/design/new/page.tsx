import { redirect } from 'next/navigation';

type NewDesignPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function NewDesignPage({ params }: NewDesignPageProps) {
  const { locale } = await params;

  // Generate a unique design ID using crypto.randomUUID for better collision resistance
  const designId = `design_${Date.now()}_${crypto.randomUUID().slice(0, 8)}`;

  // Redirect to the design editor with the new ID
  redirect(`/${locale}/design/${designId}`);
}

export async function generateMetadata() {
  return {
    title: 'Create New Design',
    description: 'Start creating a new design template',
  };
}
