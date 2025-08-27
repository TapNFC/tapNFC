'use client';

import {
  ChevronRight,
  Image,
  Palette,
  Settings,
  Shapes,
  Type,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CanvasSettings } from './CanvasSettings';
import { BackgroundsPanel } from './components/sidebar/BackgroundsPanel';
import { ElementsPanel } from './components/sidebar/ElementsPanel';
import { SidebarSection } from './components/sidebar/SidebarSection';
import { useFabricOperations } from './hooks/useFabricOperations';
import { ImageUpload } from './ImageUpload';

import './sidebar-animations.css';

// Import fabric properly with error handling
let fabric: any = null;
let fabricLoaded = false;

const loadFabric = async () => {
  if (typeof window !== 'undefined' && !fabricLoaded) {
    try {
      const fabricModule = await import('fabric');
      fabric = fabricModule.fabric;
      fabricLoaded = true;
    } catch (error) {
      console.error('Failed to load Fabric.js in sidebar:', error);
    }
  }
  return fabric;
};

// Use the same type definition for BackgroundInput as used in useFabricOperations
type FabricColorStop = { offset: number; color: string };
type FabricGradientOption = {
  type: 'linear';
  colorStops: FabricColorStop[];
};

type BackgroundInput = string | { type: 'gradient'; value: FabricGradientOption };

type DesignSidebarProps = {
  canvas: any;
  collapsed: boolean;
  _onToggle: () => void;
  designId?: string;
  locale?: string;
};

