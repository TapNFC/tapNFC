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
    tag?: string;
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
  description?: string;
  tags?: string[];
  canvas_data: any; // JSONB data representing the Fabric.js canvas
  preview_url: string | null;
  qr_code_url?: string | null;
  qr_code_data?: string | null; // SVG data for the QR code (base64 or serialized SVG)
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

// Legacy DesignData type for compatibility with existing components
export type DesignData = {
  id: string;
  canvasData: any;
  metadata: {
    width: number;
    height: number;
    backgroundColor: string;
    title?: string;
    description?: string;
    imageUrl?: string;
    designType?: string;
    previewUrl?: string;
  };
  qr_code_url?: string;
  qr_code_data?: string; // SVG data for the QR code
  createdAt: Date;
  updatedAt: Date;
};

// Utility functions to convert between Design and DesignData types
export function designToDesignData(design: Design): DesignData {
  const canvasData = design.canvas_data || {};

  return {
    id: design.id,
    canvasData,
    metadata: {
      width: canvasData.width || 375,
      height: canvasData.height || 667,
      backgroundColor: canvasData.background || '#ffffff',
      title: design.name,
      description: design.description,
      imageUrl: canvasData.imageUrl || canvasData.metadata?.imageUrl,
      designType: canvasData.designType || canvasData.metadata?.designType || 'standard',
      previewUrl: design.preview_url || undefined,
    },
    qr_code_url: design.qr_code_url || undefined,
    qr_code_data: design.qr_code_data || undefined,
    createdAt: new Date(design.created_at),
    updatedAt: new Date(design.updated_at),
  };
}

export function designDataToDesign(designData: DesignData, userId: string): Omit<Design, 'created_at' | 'updated_at'> {
  const canvasData = {
    ...designData.canvasData,
    width: designData.metadata.width,
    height: designData.metadata.height,
    background: designData.metadata.backgroundColor,
    imageUrl: designData.metadata.imageUrl,
    designType: designData.metadata.designType,
    metadata: {
      ...designData.canvasData.metadata,
      imageUrl: designData.metadata.imageUrl,
      designType: designData.metadata.designType,
    },
  };

  return {
    id: designData.id,
    user_id: userId,
    name: designData.metadata.title || `Design ${designData.id}`,
    description: designData.metadata.description,
    tags: [],
    canvas_data: canvasData,
    preview_url: designData.metadata.previewUrl || null,
    qr_code_url: designData.qr_code_url || null,
    qr_code_data: designData.qr_code_data || null,
    is_template: false,
    is_public: false,
  };
}
