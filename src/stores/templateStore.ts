import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Template = {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  canvasData: any; // Fabric.js canvas JSON data
  createdAt: Date | string;
  updatedAt: Date | string;
  category: string;
  tags: string[];
};

type TemplateStore = {
  templates: Template[];
  currentTemplate: Template | null;
  addTemplate: (template: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTemplate: (id: string, updates: Partial<Template>) => void;
  deleteTemplate: (id: string) => void;
  loadTemplate: (id: string) => Template | null;
  setCurrentTemplate: (template: Template | null) => void;
  saveCurrentTemplate: (canvasData: any, name?: string) => void;
};

// Helper function to format dates consistently
const formatDate = (date: Date | string): string => {
  try {
    if (typeof date === 'string') {
      return new Date(date).toLocaleDateString();
    }
    return date.toLocaleDateString();
  } catch {
    return 'Invalid Date';
  }
};

// Helper function to ensure date is a Date object
const ensureDate = (date: Date | string): Date => {
  if (typeof date === 'string') {
    return new Date(date);
  }
  return date;
};

// Dummy templates for testing
const dummyTemplates: Template[] = [
  {
    id: 'template-1',
    name: 'Business Card Template',
    description: 'Professional business card design with company logo placeholder',
    thumbnail: '/api/placeholder/300/200',
    category: 'Business',
    tags: ['business', 'professional', 'card'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    canvasData: {
      version: '5.3.0',
      objects: [
        {
          type: 'rect',
          left: 50,
          top: 50,
          width: 300,
          height: 180,
          fill: '#ffffff',
          stroke: '#cccccc',
          strokeWidth: 2,
          rx: 10,
          ry: 10,
        },
        {
          type: 'i-text',
          left: 70,
          top: 80,
          text: 'John Doe',
          fontSize: 24,
          fontFamily: 'Arial',
          fontWeight: 'bold',
          fill: '#333333',
        },
        {
          type: 'i-text',
          left: 70,
          top: 110,
          text: 'Senior Developer',
          fontSize: 16,
          fontFamily: 'Arial',
          fill: '#666666',
        },
        {
          type: 'i-text',
          left: 70,
          top: 140,
          text: 'john.doe@company.com',
          fontSize: 14,
          fontFamily: 'Arial',
          fill: '#0066cc',
        },
        {
          type: 'i-text',
          left: 70,
          top: 160,
          text: '+1 (555) 123-4567',
          fontSize: 14,
          fontFamily: 'Arial',
          fill: '#333333',
        },
      ],
    },
  },
  {
    id: 'template-2',
    name: 'Event Poster',
    description: 'Colorful event poster with bold typography',
    thumbnail: '/api/placeholder/300/400',
    category: 'Marketing',
    tags: ['event', 'poster', 'marketing'],
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
    canvasData: {
      version: '5.3.0',
      objects: [
        {
          type: 'rect',
          left: 0,
          top: 0,
          width: 400,
          height: 600,
          fill: '#ff6b6b',
          stroke: null,
          strokeWidth: 0,
        },
        {
          type: 'i-text',
          left: 200,
          top: 100,
          text: 'SUMMER FESTIVAL',
          fontSize: 36,
          fontFamily: 'Impact',
          fontWeight: 'bold',
          fill: '#ffffff',
          textAlign: 'center',
          originX: 'center',
        },
        {
          type: 'i-text',
          left: 200,
          top: 160,
          text: 'July 15-17, 2024',
          fontSize: 24,
          fontFamily: 'Arial',
          fill: '#ffffff',
          textAlign: 'center',
          originX: 'center',
        },
        {
          type: 'circle',
          left: 150,
          top: 250,
          radius: 50,
          fill: '#ffd93d',
          stroke: '#ffffff',
          strokeWidth: 4,
        },
        {
          type: 'i-text',
          left: 200,
          top: 400,
          text: 'Central Park\nNew York City',
          fontSize: 20,
          fontFamily: 'Arial',
          fill: '#ffffff',
          textAlign: 'center',
          originX: 'center',
        },
      ],
    },
  },
  {
    id: 'template-3',
    name: 'Social Media Post',
    description: 'Instagram-ready social media post template',
    thumbnail: '/api/placeholder/400/400',
    category: 'Social Media',
    tags: ['instagram', 'social', 'square'],
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25'),
    canvasData: {
      version: '5.3.0',
      objects: [
        {
          type: 'rect',
          left: 0,
          top: 0,
          width: 400,
          height: 400,
          fill: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
          stroke: null,
          strokeWidth: 0,
        },
        {
          type: 'i-text',
          left: 200,
          top: 150,
          text: 'Follow Your Dreams',
          fontSize: 32,
          fontFamily: 'Georgia',
          fontWeight: 'bold',
          fill: '#ffffff',
          textAlign: 'center',
          originX: 'center',
        },
        {
          type: 'i-text',
          left: 200,
          top: 200,
          text: 'Make it happen',
          fontSize: 18,
          fontFamily: 'Georgia',
          fontStyle: 'italic',
          fill: '#ffffff',
          textAlign: 'center',
          originX: 'center',
        },
        {
          type: 'rect',
          left: 50,
          top: 300,
          width: 300,
          height: 2,
          fill: '#ffffff',
          stroke: null,
          strokeWidth: 0,
        },
      ],
    },
  },
];

export const useTemplateStore = create<TemplateStore>()(
  persist(
    (set, get) => ({
      templates: dummyTemplates,
      currentTemplate: null,

      addTemplate: (templateData) => {
        const newTemplate: Template = {
          ...templateData,
          id: `template-${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set(state => ({
          templates: [...state.templates, newTemplate],
        }));
      },

      updateTemplate: (id, updates) => {
        set(state => ({
          templates: state.templates.map(template =>
            template.id === id
              ? { ...template, ...updates, updatedAt: new Date() }
              : template,
          ),
        }));
      },

      deleteTemplate: (id) => {
        set(state => ({
          templates: state.templates.filter(template => template.id !== id),
          currentTemplate: state.currentTemplate?.id === id ? null : state.currentTemplate,
        }));
      },

      loadTemplate: (id) => {
        const template = get().templates.find(t => t.id === id);
        if (template) {
          // Ensure dates are Date objects
          const normalizedTemplate = {
            ...template,
            createdAt: ensureDate(template.createdAt),
            updatedAt: ensureDate(template.updatedAt),
          };
          set({ currentTemplate: normalizedTemplate });
          return normalizedTemplate;
        }
        return null;
      },

      setCurrentTemplate: (template) => {
        if (template) {
          // Ensure dates are Date objects
          const normalizedTemplate = {
            ...template,
            createdAt: ensureDate(template.createdAt),
            updatedAt: ensureDate(template.updatedAt),
          };
          set({ currentTemplate: normalizedTemplate });
        } else {
          set({ currentTemplate: null });
        }
      },

      saveCurrentTemplate: (canvasData, name) => {
        const { currentTemplate } = get();
        if (currentTemplate) {
          // Update existing template
          get().updateTemplate(currentTemplate.id, {
            canvasData,
            ...(name && { name }),
          });
        } else if (name) {
          // Create new template
          get().addTemplate({
            name,
            description: 'Custom template',
            thumbnail: '/api/placeholder/300/200',
            category: 'Custom',
            tags: ['custom'],
            canvasData,
          });
        }
      },
    }),
    {
      name: 'template-store',
      // Transform dates when persisting/rehydrating
      partialize: state => ({
        ...state,
        templates: state.templates.map(template => ({
          ...template,
          createdAt: template.createdAt instanceof Date ? template.createdAt.toISOString() : template.createdAt,
          updatedAt: template.updatedAt instanceof Date ? template.updatedAt.toISOString() : template.updatedAt,
        })),
        currentTemplate: state.currentTemplate
          ? {
              ...state.currentTemplate,
              createdAt: state.currentTemplate.createdAt instanceof Date ? state.currentTemplate.createdAt.toISOString() : state.currentTemplate.createdAt,
              updatedAt: state.currentTemplate.updatedAt instanceof Date ? state.currentTemplate.updatedAt.toISOString() : state.currentTemplate.updatedAt,
            }
          : null,
      }),
    },
  ),
);

// Export the helper function for use in components
export { formatDate };
