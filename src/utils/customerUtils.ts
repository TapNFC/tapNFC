import type { Customer, DbCustomer } from '@/types/customer';

/**
 * Maps an array of database customer objects to an array of UI-formatted customer objects.
 * @param dbCustomers - The array of customer objects from the database.
 * @returns An array of customer objects formatted for the UI.
 */
export const mapDbToDisplay = (dbCustomers: DbCustomer[]): Customer[] => {
  return dbCustomers.map(c => ({
    id: c.id,
    name: c.name || 'No Name',
    email: c.email || 'no-email@example.com',
    phone: c.phone || 'N/A',
    website: c.website,
    brandColor: c.brand_color || '#3B82F6',
    status: (c.status as 'Active' | 'Inactive') || 'Active',
    socialLinks: {
      linkedin: c.linkedin_url,
      twitter: c.twitter_url,
      instagram: c.instagram_url,
    },
    logo: c.avatar_url,
    qrCodeId: `QR-${c.id.substring(0, 8)}`,
    qrCodeUrl: `https://qr.studio/dummy-${c.id.substring(0, 8)}`,
    createdAt: c.created_at,
    lastUpdated: c.created_at, // Assuming lastUpdated is same as created_at for now
  }));
};
