# QR Profile Management System

🚀 A modern, full-featured QR Profile Management System built with Next.js 15, TypeScript, and Tailwind CSS. Create, manage, and track QR codes for digital profiles, business cards, and customer engagement.

## ✨ Features

### 🎯 Core QR Management
- **Dynamic QR Code Generation** - Create custom QR codes with various data types
- **Profile Templates** - Pre-built templates for business cards, social profiles, and more
- **Real-time Analytics** - Track scans, locations, and engagement metrics
- **Customer Management** - Organize and manage customer profiles and QR assignments
- **Bulk Operations** - Import/export customer data and generate QR codes in bulk

### 🛠️ Technical Excellence
- ⚡ **Next.js 15** with App Router and React 19
- 🔥 **TypeScript** for type safety and better developer experience
- 💎 **Tailwind CSS** with custom design system and dark mode
- 🔐 **NextAuth.js v5** with multiple authentication providers
- 🌐 **Internationalization** (i18n) with next-intl
- 📱 **Responsive Design** optimized for all devices
- 🎨 **Modern UI Components** with Radix UI and custom animations

### 🔧 Developer Experience
- 📏 **ESLint** with Antfu configuration
- 💖 **Prettier** for consistent code formatting
- 🦊 **Husky** for Git hooks and pre-commit validation
- 🚓 **Commitlint** for conventional commit messages
- 🦺 **Vitest** for unit testing with React Testing Library
- 🧪 **Playwright** for E2E testing
- 📚 **Storybook** for component development
- 🚨 **Sentry** for error monitoring and performance tracking

### 🚀 Production Ready
- ☂️ **Code Coverage** with Codecov integration
- 📝 **Logging** with Pino.js and structured logging
- 🖥️ **Monitoring** with Checkly for uptime and performance
- 🔐 **Security** with Arcjet for bot protection and rate limiting
- 🎁 **Automated Releases** with semantic versioning
- 🗺️ **SEO Optimized** with metadata, sitemap, and robots.txt

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ and npm
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-org/qr-profile-management.git
cd qr-profile-management
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```env
# Database
DATABASE_URL="your-database-url"

# Authentication
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Monitoring (optional)
SENTRY_DSN="your-sentry-dsn"
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
qr-profile-management/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── [locale]/          # Internationalized routes
│   │   │   ├── (auth)/        # Authentication pages
│   │   │   └── dashboard/     # Main application
│   │   │       ├── analytics/ # Analytics dashboard
│   │   │       ├── customers/ # Customer management
│   │   │       ├── profile/   # Profile management
│   │   │       ├── qr-codes/  # QR code management
│   │   │       ├── settings/  # Application settings
│   │   │       └── templates/ # Template management
│   │   └── api/               # API routes
│   ├── components/            # React components
│   │   ├── common/           # Shared components
│   │   ├── customers/        # Customer-specific components
│   │   ├── dashboard/        # Dashboard components
│   │   ├── forms/            # Form components
│   │   ├── layout/           # Layout components
│   │   ├── qr/               # QR code components
│   │   ├── template-editor/  # Template editor
│   │   └── ui/               # UI primitives
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utility libraries
│   ├── stores/               # State management (Zustand)
│   ├── types/                # TypeScript type definitions
│   ├── utils/                # Utility functions
│   └── validations/          # Zod validation schemas
├── public/                   # Static assets
├── tests/                    # Test files
│   ├── e2e/                 # End-to-end tests
│   └── integration/         # Integration tests
└── docs/                    # Documentation
```

## 🎯 Key Features Guide

### QR Code Management
- Create QR codes for various data types (URLs, text, contact info, WiFi, etc.)
- Customize QR code appearance with colors, logos, and styles
- Generate QR codes in bulk from CSV imports
- Track scan analytics and performance metrics

### Profile Templates
- Pre-built templates for business cards, social profiles, and contact cards
- Drag-and-drop template editor with real-time preview
- Custom field mapping and data validation
- Template sharing and collaboration features

### Customer Management
- Import customers from CSV files or manual entry
- Organize customers with tags, groups, and custom fields
- Assign QR codes to specific customers or campaigns
- Track customer engagement and scan history

### Analytics Dashboard
- Real-time scan tracking and geographic data
- Performance metrics and conversion rates
- Export analytics data for reporting
- Custom date ranges and filtering options

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server with Turbo
npm run build           # Build for production
npm run start           # Start production server

# Code Quality
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint issues
npm run check-types     # TypeScript type checking

# Testing
npm run test            # Run unit tests
npm run test:e2e        # Run E2E tests

# Tools
npm run storybook       # Start Storybook
npm run commit          # Interactive commit with Commitizen
npm run generate:component # Generate new component
```

### Code Style

This project follows strict code quality standards:

- **TypeScript** for type safety
- **ESLint** with Antfu configuration
- **Prettier** for code formatting
- **Conventional Commits** for commit messages
- **Husky** for pre-commit hooks

### Testing Strategy

- **Unit Tests**: Vitest + React Testing Library
- **Integration Tests**: Playwright
- **E2E Tests**: Playwright with visual testing
- **Component Tests**: Storybook with interaction testing

## 🚀 Deployment

### Environment Variables

Required environment variables for production:

```env
# Database
DATABASE_URL=

# Authentication
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# Optional: OAuth Providers
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# Optional: Monitoring
SENTRY_DSN=
SENTRY_ORG=
SENTRY_PROJECT=

# Optional: Analytics
NEXT_PUBLIC_GA_ID=
```

### Build and Deploy

```bash
# Build for production
npm run build

# Start production server
npm run start
```

### Vercel Deployment

This project is optimized for Vercel deployment:

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Run the test suite: `npm run test`
5. Commit using conventional commits: `npm run commit`
6. Push to your branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Radix UI](https://www.radix-ui.com/) for accessible UI primitives
- [Vercel](https://vercel.com/) for hosting and deployment platform

## 📞 Support

- 📧 Email: support@yourcompany.com
- 💬 Discord: [Join our community](https://discord.gg/yourserver)
- 📖 Documentation: [docs.yourcompany.com](https://docs.yourcompany.com)
- 🐛 Issues: [GitHub Issues](https://github.com/your-org/qr-profile-management/issues)

---

Built with ❤️ by [Your Team Name](https://yourcompany.com)
