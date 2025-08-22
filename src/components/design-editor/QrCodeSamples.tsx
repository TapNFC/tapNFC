'use client';

import { Check, QrCode } from 'lucide-react';
import {
  FaApple,
  FaBluetoothB,
  FaCar,
  FaDiscord,
  FaDollarSign,
  FaEnvelope,
  FaFacebook,
  FaFacebookMessenger,
  FaHome,
  FaInstagram,
  FaLinkedin,
  FaMap,
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
  { id: 'spotify-style', name: 'Spotify', color: '#1DB954', IconComponent: FaSpotify, svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="16" height="16" viewBox="0 0 48 48"><linearGradient id="tS~Tu1dsT5kMXF2Lct~HUa_G9XXzb9XaEKX_gr1" x1="24.001" x2="24.001" y1="-4.765" y2="56.31" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#4caf50"></stop><stop offset=".489" stop-color="#4aaf50"></stop><stop offset=".665" stop-color="#43ad50"></stop><stop offset=".79" stop-color="#38aa50"></stop><stop offset=".892" stop-color="#27a550"></stop><stop offset=".978" stop-color="#11a050"></stop><stop offset="1" stop-color="#0a9e50"></stop></linearGradient><path fill="url(#tS~Tu1dsT5kMXF2Lct~HUa_G9XXzb9XaEKX_gr1)" d="M24.001,4c-11.077,0-20,8.923-20,20s8.923,20,20,20c11.076,0,20-8.923,20-20	S35.077,4,24.001,4z"></path><path d="M21.224,15.938c5.554,0,11.4,1.17,15.785,3.654c0.584,0.293,1.022,0.877,1.022,1.754 c-0.145,1.023-0.877,1.755-1.899,1.755c-0.438,0-0.585-0.146-1.023-0.291c-3.508-2.047-8.769-3.217-13.885-3.217 c-2.631,0-5.262,0.293-7.6,0.877c-0.293,0-0.585,0.146-1.023,0.146c-0.075,0.011-0.149,0.016-0.221,0.016 c-0.905,0-1.533-0.821-1.533-1.77c0-1.023,0.585-1.607,1.315-1.754C14.939,16.231,17.862,15.938,21.224,15.938 M20.785,22.369 c4.97,0,9.793,1.17,13.593,3.507c0.584,0.291,0.877,0.877,0.877,1.461c0,0.878-0.585,1.608-1.462,1.608 c-0.438,0-0.73-0.144-1.023-0.291c-3.068-1.9-7.308-3.071-12.13-3.071c-2.339,0-4.531,0.293-6.139,0.733 c-0.439,0.144-0.585,0.144-0.877,0.144c-0.877,0-1.462-0.73-1.462-1.461c0-0.877,0.439-1.316,1.169-1.607 C15.523,22.808,17.716,22.369,20.785,22.369 M21.223,28.654c4.093,0,7.893,1.021,11.108,2.924 c0.438,0.291,0.731,0.584,0.731,1.314c-0.146,0.586-0.731,1.023-1.315,1.023c-0.292,0-0.585-0.145-0.877-0.292 c-2.777-1.607-6.139-2.484-9.792-2.484c-2.047,0-4.093,0.291-5.993,0.73c-0.292,0-0.731,0.146-0.877,0.146 c-0.731,0-1.169-0.586-1.169-1.17c0-0.73,0.438-1.17,1.023-1.314C16.4,28.945,18.739,28.654,21.223,28.654 M21.224,14.938 c-3.789,0-6.666,0.371-9.317,1.202c-1.254,0.279-2.06,1.341-2.06,2.722c0,1.553,1.112,2.77,2.533,2.77 c0.095,0,0.192-0.005,0.291-0.017c0.319-0.007,0.574-0.065,0.764-0.107c0.068-0.015,0.13-0.035,0.193-0.038h0.123l0.116-0.03 c2.219-0.554,4.763-0.847,7.358-0.847c5.073,0,10.075,1.152,13.381,3.081l0.09,0.053l0.099,0.033 c0.109,0.036,0.195,0.073,0.273,0.105c0.251,0.105,0.563,0.236,1.065,0.236c1.483,0,2.671-1.075,2.889-2.615l0.01-0.07v-0.071 c0-1.171-0.564-2.13-1.549-2.635C33.238,16.313,27.314,14.938,21.224,14.938L21.224,14.938z M20.785,21.369 c-3.291,0-5.651,0.508-7.711,1.057l-0.058,0.015l-0.055,0.022c-1.194,0.476-1.799,1.329-1.799,2.536 c0,1.357,1.104,2.461,2.462,2.461c0.371,0,0.626-0.009,1.189-0.194c1.572-0.429,3.714-0.683,5.827-0.683 c4.441,0,8.562,1.037,11.603,2.921l0.038,0.024l0.04,0.02c0.334,0.168,0.792,0.397,1.471,0.397c1.404,0,2.462-1.121,2.462-2.608 c0-0.996-0.53-1.886-1.387-2.334C31.04,22.659,26.04,21.369,20.785,21.369L20.785,21.369z M21.223,27.654 c-2.547,0-4.969,0.297-7.404,0.907c-1.096,0.27-1.78,1.145-1.78,2.284c0,1.217,0.953,2.17,2.169,2.17 c0.172,0,0.334-0.037,0.522-0.079c0.101-0.023,0.288-0.065,0.357-0.067l0.101-0.003l0.122-0.023 c2.023-0.467,3.963-0.704,5.768-0.704c3.422,0,6.635,0.812,9.291,2.35l0.025,0.015l0.026,0.013 c0.334,0.168,0.792,0.399,1.327,0.399c1.05,0,2.032-0.766,2.285-1.781l0.03-0.119v-0.123c0-1.202-0.595-1.76-1.178-2.147 l-0.022-0.014l-0.022-0.013C29.455,28.713,25.437,27.654,21.223,27.654L21.223,27.654z" opacity=".05"></path><path d="M21.224,15.938c5.554,0,11.4,1.17,15.785,3.654c0.584,0.293,1.022,0.877,1.022,1.754 c-0.145,1.023-0.877,1.755-1.899,1.755c-0.438,0-0.585-0.146-1.023-0.291c-3.508-2.047-8.769-3.217-13.885-3.217 c-2.631,0-5.262,0.293-7.6,0.877c-0.293,0-0.585,0.146-1.023,0.146c-0.075,0.011-0.149,0.016-0.221,0.016 c-0.905,0-1.533-0.821-1.533-1.77c0-1.023,0.585-1.607,1.315-1.754C14.939,16.231,17.862,15.938,21.224,15.938 M20.785,22.369 c4.97,0,9.793,1.17,13.593,3.507c0.584,0.291,0.877,0.877,0.877,1.461c0,0.878-0.585,1.608-1.462,1.608 c-0.438,0-0.73-0.144-1.023-0.291c-3.068-1.9-7.308-3.071-12.13-3.071c-2.339,0-4.531,0.293-6.139,0.733 c-0.439,0.144-0.585,0.144-0.877,0.144c-0.877,0-1.462-0.73-1.462-1.461c0-0.877,0.439-1.316,1.169-1.607 C15.523,22.808,17.716,22.369,20.785,22.369 M21.223,28.654c4.093,0,7.893,1.021,11.108,2.924 c0.438,0.291,0.731,0.584,0.731,1.314c-0.146,0.586-0.731,1.023-1.315,1.023c-0.292,0-0.585-0.145-0.877-0.292 c-2.777-1.607-6.139-2.484-9.792-2.484c-2.047,0-4.093,0.291-5.993,0.73c-0.292,0-0.731,0.146-0.877,0.146 c-0.731,0-1.169-0.586-1.169-1.17c0-0.73,0.438-1.17,1.023-1.314C16.4,28.945,18.739,28.654,21.223,28.654 M21.224,15.438 c-3.747,0-6.582,0.366-9.188,1.186c-1.042,0.222-1.689,1.078-1.689,2.238c0,1.273,0.893,2.27,2.033,2.27 c0.084,0,0.169-0.005,0.257-0.016c0.28-0.004,0.506-0.055,0.689-0.096c0.119-0.027,0.222-0.05,0.299-0.05h0.061l0.06-0.015 c2.258-0.564,4.844-0.862,7.479-0.862c5.158,0,10.254,1.177,13.633,3.149l0.045,0.026l0.05,0.016 c0.123,0.041,0.221,0.082,0.309,0.119c0.231,0.097,0.47,0.197,0.871,0.197c1.247,0,2.209-0.878,2.394-2.185l0.005-0.035v-0.035 c0-0.985-0.473-1.787-1.298-2.201C33.083,16.794,27.24,15.438,21.224,15.438L21.224,15.438z M20.785,21.869 c-3.054,0-5.24,0.416-7.583,1.04l-0.029,0.008l-0.028,0.011c-0.637,0.254-1.484,0.745-1.484,2.071c0,0.943,0.75,1.961,1.962,1.961 c0.34,0,0.541-0.008,1.033-0.169c1.637-0.447,3.827-0.708,5.983-0.708c4.533,0,8.747,1.064,11.867,2.996 c0.345,0.175,0.725,0.366,1.286,0.366c1.119,0,1.962-0.906,1.962-2.108c0-0.823-0.442-1.554-1.154-1.909 C30.885,23.141,25.965,21.869,20.785,21.869L20.785,21.869z M21.223,28.154c-2.506,0-4.888,0.292-7.283,0.892 c-0.864,0.213-1.401,0.902-1.401,1.799c0,0.821,0.624,1.67,1.669,1.67c0.116,0,0.246-0.029,0.411-0.067 c0.148-0.033,0.351-0.079,0.466-0.079h0.057l0.056-0.013c2.06-0.476,4.038-0.717,5.88-0.717c3.51,0,6.809,0.836,9.542,2.417 c0.331,0.168,0.712,0.359,1.127,0.359c0.827,0,1.601-0.603,1.8-1.402l0.015-0.06v-0.061c0-1.012-0.493-1.424-0.954-1.73 C29.277,29.189,25.348,28.154,21.223,28.154L21.223,28.154z" opacity=".07"></path><path fill="#000000" d="M31.747,33.915c-0.292,0-0.585-0.145-0.877-0.292c-2.777-1.607-6.139-2.484-9.792-2.484 c-2.047,0-4.093,0.291-5.993,0.73c-0.292,0-0.731,0.146-0.877,0.146c-0.731,0-1.169-0.586-1.169-1.17 c0-0.73,0.438-1.17,1.023-1.314c2.338-0.586,4.677-0.877,7.161-0.877c4.093,0,7.893,1.021,11.108,2.924 c0.438,0.291,0.731,0.584,0.731,1.314C32.916,33.478,32.331,33.915,31.747,33.915z M33.793,28.945c-0.438,0-0.73-0.144-1.023-0.291 c-3.068-1.9-7.308-3.071-12.13-3.071c-2.339,0-4.531,0.293-6.139,0.733c-0.439,0.144-0.585,0.144-0.877,0.144 c-0.877,0-1.462-0.73-1.462-1.461c0-0.877,0.439-1.316,1.169-1.607c2.192-0.584,4.385-1.023,7.454-1.023 c4.97,0,9.793,1.17,13.593,3.507c0.584,0.291,0.877,0.877,0.877,1.461C35.255,28.215,34.67,28.945,33.793,28.945z M36.132,23.101 c-0.438,0-0.585-0.146-1.023-0.291c-3.508-2.047-8.769-3.217-13.885-3.217c-2.631,0-5.262,0.293-7.6,0.877 c-0.293,0-0.585,0.146-1.023,0.146c-1.023,0.146-1.754-0.73-1.754-1.754c0-1.023,0.585-1.607,1.315-1.754 c2.777-0.877,5.7-1.17,9.062-1.17c5.554,0,11.4,1.17,15.785,3.654c0.584,0.293,1.022,0.877,1.022,1.754 C37.886,22.369,37.154,23.101,36.132,23.101z"></path></svg>' },
  { id: 'soundcloud-style', name: 'SoundCloud', color: '#ff7700', IconComponent: FaSoundcloud },
  { id: 'apple-music-style', name: 'Apple Music', color: '#FF2D55', IconComponent: FaApple },
  { id: 'paypal-style', name: 'PayPal', color: '#00457C', IconComponent: FaPaypal, svgIcon: '<svg width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="40" height="40" rx="8" ry="8" fill="#003087"/><g transform="translate(13, 6) scale(0.9)"><path d="M20.3305 14.0977C20.3082 14.24 20.2828 14.3856 20.2542 14.5351C19.2704 19.5861 15.9046 21.331 11.606 21.331H9.4173C8.8916 21.331 8.4486 21.7127 8.3667 22.2313L7.2461 29.3381L6.9288 31.3527C6.8755 31.693 7.1379 32 7.4815 32H11.3634C11.8231 32 12.2136 31.666 12.286 31.2127L12.3241 31.0154L13.055 26.3772L13.1019 26.1227C13.1735 25.6678 13.5648 25.3338 14.0245 25.3338H14.6051C18.3661 25.3338 21.3103 23.8068 22.1708 19.388C22.5303 17.5421 22.3442 16.0008 21.393 14.9168C21.1051 14.59 20.748 14.3188 20.3305 14.0977Z" fill="white" /><path d="M19.3009 13.6871C19.1506 13.6434 18.9955 13.6036 18.8364 13.5678C18.6766 13.5328 18.5127 13.5018 18.3441 13.4748C17.754 13.3793 17.1074 13.334 16.4147 13.334H10.5676C10.4237 13.334 10.2869 13.3666 10.1644 13.4254C9.8948 13.5551 9.6944 13.8104 9.6459 14.1229L8.402 22.0013L8.3662 22.2311C8.4481 21.7126 8.8911 21.3308 9.4168 21.3308H11.6055C15.9041 21.3308 19.2699 19.5851 20.2537 14.5349C20.2831 14.3854 20.3078 14.2398 20.33 14.0975C20.0811 13.9655 19.8115 13.8525 19.5212 13.7563C19.4496 13.7324 19.3757 13.7094 19.3009 13.6871Z" fill="white" fill-opacity="0.85"/><path d="M9.6461 14.1231C9.6946 13.8105 9.895 13.5552 10.1646 13.4264C10.2879 13.3675 10.4239 13.3349 10.5678 13.3349H16.4149C17.1077 13.3349 17.7542 13.3803 18.3444 13.4757C18.513 13.5027 18.6768 13.5338 18.8367 13.5687C18.9957 13.6045 19.1508 13.6443 19.3011 13.688C19.3759 13.7103 19.4498 13.7334 19.5222 13.7564C19.8125 13.8527 20.0821 13.9664 20.331 14.0976C20.6237 12.231 20.3287 10.9601 19.3194 9.8093C18.2068 8.5424 16.1986 8 13.629 8H6.169C5.6441 8 5.1963 8.3817 5.1152 8.9011L2.0079 28.5969C1.9467 28.9866 2.2473 29.3381 2.6402 29.3381H7.2458L8.4022 22.0014L9.6461 14.1231Z" fill="white" fill-opacity="0.7"/></g></svg>' },
  { id: 'venmo-style', name: 'Venmo', color: '#3396cd', IconComponent: SiVenmo, svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 -452 516 516">  <rect y="-452" rx="61" height="516" width="516" fill="#3396cd"/>  <path d="M385.16-347c11.1 18.3 16.08 37.17 16.08 61 0 76-64.87 174.7-117.52 244H163.5l-48.2-288.35 105.3-10 25.6 205.17C270-174 299.43-235 299.43-276.56c0-22.77-3.9-38.25-10-51z" fill="#fff"/></svg>' },
  { id: 'telegram-style', name: 'Telegram', color: '#24A1DE', IconComponent: FaTelegram },
  { id: 'discord-style', name: 'Discord', color: '#5865F2', IconComponent: FaDiscord },
  { id: 'pinterest-style', name: 'Pinterest', color: '#E60023', IconComponent: FaPinterest },
  { id: 'reddit-style', name: 'Reddit', color: '#FF4500', IconComponent: FaReddit },
  { id: 'wechat-style', name: 'WeChat', color: '#07C160', IconComponent: FaWeixin },
  { id: 'google-style', name: 'Google', color: '#1976D2', IconComponent: SiGoogle, svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="16" height="16" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path></svg>' },
  { id: 'trustpilot-style', name: 'Trustpilot', color: '#00B67A', IconComponent: SiTrustpilot },
  { id: 'yelp-style', name: 'Yelp', color: '#D32323', IconComponent: FaYelp },
  { id: 'tripadvisor-style', name: 'Tripadvisor', color: '#34E0A1', IconComponent: SiTripadvisor },
  { id: 'wifi-style', name: 'WiFi', color: '#000000', IconComponent: FaWifi },
  { id: 'bluetooth-style', name: 'Bluetooth', color: '#000000', IconComponent: FaBluetoothB },
  { id: 'email-style', name: 'Email', color: '#000000', IconComponent: FaEnvelope },
  { id: 'home-style', name: 'Home', color: '#000000', IconComponent: FaHome },
  { id: 'car-style', name: 'Car', color: '#000000', IconComponent: FaCar },
  { id: 'apple-style', name: 'Apple', color: '#000000', IconComponent: FaApple },
  { id: 'zelle-style', name: 'Zelle', color: '#AA00FF', IconComponent: FaEnvelope, svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="16" height="16" viewBox="0 0 48 48"><path fill="#a0f" d="M35,42H13c-3.866,0-7-3.134-7-7V13c0-3.866,3.134-7,7-7h22c3.866,0,7,3.134,7,7v22 C42,38.866,38.866,42,35,42z"></path><path fill="#fff" d="M17.5,18.5h14c0.552,0,1-0.448,1-1V15c0-0.552-0.448-1-1-1h-14c-0.552,0-1,0.448-1,1v2.5	C16.5,18.052,16.948,18.5,17.5,18.5z"></path><path fill="#fff" d="M17,34.5h14.5c0.552,0,1-0.448,1-1V31c0-0.552-0.448-1-1-1H17c-0.552,0-1,0.448-1,1v2.5	C16,34.052,16.448,34.5,17,34.5z"></path><path fill="#fff" d="M22.25,11v6c0,0.276,0.224,0.5,0.5,0.5h3.5c0.276,0,0.5-0.224,0.5-0.5v-6c0-0.276-0.224-0.5-0.5-0.5	h-3.5C22.474,10.5,22.25,10.724,22.25,11z"></path><path fill="#fff" d="M22.25,32v6c0,0.276,0.224,0.5,0.5,0.5h3.5c0.276,0,0.5-0.224,0.5-0.5v-6c0-0.276-0.224-0.5-0.5-0.5	h-3.5C22.474,31.5,22.25,31.724,22.25,32z"></path><path fill="#fff" d="M16.578,30.938H22l10.294-12.839c0.178-0.222,0.019-0.552-0.266-0.552H26.5L16.275,30.298	C16.065,30.553,16.247,30.938,16.578,30.938z"></path></svg>' },
  { id: 'cashapp-style', name: 'Cash App', color: '#64dd17', IconComponent: FaDollarSign, svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="16" height="16" viewBox="0 0 48 48"><path fill="#64dd17" d="M14,6h20c4.418,0,8,3.582,8,8v20c0,4.418-3.582,8-8,8H14c-4.418,0-8-3.582-8-8V14	C6,9.582,9.582,6,14,6z"></path><path fill="#fafafa" d="M23.056,33.933c-0.122,0-0.245-0.001-0.37-0.004c-3.612-0.088-5.98-2.312-6.781-3.198 c-0.177-0.195-0.171-0.489,0.011-0.68l1.664-1.876c0.178-0.187,0.464-0.209,0.667-0.05c0.738,0.58,2.446,2.054,4.696,2.177 c2.612,0.142,3.829-0.601,3.986-1.736c0.149-1.075-0.375-1.986-3.277-2.739c-5.185-1.345-6.115-4.37-5.796-6.897 c0.335-2.659,3.09-4.777,6.285-4.745c4.566,0.047,7.38,2.086,8.361,2.938c0.22,0.191,0.225,0.525,0.018,0.73l-1.581,1.786 c-0.165,0.164-0.422,0.195-0.617,0.068c-0.799-0.52-2.392-2.074-5.236-2.074c-1.75,0-2.816,0.668-2.927,1.541 c-0.154,1.22,0.661,2.274,3.155,2.837c5.527,1.247,6.457,4.467,5.87,7.068C30.644,31.474,27.907,33.933,23.056,33.933z"></path><path fill="#fafafa" d="M28.032,16.592l0.839-3.99C28.937,12.292,28.699,12,28.382,12h-3.065 c-0.236,0-0.441,0.166-0.489,0.397l-0.843,4.011L28.032,16.592z"></path><path fill="#fafafa" d="M20.916,31l-0.925,4.397C19.926,35.708,20.163,36,20.481,36h3.065c0.236,0,0.441-0.166,0.489-0.397 L25.003,31H20.916z"></path></svg>' },
  { id: 'googlemaps-style', name: 'Google Maps', color: '#2A81E3', IconComponent: FaMap, svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="16" height="16" viewBox="0 0 48 48"><path fill="#48b564" d="M35.76,26.36h0.01c0,0-3.77,5.53-6.94,9.64c-2.74,3.55-3.54,6.59-3.77,8.06	C24.97,44.6,24.53,45,24,45s-0.97-0.4-1.06-0.94c-0.23-1.47-1.03-4.51-3.77-8.06c-0.42-0.55-0.85-1.12-1.28-1.7L28.24,22l8.33-9.88	C37.49,14.05,38,16.21,38,18.5C38,21.4,37.17,24.09,35.76,26.36z"></path><path fill="#fcc60e" d="M28.24,22L17.89,34.3c-2.82-3.78-5.66-7.94-5.66-7.94h0.01c-0.3-0.48-0.57-0.97-0.8-1.48L19.76,15	c-0.79,0.95-1.26,2.17-1.26,3.5c0,3.04,2.46,5.5,5.5,5.5C25.71,24,27.24,23.22,28.24,22z"></path><path fill="#2c85eb" d="M28.4,4.74l-8.57,10.18L13.27,9.2C15.83,6.02,19.69,4,24,4C25.54,4,27.02,4.26,28.4,4.74z"></path><path fill="#ed5748" d="M19.83,14.92L19.76,15l-8.32,9.88C10.52,22.95,10,20.79,10,18.5c0-3.54,1.23-6.79,3.27-9.3	L19.83,14.92z"></path><path fill="#5695f6" d="M28.24,22c0.79-0.95,1.26-2.17,1.26-3.5c0-3.04-2.46-5.5-5.5-5.5c-1.71,0-3.24,0.78-4.24,2L28.4,4.74	c3.59,1.22,6.53,3.91,8.17,7.38L28.24,22z"></path></svg>' },
];

export const sampleQrDesigns: QrSampleProps[] = [
  {
    id: 'style-none',
    name: 'Plain QR',
    svgWrapper: qrCodeElement => qrCodeElement, // Simply return the QR code without wrapping
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
