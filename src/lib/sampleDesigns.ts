import { designService } from '@/services/designService';
import { templateService } from '@/services/templateService';

// Sample design data for testing and development
export const sampleDesigns = [
  {
    id: 'sample-design-1',
    name: 'Modern Business Card',
    description: 'A clean and professional business card design',
    type: 'business-card',
    width: 350,
    height: 200,
    backgroundColor: '#ffffff',
    canvas_data: {
      version: '5.3.0',
      objects: [
        {
          type: 'rect',
          left: 0,
          top: 0,
          width: 350,
          height: 200,
          fill: '#ffffff',
          stroke: '#e0e0e0',
          strokeWidth: 1,
        },
        {
          type: 'text',
          left: 25,
          top: 30,
          fontSize: 24,
          fontWeight: 'bold',
          fill: '#2563eb',
          text: 'John Doe',
        },
        {
          type: 'text',
          left: 25,
          top: 65,
          fontSize: 14,
          fill: '#6b7280',
          text: 'Software Engineer',
        },
        {
          type: 'text',
          left: 25,
          top: 90,
          fontSize: 12,
          fill: '#9ca3af',
          text: 'john.doe@example.com',
        },
        {
          type: 'text',
          left: 25,
          top: 110,
          fontSize: 12,
          fill: '#9ca3af',
          text: '+1 (555) 123-4567',
        },
      ],
    },
    is_template: false,
    is_public: true,
  },
  {
    id: 'sample-design-2',
    name: 'Event Flyer',
    description: 'An eye-catching event promotion flyer',
    type: 'flyer',
    width: 600,
    height: 800,
    backgroundColor: '#f3f4f6',
    canvas_data: {
      version: '5.3.0',
      objects: [
        {
          type: 'rect',
          left: 0,
          top: 0,
          width: 600,
          height: 800,
          fill: '#f3f4f6',
        },
        {
          type: 'rect',
          left: 50,
          top: 50,
          width: 500,
          height: 700,
          fill: '#ffffff',
          rx: 10,
          ry: 10,
        },
        {
          type: 'text',
          left: 300,
          top: 120,
          fontSize: 36,
          fontWeight: 'bold',
          fill: '#dc2626',
          text: 'SUMMER FESTIVAL',
          textAlign: 'center',
          originX: 'center',
        },
        {
          type: 'text',
          left: 300,
          top: 180,
          fontSize: 18,
          fill: '#374151',
          text: 'Join us for an amazing celebration!',
          textAlign: 'center',
          originX: 'center',
        },
        {
          type: 'text',
          left: 300,
          top: 250,
          fontSize: 24,
          fontWeight: 'bold',
          fill: '#059669',
          text: 'July 15-17, 2024',
          textAlign: 'center',
          originX: 'center',
        },
      ],
    },
    is_template: false,
    is_public: true,
  },
];

// Sample template data
export const sampleTemplates = [
  {
    id: 'template-business-card',
    name: 'Business Card Template',
    description: 'Professional business card template with modern design',
    category: 'Business',
    canvas_data: {
      version: '5.3.0',
      objects: [
        {
          type: 'rect',
          left: 0,
          top: 0,
          width: 350,
          height: 200,
          fill: '#ffffff',
          stroke: '#e0e0e0',
          strokeWidth: 1,
        },
        {
          type: 'text',
          left: 25,
          top: 30,
          fontSize: 24,
          fontWeight: 'bold',
          fill: '#2563eb',
          text: 'Your Name',
        },
        {
          type: 'text',
          left: 25,
          top: 65,
          fontSize: 14,
          fill: '#6b7280',
          text: 'Your Title',
        },
        {
          type: 'text',
          left: 25,
          top: 90,
          fontSize: 12,
          fill: '#9ca3af',
          text: 'your.email@example.com',
        },
        {
          type: 'text',
          left: 25,
          top: 110,
          fontSize: 12,
          fill: '#9ca3af',
          text: '+1 (555) 123-4567',
        },
      ],
    },
    is_template: true,
    is_public: true,
  },
  {
    id: 'template-social-media',
    name: 'Social Media Post',
    description: 'Instagram and Facebook post template',
    category: 'Social Media',
    canvas_data: {
      version: '5.3.0',
      objects: [
        {
          type: 'rect',
          left: 0,
          top: 0,
          width: 1080,
          height: 1080,
          fill: '#f8fafc',
        },
        {
          type: 'rect',
          left: 40,
          top: 40,
          width: 1000,
          height: 1000,
          fill: '#ffffff',
          rx: 20,
          ry: 20,
        },
        {
          type: 'text',
          left: 540,
          top: 200,
          fontSize: 48,
          fontWeight: 'bold',
          fill: '#1e40af',
          text: 'Your Post Title',
          textAlign: 'center',
          originX: 'center',
        },
        {
          type: 'text',
          left: 540,
          top: 300,
          fontSize: 24,
          fill: '#374151',
          text: 'Add your content here',
          textAlign: 'center',
          originX: 'center',
        },
      ],
    },
    is_template: true,
    is_public: true,
  },
];

// Function to populate the database with sample data
export async function populateWithSampleData() {
  try {
    // Create sample designs
    for (const design of sampleDesigns) {
      const createdDesign = await designService.createDesign(design);
      if (!createdDesign) {
        // Handle failed design creation silently
      }
    }

    // Create sample templates
    for (const template of sampleTemplates) {
      const createdTemplate = await templateService.createTemplate(template);
      if (!createdTemplate) {
        // Handle failed template creation silently
      }
    }
  } catch {
    // Handle errors silently
  }
}

// Function to clear all sample data
export async function clearSampleData() {
  try {
    // Get all designs and templates
    const [designs, templates] = await Promise.all([
      designService.getUserDesigns(),
      templateService.getUserTemplates(),
    ]);

    // Delete sample designs
    for (const design of designs) {
      if (design.name.includes('Sample') || design.name.includes('sample')) {
        await designService.deleteDesign(design.id);
      }
    }

    // Delete sample templates
    for (const template of templates) {
      if (template.name.includes('Template') || template.name.includes('template')) {
        await templateService.deleteTemplate(template.id);
      }
    }
  } catch {
    // Handle errors silently
  }
}

// Function to get all sample data for display
export async function getAllSampleData() {
  try {
    const [designs, templates] = await Promise.all([
      designService.getUserDesigns(),
      templateService.getUserTemplates(),
    ]);

    return {
      designs,
      templates,
    };
  } catch {
    return {
      designs: [],
      templates: [],
    };
  }
}
