'use client';

import type { DesignData, TemplateData } from '@/lib/indexedDB';
import {
  Grid3x3,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { designDB, formatDesignTitle, generateTemplateId } from '@/lib/indexedDB';
import { LoadTemplateDialog } from './components/dialogs/LoadTemplateDialog';
import { SaveTemplateDialog } from './components/dialogs/SaveTemplateDialog';
import { FileMenu } from './components/toolbar/FileMenu';
import { PreviewButton } from './components/toolbar/PreviewButton';
import { QrCodeButton } from './components/toolbar/QrCodeButton';
import { StatusIndicator } from './components/toolbar/StatusIndicator';
import { ToolbarActions } from './components/toolbar/ToolbarActions';

type DesignToolbarProps = {
  designId: string;
  locale?: string;
  canvas?: any;
  showSaveDialog?: boolean;
  setShowSaveDialog?: (show: boolean) => void;
  showLoadDialog?: boolean;
  setShowLoadDialog?: (show: boolean) => void;
  onToggleSidebar?: () => void;
  sidebarCollapsed?: boolean;
  hasUnsavedChanges?: boolean;
  lastSaved?: Date | null;
  onManualSave?: () => Promise<void>;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  guideControls?: any;
};

export function DesignToolbar({
  designId,
  locale = 'en',
  canvas,
  showSaveDialog = false,
  setShowSaveDialog,
  showLoadDialog = false,
  setShowLoadDialog,
  onToggleSidebar,
  sidebarCollapsed = false,
  hasUnsavedChanges = false,
  lastSaved = null,
  onManualSave,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  guideControls,
}: DesignToolbarProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isGuidesEnabled, setIsGuidesEnabled] = useState(true);
  const [isExporting] = useState(false);
  const [currentTemplateName, setCurrentTemplateName] = useState<string>('');

  const handleSaveTemplate = async (templateName: string, category = 'Custom', description?: string) => {
    if (!canvas) {
      toast.error('Canvas not available');
      return;
    }

    try {
      setIsSaving(true);
      const canvasData = canvas.toJSON?.(['elementType', 'buttonData', 'linkData', 'shapeData']) || {};

      // Add canvas dimensions and background
      canvasData.width = canvas.getWidth?.() || 0;
      canvasData.height = canvas.getHeight?.() || 0;
      canvasData.background = canvas.backgroundColor || '#ffffff';

      // Save directly to IndexedDB as a template
      const templateData: TemplateData = {
        id: generateTemplateId(),
        name: templateName,
        description: description || `Template created on ${new Date().toLocaleDateString()}`,
        category,
        canvasData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await designDB.saveTemplate(templateData);
      setCurrentTemplateName(templateName);
      toast.success('Template saved successfully!');
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Failed to save template');
    } finally {
      setIsSaving(false);
    }
  };

  const handleManualSave = async () => {
    if (!canvas || !onManualSave) {
      return;
    }

    try {
      await onManualSave();

      // Also save to IndexedDB for the preview functionality
      const canvasData = canvas.toJSON?.(['elementType', 'buttonData', 'linkData', 'shapeData']) || {};
      canvasData.width = canvas.getWidth?.() || 0;
      canvasData.height = canvas.getHeight?.() || 0;
      canvasData.background = canvas.backgroundColor || '#ffffff';

      const designData: DesignData = {
        id: designId,
        canvasData,
        metadata: {
          width: canvas.getWidth?.() || 0,
          height: canvas.getHeight?.() || 0,
          backgroundColor: canvas.backgroundColor || '#ffffff',
          title: `Design ${designId}`,
          description: 'Manual save from design editor',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await designDB.saveDesign(designData);
      toast.success('Design saved successfully!');
    } catch (error) {
      console.error('Error in manual save:', error);
      toast.error('Failed to save design');
    }
  };

  const handleLoadTemplate = async (templateId: string) => {
    if (!canvas) {
      toast.error('Canvas not available');
      return;
    }

    try {
      // Try to load as template first, then as design
      const templateData = await designDB.getTemplate(templateId);
      let designData = null;
      let dataToLoad = null;
      let name = '';

      if (templateData) {
        dataToLoad = templateData.canvasData;
        name = templateData.name;
      } else {
        designData = await designDB.getDesign(templateId);
        if (designData) {
          dataToLoad = designData.canvasData;
          name = formatDesignTitle(designData.id, designData.metadata.title);
        }
      }

      if (!dataToLoad) {
        toast.error('Template or design not found');
        return;
      }

      // Clear canvas first
      canvas.clear?.();

      // Set canvas dimensions if available
      if (dataToLoad?.width && dataToLoad?.height) {
        canvas.setDimensions?.({
          width: dataToLoad.width,
          height: dataToLoad.height,
        });
      }

      // Set background color
      if (dataToLoad?.background) {
        canvas.backgroundColor = dataToLoad.background;
      }

      // Load template/design data
      canvas.loadFromJSON?.(dataToLoad, () => {
        canvas.renderAll?.();
        setCurrentTemplateName(name);
        toast.success(`${templateData ? 'Template' : 'Design'} "${name}" loaded successfully!`);
      });
    } catch (error) {
      console.error('Error loading template/design:', error);
      toast.error('Failed to load template or design');
    }
  };

  // const handleExport = async (format?: string) => {
  //   if (!canvas) {
  //     toast.error('Canvas not available');
  //     return;
  //   }

  //   setIsExporting(true);
  //   try {
  //     const dataURL = canvas.toDataURL({
  //       format: format || 'png',
  //       quality: 1,
  //       multiplier: 2,
  //     });

  //     const link = document.createElement('a');
  //     link.download = `design-${designId}.${format || 'png'}`;
  //     link.href = dataURL;
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);

  //     toast.success(`Design exported as ${format?.toUpperCase() || 'PNG'}`);
  //   } catch (error) {
  //     console.error('Error exporting design:', error);
  //     toast.error('Failed to export design');
  //   } finally {
  //     setIsExporting(false);
  //   }
  // };

  const handleProceedToQrCode = () => {
    if (!canvas) {
      toast.error('Canvas not ready');
      return;
    }

    // The QrCodeButton component will handle the saving
    // This is just a backup validation
    const objects = canvas.getObjects();
    if (objects.length === 0) {
      toast.error('Canvas is empty. Add some elements before generating QR code.');
    }
  };

  const handlePreview = () => {
    // PreviewButton component handles the preview logic
  };

  const handleUndo = () => {
    if (onUndo) {
      onUndo();
    }
  };

  const handleRedo = () => {
    if (onRedo) {
      onRedo();
    }
  };

  const handleRotateLeft = () => {
    if (!canvas) {
      return;
    }
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      const currentAngle = activeObject.angle || 0;
      activeObject.rotate(currentAngle - 15);
      canvas.renderAll();
    }
  };

  const handleRotateRight = () => {
    if (!canvas) {
      return;
    }

    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      const currentAngle = activeObject.angle || 0;
      activeObject.set('angle', currentAngle + 90);
      canvas.renderAll();
    }
  };

  const toggleAlignmentGuides = () => {
    if (guideControls) {
      const newState = !isGuidesEnabled;
      setIsGuidesEnabled(newState);
      guideControls.toggleGuidelines(newState);
    }
  };

  return (
    <>
      <div className="relative flex h-16 items-center justify-between border-b border-white/20 bg-white/80 px-6 shadow-lg shadow-blue-100/20 backdrop-blur-xl">
        {/* Elegant gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-indigo-500/5"></div>

        {/* Left Section - Sidebar Toggle, File Menu and Actions */}
        <div className="relative z-10 flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="group rounded-lg p-2 text-gray-600 backdrop-blur-sm transition-all duration-200 hover:bg-white/60 hover:text-blue-600"
          >
            {sidebarCollapsed
              ? (
                  <Menu className="size-5 transition-transform duration-200 group-hover:scale-110" />
                )
              : (
                  <X className="size-5 transition-transform duration-200 group-hover:scale-110" />
                )}
          </Button>

          <div className="h-6 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent" />

          <FileMenu
            onSaveTemplate={() => setShowSaveDialog?.(true)}
            onLoadTemplate={() => setShowLoadDialog?.(true)}
            onExport={handleProceedToQrCode}
          />

          {/* Action Tools */}
          <div className="flex items-center space-x-1">
            <ToolbarActions
              onUndo={handleUndo}
              onRedo={handleRedo}
              onRotateLeft={handleRotateLeft}
              onRotateRight={handleRotateRight}
              canUndo={canUndo}
              canRedo={canRedo}
            />

            {/* Alignment Guides Toggle */}
            <Button
              onClick={toggleAlignmentGuides}
              variant={isGuidesEnabled ? 'primary' : 'outline'}
              size="sm"
              className={`flex items-center gap-2 transition-all duration-200 ${
                isGuidesEnabled
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'border-white/20 bg-white/10 hover:bg-white/20'
              }`}
              title={isGuidesEnabled ? 'Disable alignment guides' : 'Enable alignment guides'}
            >
              <Grid3x3 className="size-4" />
              {isGuidesEnabled && <span className="text-xs">ON</span>}
            </Button>
          </div>
        </div>

        {/* Center Section - Status */}
        <div className="relative z-10">
          <StatusIndicator
            currentTemplateName={currentTemplateName}
          />
        </div>

        {/* Right Section - QR Code Generation and User */}
        <div className="relative z-10 flex items-center space-x-3">
          {/* Save Status Indicator */}
          <div className="flex items-center gap-2 rounded-xl border border-white/30 bg-white/60 px-4 py-2 shadow-sm backdrop-blur-sm">
            {hasUnsavedChanges
              ? (
                  <>
                    <div className="size-2 animate-pulse rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 shadow-sm" />
                    <span className="text-sm font-medium text-gray-700">Unsaved changes</span>
                  </>
                )
              : (
                  <>
                    <div className="size-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 shadow-sm" />
                    <span className="text-sm font-medium text-gray-700">
                      {lastSaved ? `Saved ${lastSaved.toLocaleTimeString()}` : 'All changes saved'}
                    </span>
                  </>
                )}
          </div>

          {/* Manual Save Button */}
          <Button
            onClick={handleManualSave}
            variant="outline"
            size="sm"
            disabled={isSaving || !hasUnsavedChanges}
            className="border-white/40 bg-white/60 backdrop-blur-sm transition-all duration-200 hover:border-blue-200 hover:bg-white/80 disabled:opacity-50"
          >
            {isSaving
              ? (
                  <div className="flex items-center gap-2">
                    <div className="size-4 animate-spin rounded-full border-2 border-blue-300 border-t-blue-600" />
                    <span className="font-medium">Saving...</span>
                  </div>
                )
              : (
                  <span className="font-medium">Save Now</span>
                )}
          </Button>

          <PreviewButton
            canvas={canvas}
            onPreview={handlePreview}
            hasUnsavedChanges={hasUnsavedChanges}
          />

          <QrCodeButton
            designId={designId}
            locale={locale}
            disabled={isExporting}
            canvas={canvas}
          />

          <div className="h-6 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent" />

          {/* Enhanced User Avatar */}
          <div className="group relative">
            <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25 transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-blue-500/30">
              <span className="text-sm font-bold text-white">U</span>
            </div>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400/20 to-indigo-400/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <SaveTemplateDialog
        open={showSaveDialog}
        onOpenChange={setShowSaveDialog || (() => {})}
        onSave={handleSaveTemplate}
      />

      <LoadTemplateDialog
        open={showLoadDialog}
        onOpenChange={setShowLoadDialog || (() => {})}
        onLoad={handleLoadTemplate}
      />
    </>
  );
}
