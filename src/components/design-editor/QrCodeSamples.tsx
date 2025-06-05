'use client';

import { QrCode } from 'lucide-react';

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
const qrX = 20;
const qrY = 20;

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
];

type QrCodeSamplesProps = {
  onSampleSelect: (selectedSample: QrSampleProps | null) => void;
  currentSelectedId?: string | null;
};

export function QrCodeSamples({ onSampleSelect, currentSelectedId }: QrCodeSamplesProps) {
  const handleSelect = (sample: QrSampleProps) => {
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
    <div className="mb-6">
      <h4 className="mb-3 text-center font-semibold text-gray-700">Choose a Style</h4>
      <div className="grid grid-cols-4 gap-3 gap-y-6 sm:grid-cols-4 lg:grid-cols-5">
        {sampleQrDesigns.map((sample) => {
          const isSelected = currentSelectedId === sample.id;
          return (
            <button
              key={sample.id}
              type="button"
              title={sample.name}
              className={`group relative flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 bg-white p-1.5 shadow-sm transition-all duration-200 hover:border-blue-400 hover:shadow-md focus:outline-none ${isSelected ? 'border-blue-600 shadow-lg ring-2 ring-blue-300' : 'border-gray-200'}`}
              onClick={() => handleSelect(sample)}
            >
              <div className="absolute inset-0 flex size-full scale-90 items-center justify-center p-0.5 transition-transform group-hover:scale-100">
                {renderSampleContent(sample)}
              </div>
              <span
                className={`absolute inset-x-0 -bottom-5 py-0.5 text-center text-[10px] font-medium transition-all duration-200 ${isSelected ? 'text-blue-700 opacity-100' : 'text-gray-600 opacity-0 group-hover:opacity-100'}`}
              >
                {sample.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
