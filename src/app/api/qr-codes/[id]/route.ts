import { NextResponse } from 'next/server';
import { createAppServerClient } from '@/utils/supabase/server-app';

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

  try {
    // Query for the design, focusing only on QR code related fields
    const { data, error } = await supabase
      .from('designs')
      .select('id, name, qr_code_url, created_at, updated_at')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching QR code data for design ${id}:`, error);

      if (error.code === 'PGRST116') {
        // No rows returned - design not found
        return NextResponse.json({ error: 'QR code not found' }, { status: 404 });
      }

      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // If the design doesn't have a QR code URL, return an appropriate message
    if (!data.qr_code_url) {
      return NextResponse.json({ error: 'QR code has not been generated for this design' }, { status: 404 });
    }

    // Get scan statistics if available (placeholder for future implementation)
    const scanStats = {
      scans: 0,
      lastScan: null,
      scansByDate: {},
      scansByCountry: {},
      scansByDevice: {},
    };

    // Return combined data
    const responseData = {
      id: data.id,
      name: data.name,
      qrCodeUrl: data.qr_code_url,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      ...scanStats,
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Unexpected error in GET /api/qr-codes/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
