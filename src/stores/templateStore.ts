import type { CreateTemplateData, Template } from '@/services/templateService';
import { create } from 'zustand';
import { templateService } from '@/services/templateService';

type TemplateState = {
  templates: Template[];
  isLoading: boolean;
  error: string | null;
  loadTemplates: () => Promise<void>;
  saveTemplate: (template: Omit<CreateTemplateData, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
  getTemplate: (id: string) => Promise<Template | null>;
  saveCurrentTemplate: (canvasData: any, name: string, description?: string, category?: string) => Promise<void>;
};

export const useTemplateStore = create<TemplateState>((set, get) => ({
  templates: [],
  isLoading: false,
  error: null,

  loadTemplates: async () => {
    set({ isLoading: true, error: null });
    try {
      const templates = await templateService.getUserTemplates();
      set({ templates, isLoading: false });
    } catch (error) {
      console.error('Failed to load templates:', error);
      set({ error: 'Failed to load templates', isLoading: false });
    }
  },

  saveTemplate: async (template) => {
    set({ isLoading: true, error: null });
    try {
      const newTemplate = await templateService.createTemplate({
        name: template.name,
        description: template.description,
        category: template.category,
        canvas_data: template.canvas_data,
        user_id: undefined, // Will be set by Supabase RLS
        is_public: false,
        is_template: true,
      });

      if (newTemplate) {
        // Add to local state
        set(state => ({
          templates: [...state.templates, newTemplate],
          isLoading: false,
        }));
      } else {
        throw new Error('Failed to create template');
      }
    } catch (error) {
      console.error('Failed to save template:', error);
      set({ error: 'Failed to save template', isLoading: false });
      throw error;
    }
  },

  deleteTemplate: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const success = await templateService.deleteTemplate(id);
      if (success) {
        set(state => ({
          templates: state.templates.filter(t => t.id !== id),
          isLoading: false,
        }));
      } else {
        throw new Error('Failed to delete template');
      }
    } catch (error) {
      console.error('Failed to delete template:', error);
      set({ error: 'Failed to delete template', isLoading: false });
      throw error;
    }
  },

  getTemplate: async (id) => {
    try {
      const template = await templateService.getTemplateById(id);
      return template;
    } catch (error) {
      console.error('Failed to get template:', error);
      return null;
    }
  },

  saveCurrentTemplate: async (canvasData, name, description = '', category = 'General') => {
    if (!canvasData) {
      throw new Error('Canvas data is required');
    }

    await get().saveTemplate({
      name,
      description,
      category,
      canvas_data: canvasData,
    });
  },
}));

// Format date for display
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

// Load templates on store initialization
if (typeof window !== 'undefined') {
  // Initialize templates after a short delay to ensure Supabase is ready
  setTimeout(() => {
    useTemplateStore.getState().loadTemplates().catch(console.error);
  }, 100);
}
