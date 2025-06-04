import type { DesignData, TemplateData } from './indexedDB';
import { designDB } from './indexedDB';

export const createSampleDesigns = async () => {
  try {
    // Sample design data
    const sampleDesigns: DesignData[] = [
      {
        id: 'design_sample_1',
        canvasData: {
          version: '5.3.0',
          objects: [
            {
              type: 'i-text',
              left: 50,
              top: 50,
              width: 200,
              height: 40,
              text: 'Welcome to My Business',
              fontSize: 24,
              fontFamily: 'Arial',
              fill: '#333333',
            },
            {
              type: 'rect',
              left: 50,
              top: 120,
              width: 300,
              height: 200,
              fill: '#3b82f6',
              rx: 10,
              ry: 10,
            },
          ],
          background: '#ffffff',
          width: 400,
          height: 300,
        },
        metadata: {
          width: 400,
          height: 300,
          backgroundColor: '#ffffff',
          title: 'Business Card Design',
          description: 'A simple business card template with company name and logo area',
        },
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
      {
        id: 'design_sample_2',
        canvasData: {
          version: '5.3.0',
          objects: [
            {
              type: 'i-text',
              left: 100,
              top: 100,
              width: 300,
              height: 60,
              text: 'Social Media Post',
              fontSize: 32,
              fontFamily: 'Arial',
              fill: '#ffffff',
              textAlign: 'center',
            },
            {
              type: 'circle',
              left: 200,
              top: 200,
              radius: 80,
              fill: '#ef4444',
            },
          ],
          background: '#1f2937',
          width: 500,
          height: 500,
        },
        metadata: {
          width: 500,
          height: 500,
          backgroundColor: '#1f2937',
          title: 'Instagram Post',
          description: 'Square format social media post with dark theme',
        },
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      },
      {
        id: 'design_sample_3',
        canvasData: {
          version: '5.3.0',
          objects: [
            {
              type: 'i-text',
              left: 50,
              top: 30,
              width: 500,
              height: 40,
              text: 'Event Flyer',
              fontSize: 28,
              fontFamily: 'Arial',
              fill: '#7c3aed',
              textAlign: 'center',
            },
            {
              type: 'rect',
              left: 50,
              top: 100,
              width: 500,
              height: 300,
              fill: '#f3f4f6',
              stroke: '#7c3aed',
              strokeWidth: 3,
            },
          ],
          background: '#ffffff',
          width: 600,
          height: 800,
        },
        metadata: {
          width: 600,
          height: 800,
          backgroundColor: '#ffffff',
          title: 'Event Flyer Design',
          description: 'Vertical flyer template for events and announcements',
        },
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      },
    ];

    // Sample template data
    const sampleTemplates: TemplateData[] = [
      {
        id: 'template_business_card',
        name: 'Professional Business Card',
        description: 'Clean and professional business card template',
        category: 'Business Cards',
        canvasData: {
          version: '5.3.0',
          objects: [
            {
              type: 'i-text',
              left: 20,
              top: 20,
              width: 160,
              height: 25,
              text: 'Your Name',
              fontSize: 18,
              fontFamily: 'Arial',
              fill: '#1f2937',
              fontWeight: 'bold',
            },
            {
              type: 'i-text',
              left: 20,
              top: 50,
              width: 160,
              height: 20,
              text: 'Job Title',
              fontSize: 14,
              fontFamily: 'Arial',
              fill: '#6b7280',
            },
            {
              type: 'line',
              left: 20,
              top: 80,
              x1: 0,
              y1: 0,
              x2: 160,
              y2: 0,
              stroke: '#3b82f6',
              strokeWidth: 2,
            },
          ],
          background: '#ffffff',
          width: 350,
          height: 200,
        },
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      },
      {
        id: 'template_social_media',
        name: 'Social Media Square',
        description: 'Perfect for Instagram posts and social media',
        category: 'Social Media',
        canvasData: {
          version: '5.3.0',
          objects: [
            {
              type: 'rect',
              left: 0,
              top: 0,
              width: 500,
              height: 500,
              fill: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
            },
            {
              type: 'i-text',
              left: 250,
              top: 250,
              width: 300,
              height: 40,
              text: 'Your Message',
              fontSize: 24,
              fontFamily: 'Arial',
              fill: '#ffffff',
              textAlign: 'center',
              originX: 'center',
              originY: 'center',
            },
          ],
          background: '#ffffff',
          width: 500,
          height: 500,
        },
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
        updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
      },
      {
        id: 'template_presentation',
        name: 'Presentation Slide',
        description: 'Professional presentation slide template',
        category: 'Presentations',
        canvasData: {
          version: '5.3.0',
          objects: [
            {
              type: 'i-text',
              left: 50,
              top: 50,
              width: 600,
              height: 60,
              text: 'Slide Title',
              fontSize: 36,
              fontFamily: 'Arial',
              fill: '#1f2937',
              fontWeight: 'bold',
            },
            {
              type: 'i-text',
              left: 50,
              top: 150,
              width: 600,
              height: 200,
              text: 'Your content goes here. This is a placeholder for your presentation content.',
              fontSize: 18,
              fontFamily: 'Arial',
              fill: '#374151',
              lineHeight: 1.5,
            },
          ],
          background: '#f9fafb',
          width: 800,
          height: 600,
        },
        createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), // 12 days ago
        updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
      },
    ];

    // Save sample designs
    for (const design of sampleDesigns) {
      await designDB.saveDesign(design);
    }

    // Save sample templates
    for (const template of sampleTemplates) {
      await designDB.saveTemplate(template);
    }

    return {
      designsCreated: sampleDesigns.length,
      templatesCreated: sampleTemplates.length,
    };
  } catch (error) {
    console.error('Error creating sample designs:', error);
    throw error;
  }
};

export const clearAllDesigns = async () => {
  try {
    await designDB.clearAll();
  } catch (error) {
    console.error('Error clearing designs:', error);
    throw error;
  }
};

// Helper function to check if sample data exists
export const hasSampleData = async () => {
  try {
    const [designs, templates] = await Promise.all([
      designDB.getAllDesigns(),
      designDB.getAllTemplates(),
    ]);

    return {
      hasDesigns: designs.length > 0,
      hasTemplates: templates.length > 0,
      totalDesigns: designs.length,
      totalTemplates: templates.length,
    };
  } catch (error) {
    console.error('Error checking sample data:', error);
    return {
      hasDesigns: false,
      hasTemplates: false,
      totalDesigns: 0,
      totalTemplates: 0,
    };
  }
};