export function DesignSidebar({ canvas, collapsed, designId, locale }: Omit<DesignSidebarProps, '_onToggle'>) {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [fabricReady, setFabricReady] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const fabricInitialized = useRef(false);

  // Memoize the static sidebar sections array to prevent recreation on every render
  const sidebarSections = useMemo(() => [
    {
      id: 'backgrounds',
      label: 'Background',
      icon: Palette,
      gradient: 'from-indigo-500 to-purple-600',
      description: 'Colors & patterns',
      items: [
        { id: 'colors', label: 'Colors', icon: Palette, description: 'Solid colors' },
        { id: 'gradients', label: 'Gradients', icon: Palette, description: 'Color gradients' },
        { id: 'patterns', label: 'Patterns', icon: Palette, description: 'Texture patterns' },
      ],
    },
    {
      id: 'elements',
      label: 'Elements',
      icon: Shapes,
      gradient: 'from-blue-500 to-cyan-600',
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
      gradient: 'from-emerald-500 to-teal-600',
      description: 'Typography tools',
      items: [
        { id: 'add-text', label: 'Heading', icon: Type },
        { id: 'add-subheading', label: 'Subheading', icon: Type },
        { id: 'add-body', label: 'Body Text', icon: Type },
      ],
    },
    {
      id: 'images',
      label: 'Images',
      icon: Image,
      gradient: 'from-orange-500 to-red-600',
      description: 'Photos & graphics',
      items: [
        { id: 'upload', label: 'Upload', icon: Image, description: 'Your photos' },
        { id: 'search', label: 'Search', icon: Image, description: 'Stock photos' },
        { id: 'photos', label: 'Photos', icon: Image, description: 'Photo library' },
      ],
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      gradient: 'from-slate-500 to-gray-600',
      description: 'Canvas settings',
      items: [
        { id: 'canvas-settings', label: 'Canvas', icon: Settings, description: 'Size & format' },
        { id: 'export-settings', label: 'Export', icon: Settings, description: 'Download options' },
      ],
    },
  ], []);

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

  // Use custom hook for fabric operations
  const {
    handleAddText,
    handleAddShape,
    handleBackgroundChange,
    handleAddButton,
    handleAddLink,
    handleAddSocialIcon,
  } = useFabricOperations({
    canvas,
    fabric,
    fabricReady,
  });

  // Memoize callbacks to prevent recreation on every render
  const memoizedHandleBackgroundChange = useCallback((background: BackgroundInput) => {
    handleBackgroundChange(background);
  }, [handleBackgroundChange]);

  const memoizedHandleAddSocialIcon = useCallback((iconPath: string, iconName: string, svgCode?: string) => {
    handleAddSocialIcon(iconPath, iconName, svgCode);
  }, [handleAddSocialIcon]);

  const handleSectionClick = useCallback((sectionId: string) => {
    if (isAnimating) {
      return;
    } // Prevent clicks during animation

    setIsAnimating(true);

    if (activeSection === sectionId) {
      setActiveSection(null); // Close if already open
    } else {
      setActiveSection(sectionId); // Open the clicked section
    }

    // Reset animation state after transition completes
    setTimeout(() => setIsAnimating(false), 400);
  }, [isAnimating, activeSection]);

  const handleItemClick = useCallback((sectionId: string, itemId: string) => {
    if (sectionId === 'text') {
      handleAddText(itemId);
    } else if (sectionId === 'elements' && itemId === 'shapes') {
      // Keep the shapes panel open for interaction
    } else if (sectionId === 'backgrounds') {
      // Keep backgrounds panel open
    } else if (sectionId === 'images') {
      // Keep images panel open
    } else if (sectionId === 'settings') {
      // Keep settings panel open
    }
  }, [handleAddText]);

  // Memoize the detail panel rendering to prevent unnecessary re-renders
  const renderDetailPanel = useCallback(() => {
    if (!activeSection) {
      return null;
    }

    const section = sidebarSections.find(s => s.id === activeSection);
    if (!section) {
      return null;
    }

    return (
      <div className="flex w-80 flex-col border-r border-white/20 bg-white/80 shadow-lg shadow-blue-100/20 backdrop-blur-xl">
        {/* Header */}
        <div className="relative border-b border-white/30 p-4">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-indigo-500/5" />

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-3 shadow-lg shadow-blue-500/25">
                <section.icon className="size-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{section.label}</h3>
                <p className="text-sm text-gray-600">{section.description || 'Customize your design'}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveSection(null)}
              className="group size-8 rounded-lg p-0 text-gray-500 transition-all duration-200 hover:bg-white/60 hover:text-blue-600"
            >
              <ChevronRight className="size-4 rotate-180 transition-transform duration-200 group-hover:scale-110" />
            </Button>
          </div>
        </div>

        {/* Detail Panel Content */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-b from-transparent to-blue-50/20">
          {/* Special content sections */}
          {activeSection === 'backgrounds' && (
            <div
              className="space-y-6 transition-all  delay-200 duration-300 ease-out"
              style={{
                animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both',
              }}
            >
              {/* Backgrounds panel */}
              <div className="rounded-2xl border border-white/30 bg-white/70 p-6 shadow-lg shadow-blue-100/20 backdrop-blur-sm">
                <SidebarSection title="Backgrounds">
                  <BackgroundsPanel
                    onBackgroundChange={memoizedHandleBackgroundChange}
                    currentBackground={canvas?.backgroundColor || '#ffffff'}
                  />
                </SidebarSection>
              </div>
            </div>
          )}

          {activeSection === 'elements' && (
            <div
              className="space-y-6 transition-all  delay-200 duration-300 ease-out"
              style={{
                animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both',
              }}
            >
              {/* Elements panel with buttons, links, and shapes */}
              <div className="rounded-2xl border border-white/30 bg-white/70 p-6 shadow-lg shadow-blue-100/20 backdrop-blur-sm">
                <ElementsPanel
                  onAddShape={handleAddShape}
                  onAddLink={handleAddLink}
                  onAddSocialIcon={memoizedHandleAddSocialIcon}
                />
              </div>
            </div>
          )}

          {activeSection === 'text' && (
            <div
              className="transition-all delay-200 duration-300 ease-out"
              style={{
                animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both',
              }}
            >
              <div className="space-y-4">
                {section.items.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleItemClick(section.id, item.id)}
                      className="group relative w-full overflow-hidden rounded-2xl border border-white/30 bg-white/70 p-4 text-left shadow-lg shadow-blue-100/20 backdrop-blur-sm transition-all duration-300 hover:bg-white/80 hover:shadow-xl hover:shadow-blue-100/30"
                      style={{
                        animation: `fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${0.3 + index * 0.1}s both`,
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-teal-500/5 opacity-0 transition-all duration-300 group-hover:opacity-100" />
                      <div className="relative flex items-center gap-4">
                        <div className="rounded-xl bg-gradient-to-br from-green-100 to-teal-100 p-3 shadow-md transition-all duration-300 group-hover:scale-110 group-hover:from-green-200 group-hover:to-teal-200">
                          <Icon className="size-5 text-green-600 transition-transform duration-300 group-hover:scale-110" />
                        </div>
                        <div>
                          <span className="font-semibold text-gray-900 transition-colors group-hover:text-green-700">{item.label}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {activeSection === 'images' && (
            <div
              className="transition-all delay-200 duration-300 ease-out"
              style={{
                animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both',
              }}
            >
              <div className="rounded-2xl border border-white/30 bg-white/70 p-6 shadow-lg shadow-blue-100/20 backdrop-blur-sm">
                <SidebarSection title="Images">
                  <ImageUpload canvas={canvas} />
                </SidebarSection>
              </div>
            </div>
          )}

          {activeSection === 'settings' && (
            <div
              className="transition-all  delay-200 duration-300 ease-out"
              style={{
                animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both',
              }}
            >
              <div className="rounded-2xl border border-white/30 bg-white/70 p-6 shadow-lg shadow-blue-100/20 backdrop-blur-sm">
                <SidebarSection title="Settings">
                  <CanvasSettings canvas={canvas} designId={designId} locale={locale} />
                </SidebarSection>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }, [activeSection, sidebarSections, canvas, memoizedHandleBackgroundChange, handleAddShape, handleAddButton, handleAddLink, memoizedHandleAddSocialIcon, handleItemClick, designId, locale]);

  if (collapsed) {
    return null;
  }

  return (
    <div className="flex h-full">
      {/* Main Sidebar */}
      <div className="relative flex w-24 flex-col items-center space-y-2 border-r border-white/20 bg-white/80 py-6 shadow-lg shadow-blue-100/20 backdrop-blur-xl">
        {/* Elegant background elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-purple-500/5 to-indigo-500/5"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent_50%)]" />

        {/* Sidebar Items */}
        <div className="relative z-10 flex flex-col space-y-3">
          {sidebarSections.map((section, index) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;

            return (
              <button
                key={section.id}
                type="button"
                onClick={() => handleSectionClick(section.id)}
                className={cn(
                  'group relative flex size-14 items-center justify-center rounded-xl transition-all duration-300',
                  isActive
                    ? 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25 scale-105'
                    : 'bg-white/60 backdrop-blur-sm border border-white/30 hover:bg-white/80 hover:scale-105 hover:shadow-md shadow-sm',
                )}
                title={section.label}
                style={{
                  animation: `fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s both`,
                }}
              >
                {/* Background gradient for active state */}
                {isActive && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400/20 to-indigo-400/20"></div>
                )}

                {/* Hover gradient overlay */}
                {!isActive && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                )}

                <Icon
                  className={cn(
                    'size-6 transition-all duration-300 group-hover:scale-110',
                    isActive ? 'text-white' : 'text-gray-600 group-hover:text-blue-600',
                  )}
                />

                {/* Active indicator */}
                {isActive && (
                  <div className="absolute -right-1 top-1/2 h-8 w-1 -translate-y-1/2 rounded-full bg-white shadow-sm"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Detail Panel */}
      {renderDetailPanel()}
    </div>
  );
}
