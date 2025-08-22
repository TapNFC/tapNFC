import type { Design } from '@/types/design';
import { generateSlug } from '@/utils/slugUtils';
import { createClient } from '@/utils/supabase/client';
import { storageService } from './storageService';

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

  // Get a specific design by slug
  async getDesignBySlug(slug: string): Promise<Design | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('designs')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error(`Error fetching design with slug ${slug}:`, error);
      return null;
    }

    return data;
  },

  // Create a new design
  async createDesign(design: Partial<Design>): Promise<Design | null> {
    const supabase = createClient();

    // Generate slug if not provided
    let slug = design.slug;
    if (!slug && design.name) {
      slug = generateSlug(design.name);

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

    const designWithSlug = {
      ...design,
      slug,
    };

    const { data, error } = await supabase
      .from('designs')
      .insert([designWithSlug])
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

    // Generate slug if name is being updated and slug is not provided
    let slug = updates.slug;
    if (!slug && updates.name) {
      slug = generateSlug(updates.name);

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

    const updatesWithSlug = {
      ...updates,
      ...(slug && { slug }),
    };

    const { data, error } = await supabase
      .from('designs')
      .update(updatesWithSlug)
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

    try {
      // First, get the design to access its image URLs
      const { data: design, error: fetchError } = await supabase
        .from('designs')
        .select('preview_url, qr_code_url')
        .eq('id', id)
        .single();

      if (fetchError) {
        console.error(`Error fetching design ${id} for deletion:`, fetchError);
        return false;
      }

      // Delete associated images from storage
      if (design?.preview_url) {
        await storageService.deleteDesignPreview(design.preview_url);
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
        return false;
      }

      return true;
    } catch (error) {
      console.error(`Error in deleteDesign for ${id}:`, error);
      return false;
    }
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

  // Get designs by tag
  async getDesignsByTag(tag: string): Promise<Design[]> {
    if (!tag) {
      console.error('Error fetching designs by tag: tag parameter is empty');
      return [];
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from('designs')
      .select('*')
      .or(`is_public.eq.true,user_id.eq.auth.uid()`)
      .contains('tags', [tag])
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching designs by tag:', error);
      return [];
    }

    return data || [];
  },

  // Get QR codes for the current user
  async getUserQrCodes(includeArchived = false): Promise<Design[]> {
    const supabase = createClient();
    let query = supabase
      .from('designs')
      .select('*')
      .not('qr_code_url', 'is', null)
      .order('updated_at', { ascending: false });

    if (!includeArchived) {
      query = query.eq('is_archived', false);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching QR codes:', error);
      return [];
    }

    return data || [];
  },

  async archiveDesign(id: string): Promise<Design | null> {
    return this.updateDesign(id, { is_archived: true });
  },

  async restoreDesign(id: string): Promise<Design | null> {
    return this.updateDesign(id, { is_archived: false });
  },
};
