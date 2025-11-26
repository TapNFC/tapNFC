import { NextResponse } from 'next/server';
import { createAppServerClient } from '@/utils/supabase/server-app';
import { createServiceClient } from '@/utils/supabase/server-service';

/**
 * GET endpoint to fetch QR code data for a design
 * This endpoint is public and doesn't require authentication
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const supabase = createAppServerClient();
  const supabaseService = createServiceClient();

  try {
    // Query for the design, focusing only on QR code related fields
    const { data, error } = await supabase
      .from('designs')
      .select('id, name, qr_code_url, is_archived, created_at, updated_at')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching QR code data for design ${id}:`, error);

      if ((error as any).code === 'PGRST116') {
        // No rows returned - design not found
        return NextResponse.json({ error: 'QR code not found' }, { status: 404 });
      }

      return NextResponse.json({ error: (error as any).message }, { status: 500 });
    }

    if (data.is_archived) {
      return NextResponse.json({ error: 'QR code is archived' }, { status: 410 });
    }

    // If the design doesn't have a QR code URL, return an appropriate message
    if (!data.qr_code_url) {
      return NextResponse.json({ error: 'QR code has not been generated for this design' }, { status: 404 });
    }

    // Get actual scan statistics from the qr_code_scans table using the service client (bypass RLS)
    const { data: scanStats, error: scanError } = await supabaseService
      .from('qr_code_scans')
      .select('created_at, country_code, city, device_type, browser, os')
      .eq('design_id', id)
      .order('created_at', { ascending: false });

    if (scanError) {
      console.error('Error fetching scan statistics:', scanError);
    }

    // Process scan statistics
    const totalScans = scanStats?.length || 0;
    const lastScan = scanStats?.[0]?.created_at || null;

    // Group scans by date
    const scansByDate: Record<string, number> = {};
    if (scanStats) {
      scanStats.forEach((scan) => {
        const date = new Date(scan.created_at).toISOString().split('T')[0];
        if (date) {
          scansByDate[date] = (scansByDate[date] ?? 0) + 1;
        }
      });
    }

    // Group scans by country
    const scansByCountry: Record<string, number> = {};
    if (scanStats) {
      scanStats.forEach((scan) => {
        const country = scan.country_code || 'Unknown';
        scansByCountry[country] = (scansByCountry[country] || 0) + 1;
      });
    }

    // Group scans by device type
    const scansByDevice: Record<string, number> = {};
    if (scanStats) {
      scanStats.forEach((scan) => {
        const device = scan.device_type || 'Unknown';
        scansByDevice[device] = (scansByDevice[device] || 0) + 1;
      });
    }

    // Return combined data
    const responseData = {
      id: data.id,
      name: data.name,
      qrCodeUrl: data.qr_code_url,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      scans: totalScans,
      lastScan,
      scansByDate,
      scansByCountry,
      scansByDevice,
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Unexpected error in GET /api/qr-codes/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
