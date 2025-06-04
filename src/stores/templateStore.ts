import type { TemplateData } from '@/lib/indexedDB';
import { create } from 'zustand';
import { designDB } from '@/lib/indexedDB';

export type Template = {
  id: string;
  name: string;
  description?: string;
  category: string;
  data: any;
  createdAt: Date;
  updatedAt: Date;
};

type TemplateState = {
  templates: Template[];
  isLoading: boolean;
  error: string | null;
  loadTemplates: () => Promise<void>;
  saveTemplate: (template: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
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
      const templatesData = await designDB.getAllTemplates();
      const templates = templatesData.map((templateData): Template => ({
        id: templateData.id,
        name: templateData.name,
        description: templateData.description,
        category: templateData.category,
        data: templateData.canvasData,
        createdAt: templateData.createdAt,
        updatedAt: templateData.updatedAt,
      }));
      set({ templates, isLoading: false });
    } catch (error) {
      console.error('Failed to load templates:', error);
      set({ error: 'Failed to load templates', isLoading: false });
    }
  },

  saveTemplate: async (template) => {
    set({ isLoading: true, error: null });
    try {
      const templateData: TemplateData = {
        id: generateTemplateId(),
        name: template.name,
        description: template.description,
        category: template.category,
        canvasData: template.data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await designDB.saveTemplate(templateData);

      // Add to local state
      const newTemplate: Template = {
        id: templateData.id,
        name: templateData.name,
        description: templateData.description,
        category: templateData.category,
        data: templateData.canvasData,
        createdAt: templateData.createdAt,
        updatedAt: templateData.updatedAt,
      };

      set(state => ({
        templates: [...state.templates, newTemplate],
        isLoading: false,
      }));
    } catch (error) {
      console.error('Failed to save template:', error);
      set({ error: 'Failed to save template', isLoading: false });
      throw error;
    }
  },

  deleteTemplate: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await designDB.deleteTemplate(id);
      set(state => ({
        templates: state.templates.filter(t => t.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      console.error('Failed to delete template:', error);
      set({ error: 'Failed to delete template', isLoading: false });
      throw error;
    }
  },

  getTemplate: async (id) => {
    try {
      const templateData = await designDB.getTemplate(id);
      if (!templateData) {
        return null;
      }

      return {
        id: templateData.id,
        name: templateData.name,
        description: templateData.description,
        category: templateData.category,
        data: templateData.canvasData,
        createdAt: templateData.createdAt,
        updatedAt: templateData.updatedAt,
      };
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
      data: canvasData,
    });
  },
}));

// Generate a unique template ID
function generateTemplateId(): string {
  return `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

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
  // Initialize templates after a short delay to ensure IndexedDB is ready
  setTimeout(() => {
    useTemplateStore.getState().loadTemplates().catch(console.error);
  }, 100);
}
