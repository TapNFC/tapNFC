'use client';

import {
  ChevronDown,
  Grid3x3,
  LogOut,
  Settings,
  User,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { BrandLogo } from '@/components/common/BrandLogo';
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
import { designService } from '@/services/designService';
import { storageService } from '@/services/storageService';
import { createClient } from '@/utils/supabase/client';
import { normalizeTextObjects } from '@/utils/textUtils';
import { LoadTemplateDialog } from './components/dialogs/LoadTemplateDialog';
import { SaveTemplateDialog } from './components/dialogs/SaveTemplateDialog';
import { QrCodeButton } from './components/toolbar/QrCodeButton';
import { ToolbarActions } from './components/toolbar/ToolbarActions';
import { safeLoadFromJSON, safeRenderAll, safeSetBackgroundColor, safeSetDimensions } from './utils/canvasSafety';

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
  onToggleSidebar: _onToggleSidebar,
  sidebarCollapsed: _sidebarCollapsed = false,
  hasUnsavedChanges = false,
  lastSaved = null,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  guideControls,
}: DesignToolbarProps) {
  const [isGuidesEnabled, setIsGuidesEnabled] = useState(true);
  const [isExporting] = useState(false);
  const [designName, setDesignName] = useState<string>('Untitled Design');
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
            name: authUser.user_metadata?.full_name
              || authUser.user_metadata?.name
              || authUser.email?.split('@')[0]
              || 'User',
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

  useEffect(() => {
    const fetchDesign = async () => {
      if (designId) {
        try {
          const design = await designService.getDesignById(designId);
          if (design && design.name) {
            setDesignName(design.name);
          }
        } catch (error) {
          console.error('Error fetching design name:', error);
          toast.error('Could not load design name.');
        }
      }
    };
    fetchDesign();
  }, [designId]);

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

  // Add this function to the DesignToolbar component to handle saving templates with Supabase

  const handleSaveTemplate = async (name: string, category?: string, description?: string) => {
    if (!canvas) {
      toast.error('Canvas is not ready');
      return;
    }

    try {
      // Get the current user
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast.error('You must be logged in to save templates');
        return;
      }

      // Get canvas JSON data
      const canvasJSON = canvas.toJSON(['id', 'selectable', 'lockMovementX', 'lockMovementY', 'editable', 'hasControls', 'linkUrl', 'elementType', 'buttonData', 'linkData', 'url', 'name', 'svgCode', 'isSvgIcon']);

      // Get canvas dimensions and background
      const width = canvas.getWidth();
      const height = canvas.getHeight();
      const backgroundColor = canvas.backgroundColor?.toString() || '#ffffff';

      // Create a preview image
      let previewUrl = null;
      try {
        const dataURL = canvas.toDataURL({
          format: 'png',
          quality: 0.8,
          multiplier: 0.5,
        });

        // Convert data URL to Blob
        const res = await fetch(dataURL);
        const blob = await res.blob();

        if (blob) {
          const templateId = crypto.randomUUID();
          const file = new File([blob], `template_${templateId}_preview.png`, { type: 'image/png' });
          previewUrl = await designService.uploadPreviewImage(templateId, file);
        }
      } catch (previewError) {
        console.error('Failed to generate preview:', previewError);
      }

      // Create the template in Supabase
      const newTemplate = await designService.createDesign({
        user_id: user.id,
        name,
        canvas_data: {
          canvasJSON,
          width,
          height,
          backgroundColor,
          category,
          description,
        },
        preview_url: previewUrl,
        is_template: true,
        is_public: true, // Templates are public by default
      });

      if (newTemplate) {
        toast.success('Template saved successfully');
        if (setShowSaveDialog) {
          setShowSaveDialog(false);
        }
      } else {
        toast.error('Failed to save template');
      }
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Error saving template');
    }
  };

  const handleProceedToQrCode = async () => {
    if (!canvas) {
      toast.error('Canvas is not ready');
      return;
    }

    try {
      // 1. Get existing design to find old preview_url
      const existingDesign = await designService.getDesignById(designId);
      if (existingDesign?.preview_url) {
        await storageService.deleteDesignPreview(existingDesign.preview_url);
      }

      const canvasData = canvas.toJSON?.(['elementType', 'buttonData', 'linkData', 'shapeData', 'url', 'name', 'svgCode', 'isSvgIcon']);

      if (!canvasData) {
        toast.error('Failed to get canvas data. Cannot proceed.');
        return;
      }

      // Add canvas dimensions and background to the saved data
      canvasData.width = canvas.getWidth?.();
      canvasData.height = canvas.getHeight?.();
      canvasData.background = canvas.backgroundColor || '#ffffff';

      // Try to generate preview image, but handle tainted canvas gracefully
      let previewUrl: string | null = null;
      try {
        const dataUrl = canvas.toDataURL({ format: 'png', quality: 0.8 });
        previewUrl = await storageService.uploadDesignPreview(designId, dataUrl);

        if (previewUrl) {
          await designService.updateDesign(designId, { preview_url: previewUrl });
          toast.success('Design preview updated.');
        }
      } catch (previewError) {
        // Handle tainted canvas error gracefully
        if (previewError instanceof Error && previewError.message.includes('Tainted canvases may not be exported')) {
          console.warn('Canvas contains external images, skipping preview generation due to CORS restrictions');
          // Continue without preview - this is not a critical error
        } else {
          console.warn('Failed to generate preview image:', previewError);
          // Continue without preview - this is not a critical error
        }
      }

      // Save full canvas data to the backend, preserving existing name and description
      await designService.updateDesign(designId, {
        name: existingDesign?.name || `Design ${designId}`,
        description: existingDesign?.description || '',
        canvas_data: canvasData,
        width: Math.round(canvas.getWidth?.() || 800), // Save canvas width at design level, rounded to integer
        height: Math.round(canvas.getHeight?.() || 600), // Save canvas height at design level, rounded to integer
        background_color: typeof canvas.backgroundColor === 'string' ? canvas.backgroundColor : '#ffffff', // Save background color at design level
      });
      toast.success('Design saved successfully.');

      // Navigate to dashboard after saving
      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to save design data:', error);
      toast.error('Failed to save design data. Please try again.');
    }
  };

  const handleLoadTemplate = async (templateId: string) => {
    if (!canvas) {
      toast.error('Canvas is not ready');
      return;
    }

    try {
      // Fetch the template from Supabase
      const template = await designService.getDesignById(templateId);

      if (!template || !template.canvas_data?.canvasJSON) {
        toast.error('Template not found or invalid');
        return;
      }

      if (template.name) {
        setDesignName(template.name);
      }

      // Clear the canvas
      canvas.clear();

      // Set canvas dimensions if available
      if (template.canvas_data.width && template.canvas_data.height) {
        const success = safeSetDimensions(canvas, {
          width: template.canvas_data.width,
          height: template.canvas_data.height,
        });

        if (!success) {
          console.warn('Failed to set canvas dimensions during template load - canvas not ready');
        }
      }

      // Set background color
      if (template.canvas_data.backgroundColor) {
        const success = safeSetBackgroundColor(canvas, template.canvas_data.backgroundColor);
        if (!success) {
          console.warn('Failed to set background color during template load - canvas not ready');
        }
      }

      // Load the canvas data safely
      const loadSuccess = safeLoadFromJSON(canvas, template.canvas_data.canvasJSON, (_loadedCanvas, error) => {
        if (error) {
          console.error('Error loading template:', error);
          toast.error('Error loading template');
          return;
        }

        // Normalize text objects to ensure they don't have scaling issues
        normalizeTextObjects(canvas);

        const renderSuccess = safeRenderAll(canvas);
        if (renderSuccess) {
          toast.success(`Template "${template.name}" loaded successfully`);
        } else {
          toast.error('Template loaded but rendering failed');
        }

        // Close the dialog
        if (setShowLoadDialog) {
          setShowLoadDialog(false);
        }
      });

      if (!loadSuccess) {
        toast.error('Failed to initiate template loading');
      }
    } catch (error) {
      console.error('Error loading template:', error);
      toast.error('Error loading template');
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

  // Remove handleProceedToQrCode function since it's no longer needed

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
      safeRenderAll(canvas);
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
      safeRenderAll(canvas);
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
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={handleProceedToQrCode}
              className="flex cursor-pointer items-center transition-transform duration-200 hover:scale-105"
              title="Save and Go to Dashboard"
            >
              <div className="hidden size-10 sm:flex">
                <BrandLogo
                  imageSize={40}
                  className="size-full"
                />
              </div>
              <div className="flex size-9 sm:hidden">
                <BrandLogo
                  showText={false}
                  imageSize={36}
                  className="size-full"
                />
              </div>
            </button>
          </div>

          <div className="h-6 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent" />

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
        <div className="relative z-10 flex items-center gap-4">
          <h2 className="text-lg font-medium text-gray-700">{designName}</h2>
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

          {/* Add QrCodeButton here */}
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
                <DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/dashboard/settings')}>
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
