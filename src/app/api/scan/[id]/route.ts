import type { NextRequest } from 'next/server';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { createAppServerClient } from '@/utils/supabase/server-app';

/**
 * POST endpoint to record a QR code scan
 * This endpoint is public and doesn't require authentication
 */
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const headersList = await headers();

  const supabase = createAppServerClient();

  try {
    // First, verify the design exists
    const { data: design, error: designError } = await supabase
      .from('designs')
      .select('id, name, is_public, is_archived')
      .eq('id', id)
      .single();

    if (designError) {
      console.error(`Error fetching design ${id}:`, designError);
      return NextResponse.json({ error: 'Design not found' }, { status: 404 });
    }

    // If the design is archived, do not record scans
    if (design.is_archived) {
      return NextResponse.json({ error: 'QR code is archived' }, { status: 410 });
    }

    // Extract user information from headers
    const userAgent = headersList.get('user-agent') || '';
    const referrer = headersList.get('referer') || '';
    const ipAddress = headersList.get('x-forwarded-for')
      || headersList.get('x-real-ip')
      || 'unknown';

    // Determine device type and browser
    let deviceType = 'unknown';
    let browser = 'unknown';
    let os = 'unknown';

    if (userAgent) {
      // Simple device detection
      if (userAgent.includes('Mobile') || userAgent.includes('Android') || userAgent.includes('iPhone')) {
        deviceType = 'mobile';
      } else if (userAgent.includes('Tablet') || userAgent.includes('iPad')) {
        deviceType = 'tablet';
      } else {
        deviceType = 'desktop';
      }

      // Simple browser detection
      if (userAgent.includes('Chrome')) {
        browser = 'Chrome';
      } else if (userAgent.includes('Firefox')) {
        browser = 'Firefox';
      } else if (userAgent.includes('Safari')) {
        browser = 'Safari';
      } else if (userAgent.includes('Edge')) {
        browser = 'Edge';
      }

      // Simple OS detection
      if (userAgent.includes('Windows')) {
        os = 'Windows';
      } else if (userAgent.includes('Mac')) {
        os = 'macOS';
      } else if (userAgent.includes('Linux')) {
        os = 'Linux';
      } else if (userAgent.includes('Android')) {
        os = 'Android';
      } else if (userAgent.includes('iOS')) {
        os = 'iOS';
      }
    }

    // Record the scan
    const { error: scanError } = await supabase
      .from('qr_code_scans')
      .insert([
        {
          design_id: id,
          ip_address: ipAddress,
          user_agent: userAgent,
          referrer,
          device_type: deviceType,
          browser,
          os,
        },
      ]);

    if (scanError) {
      console.error('Error recording scan:', scanError);
      return NextResponse.json({ error: 'Failed to record scan' }, { status: 500 });
    }

    // Get updated scan statistics
    const { data: scanStats, error: statsError } = await supabase
      .from('qr_code_scans')
      .select('created_at')
      .eq('design_id', id)
      .order('created_at', { ascending: false });

    if (statsError) {
      console.error('Error fetching scan stats:', statsError);
    }

    const totalScans = scanStats?.length || 0;
    const lastScan = scanStats?.[0]?.created_at || null;

    return NextResponse.json({
      success: true,
      designId: id,
      scanRecorded: true,
      totalScans,
      lastScan,
    });
  } catch (error) {
    console.error('Unexpected error in POST /api/scan/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
