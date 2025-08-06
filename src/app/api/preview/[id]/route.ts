import { NextResponse } from 'next/server';
import { createAppServerClient } from '@/utils/supabase/server-app';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const supabase = createAppServerClient();

  try {
    // Query for public designs only for preview
    // This endpoint doesn't require authentication and only returns public designs
    const { data, error } = await supabase
      .from('designs')
      .select('id, name, description, canvas_data, preview_url, qr_code_url, qr_code_data, created_at, updated_at')
      .eq('id', id)
      .eq('is_public', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned - design not found or not public
        console.log(`Design ${id} not found or not public`); // eslint-disable-line no-console
        return NextResponse.json({ error: 'Design not found or not publicly accessible' }, { status: 404 });
      }

      console.error(`Error fetching public design ${id}:`, error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Return minimal data structure optimized for preview
    const previewData = {
      id: data.id,
      name: data.name,
      description: data.description,
      canvas_data: data.canvas_data,
      preview_url: data.preview_url,
      qr_code_url: data.qr_code_url,
      qr_code_data: data.qr_code_data,
      created_at: data.created_at,
      updated_at: data.updated_at,
      // Add required fields for compatibility
      user_id: 'public',
      tags: [],
      is_template: false,
      is_public: true,
    };

    return NextResponse.json(previewData, {
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=600', // Cache for 5 minutes, CDN for 10 minutes
      },
    });
  } catch (error) {
    console.error('Unexpected error in GET /api/preview/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
