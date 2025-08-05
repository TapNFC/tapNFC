import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { SidebarSection } from './SidebarSection';

type SocialIconsPanelProps = {
  onAddSocialIcon: (iconPath: string, iconName: string) => void;
};

// Define available social icons
const socialIcons = [
  {
    id: 'facebook',
    name: 'Facebook',
    path: '/assets/images/social-icons/facebook.png',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    path: '/assets/images/social-icons/instagram.png',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    path: '/assets/images/social-icons/tiktok.png',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    path: '/assets/images/social-icons/youtube.png',
  },
  {
    id: 'social',
    name: 'Social',
    path: '/assets/images/social-icons/social.png',
  },
];

export function SocialIconsPanel({ onAddSocialIcon }: SocialIconsPanelProps) {
  return (
    <SidebarSection title="Social Icons">
      <div className="grid grid-cols-3 gap-3">
        <TooltipProvider>
          {socialIcons.map(icon => (
            <Tooltip key={icon.id} delayDuration={300}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-16 flex-col gap-1 rounded-xl border-2 border-gray-200 bg-white p-1 shadow-sm transition-all duration-300 hover:scale-105 hover:border-gray-300 hover:shadow-lg active:scale-95"
                  onClick={() => onAddSocialIcon(icon.path, icon.name)}
                >
                  <div className="relative size-10 overflow-hidden rounded-md">
                    <Image
                      src={icon.path}
                      alt={icon.name}
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-gray-800 text-white">
                <p>{icon.name}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>
    </SidebarSection>
  );
}
