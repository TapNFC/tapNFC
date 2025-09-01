import { useQuery } from '@tanstack/react-query';
import { getCustomers } from '@/services/customerService';
import { designService } from '@/services/designService';

export type DashboardStats = {
  totalQrCodes: number;
  activeTemplates: number;
  totalCustomers: number;
  totalScans: number;
  totalDesigns: number;
};

// Fetch QR code scan data
const fetchQrCodeScans = async (qrCodeIds: string[]): Promise<number> => {
  if (qrCodeIds.length === 0) {
    return 0;
  }

  try {
    const batchResponse = await fetch('/api/qr-codes/scans-batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qrCodeIds }),
    });

    if (batchResponse.ok) {
      const batchData = await batchResponse.json();
      if (batchData.success && batchData.data) {
        return batchData.data.reduce((sum: number, item: any) => sum + item.scanCount, 0);
      }
    }

    // Fallback to individual calls if batch fails
    const scanResults = await Promise.all(
      qrCodeIds.map(async (id) => {
        try {
          const res = await fetch(`/api/qr-codes/${id}`);
          if (!res.ok) {
            return 0;
          }
          const data = await res.json();
          return typeof data?.scans === 'number' ? data.scans : 0;
        } catch {
          return 0;
        }
      }),
    );
    return scanResults.reduce((sum, n) => sum + n, 0);
  } catch (error) {
    console.error('Error fetching scan data:', error);
    return 0;
  }
};

// Fetch all dashboard data
const fetchDashboardData = async (): Promise<DashboardStats> => {
  const [qrDesignsAll, allUserDesigns, publicTemplates, customers] = await Promise.all([
    designService.getUserQrCodes(true),
    designService.getUserDesigns(),
    designService.getPublicDesigns(),
    getCustomers().catch(() => []),
  ]);

  // Exclude archived designs
  const qrDesigns = qrDesignsAll.filter(d => !(d.is_archived ?? false));
  const totalQrCodes = qrDesigns.length;
  const totalDesigns = allUserDesigns.filter(d => !(d.is_archived ?? false)).length;
  const activeTemplates = publicTemplates.filter(d => d.is_template && !(d.is_archived ?? false)).length;
  const totalCustomers = customers.length;

  // Fetch scan data for QR codes
  const totalScans = await fetchQrCodeScans(qrDesigns.map(d => d.id));

  return {
    totalQrCodes,
    activeTemplates,
    totalCustomers,
    totalScans,
    totalDesigns,
  };
};

export const useDashboardData = () => {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: fetchDashboardData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
