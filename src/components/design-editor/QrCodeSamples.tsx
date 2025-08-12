'use client';

import { Check, QrCode } from 'lucide-react';
import {
  FaApple,
  FaBluetoothB,
  FaCar,
  FaDiscord,
  FaEnvelope,
  FaFacebook,
  FaFacebookMessenger,
  FaHome,
  FaInstagram,
  FaLinkedin,
  FaPaypal,
  FaPinterest,
  FaReddit,
  FaSnapchat,

  FaSoundcloud,
  FaSpotify,
  FaTelegram,
  FaTiktok,
  FaWeixin,
  FaWhatsapp,
  FaWifi,
  FaYelp,
  FaYoutube,
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { SiGoogle, SiTripadvisor, SiTrustpilot, SiVenmo } from 'react-icons/si';

export type QrSampleProps = {
  id: string;
  name: string;
  svgWrapper: (qrCodeElement: React.ReactNode) => React.ReactNode;
};

const QrCodePlaceholder = ({ size = 40 }: { size?: number }) => (
  <div
    className="flex items-center justify-center rounded-sm bg-white p-0.5"
    style={{ width: size, height: size }}
  >
    <QrCode className="text-black" style={{ width: size * 0.8, height: size * 0.8 }} />
  </div>
);

// The center position for QR codes within the SVG wrapper
const qrX = 15;
const qrY = 15;

const createSocialStyle = ({
  id,
  name,
  color,
  IconComponent,
  bgColor = 'white',
  qrBg = 'transparent',
  svgIcon = '',
}: {
  id: string;
  name: string;
  color: string;
  IconComponent: React.ElementType;
  bgColor?: string;
  qrBg?: string;
  svgIcon?: string;
}): QrSampleProps => ({
  id,
  name,
  svgWrapper: qrCodeElement => (
    <svg viewBox="-5 -5 90 90" className="size-full">
      <defs>
        <filter id={`shadow_${id}`} x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="1" dy="1" stdDeviation="1.5" floodColor="#000" floodOpacity="0.15" />
        </filter>
      </defs>
      <rect
        x="5"
        y="10"
        width="70"
        height="70"
        rx="15"
        stroke={color}
        strokeWidth="3"
        fill={bgColor}
        filter={`url(#shadow_${id})`}
      />
      {qrBg !== 'transparent' && <rect x="14" y="19" width="52" height="52" rx="4" fill={qrBg} />}
      <g transform={`translate(${qrX}, ${qrY + 5})`}>{qrCodeElement}</g>
      <circle cx="40" cy="10" r="10" fill={bgColor} />
      <g transform="translate(32, 2)">
        {svgIcon
          ? (
              <g dangerouslySetInnerHTML={{ __html: svgIcon }} />
            )
          : (
              <IconComponent color={color} size={16} />
            )}
      </g>
    </svg>
  ),
});

const socialStylesData = [
  {
    id: 'instagram-style',
    name: 'Instagram',
    color: '#D22A83',
    IconComponent: FaInstagram,
    svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="16" height="16" viewBox="0 0 48 48"><radialGradient id="yOrnnhliCrdS2gy~4tD8ma_Xy10Jcu1L2Su_gr1" cx="19.38" cy="42.035" r="44.899" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fd5"></stop><stop offset=".328" stop-color="#ff543f"></stop><stop offset=".348" stop-color="#fc5245"></stop><stop offset=".504" stop-color="#e64771"></stop><stop offset=".643" stop-color="#d53e91"></stop><stop offset=".761" stop-color="#cc39a4"></stop><stop offset=".841" stop-color="#c837ab"></stop></radialGradient><path fill="url(#yOrnnhliCrdS2gy~4tD8ma_Xy10Jcu1L2Su_gr1)" d="M34.017,41.99l-20,0.019c-4.4,0.004-8.003-3.592-8.008-7.992l-0.019-20 c-0.004-4.4,3.592-8.003,7.992-8.008l20-0.019c4.4-0.004,8.003,3.592,8.008,7.992l0.019,20 C42.014,38.383,38.417,41.986,34.017,41.99z"></path><radialGradient id="yOrnnhliCrdS2gy~4tD8mb_Xy10Jcu1L2Su_gr2" cx="11.786" cy="5.54" r="29.813" gradientTransform="matrix(1 0 0 .6663 0 1.849)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#4168c9"></stop><stop offset=".999" stop-color="#4168c9" stop-opacity="0"></stop></radialGradient><path fill="url(#yOrnnhliCrdS2gy~4tD8mb_Xy10Jcu1L2Su_gr2)" d="M34.017,41.99l-20,0.019c-4.4,0.004-8.003-3.592-8.008-7.992l-0.019-20 c-0.004-4.4,3.592-8.003,7.992-8.008l20-0.019c4.4-0.004,8.003,3.592,8.008,7.992l0.019,20 C42.014,38.383,38.417,41.986,34.017,41.99z"></path><path fill="#fff" d="M24,31c-3.859,0-7-3.14-7-7s3.141-7,7-7s7,3.14,7,7S27.859,31,24,31z M24,19c-2.757,0-5,2.243-5,5 s2.243,5,5,5s5-2.243,5-5S26.757,19,24,19z"></path><circle cx="31.5" cy="16.5" r="1.5" fill="#fff"></circle><path fill="#fff" d="M30,37H18c-3.859,0-7-3.14-7-7V18c0-3.86,3.141-7,7-7h12c3.859,0,7,3.14,7,7v12 C37,33.86,33.859,37,30,37z M18,13c-2.757,0-5,2.243-5,5v12c0,2.757,2.243,5,5,5h12c2.757,0,5-2.243,5-5V18c0-2.757-2.243-5-5-5H18z"></path></svg>',
  },
  { id: 'facebook-style', name: 'Facebook', color: '#1877F2', IconComponent: FaFacebook },
  { id: 'whatsapp-style', name: 'WhatsApp', color: '#25D366', IconComponent: FaWhatsapp },
  { id: 'messenger-style', name: 'Messenger', color: '#00B2FF', IconComponent: FaFacebookMessenger },
  { id: 'x-style', name: 'X (Twitter)', color: '#000000', IconComponent: FaXTwitter },
  { id: 'snapchat-style', name: 'Snapchat', color: '#FFFC00', IconComponent: FaSnapchat, bgColor: '#1A1A1A', qrBg: 'white' },
  {
    id: 'tiktok-style',
    name: 'TikTok',
    color: '#000000',
    IconComponent: FaTiktok,
    svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="16" height="16" viewBox="0 0 48 48"><path fill="#212121" fill-rule="evenodd" d="M10.904,6h26.191C39.804,6,42,8.196,42,10.904v26.191 C42,39.804,39.804,42,37.096,42H10.904C8.196,42,6,39.804,6,37.096V10.904C6,8.196,8.196,6,10.904,6z" clip-rule="evenodd"></path><path fill="#ec407a" fill-rule="evenodd" d="M29.208,20.607c1.576,1.126,3.507,1.788,5.592,1.788v-4.011 c-0.395,0-0.788-0.041-1.174-0.123v3.157c-2.085,0-4.015-0.663-5.592-1.788v8.184c0,4.094-3.321,7.413-7.417,7.413 c-1.528,0-2.949-0.462-4.129-1.254c1.347,1.376,3.225,2.23,5.303,2.23c4.096,0,7.417-3.319,7.417-7.413L29.208,20.607L29.208,20.607 z M30.657,16.561c-0.805-0.879-1.334-2.016-1.449-3.273v-0.516h-1.113C28.375,14.369,29.331,15.734,30.657,16.561L30.657,16.561z M19.079,30.832c-0.45-0.59-0.693-1.311-0.692-2.053c0-1.873,1.519-3.391,3.393-3.391c0.349,0,0.696,0.053,1.029,0.159v-4.1 c-0.389-0.053-0.781-0.076-1.174-0.068v3.191c-0.333-0.106-0.68-0.159-1.03-0.159c-1.874,0-3.393,1.518-3.393,3.391 C17.213,29.127,17.972,30.274,19.079,30.832z" clip-rule="evenodd"></path><path fill="#fff" fill-rule="evenodd" d="M28.034,19.63c1.576,1.126,3.507,1.788,5.592,1.788v-3.157 c-1.164-0.248-2.194-0.856-2.969-1.701c-1.326-0.827-2.281-2.191-2.561-3.788h-2.923v16.018c-0.007,1.867-1.523,3.379-3.393,3.379 c-1.102,0-2.081-0.525-2.701-1.338c-1.107-0.558-1.866-1.705-1.866-3.029c0-1.873,1.519-3.391,3.393-3.391 c0.359,0,0.705,0.056,1.03,0.159V21.38c-4.024,0.083-7.26,3.369-7.26,7.411c0,2.018,0.806,3.847,2.114,5.183 c1.18,0.792,2.601,1.254,4.129,1.254c4.096,0,7.417-3.319,7.417-7.413L28.034,19.63L28.034,19.63z" clip-rule="evenodd"></path><path fill="#81d4fa" fill-rule="evenodd" d="M33.626,18.262v-0.854c-1.05,0.002-2.078-0.292-2.969-0.848 C31.445,17.423,32.483,18.018,33.626,18.262z M28.095,12.772c-0.027-0.153-0.047-0.306-0.061-0.461v-0.516h-4.036v16.019 c-0.006,1.867-1.523,3.379-3.393,3.379c-0.549,0-1.067-0.13-1.526-0.362c0.62,0.813,1.599,1.338,2.701,1.338 c1.87,0,3.386-1.512,3.393-3.379V12.772H28.095z M21.635,21.38v-0.909c-0.337-0.046-0.677-0.069-1.018-0.069 c-4.097,0-7.417,3.319-7.417,7.413c0,2.567,1.305,4.829,3.288,6.159c-1.308-1.336-2.114-3.165-2.114-5.183 C14.374,24.749,17.611,21.463,21.635,21.38z" clip-rule="evenodd"></path></svg>',
  },
  { id: 'linkedin-style', name: 'LinkedIn', color: '#0A66C2', IconComponent: FaLinkedin },
  { id: 'youtube-style', name: 'YouTube', color: '#FF0000', IconComponent: FaYoutube },
  { id: 'spotify-style', name: 'Spotify', color: '#1DB954', IconComponent: FaSpotify },
  { id: 'soundcloud-style', name: 'SoundCloud', color: '#ff7700', IconComponent: FaSoundcloud },
  { id: 'apple-music-style', name: 'Apple Music', color: '#FF2D55', IconComponent: FaApple },
  { id: 'paypal-style', name: 'PayPal', color: '#00457C', IconComponent: FaPaypal },
  { id: 'venmo-style', name: 'Venmo', color: '#008CFF', IconComponent: SiVenmo },
  { id: 'telegram-style', name: 'Telegram', color: '#24A1DE', IconComponent: FaTelegram },
  { id: 'discord-style', name: 'Discord', color: '#5865F2', IconComponent: FaDiscord },
  { id: 'pinterest-style', name: 'Pinterest', color: '#E60023', IconComponent: FaPinterest },
  { id: 'reddit-style', name: 'Reddit', color: '#FF4500', IconComponent: FaReddit },
  { id: 'wechat-style', name: 'WeChat', color: '#07C160', IconComponent: FaWeixin },
  { id: 'google-style', name: 'Google', color: '#4285F4', IconComponent: SiGoogle },
  { id: 'trustpilot-style', name: 'Trustpilot', color: '#00B67A', IconComponent: SiTrustpilot },
  { id: 'yelp-style', name: 'Yelp', color: '#D32323', IconComponent: FaYelp },
  { id: 'tripadvisor-style', name: 'Tripadvisor', color: '#34E0A1', IconComponent: SiTripadvisor },
  { id: 'wifi-style', name: 'WiFi', color: '#000000', IconComponent: FaWifi },
  { id: 'bluetooth-style', name: 'Bluetooth', color: '#000000', IconComponent: FaBluetoothB },
  { id: 'email-style', name: 'Email', color: '#000000', IconComponent: FaEnvelope },
  { id: 'home-style', name: 'Home', color: '#000000', IconComponent: FaHome },
  { id: 'car-style', name: 'Car', color: '#000000', IconComponent: FaCar },
  { id: 'apple-style', name: 'Apple', color: '#000000', IconComponent: FaApple },
];

export const sampleQrDesigns: QrSampleProps[] = [
  {
    id: 'style-none',
    name: 'Plain QR',
    svgWrapper: qrCodeElement => qrCodeElement, // Simply return the QR code without wrapping
  },
  {
    id: 'style1',
    name: 'Gradient Frame',
    svgWrapper: qrCodeElement => (
      <svg viewBox="0 0 80 80" className="size-full">
        <defs>
          <linearGradient id="grad_swirl" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
          <filter id="shadow_swirl" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="1" dy="1" stdDeviation="1" floodColor="#4F46E5" floodOpacity="0.3" />
          </filter>
        </defs>
        <rect width="80" height="80" fill="white" />
        <rect
          x="5"
          y="5"
          width="70"
          height="70"
          rx="10"
          fill="white"
          stroke="url(#grad_swirl)"
          strokeWidth="2"
          filter="url(#shadow_swirl)"
        />
        <circle cx="15" cy="15" r="3" fill="url(#grad_swirl)" />
        <circle cx="65" cy="15" r="3" fill="url(#grad_swirl)" />
        <circle cx="15" cy="65" r="3" fill="url(#grad_swirl)" />
        <circle cx="65" cy="65" r="3" fill="url(#grad_swirl)" />
        <g transform={`translate(${qrX}, ${qrY})`}>{qrCodeElement}</g>
      </svg>
    ),
  },
  {
    id: 'style2',
    name: 'Geometric Burst',
    svgWrapper: qrCodeElement => (
      <svg viewBox="0 0 80 80" className="size-full">
        <defs>
          <linearGradient id="grad_burst" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
          <filter id="glow_burst" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="0.5" result="blur" />
            <feFlood floodColor="#10B981" floodOpacity="0.3" result="glow" />
            <feComposite in="glow" in2="blur" operator="in" result="softGlow" />
            <feMerge>
              <feMergeNode in="softGlow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <rect width="80" height="80" fill="#f8fafc" />
        {Array.from({ length: 8 }).map((_, i) => (
          <line
            key={`burst_line_${i}`}
            x1="40"
            y1="40"
            x2={40 + 38 * Math.cos((i * 45 * Math.PI) / 180)}
            y2={40 + 38 * Math.sin((i * 45 * Math.PI) / 180)}
            stroke="url(#grad_burst)"
            strokeWidth="1.5"
            filter="url(#glow_burst)"
          />
        ))}
        <circle cx="40" cy="40" r="24" fill="none" stroke="url(#grad_burst)" strokeWidth="1" strokeDasharray="2,2" />
        <rect x="20" y="20" width="40" height="40" fill="white" rx="4" />
        <g transform={`translate(${qrX}, ${qrY})`}>{qrCodeElement}</g>
      </svg>
    ),
  },
  {
    id: 'style3',
    name: 'Rounded Frame',
    svgWrapper: qrCodeElement => (
      <svg viewBox="0 0 80 80" className="size-full">
        <defs>
          <linearGradient id="grad_frame" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#EF4444" />
          </linearGradient>
          <filter id="shadow_frame" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="2" dy="2" stdDeviation="1" floodColor="#EF4444" floodOpacity="0.2" />
          </filter>
        </defs>
        <rect width="80" height="80" fill="#fffbeb" />
        <rect
          x="5"
          y="5"
          width="70"
          height="70"
          rx="15"
          stroke="url(#grad_frame)"
          strokeWidth="2"
          fill="white"
          filter="url(#shadow_frame)"
        />
        <circle cx="15" cy="15" r="3" fill="url(#grad_frame)" />
        <circle cx="65" cy="15" r="3" fill="url(#grad_frame)" />
        <circle cx="15" cy="65" r="3" fill="url(#grad_frame)" />
        <circle cx="65" cy="65" r="3" fill="url(#grad_frame)" />
        <g transform={`translate(${qrX}, ${qrY})`}>{qrCodeElement}</g>
      </svg>
    ),
  },
  {
    id: 'style4',
    name: 'Corner Accents',
    svgWrapper: qrCodeElement => (
      <svg viewBox="0 0 80 80" className="size-full">
        <defs>
          <linearGradient id="grad_corners" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#DB2777" />
          </linearGradient>
          <filter id="glow_corners" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feFlood floodColor="#8B5CF6" floodOpacity="0.2" result="glow" />
            <feComposite in="glow" in2="blur" operator="in" result="softGlow" />
            <feMerge>
              <feMergeNode in="softGlow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <rect width="80" height="80" fill="#f5f3ff" />
        <rect x="10" y="10" width="60" height="60" fill="white" rx="8" />
        <path d="M5 20 V5 H20" stroke="url(#grad_corners)" strokeWidth="3" fill="none" strokeLinecap="round" filter="url(#glow_corners)" />
        <path d="M60 5 H75 V20" stroke="url(#grad_corners)" strokeWidth="3" fill="none" strokeLinecap="round" filter="url(#glow_corners)" />
        <path d="M5 60 V75 H20" stroke="url(#grad_corners)" strokeWidth="3" fill="none" strokeLinecap="round" filter="url(#glow_corners)" />
        <path d="M60 75 H75 V60" stroke="url(#grad_corners)" strokeWidth="3" fill="none" strokeLinecap="round" filter="url(#glow_corners)" />
        <g transform={`translate(${qrX}, ${qrY})`}>{qrCodeElement}</g>
      </svg>
    ),
  },
  {
    id: 'style6',
    name: 'Dotted Border',
    svgWrapper: qrCodeElement => (
      <svg viewBox="0 0 80 80" className="size-full">
        <defs>
          <linearGradient id="grad_dots" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22D3EE" />
            <stop offset="100%" stopColor="#A78BFA" />
          </linearGradient>
          <filter id="glow_dots" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feFlood floodColor="#22D3EE" floodOpacity="0.3" result="glow" />
            <feComposite in="glow" in2="blur" operator="in" result="softGlow" />
            <feMerge>
              <feMergeNode in="softGlow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <rect width="80" height="80" fill="#f0fdfa" />
        <rect x="10" y="10" width="60" height="60" fill="white" rx="8" />
        {Array.from({ length: 16 }).map((_, i) => (
          <circle
            key={`dot_border_${i}`}
            cx={40 + 32 * Math.cos((i * 22.5 * Math.PI) / 180)}
            cy={40 + 32 * Math.sin((i * 22.5 * Math.PI) / 180)}
            r="3"
            fill="url(#grad_dots)"
            filter="url(#glow_dots)"
          />
        ))}
        <g transform={`translate(${qrX}, ${qrY})`}>{qrCodeElement}</g>
      </svg>
    ),
  },
  {
    id: 'style7',
    name: '3D Shadow',
    svgWrapper: qrCodeElement => (
      <svg viewBox="0 0 80 80" className="size-full">
        <defs>
          <filter id="shadow3D" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="3" dy="3" stdDeviation="2" floodColor="#000000" floodOpacity="0.3" />
          </filter>
          <linearGradient id="grad_3d" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0EA5E9" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
        </defs>
        <rect width="80" height="80" fill="#f0f9ff" />
        <rect
          x="10"
          y="10"
          width="60"
          height="60"
          rx="8"
          fill="white"
          stroke="url(#grad_3d)"
          strokeWidth="2"
          filter="url(#shadow3D)"
        />
        <g transform={`translate(${qrX}, ${qrY})`}>{qrCodeElement}</g>

        {/* Decorative elements */}
        <circle cx="10" cy="10" r="3" fill="url(#grad_3d)" />
        <circle cx="70" cy="10" r="3" fill="url(#grad_3d)" />
        <circle cx="10" cy="70" r="3" fill="url(#grad_3d)" />
        <circle cx="70" cy="70" r="3" fill="url(#grad_3d)" />
      </svg>
    ),
  },
  {
    id: 'style8',
    name: 'Neon Glow',
    svgWrapper: qrCodeElement => (
      <svg viewBox="0 0 80 80" className="size-full">
        <defs>
          <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feFlood floodColor="#FF2D55" floodOpacity="0.8" result="glow" />
            <feComposite in="glow" in2="blur" operator="in" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="grad_neon" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF2D55" />
            <stop offset="100%" stopColor="#FF9500" />
          </linearGradient>
          <linearGradient id="grad_neon_bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1A1A1A" />
            <stop offset="100%" stopColor="#000000" />
          </linearGradient>
          <filter id="inner_glow">
            <feFlood floodColor="#FF2D55" floodOpacity="0.5" result="color" />
            <feComposite in="color" in2="SourceGraphic" operator="in" result="colored-filter" />
            <feGaussianBlur in="colored-filter" stdDeviation="1.5" />
            <feComposite in="SourceGraphic" operator="over" />
          </filter>
        </defs>
        <rect width="80" height="80" fill="url(#grad_neon_bg)" />
        <rect
          x="5"
          y="5"
          width="70"
          height="70"
          rx="15"
          fill="rgba(30, 30, 30, 0.7)"
          stroke="url(#grad_neon)"
          strokeWidth="2"
          filter="url(#neonGlow)"
        />

        {/* Add a white background for the QR code for contrast */}
        <rect x="15" y="15" width="50" height="50" rx="6" fill="white" />
        <g transform={`translate(${qrX}, ${qrY})`}>{qrCodeElement}</g>

        {/* Enhanced decorative neon dots */}
        <circle cx="40" cy="5" r="2.5" fill="url(#grad_neon)" filter="url(#neonGlow)" />
        <circle cx="5" cy="40" r="2.5" fill="url(#grad_neon)" filter="url(#neonGlow)" />
        <circle cx="75" cy="40" r="2.5" fill="url(#grad_neon)" filter="url(#neonGlow)" />
        <circle cx="40" cy="75" r="2.5" fill="url(#grad_neon)" filter="url(#neonGlow)" />

        {/* Add corner dots for more visual interest */}
        <circle cx="12" cy="12" r="2" fill="url(#grad_neon)" filter="url(#neonGlow)" />
        <circle cx="68" cy="12" r="2" fill="url(#grad_neon)" filter="url(#neonGlow)" />
        <circle cx="12" cy="68" r="2" fill="url(#grad_neon)" filter="url(#neonGlow)" />
        <circle cx="68" cy="68" r="2" fill="url(#grad_neon)" filter="url(#neonGlow)" />
      </svg>
    ),
  },
  {
    id: 'style9',
    name: 'Glassmorphism',
    svgWrapper: qrCodeElement => (
      <svg viewBox="0 0 80 80" className="size-full">
        <defs>
          <linearGradient id="grad_glass_bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4158D0" />
            <stop offset="46%" stopColor="#C850C0" />
            <stop offset="100%" stopColor="#FFCC70" />
          </linearGradient>
          <filter id="blur_glass" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="1" result="blur" />
          </filter>
        </defs>

        {/* Background gradient */}
        <rect width="80" height="80" fill="url(#grad_glass_bg)" />

        {/* Glass panel with QR code */}
        <rect
          x="10"
          y="10"
          width="60"
          height="60"
          rx="12"
          fill="rgba(255, 255, 255, 0.25)"
          stroke="rgba(255, 255, 255, 0.5)"
          strokeWidth="1"
          style={{ backdropFilter: 'blur(4px)' }}
        />

        {/* Decorative glass circles */}
        <circle cx="15" cy="15" r="3" fill="rgba(255, 255, 255, 0.4)" />
        <circle cx="65" cy="15" r="3" fill="rgba(255, 255, 255, 0.4)" />
        <circle cx="15" cy="65" r="3" fill="rgba(255, 255, 255, 0.4)" />
        <circle cx="65" cy="65" r="3" fill="rgba(255, 255, 255, 0.4)" />

        {/* QR code with proper contrast background */}
        <rect x="20" y="20" width="40" height="40" fill="white" rx="4" />
        <g transform={`translate(${qrX}, ${qrY})`}>{qrCodeElement}</g>
      </svg>
    ),
  },
  {
    id: 'style10',
    name: 'Tech Circuit',
    svgWrapper: qrCodeElement => (
      <svg viewBox="0 0 80 80" className="size-full">
        <defs>
          <linearGradient id="grad_circuit" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#1E293B" />
          </linearGradient>
          <linearGradient id="grad_circuit_lines" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#2DD4BF" />
          </linearGradient>
          <filter id="glow_circuit" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feFlood floodColor="#38BDF8" floodOpacity="0.5" result="glow" />
            <feComposite in="glow" in2="blur" operator="in" result="softGlow" />
            <feMerge>
              <feMergeNode in="softGlow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background */}
        <rect width="80" height="80" fill="url(#grad_circuit)" />

        {/* Circuit Pattern */}
        <path d="M5,20 H25 L30,25 H50 L55,20 H75" stroke="url(#grad_circuit_lines)" strokeWidth="1" fill="none" filter="url(#glow_circuit)" />
        <path d="M5,60 H25 L30,55 H50 L55,60 H75" stroke="url(#grad_circuit_lines)" strokeWidth="1" fill="none" filter="url(#glow_circuit)" />
        <path d="M20,5 V25 L25,30 V50 L20,55 V75" stroke="url(#grad_circuit_lines)" strokeWidth="1" fill="none" filter="url(#glow_circuit)" />
        <path d="M60,5 V25 L55,30 V50 L60,55 V75" stroke="url(#grad_circuit_lines)" strokeWidth="1" fill="none" filter="url(#glow_circuit)" />

        {/* Circuit Nodes */}
        <circle cx="20" cy="20" r="2" fill="url(#grad_circuit_lines)" filter="url(#glow_circuit)" />
        <circle cx="60" cy="20" r="2" fill="url(#grad_circuit_lines)" filter="url(#glow_circuit)" />
        <circle cx="20" cy="60" r="2" fill="url(#grad_circuit_lines)" filter="url(#glow_circuit)" />
        <circle cx="60" cy="60" r="2" fill="url(#grad_circuit_lines)" filter="url(#glow_circuit)" />

        {/* QR code with white background for contrast */}
        <rect x="15" y="15" width="50" height="50" rx="6" fill="white" />
        <g transform={`translate(${qrX}, ${qrY})`}>{qrCodeElement}</g>
      </svg>
    ),
  },
  ...socialStylesData.map(style => createSocialStyle(style)),
];

type QrCodeSamplesProps = {
  onSampleSelect: (selectedSample: QrSampleProps | null) => void;
  currentSelectedId?: string | null;
  disabled?: boolean;
};

export function QrCodeSamples({ onSampleSelect, currentSelectedId, disabled = false }: QrCodeSamplesProps) {
  const handleSelect = (sample: QrSampleProps) => {
    if (disabled) {
      return;
    }

    if (currentSelectedId === sample.id) {
      onSampleSelect(null);
    } else {
      onSampleSelect(sample);
    }
  };

  // Helper function to render the sample content based on its type
  const renderSampleContent = (sample: QrSampleProps) => {
    if (sample.id === 'style-none') {
      return (
        <div className="flex size-full items-center justify-center">
          <QrCodePlaceholder size={32} />
        </div>
      );
    }
    return sample.svgWrapper(<QrCodePlaceholder size={24} />);
  };

  return (
    <div className="mb-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {sampleQrDesigns.map(sample => (
          <button
            key={`qr-sample-${sample.id}`}
            type="button"
            title={sample.name}
            className={`relative flex flex-col items-center rounded-lg border p-2 transition-all duration-200 ${
              sample.id === currentSelectedId
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
            } ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
            onClick={() => handleSelect(sample)}
            disabled={disabled}
          >
            <div className="mb-2 size-16 overflow-hidden rounded">
              {renderSampleContent(sample)}
            </div>
            <span className="w-full truncate text-center text-xs font-medium text-gray-700">
              {sample.name}
            </span>
            {sample.id === currentSelectedId && (
              <div className="absolute right-1 top-1 rounded-full bg-blue-500 p-0.5">
                <Check className="size-3 text-white" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
