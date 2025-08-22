import { NextResponse } from 'next/server';
import { createServiceClient } from '@/utils/supabase/server-service';

/**
 * POST endpoint to fetch scan counts for multiple QR codes in batch
 * This significantly improves performance by reducing N+1 API calls to a single query
 */
export async function POST(request: Request) {
  try {
    const { qrCodeIds } = await request.json();

    if (!qrCodeIds || !Array.isArray(qrCodeIds) || qrCodeIds.length === 0) {
      return NextResponse.json(
        { error: 'qrCodeIds array is required and must not be empty' },
        { status: 400 },
      );
    }

    const supabaseService = createServiceClient();

    // Fetch scan counts for all QR codes in a single query
    // Using the service client to bypass RLS for batch operations
    const { data: scanStats, error: scanError } = await supabaseService
      .from('qr_code_scans')
      .select('design_id, created_at')
      .in('design_id', qrCodeIds);

    if (scanError) {
      console.error('Error fetching batch scan statistics:', scanError);
      return NextResponse.json(
        { error: 'Failed to fetch scan statistics' },
        { status: 500 },
      );
    }

    // Process scan statistics to get counts per design
    const scanCounts: Record<string, number> = {};

    // Initialize all requested IDs with 0
    qrCodeIds.forEach((id) => {
      scanCounts[id] = 0;
    });

    // Count scans for each design
    if (scanStats) {
      scanStats.forEach((scan) => {
        const designId = scan.design_id;
        if (designId in scanCounts) {
          scanCounts[designId] = (scanCounts[designId] || 0) + 1;
        }
      });
    }

    // Return the scan counts in the same order as requested
    const responseData = qrCodeIds.map(id => ({
      designId: id,
      scanCount: scanCounts[id] || 0,
    }));

    return NextResponse.json({
      success: true,
      data: responseData,
      totalProcessed: qrCodeIds.length,
    });
  } catch (error) {
    console.error('Unexpected error in POST /api/qr-codes/scans-batch:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
