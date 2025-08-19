import type { User } from '@supabase/supabase-js';

// QR Code styling settings and metadata type
export type QrCodeStyling = {
  qrSize: number;
  qrColor: string;
  bgColor: string;
  includeMargin: boolean;
  logoImage: string | null;
  logoSize: number;
  selectedQrSampleId: string;
  // Additional metadata fields
  createdAt?: string; // When the QR code was first generated
  lastModified?: string; // When the QR code was last modified
  version?: string; // Version of the QR code styling format
};

// Main Design type that matches the Supabase database schema
export type Design = {
  id: string;
  user_id: string;
  name: string;
  type?: string;
  description?: string;
  tags?: string[];
  canvas_data: any; // JSONB data representing the Fabric.js canvas
  preview_url: string | null;
  qr_code_url?: string | null;
  qr_code_data?: string | null; // SVG data for the QR code (base64 or serialized SVG)
  design_qr_metadata?: QrCodeStyling | null; // QR code styling settings and metadata
  is_template: boolean;
  is_public: boolean;
  is_archived?: boolean;
  slug?: string; // URL-friendly slug for preview URLs
  width?: number; // Canvas width in pixels
  height?: number; // Canvas height in pixels
  background_color?: string; // Canvas background color
  created_at: string;
  updated_at: string;
};

// Type for creating a new design
export type CreateDesignInput = Omit<Design, 'id' | 'created_at' | 'updated_at'>;

// Type for updating an existing design
export type UpdateDesignInput = Partial<Omit<Design, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;

// Design category for filtering
export type DesignCategory = 'all' | 'templates' | 'my-designs' | 'recent';

// Extended Design type with user information
export type DesignWithUser = Design & {
  user?: User;
};

// Design statistics for dashboard
export type DesignStats = {
  totalDesigns: number;
  totalTemplates: number;
  recentDesigns: number;
  publicDesigns: number;
};

// Design filter options
export type DesignFilters = {
  category?: DesignCategory;
  search?: string;
  tags?: string[];
  isTemplate?: boolean;
  isPublic?: boolean;
  userId?: string;
};

// Design sort options
export type DesignSortOption = 'created_at' | 'updated_at' | 'name' | 'type';

// Design sort order
export type DesignSortOrder = 'asc' | 'desc';

// Design export options
export type DesignExportOptions = {
  format: 'png' | 'jpg' | 'svg' | 'pdf';
  quality?: number;
  width?: number;
  height?: number;
  backgroundColor?: string;
};

// Design sharing options
export type DesignSharingOptions = {
  isPublic: boolean;
  allowCopy: boolean;
  allowDownload: boolean;
  password?: string;
  expiresAt?: Date;
};

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
