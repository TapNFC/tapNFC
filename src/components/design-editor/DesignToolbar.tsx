'use client';

import type { DesignData, TemplateData } from '@/lib/indexedDB';
import {
  ChevronDown,
  Grid3x3,
  LogOut,
  Menu,
  Settings,
  User,
  X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { designDB, formatDesignTitle, generateTemplateId } from '@/lib/indexedDB';
import { createClient } from '@/utils/supabase/client';
import { LoadTemplateDialog } from './components/dialogs/LoadTemplateDialog';
import { SaveTemplateDialog } from './components/dialogs/SaveTemplateDialog';
import { FileMenu } from './components/toolbar/FileMenu';
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
  const [currentTemplateName, setCurrentTemplateName] = useState<string | null>(null);
  const [user, setUser] = useState<{
    name: string;
    email: string;
    avatar?: string;
  } | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const { toast: hookToast } = useToast();

  // Fetch user data
  useEffect(() => {
    const getUser = async () => {
      try {
        const supabase = createClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
          setUser({
            name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
            email: authUser.email || '',
            avatar: authUser.user_metadata?.avatar_url,
          });
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    getUser();
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push('/sign-in');
      hookToast({
        title: 'Logged out successfully',
        description: 'You have been logged out of your account.',
      });
    } catch (error) {
      console.error('Error logging out:', error);
      hookToast({
        title: 'Error logging out',
        description: 'There was a problem logging out. Please try again.',
        variant: 'error',
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

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
            currentTemplateName={currentTemplateName ?? undefined}
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

          <QrCodeButton
            designId={designId}
            locale={locale}
            disabled={isExporting}
            canvas={canvas}
          />

          <div className="h-6 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent" />

          {/* User Menu */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-auto rounded-lg px-2 hover:bg-white/60"
                >
                  <div className="flex items-center space-x-2">
                    <Avatar className="size-8 ring-2 ring-primary/20">
                      <AvatarImage src={user.avatar ?? ''} alt={user.name} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden text-left sm:block">
                      <p className="text-sm font-medium text-slate-900">
                        {user.name.split(' ')[0]}
                      </p>
                    </div>
                    <ChevronDown className="size-3 text-slate-500" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/dashboard/profile')}>
                  <User className="mr-2 size-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/dashboard/settings')}>
                  <Settings className="mr-2 size-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-red-600 dark:text-red-400"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                >
                  <LogOut className="mr-2 size-4" />
                  <span>{isLoggingOut ? 'Logging out...' : 'Log out'}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
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
