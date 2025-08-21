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
  {
    id: 'messenger',
    name: 'Messenger',
    path: '/assets/images/social-icons/messenger.svg',
  },
  {
    id: 'x',
    name: 'X (Twitter)',
    path: '/assets/images/social-icons/x.png',
  },
  {
    id: 'snapchat',
    name: 'Snapchat',
    path: '/assets/images/social-icons/snapchat.png',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    path: '/assets/images/social-icons/linkedin.png',
  },
  {
    id: 'pinterest',
    name: 'Pinterest',
    path: '/assets/images/social-icons/pinterest.png',
  },
  {
    id: 'spotify',
    name: 'Spotify',
    path: '/assets/images/social-icons/spotify.png',
  },
  {
    id: 'soundcloud',
    name: 'Soundcloud',
    path: '/assets/images/social-icons/soundcloud.png',
  },
  {
    id: 'apple',
    name: 'Apple',
    path: '/assets/images/social-icons/apple.svg',
  },
  {
    id: 'paypal',
    name: 'Paypal',
    path: '/assets/images/social-icons/paypal.png',
  },
  {
    id: 'venmo',
    name: 'Venmo',
    path: '/assets/images/social-icons/venmo.png',
  },
  {
    id: 'telegram',
    name: 'Telegram',
    path: '/assets/images/social-icons/telegram.svg',
  },
  {
    id: 'discord',
    name: 'Discord',
    path: '/assets/images/social-icons/discord.png',
  },
  {
    id: 'reddit',
    name: 'Reddit',
    path: '/assets/images/social-icons/reddit.png',
  },
  {
    id: 'apple-music',
    name: 'Apple Music',
    path: '/assets/images/social-icons/apple-music.png',
  },
  {
    id: 'we-chat',
    name: 'We Chat',
    path: '/assets/images/social-icons/wechat.svg',
  },
  {
    id: 'google',
    name: 'Google',
    path: '/assets/images/social-icons/google.png',
  },
  {
    id: 'trustpilot',
    name: 'Trustpilot',
    path: '/assets/images/social-icons/trustpilot.png',
  },
  {
    id: 'yelp',
    name: 'Yelp',
    path: '/assets/images/social-icons/yelp.png',
  },
  {
    id: 'tripadvisor',
    name: 'Tripadvisor',
    path: '/assets/images/social-icons/tripadvisor.png',
  },
  {
    id: 'wifi',
    name: 'WiFi',
    path: '/assets/images/social-icons/wifi.png',
  },
  {
    id: 'apple-phone',
    name: 'Apple Phone',
    path: '/assets/images/social-icons/apple-phone.png',
  },
  {
    id: 'apple-email',
    name: 'Apple Email',
    path: '/assets/images/social-icons/apple-email.png',
  },
  {
    id: 'home',
    name: 'Home',
    path: '/assets/images/social-icons/home.png',
  },
  {
    id: 'car',
    name: 'Car',
    path: '/assets/images/social-icons/car.png',
  },
  {
    id: 'zelle',
    name: 'Zelle',
    path: '/assets/images/social-icons/zelle.png',
  },
  {
    id: 'cash-app',
    name: 'Cash App',
    path: '/assets/images/social-icons/cash-app.png',
  },
  {
    id: 'google-maps',
    name: 'Google Maps',
    path: '/assets/images/social-icons/google-maps.png',
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
