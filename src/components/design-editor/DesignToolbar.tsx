'use client';

import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useTemplateStore } from '@/stores/templateStore';
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
}: DesignToolbarProps) {
  const [isSaving, setIsSaving] = useState(false);

  const {
    currentTemplate,
    saveCurrentTemplate,
    loadTemplate,
  } = useTemplateStore();

  const handleSaveTemplate = async (templateName: string) => {
    if (!canvas) {
      return;
    }

    try {
      setIsSaving(true);
      const canvasData = canvas.toJSON(['elementType', 'buttonData', 'linkData']);
      saveCurrentTemplate(canvasData, templateName);
      console.warn('Template saved successfully:', templateName);
    } catch (error) {
      console.error('Error saving template:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const handleManualSave = async () => {
    if (onManualSave) {
      try {
        setIsSaving(true);
        await onManualSave();
      } catch (error) {
        console.error('Error during manual save:', error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleLoadTemplate = async (templateId: string) => {
    if (!canvas) {
      return;
    }

    try {
      const template = loadTemplate(templateId);
      if (template && template.canvasData) {
        canvas.loadFromJSON(template.canvasData, (loadedCanvas: any, error: any) => {
          if (error) {
            console.error('Error loading template in toolbar:', error);
            throw new Error(`Failed to load template: ${error}`);
          }

          try {
            // Validate that loadedCanvas exists and has the required methods
            if (loadedCanvas && typeof loadedCanvas.renderAll === 'function') {
              loadedCanvas.renderAll();
            } else {
              // Fallback to original canvas
              canvas.renderAll();
            }
            console.warn('Template loaded successfully:', template.name);
          } catch (renderError) {
            console.error('Error rendering template in toolbar:', renderError);
            // Try fallback with original canvas
            try {
              canvas.renderAll();
            } catch (fallbackError) {
              console.error('Fallback render also failed in toolbar:', fallbackError);
              throw new Error(`Failed to render template: ${renderError}`);
            }
          }
        });
      }
    } catch (error) {
      console.error('Error loading template:', error);
      throw error;
    }
  };

  const handleProceedToQrCode = () => {
    // Save the current canvas data to localStorage before proceeding
    if (canvas) {
      const canvasData = canvas.toJSON(['elementType', 'buttonData', 'linkData']);
      localStorage.setItem(`design_${designId}`, JSON.stringify(canvasData));
    }
  };

  const handlePreview = () => {
    console.warn('Opening design preview');
    // Preview functionality is handled by the PreviewButton component
  };

  const handleUndo = () => {
    if (onUndo && canUndo) {
      onUndo();
      console.warn('Undo action performed');
    }
  };

  const handleRedo = () => {
    if (onRedo && canRedo) {
      onRedo();
      console.warn('Redo action performed');
    }
  };

  const handleRotateLeft = () => {
    if (!canvas) {
      return;
    }
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      activeObject.rotate(activeObject.angle - 15);
      canvas.renderAll();
    }
  };

  const handleRotateRight = () => {
    if (!canvas) {
      return;
    }
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      activeObject.rotate(activeObject.angle + 15);
      canvas.renderAll();
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
            onExport={() => handleProceedToQrCode()}
          />

          <ToolbarActions
            onUndo={handleUndo}
            onRedo={handleRedo}
            onRotateLeft={handleRotateLeft}
            onRotateRight={handleRotateRight}
            canUndo={canUndo}
            canRedo={canRedo}
          />
        </div>

        {/* Center Section - Status */}
        <div className="relative z-10">
          <StatusIndicator
            currentTemplateName={currentTemplate?.name}
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
            disabled={!canvas}
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
