import type { Design } from '@/types/design';
import { createClient } from '@/utils/supabase/client';

// Client-side Supabase functions
export const designService = {
  // Get all designs for the current user
  async getUserDesigns(): Promise<Design[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('designs')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching designs:', error);
      return [];
    }

    return data || [];
  },

  // Get public designs (templates)
  async getPublicDesigns(): Promise<Design[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('designs')
      .select('*')
      .eq('is_public', true)
      .eq('is_template', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching public designs:', error);
      return [];
    }

    return data || [];
  },

  // Get a specific design by ID
  async getDesignById(id: string): Promise<Design | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('designs')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching design ${id}:`, error);
      return null;
    }

    return data;
  },

  // Create a new design
  async createDesign(design: Partial<Design>): Promise<Design | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('designs')
      .insert([design])
      .select()
      .single();

    if (error) {
      console.error('Error creating design:', error);
      return null;
    }

    return data;
  },

  // Update an existing design
  async updateDesign(id: string, updates: Partial<Design>): Promise<Design | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('designs')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating design ${id}:`, error);
      return null;
    }

    return data;
  },

  // Delete a design
  async deleteDesign(id: string): Promise<boolean> {
    const supabase = createClient();
    const { error } = await supabase
      .from('designs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting design ${id}:`, error);
      return false;
    }

    return true;
  },

  // Upload a preview image for a design
  async uploadPreviewImage(designId: string, file: File): Promise<string | null> {
    const supabase = createClient();
    const filePath = `design-previews/${designId}/${Date.now()}.png`;

    const { data, error } = await supabase.storage
      .from('designs')
      .upload(filePath, file, {
        contentType: 'image/png',
        upsert: true,
      });

    if (error) {
      console.error('Error uploading preview image:', error);
      return null;
    }

    // Get public URL for the uploaded image
    const { data: { publicUrl } } = supabase.storage
      .from('designs')
      .getPublicUrl(data.path);

    return publicUrl;
  },

  // Search designs by name
  async searchDesigns(query: string): Promise<Design[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('designs')
      .select('*')
      .or(`is_public.eq.true,user_id.eq.auth.uid()`)
      .ilike('name', `%${query}%`)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error searching designs:', error);
      return [];
    }

    return data || [];
  },
};
