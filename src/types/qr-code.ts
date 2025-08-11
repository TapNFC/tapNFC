export type QRCode = {
  id: string;
  name: string;
  url: string;
  scans: number;
  type: string;
  created: string;
  previewImage: string;
  qrCodeUrl: string | null;
  qrCodeData: string | null; // SVG data for the QR code for multi-resolution downloads
  isArchived: boolean;
  createdBy: string; // User ID of the creator
};

export type QRCodeStats = {
  id: string;
  name: string;
  qrCodeUrl: string | null;
  scans: number;
  lastScan: string | null;
  scansByDate: Record<string, number>;
  scansByCountry: Record<string, number>;
  scansByDevice: Record<string, number>;
};
