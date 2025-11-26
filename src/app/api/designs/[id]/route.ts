import { NextResponse } from 'next/server';
import { storageService } from '@/services/storageService';
import { generateSlug } from '@/utils/slugUtils';
import { createAppServerClient } from '@/utils/supabase/server-app';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const supabase = createAppServerClient();

  try {
    // First try to get the user, but don't fail if not authenticated
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.warn(`User authentication error: ${userError.message}, proceeding as unauthenticated`);
    } else if (user) {
      console.warn(`User authenticated: ${user.id}`);
    }

    let query = supabase
      .from('designs')
      .select('*')
      .eq('id', id);

    // If user is not authenticated, only return public designs
    if (!user) {
      query = query.eq('is_public', true);
    } else {
      // If authenticated, return the user's designs or public designs
      query = query.or(`user_id.eq.${user.id},is_public.eq.true`);
    }

    const { data, error } = await query.single();

    if (error) {
      console.error(`Error fetching design ${id}:`, error);

      if (error.code === 'PGRST116') {
        // No rows returned - design not found or not accessible
        return NextResponse.json({ error: 'Design not found or you do not have access to it' }, { status: 404 });
      }

      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error in GET /api/designs/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = createAppServerClient();

  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const json = await request.json();

    // First check if the user owns this design
    const { data: designCheck, error: checkError } = await supabase
      .from('designs')
      .select('user_id')
      .eq('id', id)
      .single();

    if (checkError) {
      if (checkError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Design not found' }, { status: 404 });
      }
      return NextResponse.json({ error: checkError.message }, { status: 500 });
    }

    if (designCheck.user_id !== user.id) {
      return NextResponse.json({ error: 'You do not have permission to update this design' }, { status: 403 });
    }

    // Generate slug if name is being updated and slug is not provided
    let slug = json.slug;
    if (!slug && json.name) {
      slug = generateSlug(json.name);

      // Check if slug already exists (excluding current design) and make it unique
      let counter = 1;
      let uniqueSlug = slug;

      while (true) {
        const { data: existingDesign } = await supabase
          .from('designs')
          .select('id')
          .eq('slug', uniqueSlug)
          .neq('id', id)
          .single();

        if (!existingDesign) {
          break; // Found a unique slug
        }

        counter++;
        uniqueSlug = `${slug}-${counter}`;
      }

      slug = uniqueSlug;
    }

    const updates = {
      ...json,
      ...(slug && { slug }),
    };

    const { data, error } = await supabase
      .from('designs')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating design ${id}:`, error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error in PUT /api/designs/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = createAppServerClient();

  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // First check if the user owns this design and get image URLs
    const { data: designCheck, error: checkError } = await supabase
      .from('designs')
      .select('user_id, preview_url, qr_code_url')
      .eq('id', id)
      .single();

    if (checkError) {
      if (checkError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Design not found' }, { status: 404 });
      }
      return NextResponse.json({ error: checkError.message }, { status: 500 });
    }

    if (designCheck.user_id !== user.id) {
      return NextResponse.json({ error: 'You do not have permission to delete this design' }, { status: 403 });
    }

    // Delete associated images from storage
    if (designCheck.preview_url) {
      await storageService.deleteDesignPreview(designCheck.preview_url);
    }

    // Delete QR code images from storage
    await storageService.deleteQrCodeImages(id);

    // Now delete the design record
    const { error } = await supabase
      .from('designs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting design ${id}:`, error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error in DELETE /api/designs/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
