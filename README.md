# QR Profile Management System

<div align="center">
  <img src="public/assets/images/logo.svg" alt="QR Profile Management Logo" width="180" />
  <h3>Modern QR Code Management for Digital Profiles</h3>
  <p>Create, customize, track, and manage QR codes with powerful analytics and design tools</p>

  <div>
    <img src="https://img.shields.io/badge/Next.js-15.0-black?style=flat-square&logo=next.js" alt="Next.js 15" />
    <img src="https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react" alt="React 19" />
    <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript" alt="TypeScript 5" />
    <img src="https://img.shields.io/badge/Tailwind-3.0-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind 3" />
  </div>
</div>

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Setup](#environment-setup)
  - [Development](#development)
- [Architecture](#-architecture)
  - [Core Principles](#core-principles)
  - [Data Flow](#data-flow)
  - [Project Structure](#project-structure)
  - [Key Components](#key-components)
- [Core Functionality](#-core-functionality)
  - [QR Code Generation](#qr-code-generation)
  - [Design Editor](#design-editor)
  - [Analytics Dashboard](#analytics-dashboard)
  - [Customer Management](#customer-management)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)
- [Support](#-support)

## 🔍 Overview

QR Profile Management System is a comprehensive platform for creating, managing, and tracking QR codes for digital profiles, business cards, and customer engagement. Built with the latest web technologies, it offers a seamless experience for businesses and individuals to create custom QR codes with advanced design capabilities, real-time analytics, and customer management tools.

This document serves as a guide for new developers to understand the project's architecture, features, and development process.

## ✨ Key Features

### QR Code Management

- **Dynamic QR Code Generation** - Create custom QR codes for various data types (URLs, vCards, WiFi, text, email, etc.)
- **Customization Options** - Personalize QR codes with colors, logos, shapes, and styles
- **Bulk Operations** - Generate and manage QR codes in bulk
- **Version Control** - Track changes and maintain QR code history

### Design Editor

- **Visual Editor** - Drag-and-drop interface for designing QR codes and digital profiles
- **Template System** - Pre-built and custom templates for various use cases
- **Real-time Preview** - Instantly see how your QR codes will look
- **Image-to-QR Conversion** - Transform images into scannable QR codes

### Analytics & Tracking

- **Scan Analytics** - Track scans with geographic and temporal data
- **Engagement Metrics** - Measure conversion rates and user interactions
- **Custom Reports** - Generate detailed reports with filtering options
- **Real-time Dashboard** - Monitor performance with live updates

### Customer Management

- **Profile Management** - Organize customer data and preferences
- **Segmentation** - Group customers by tags, categories, and behavior
- **Import/Export** - Easily transfer data with CSV support
- **QR Assignment** - Link QR codes to specific customers or campaigns

## 🛠️ Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **React 19** - UI library with latest features
- **TypeScript** - Type-safe code
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible UI primitives
- **Fabric.js** - Canvas manipulation for design editor
- **Framer Motion** - Animations and transitions
- **Recharts** - Data visualization

### Backend & Infrastructure

- **NextAuth.js v5** - Authentication system
- **IndexedDB** - Client-side storage for designs
- **Next.js API Routes** - Serverless functions
- **Supabase** - Database and storage

### Development Tools

- **ESLint** - Code quality
- **Prettier** - Code formatting
- **Vitest** - Unit testing
- **Playwright** - E2E testing
- **Husky** - Git hooks
- **Commitlint** - Commit message standardization

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher
- Git

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/qr-profile-management.git
cd qr-profile-management
```

2. Install dependencies:

```bash
npm install
```

### Environment Setup

1. Copy the example environment file:

```bash
cp env.example .env.local
```

2. Update `.env.local` with your configuration:

```env
# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Authentication
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000

# OAuth Providers (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Database (if using Supabase)
DATABASE_URL=your-database-url

# Monitoring (optional)
SENTRY_DSN=your-sentry-dsn
```

### Development

1. Start the development server:

```bash
npm run dev
```

2. Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

## 📐 Architecture

This project is built on a modern, scalable architecture leveraging the full potential of Next.js 15 and the App Router. Our philosophy is to keep the frontend and backend concerns clearly separated where possible, while taking advantage of React Server Components (RSCs) for performance and data fetching.

### Core Principles

-   **Server-First:** We prioritize React Server Components (RSCs) for data fetching and rendering, minimizing the amount of client-side JavaScript. This leads to faster initial page loads and better SEO.
-   **Client-Side Interactivity:** Client components (`'use client'`) are used judiciously for interactive UI elements, state management, and browser-specific APIs.
-   **Modularity and Colocation:** The project is organized by features. Components, pages, hooks, and even API routes related to a specific feature are often located together, making the codebase easier tonavigate and maintain.
-   **Type Safety:** TypeScript is used throughout the project to ensure type safety, reduce runtime errors, and improve developer experience.
-   **Separation of Concerns:** While features are colocated, we maintain a clear separation between UI components, business logic (hooks, stores), and data fetching (server components, API routes).

### Data Flow

1.  A user requests a page.
2.  Next.js App Router maps the request to the corresponding page in `src/app`.
3.  If the page is an RSC (the default), it fetches data directly on the server (e.g., from Supabase or an external API).
4.  The server renders the page component and streams the HTML to the client.
5.  Client components are hydrated on the client-side, enabling interactivity.
6.  Client-side data mutations are handled through API routes (`src/app/api`) or server actions, which then revalidate data and update the UI.
7.  Client-side state is managed using Zustand for global state and React's built-in hooks (`useState`, `useReducer`) for local component state.

### Project Structure

The project follows a feature-based structure within the `src` directory, promoting modularity and maintainability. Here is a detailed breakdown:

```
qr-profile-management/
├── public/                 # Static assets accessible from the browser (images, fonts, favicons).
├── scripts/                # Utility scripts for development or deployment tasks.
├── src/
│   ├── app/                # Next.js App Router: Contains all pages, layouts, and API routes.
│   │   ├── [locale]/       # Dynamic route for internationalization (i18n). All user-facing routes are nested here.
│   │   │   ├── (auth)/     # Route group for authentication pages. The parentheses mean this segment is not part of the URL path.
│   │   │   ├── (main)/     # Route group for the main public-facing pages (e.g., landing page).
│   │   │   ├── dashboard/  # Protected dashboard area. Each sub-folder is a dashboard section.
│   │   │   ├── design/     # Pages related to the QR code and profile design editor.
│   │   │   ├── preview/    # Public preview pages for shared designs.
│   │   │   └── layout.tsx  # Root layout for the application within a locale.
│   │   ├── api/            # API routes. Used for server-side logic, data mutations, and secure operations.
│   │   ├── global-error.tsx # Global error boundary for the application.
│   │   ├── robots.ts       # Generates the robots.txt file.
│   │   └── sitemap.ts      # Generates the sitemap.xml file.
│   ├── components/         # Reusable React components.
│   │   ├── common/         # General-purpose components used across multiple features (e.g., buttons, inputs, modals).
│   │   ├── customers/      # Components specific to the customer management feature.
│   │   ├── dashboard/      # Components used to build the dashboard pages.
│   │   ├── design-editor/  # Components for the visual design editor, organized by sub-feature.
│   │   ├── forms/          # Form components, often integrated with react-hook-form.
│   │   ├── layout/         # Layout components like headers, sidebars, and footers.
│   │   ├── qr/             # Components specifically for displaying and interacting with QR codes.
│   │   ├── template-editor/ # Components for the template editor.
│   │   └── ui/             # Low-level UI primitives, often wrappers around Radix UI components (e.g., Card, Dialog, Tooltip).
│   ├── hooks/              # Custom React hooks for reusable logic (e.g., `useMobile`, `useToast`).
│   ├── lib/                # Core libraries, helper functions, and major integrations (e.g., `indexedDB.ts`, `canvasToHtml.ts`).
│   ├── libs/               # Third-party service initializations and configurations (e.g., `Arcjet`, `i18n`).
│   ├── locales/            # Translation files for internationalization (i18n).
│   ├── stores/             # Global state management using Zustand.
│   ├── styles/             # Global CSS files and styles.
│   ├── templates/          # Base page templates and Storybook stories.
│   ├── types/              # Global TypeScript type definitions (e.g., `next-auth.d.ts`).
│   ├── utils/              # General utility functions that don't fit in `lib`.
│   └── validations/        # Zod validation schemas for forms and API requests.
├── supabase/               # Supabase database migrations.
├── tests/                  # Test files.
│   ├── e2e/                # End-to-end tests using Playwright.
│   └── integration/        # Integration tests.
├── auth.ts                 # NextAuth.js v5 configuration.
├── next.config.ts          # Next.js configuration file.
├── tailwind.config.ts      # Tailwind CSS configuration file.
└── tsconfig.json           # TypeScript configuration file.
```

### Key Components

- **Design Editor (`src/components/design-editor`)** - A comprehensive module for creating and customizing QR codes and digital profiles. It leverages Fabric.js for canvas manipulation and includes features like a template system, real-time preview, and various design tools.
- **QR Code Generator (`src/components/qr`)** - The core functionality for generating different types of QR codes. This component is highly customizable and can be integrated into various parts of the application.
- **Analytics Dashboard (`src/components/dashboard`)** - A data-driven module that provides insights into QR code performance through charts, graphs, and reports. It uses Recharts for data visualization.
- **Customer Management (`src/components/customers`)** - A dedicated module for managing customer profiles, including data storage, segmentation, and QR code assignment.

## 💡 Core Functionality

### QR Code Generation

The system supports a wide range of QR code types, each with its own set of customizable options:

- **URL QR Codes**: Link to any website or web page. Ideal for marketing campaigns and directing users to online content.
- **vCard QR Codes**: Share contact information seamlessly. Users can scan the code to add a new contact to their address book.
- **WiFi QR Codes**: Provide instant access to a WiFi network. Users can connect without manually entering the network name and password.
- **Text QR Codes**: Display plain text messages. Useful for sharing information, notes, or instructions.
- **Email QR Codes**: Open the user's default email client with a pre-filled recipient, subject, and body.
- **Custom QR Codes**: Create specialized QR codes for unique use cases, such as event check-ins, product authentication, or custom application deep links.

### Design Editor

The design editor is a powerful, user-friendly tool for creating visually appealing QR codes and digital profiles:

- **Canvas Manipulation**: Full control over design elements, including resizing, rotating, and positioning.
- **Layer Management**: Easily organize and manage design elements with z-index control.
- **Text Formatting**: A rich set of typography controls, including fonts, sizes, colors, and styles.
- **Shape Library**: A collection of predefined shapes and icons that can be added and customized.
- **Background Options**: A variety of background styles, including solid colors, gradients, and patterns.
- **Template System**: The ability to save, load, and share design templates for consistent branding and quick creation.

### Analytics Dashboard

The analytics dashboard provides comprehensive insights into QR code performance:

- **Scan Metrics**: Track key metrics such as total scans, unique scans, and scan frequency to understand user engagement.
- **Geographic Data**: Visualize scan locations on a map to identify where your QR codes are most effective.
- **Time Analysis**: Analyze scan patterns over time to measure campaign performance and user trends.
- **Device Breakdown**: Understand your audience better by seeing which devices are used to scan your QR codes.
- **Conversion Tracking**: Measure the effectiveness of your QR codes by tracking actions taken after scanning, such as form submissions or purchases.

### Customer Management

The customer management system is a complete solution for organizing and engaging with your users:

- **Customer Profiles**: Store and manage detailed customer information, including contact details, preferences, and interaction history.
- **Segmentation**: Group customers based on various attributes or behaviors to create targeted campaigns and personalized experiences.
- **QR Code Assignment**: Link specific QR codes to individual customers or customer groups for personalized tracking and engagement.
- **CSV Import/Export**: Easily manage customer data in bulk by importing from or exporting to CSV files.
- **Activity Tracking**: Monitor customer interactions with QR codes to gain insights into their behavior and preferences.

## 🌐 Deployment

### Vercel Deployment

This project is optimized for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Configure environment variables in the Vercel dashboard
3. Deploy automatically with each push to the main branch

### Other Hosting Options

The project can also be deployed to other hosting platforms:

1. Build the production version:

```bash
npm run build
```

2. Start the production server:

```bash
npm run start
```

## 🤝 Contributing

We welcome contributions to the QR Profile Management System! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Run tests: `npm run test`
5. Commit your changes: `npm run commit`
6. Push to your branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

Please see our [Contributing Guide](CONTRIBUTING.md) for more details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Documentation**: [docs.qrprofile.com](https://docs.qrprofile.com)
- **Issues**: [GitHub Issues](https://github.com/your-username/qr-profile-management/issues)
- **Email**: support@qrprofile.com
- **Discord**: [Join our community](https://discord.gg/qrprofile)

---

<div align="center">
  <p>Built with ❤️ using Next.js, React, and TypeScript</p>
  <p>© 2024 QR Profile Management System</p>
</div>
