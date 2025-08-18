import { NextResponse } from 'next/server';
import { createAppServerClient } from '@/utils/supabase/server-app';

// Function to check if a string is a UUID
function isUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ identifier: string }> },
) {
  const { identifier } = await params;
  const isUuid = isUUID(identifier);

  const supabase = createAppServerClient();

  try {
    let query = supabase
      .from('designs')
      .select('id, name, description, canvas_data, preview_url, qr_code_url, qr_code_data, created_at, updated_at, slug, is_archived, width, height, background_color')
      .eq('is_public', true);

    // Use the appropriate field based on whether it's a UUID or slug
    if (isUuid) {
      query = query.eq('id', identifier);
    } else {
      query = query.eq('slug', identifier);
    }

    const { data, error } = await query.single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned - design not found or not public
        console.log(`Design ${isUuid ? 'with id' : 'with slug'} ${identifier} not found or not public`); // eslint-disable-line no-console
        return NextResponse.json({ error: 'Design not found or not publicly accessible' }, { status: 404 });
      }

      console.error(`Error fetching public design ${isUuid ? 'with id' : 'with slug'} ${identifier}:`, error);
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
      slug: data.slug,
      is_archived: data.is_archived,
      width: data.width || 800, // Include width with fallback
      height: data.height || 600, // Include height with fallback
      background_color: data.background_color || '#ffffff', // Include background color with fallback
      // Add required fields for compatibility
      user_id: 'public',
      tags: [],
      is_template: false,
      is_public: true,
    };

    return NextResponse.json(previewData, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate', // Disable caching for previews
      },
    });
  } catch (error) {
    console.error(`Unexpected error in GET /api/[identifier]:`, error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
