'use client';

import {
  Image,
  Settings,
  Shapes,
  Sparkles,
  Type,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
  SidebarRail,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { CanvasSettings } from './CanvasSettings';
import { BackgroundsPanel } from './components/sidebar/BackgroundsPanel';
import { ShapesPanel } from './components/sidebar/ShapesPanel';
import { SidebarSection } from './components/sidebar/SidebarSection';
import { useFabricOperations } from './hooks/useFabricOperations';
import { ImageUpload } from './ImageUpload';

// Dynamic fabric loading with error handling
let fabric: any = null;
let fabricLoaded = false;

const loadFabric = async () => {
  if (!fabricLoaded) {
    try {
      const fabricModule = await import('fabric');
      fabric = fabricModule.fabric;
      fabricLoaded = true;
    } catch {
      // Fabric loading failed - will be handled by fabric readiness check
    }
  }
  return fabric;
};

type DesignSidebarProviderProps = {
  canvas: any;
  children: React.ReactNode;
};

const sidebarSections = [
  {
    id: 'elements',
    label: 'Elements',
    icon: Shapes,
    description: 'Shapes & graphics',
    items: [
      { id: 'shapes', label: 'Shapes', icon: Shapes, description: 'Basic shapes' },
      { id: 'lines', label: 'Lines', icon: Shapes, description: 'Lines & arrows' },
      { id: 'icons', label: 'Icons', icon: Shapes, description: 'Icon library' },
      { id: 'stickers', label: 'Stickers', icon: Shapes, description: 'Fun stickers' },
    ],
  },
  {
    id: 'text',
    label: 'Text',
    icon: Type,
    description: 'Typography tools',
    items: [
      { id: 'add-text', label: 'Add a heading', icon: Type, description: 'Large title text' },
      { id: 'add-subheading', label: 'Add a subheading', icon: Type, description: 'Medium subtitle' },
      { id: 'add-body', label: 'Add body text', icon: Type, description: 'Regular paragraph' },
    ],
  },
  {
    id: 'images',
    label: 'Images',
    icon: Image,
    description: 'Photos & graphics',
    items: [
      { id: 'upload', label: 'Upload images', icon: Image, description: 'Your photos' },
      { id: 'search', label: 'Search images', icon: Image, description: 'Stock photos' },
      { id: 'photos', label: 'Photos', icon: Image, description: 'Photo library' },
    ],
  },
  {
    id: 'ai',
    label: 'AI',
    icon: Sparkles,
    description: 'AI-powered tools',
    items: [
      { id: 'ai-generate', label: 'Generate with AI', icon: Sparkles, description: 'Create with AI' },
      { id: 'ai-enhance', label: 'Enhance image', icon: Sparkles, description: 'Improve quality' },
      { id: 'ai-remove-bg', label: 'Remove background', icon: Sparkles, description: 'Auto remove BG' },
    ],
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    description: 'Canvas settings',
    items: [
      { id: 'canvas-settings', label: 'Canvas settings', icon: Settings, description: 'Size & format' },
      { id: 'export-settings', label: 'Export settings', icon: Settings, description: 'Download options' },
    ],
  },
];

export function DesignSidebarProvider({ canvas, children }: DesignSidebarProviderProps) {
  const [activeSection, setActiveSection] = useState<string>('elements');
  const [fabricReady, setFabricReady] = useState(false);
  const fabricInitialized = useRef(false);

  // Load fabric on mount only once
  useEffect(() => {
    if (!fabricInitialized.current) {
      fabricInitialized.current = true;
      const initFabric = async () => {
        await loadFabric();
        setFabricReady(!!fabric);
      };
      initFabric();
    }
  }, []);

  // Monitor canvas readiness only when canvas or fabricReady changes
  useEffect(() => {
    if (canvas && fabricReady) {
      // Canvas and fabric are ready for operations
    }
  }, [canvas, fabricReady]);

  // Use custom hook for fabric operations
  const { handleAddText, handleAddShape, handleBackgroundChange } = useFabricOperations({
    canvas,
    fabric,
    fabricReady,
  });

  const handleItemClick = (sectionId: string, itemId: string) => {
    if (sectionId === 'text') {
      handleAddText(itemId);
    } else if (sectionId === 'elements' && itemId === 'shapes') {
      setActiveSection('shapes');
    } else if (sectionId === 'images') {
      setActiveSection('images');
    } else if (sectionId === 'settings') {
      setActiveSection('settings');
    } else {
      // Handle other section/item combinations
    }
  };

  const renderSectionContent = () => {
    const section = sidebarSections.find(s => s.id === activeSection);

    // Always return a consistent wrapper to maintain DOM stability
    return (
      <div key={`section-content-${activeSection}`} className="flex-1 overflow-hidden">
        {/* Special content sections */}
        {activeSection === 'shapes' && (
          <div className="p-4">
            <ShapesPanel onAddShape={handleAddShape} />
          </div>
        )}

        {activeSection === 'backgrounds' && (
          <div className="p-4">
            <BackgroundsPanel onBackgroundChange={handleBackgroundChange} />
          </div>
        )}

        {activeSection === 'images' && (
          <div className="p-4">
            <SidebarSection title="Images">
              <ImageUpload canvas={canvas} />
            </SidebarSection>
          </div>
        )}

        {activeSection === 'settings' && (
          <div className="p-4">
            <SidebarSection title="Settings">
              <CanvasSettings canvas={canvas} />
            </SidebarSection>
          </div>
        )}

        {/* Default section content */}
        {section && !['shapes', 'backgrounds', 'images', 'settings'].includes(activeSection) && (
          <div className="p-4">
            <div className="mb-6">
              <h3 className="mb-2 text-lg font-semibold text-primary">{section.label}</h3>
              <p className="text-sm text-muted-foreground">{section.description}</p>
            </div>
            <div className="space-y-2">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleItemClick(section.id, item.id)}
                    className="w-full rounded-lg p-3 text-left transition-colors hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="size-4 text-gray-500" />
                      <div>
                        <span className="text-sm font-medium">{item.label}</span>
                        <p className="text-xs text-gray-500">{item.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <SidebarProvider>
      <Sidebar className="border-r border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <SidebarContent className="flex flex-col">
          {/* Header */}
          <div className="border-b border-border/50 p-4">
            <h2 className="text-lg font-semibold text-primary">Design Tools</h2>
            <p className="text-sm text-muted-foreground">Create amazing designs</p>
          </div>

          {/* Main Navigation */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <div className="space-y-1">
                {sidebarSections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() => setActiveSection(section.id)}
                      className={cn(
                        'w-full p-4 text-left rounded-lg transition-colors',
                        activeSection === section.id
                          ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500'
                          : 'bg-white hover:bg-gray-50',
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="size-5" />
                        <div>
                          <span className="font-medium">{section.label}</span>
                          <p className="text-sm text-gray-600">{section.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dynamic Content */}
            {renderSectionContent()}
          </div>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      {children}
    </SidebarProvider>
  );
}
