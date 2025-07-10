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

// Supabase Design type matching the database schema
export type Design = {
  id: string;
  user_id: string;
  name: string;
  canvas_data: any; // JSONB data representing the Fabric.js canvas
  preview_url: string | null;
  is_template: boolean;
  is_public: boolean;
  created_at: string;
  updated_at: string;
};

// Type for creating a new design
export type CreateDesignInput = Omit<Design, 'id' | 'created_at' | 'updated_at'>;

// Type for updating an existing design
export type UpdateDesignInput = Partial<Omit<Design, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;

// Design category for filtering
export type DesignCategory = 'all' | 'templates' | 'my-designs' | 'recent';
