import { NextResponse } from 'next/server';
import { createAppServerClient } from '@/utils/supabase/server-app';

export async function GET() {
  const supabase = createAppServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    return NextResponse.json({ error: userError.message }, { status: 500 });
  }

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Count total QR codes (designs with a QR code URL, not archived, owned by user)
    const {
      count: totalQrCodes,
      error: qrError,
    } = await supabase
      .from('designs')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .not('qr_code_url', 'is', null);

    if (qrError) {
      throw qrError;
    }

    // Count active templates (user-owned, is_template, not archived)
    const {
      count: activeTemplates,
      error: tmplError,
    } = await supabase
      .from('designs')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_template', true)
      .or('is_archived.is.null,is_archived.eq.false');

    if (tmplError) {
      throw tmplError;
    }

    // Count total customers for the user
    const {
      count: totalCustomers,
      error: custError,
    } = await supabase
      .from('customers')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id);

    if (custError) {
      throw custError;
    }

    // Get IDs of user designs with QR codes to count scans
    const {
      data: designIdRows,
      error: idError,
    } = await supabase
      .from('designs')
      .select('id')
      .eq('user_id', user.id)
      .not('qr_code_url', 'is', null);

    if (idError) {
      throw idError;
    }

    let totalScans = 0;

    if (designIdRows && designIdRows.length > 0) {
      const designIds = designIdRows.map((row: { id: string }) => row.id);

      const {
        count: scansCount,
        error: scansError,
      } = await supabase
        .from('qr_code_scans')
        .select('id', { count: 'exact', head: true })
        .in('design_id', designIds);

      if (scansError) {
        throw scansError;
      }
      totalScans = scansCount ?? 0;
    }

    return NextResponse.json({
      totalQrCodes: totalQrCodes ?? 0,
      activeTemplates: activeTemplates ?? 0,
      totalCustomers: totalCustomers ?? 0,
      totalScans,
    });
  } catch (error: any) {
    console.error('Error building dashboard overview:', error);
    return NextResponse.json({ error: error?.message ?? 'Internal server error' }, { status: 500 });
  }
}
