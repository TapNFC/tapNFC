import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import socialIconsData from '@/data/socialIcons.json';
import { SidebarSection } from './SidebarSection';

type SocialIconsPanelProps = {
  onAddSocialIcon: (iconPath: string, iconName: string, svgCode?: string) => void;
};

// Import social icons from JSON file
const socialIcons = socialIconsData;

export function SocialIconsPanel({ onAddSocialIcon }: SocialIconsPanelProps) {
  // Separate icons into two categories
  const svgIcons = socialIcons.filter((icon: any) => icon.svgCode);

  const renderIconButton = (icon: any, usePath: boolean = false) => (
    <Tooltip key={`${icon.id}-${usePath ? 'path' : 'svg'}`} delayDuration={300}>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-16 flex-col gap-1 rounded-xl border-2 border-gray-200 bg-white p-1 shadow-sm transition-all duration-300 hover:scale-105 hover:border-gray-300 hover:shadow-lg active:scale-95"
          onClick={() => onAddSocialIcon(icon.path, icon.name, usePath ? undefined : icon.svgCode)}
        >
          <div className="relative size-10 overflow-hidden rounded-md">
            {icon.svgCode
              ? (
                  <div
                    className="flex size-full items-center justify-center p-1"
                    dangerouslySetInnerHTML={{ __html: icon.svgCode }}
                    style={{ scale: '2' }}
                  />
                )
              : (
                  <Image
                    src={icon.path}
                    alt={icon.name}
                    fill
                    className="object-contain p-1"
                  />
                )}
          </div>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="bg-gray-800 text-white">
        <p>{icon.name}</p>
        {icon.svgCode && !usePath && (
          <p className="mt-1 text-xs text-gray-300">SVG Icon (Editable colors)</p>
        )}
      </TooltipContent>
    </Tooltip>
  );

  return (
    <div className="space-y-6">

      {/* SVG Icons Section */}
      {svgIcons.length > 0 && (
        <SidebarSection title="SVG Icons (Editable Colors)">
          <div className="mb-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-600">Editable Colors</h4>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <TooltipProvider>
              {svgIcons.map(icon => renderIconButton(icon, false))}
            </TooltipProvider>
          </div>
        </SidebarSection>
      )}
      {/* Regular Icons Section */}
      <SidebarSection title="Social Icons">
        <div className="mb-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-600">Standard Icons</h4>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <TooltipProvider>
            {socialIcons.map(icon => renderIconButton(icon, true))}
          </TooltipProvider>
        </div>
      </SidebarSection>

    </div>
  );
}
