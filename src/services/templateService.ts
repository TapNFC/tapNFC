import { createClient } from '@/utils/supabase/client';

export type Template = {
  id: string;
  name: string;
  description?: string;
  category: string;
  canvas_data: any;
  created_at: string;
  updated_at: string;
  user_id?: string;
  is_public?: boolean;
  is_template?: boolean;
};

export type CreateTemplateData = Omit<Template, 'id' | 'created_at' | 'updated_at'>;

// Client-side Supabase functions for templates
export const templateService = {
  // Get all templates for the current user
  async getUserTemplates(): Promise<Template[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('designs')
      .select('*')
      .eq('is_template', true)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching templates:', error);
      return [];
    }

    return data || [];
  },

  // Get public templates
  async getPublicTemplates(): Promise<Template[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('designs')
      .select('*')
      .eq('is_template', true)
      .eq('is_public', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching public templates:', error);
      return [];
    }

    return data || [];
  },

  // Get a specific template by ID
  async getTemplateById(id: string): Promise<Template | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('designs')
      .select('*')
      .eq('id', id)
      .eq('is_template', true)
      .single();

    if (error) {
      console.error(`Error fetching template ${id}:`, error);
      return null;
    }

    return data;
  },

  // Create a new template
  async createTemplate(templateData: CreateTemplateData): Promise<Template | null> {
    const supabase = createClient();

    const templateWithDefaults = {
      ...templateData,
      is_template: true,
      is_public: templateData.is_public ?? false,
    };

    const { data, error } = await supabase
      .from('designs')
      .insert([templateWithDefaults])
      .select()
      .single();

    if (error) {
      console.error('Error creating template:', error);
      return null;
    }

    return data;
  },

  // Update an existing template
  async updateTemplate(id: string, updates: Partial<Template>): Promise<Template | null> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('designs')
      .update(updates)
      .eq('id', id)
      .eq('is_template', true)
      .select()
      .single();

    if (error) {
      console.error(`Error updating template ${id}:`, error);
      return null;
    }

    return data;
  },

  // Delete a template
  async deleteTemplate(id: string): Promise<boolean> {
    const supabase = createClient();

    try {
      // First, get the template to access its image URLs
      const { data: template, error: fetchError } = await supabase
        .from('designs')
        .select('preview_url, qr_code_url')
        .eq('id', id)
        .eq('is_template', true)
        .single();

      if (fetchError) {
        console.error(`Error fetching template ${id} for deletion:`, fetchError);
        return false;
      }

      // Delete associated images from storage if they exist
      if (template?.preview_url) {
        // Note: You might need to implement storage deletion logic here
        // or use the existing storageService
      }

      // Now delete the template record
      const { error } = await supabase
        .from('designs')
        .delete()
        .eq('id', id)
        .eq('is_template', true);

      if (error) {
        console.error(`Error deleting template ${id}:`, error);
        return false;
      }

      return true;
    } catch (error) {
      console.error(`Error in deleteTemplate for ${id}:`, error);
      return false;
    }
  },

  // Search templates by name
  async searchTemplates(query: string): Promise<Template[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('designs')
      .select('*')
      .eq('is_template', true)
      .or(`is_public.eq.true,user_id.eq.auth.uid()`)
      .ilike('name', `%${query}%`)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error searching templates:', error);
      return [];
    }

    return data || [];
  },

  // Get templates by category
  async getTemplatesByCategory(category: string): Promise<Template[]> {
    if (!category) {
      console.error('Error fetching templates by category: category parameter is empty');
      return [];
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from('designs')
      .select('*')
      .eq('is_template', true)
      .eq('category', category)
      .or(`is_public.eq.true,user_id.eq.auth.uid()`)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching templates by category:', error);
      return [];
    }

    return data || [];
  },

  // Get all categories
  async getTemplateCategories(): Promise<string[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('designs')
      .select('category')
      .eq('is_template', true)
      .not('category', 'is', null);

    if (error) {
      console.error('Error fetching template categories:', error);
      return [];
    }

    // Extract unique categories
    const categories = [...new Set(data?.map(item => item.category) || [])];
    return categories.sort();
  },
};
