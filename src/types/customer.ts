import { z } from 'zod';

// Schema for form validation using Zod
export const customerSchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  avatar_url: z.string().optional(),
  brand_color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, 'Invalid color format (use #RRGGBB)')
    .optional(),
  linkedin_url: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
  twitter_url: z.string().url('Invalid Twitter URL').optional().or(z.literal('')),
  instagram_url: z.string().url('Invalid Instagram URL').optional().or(z.literal('')),
  status: z.enum(['Active', 'Inactive']),
});

// Type for data imported from CSV
export type CSVCustomer = {
  name: string;
  email: string;
  phone?: string;
  website?: string;
  brandColor?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  status?: string;
};

// Type inferred from the Zod schema for form data
export type CustomerFormData = z.infer<typeof customerSchema>;

// Type representing the structure of the 'customers' table in the database
export type DbCustomer = {
  id: string;
  created_at: string;
  user_id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  avatar_url: string | null;
  brand_color: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  instagram_url: string | null;
  status: string | null;
};

// Type representing the customer data structure used throughout the UI
export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  logo: string | null;
  brandColor: string | null;
  website: string | null;
  status: 'Active' | 'Inactive';
  socialLinks: {
    linkedin: string | null;
    twitter: string | null;
    instagram: string | null;
  };
  qrCodeId: string;
  qrCodeUrl: string;
  createdAt: any;
  lastUpdated: any;
};
