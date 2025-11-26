import type { LocalePrefixMode } from 'next-intl/routing';

const localePrefix: LocalePrefixMode = 'as-needed';

// App configuration variables for QR Profile Management System
export const AppConfig = {
  // App info
  name: 'QR Profile Management',
  title: 'QR Profile Management - Digital Profile & QR Code Management Platform',
  description: 'A modern platform to create, customize, manage, and track QR codes for digital profiles, campaigns, and customer engagement. Built with Next.js 15, React 19, TypeScript, and Tailwind CSS.',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://www.tapnfc.co',

  // SEO defaults
  titleSeparator: ' | ',
  locale: 'en_US',
  author: 'Code Huddle',
  twitterHandle: '@codehuddle',

  // Internationalization settings
  locales: ['en'],
  defaultLocale: 'en',
  localePrefix,

  // Theme settings
  defaultTheme: 'system', // 'light', 'dark', or 'system'

  // Contact information
  contactEmail: 'info@codehuddle.com',

  // Social media
  social: {
    github: 'https://github.com/code-huddle/qr-profile-management',
    twitter: 'https://twitter.com/code-huddle',
    linkedin: 'https://linkedin.com/company/code-huddle',
  },

  // Analytics
  googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID,

  // Feature flags
  features: {
    darkMode: true,
    auth: true,
    analytics: true,
    qrCodeGeneration: true,
    designEditor: true,
    customerManagement: true,
    csvImport: true,
    realTimePreview: true,
    autoSave: true,
    undoRedo: true,
    templates: true,
    publicSharing: true,
    scanTracking: true,
    fileUpload: true,
    internationalization: true,
  },

};
