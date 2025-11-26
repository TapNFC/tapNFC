import { NextResponse } from 'next/server';
import { createAppServerClient } from '@/utils/supabase/server-app';

export async function GET() {
  const supabase = createAppServerClient();

  try {
    // Get all public designs for testing
    const { data: publicDesigns, error: publicError } = await supabase
      .from('designs')
      .select('id, name, description, is_public, created_at')
      .eq('is_public', true)
      .limit(10);

    // Get all designs (authenticated users only)
    const { data: { user } } = await supabase.auth.getUser();
    let allDesigns = null;

    if (user) {
      const { data, error } = await supabase
        .from('designs')
        .select('id, name, description, is_public, created_at')
        .limit(10);

      if (!error) {
        allDesigns = data;
      }
    }

    return NextResponse.json({
      publicDesigns: publicDesigns || [],
      allDesigns: user ? allDesigns : 'Authentication required',
      totalPublic: publicDesigns?.length || 0,
      publicError: publicError?.message || null,
    });
  } catch (error) {
    console.error('Error fetching test designs:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST() {
  const supabase = createAppServerClient();

  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Authentication required to create test design' }, { status: 401 });
    }

    // Create a test public design
    const testDesign = {
      user_id: user.id,
      name: 'Test Public Design',
      description: 'A test design for preview functionality',
      canvas_data: {
        version: '5.2.4',
        objects: [
          {
            type: 'text',
            left: 100,
            top: 100,
            width: 200,
            height: 40,
            text: 'Test Design Preview',
            fontSize: 24,
            fontWeight: 'bold',
            fill: '#1e40af',
            textAlign: 'center',
            fontFamily: 'Arial',
          },
          {
            type: 'rect',
            left: 100,
            top: 160,
            width: 200,
            height: 80,
            fill: '#3b82f6',
            stroke: '#1e40af',
            strokeWidth: 2,
            rx: 12,
          },
        ],
        background: '#ffffff',
        width: 400,
        height: 300,
      },
      preview_url: null,
      qr_code_url: null,
      qr_code_data: null,
      is_template: false,
      is_public: true, // Make it public for testing
    };

    const { data, error } = await supabase
      .from('designs')
      .insert([testDesign])
      .select()
      .single();

    if (error) {
      console.error('Error creating test design:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Test design created successfully',
      design: data,
      previewUrl: `/${data.slug || data.id}`,
    });
  } catch (error) {
    console.error('Error creating test design:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
