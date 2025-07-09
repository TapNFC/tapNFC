// Shared types for design-related pages and components

export type DesignPageParams = {
  locale: string;
  id: string;
};

export type DesignPageProps = {
  params: Promise<DesignPageParams>;
};

export type DesignPageWithSearchParams = {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    view?: 'grid' | 'list';
    search?: string;
    category?: string;
  }>;
};

export type DesignMetadata = {
  title: string;
  description: string;
};

export type UserProfile = {
  name: string;
  email: string;
  avatar?: string;
};
