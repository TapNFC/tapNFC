import { NextResponse } from 'next/server';
import { createAppServerClient } from '@/utils/supabase/server-app';

export async function POST(request: Request) {
  const supabase = createAppServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const designId = formData.get('designId') as string;

    if (!file || !designId) {
      return NextResponse.json({ error: 'Missing file or designId' }, { status: 400 });
    }

    // Check if the user owns the design
    const { data: designData, error: designError } = await supabase
      .from('designs')
      .select('user_id')
      .eq('id', designId)
      .single();

    if (designError || !designData) {
      return NextResponse.json({ error: 'Design not found or error fetching it' }, { status: 404 });
    }

    if (designData.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized to upload to this design' }, { status: 403 });
    }

    const filePath = `design-previews/${designId}/${Date.now()}.png`;

    const { data, error } = await supabase.storage
      .from('designs')
      .upload(filePath, file, {
        contentType: 'image/png',
        upsert: true,
      });

    if (error) {
      console.error('Error uploading preview image:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get public URL for the uploaded image
    const { data: { publicUrl } } = supabase.storage
      .from('designs')
      .getPublicUrl(data.path);

    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error('Error processing upload:', error);
    return NextResponse.json({ error: 'Failed to process upload' }, { status: 500 });
  }
}
