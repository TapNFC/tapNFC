import type { Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';

export default {
  darkMode: ['class'],
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'var(--font-poppins)',
          'Poppins',
          '-apple-system',
          'BlinkMacSystemFont',
          'sans-serif',
        ],
        mono: [
          'JetBrains Mono',
          'Consolas',
          'monospace',
        ],
      },
      fontSize: {
        'xs': [
          '0.75rem',
          {
            lineHeight: '1rem',
          },
        ],
        'sm': [
          '0.875rem',
          {
            lineHeight: '1.25rem',
          },
        ],
        'base': [
          '1rem',
          {
            lineHeight: '1.5rem',
          },
        ],
        'lg': [
          '1.125rem',
          {
            lineHeight: '1.75rem',
          },
        ],
        'xl': [
          '1.25rem',
          {
            lineHeight: '1.75rem',
          },
        ],
        '2xl': [
          '1.5rem',
          {
            lineHeight: '2rem',
          },
        ],
        '3xl': [
          '1.875rem',
          {
            lineHeight: '2.25rem',
          },
        ],
        '4xl': [
          '2.25rem',
          {
            lineHeight: '2.5rem',
          },
        ],
        '5xl': [
          '3rem',
          {
            lineHeight: '1',
          },
        ],
      },
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      spacing: {
        '1': '0.25rem',
        '2': '0.5rem',
        '3': '0.75rem',
        '4': '1rem',
        '5': '1.25rem',
        '6': '1.5rem',
        '8': '2rem',
        '10': '2.5rem',
        '12': '3rem',
        '16': '4rem',
        '20': '5rem',
        'qr-xs': '4rem',
        'qr-sm': '6rem',
        'qr-md': '8rem',
        'qr-lg': '12rem',
        'qr-xl': '16rem',
      },
      borderRadius: {
        'sm': 'var(--radius-sm)',
        'md': 'var(--radius-md)',
        'lg': 'var(--radius-lg)',
        'xl': 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        'full': '9999px',
        'qr': '0.5rem',
      },
      colors: {
        'primary-blue': {
          DEFAULT: 'hsl(var(--primary-blue))',
          dark: 'hsl(var(--primary-blue-dark))',
          light: 'hsl(var(--primary-blue-light))',
        },
        'qr': {
          foreground: 'hsl(var(--qr-foreground, 0 0% 0%))',
          background: 'hsl(var(--qr-background, 0 0% 100%))',
          accent: 'hsl(var(--qr-accent, 217 91% 60%))',
          error: 'hsl(var(--qr-error, 0 84% 60%))',
          success: 'hsl(var(--qr-success, 142 76% 36%))',
        },
        'template': {
          business: 'hsl(var(--template-business, 217 91% 60%))',
          social: 'hsl(var(--template-social, 262 83% 58%))',
          contact: 'hsl(var(--template-contact, 142 76% 36%))',
          event: 'hsl(var(--template-event, 25 95% 53%))',
          wifi: 'hsl(var(--template-wifi, 199 89% 48%))',
        },
        'neutral': {
          50: 'hsl(var(--neutral-50))',
          100: 'hsl(var(--neutral-100))',
          200: 'hsl(var(--neutral-200))',
          300: 'hsl(var(--neutral-300))',
          400: 'hsl(var(--neutral-400))',
          500: 'hsl(var(--neutral-500))',
          600: 'hsl(var(--neutral-600))',
          700: 'hsl(var(--neutral-700))',
          800: 'hsl(var(--neutral-800))',
          900: 'hsl(var(--neutral-900))',
        },
        'success': 'hsl(var(--success))',
        'warning': 'hsl(var(--warning))',
        'error': 'hsl(var(--error))',
        'info': 'hsl(var(--info))',
        'bg-primary': 'hsl(var(--bg-primary))',
        'bg-secondary': 'hsl(var(--bg-secondary))',
        'bg-tertiary': 'hsl(var(--bg-tertiary))',
        'background': 'hsl(var(--background))',
        'foreground': 'hsl(var(--foreground))',
        'card': {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        'popover': {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        'primary': {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        'secondary': {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        'muted': {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        'accent': {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        'destructive': {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        'border': 'hsl(var(--border))',
        'input': 'hsl(var(--input))',
        'ring': 'hsl(var(--ring))',
        'chart': {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
        'sidebar': {
          'DEFAULT': 'hsl(var(--sidebar-background))',
          'foreground': 'hsl(var(--sidebar-foreground))',
          'primary': 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          'accent': 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          'border': 'hsl(var(--sidebar-border))',
          'ring': 'hsl(var(--sidebar-ring))',
        },
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.08)',
        'medium': '0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.06)',
        'strong': '0 8px 24px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.08)',
        'qr': '0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)',
        'qr-hover': '0 8px 24px rgba(0, 0, 0, 0.2), 0 4px 8px rgba(0, 0, 0, 0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'qr-scan': 'qrScan 2s ease-in-out infinite',
        'qr-generate': 'qrGenerate 0.5s ease-out',
        'accordionDown': 'accordionDown 0.2s ease-out',
        'accordionUp': 'accordionUp 0.2s ease-out',
        'slideDownAndFade': 'slideDownAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        'slideLeftAndFade': 'slideLeftAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        'slideUpAndFade': 'slideUpAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        'slideRightAndFade': 'slideRightAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        'enterFromRight': 'enterFromRight 250ms ease',
        'enterFromLeft': 'enterFromLeft 250ms ease',
        'exitToRight': 'exitToRight 250ms ease',
        'exitToLeft': 'exitToLeft 250ms ease',
        'scaleIn': 'scaleIn 200ms ease',
        'scaleOut': 'scaleOut 200ms ease',
        'fadeIn': 'fadeIn 200ms ease',
        'fadeOut': 'fadeOut 200ms ease',
        'ping': 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin': 'spin 1s linear infinite',
        'bounce': 'bounce 1s infinite',
        'qrScan': 'qrScan 1.5s ease-in-out infinite',
        'qrGenerate': 'qrGenerate 0.6s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          from: {
            opacity: '0',
          },
          to: {
            opacity: '1',
          },
        },
        slideUp: {
          from: {
            opacity: '0',
            transform: 'translateY(10px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        slideDown: {
          from: {
            opacity: '0',
            transform: 'translateY(-10px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        scaleIn: {
          from: {
            opacity: '0',
            transform: 'scale(0.95)',
          },
          to: {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
        qrScan: {
          '0%, 100%': {
            transform: 'translateY(0)',
            opacity: '0.7',
          },
          '50%': {
            transform: 'translateY(-4px)',
            opacity: '1',
          },
        },
        qrGenerate: {
          '0%': {
            opacity: '0',
            transform: 'scale(0.8) rotate(-5deg)',
          },
          '50%': {
            opacity: '0.5',
            transform: 'scale(1.05) rotate(2deg)',
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1) rotate(0deg)',
          },
        },
        shimmer: {
          '100%': {
            transform: 'translateX(100%)',
          },
        },
      },
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      aspectRatio: {
        qr: '1 / 1',
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
