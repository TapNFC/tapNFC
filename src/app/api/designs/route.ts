import { NextResponse } from 'next/server';
import { generateSlug } from '@/utils/slugUtils';
import { createAppServerClient } from '@/utils/supabase/server-app';

export async function GET() {
  const supabase = createAppServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('designs')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = createAppServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const json = await request.json();

  // Generate slug if not provided
  let slug = json.slug;
  if (!slug && json.name) {
    slug = generateSlug(json.name);

    // Check if slug already exists and make it unique
    let counter = 1;
    let uniqueSlug = slug;

    while (true) {
      const { data: existingDesign } = await supabase
        .from('designs')
        .select('id')
        .eq('slug', uniqueSlug)
        .single();

      if (!existingDesign) {
        break; // Found a unique slug
      }

      counter++;
      uniqueSlug = `${slug}-${counter}`;
    }

    slug = uniqueSlug;
  }

  const design = {
    ...json,
    user_id: user.id,
    slug,
  };

  const { data, error } = await supabase
    .from('designs')
    .insert([design])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
