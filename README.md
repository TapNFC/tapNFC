# QR Profile Management System

A modern, production-ready platform to create, customize, manage, and track QR codes for digital profiles, campaigns, and customer engagement. Built with Next.js App Router, React Server Components, Supabase, and a polished UX for creators and teams

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-15.3-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

</div>

---

## 📚 Table of Contents

- [Overview](#overview)
- [Who is this for?](#who-is-this-for)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Data Model](#data-model)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Local Setup](#local-setup)
  - [Apply Database Migrations](#apply-database-migrations)
  - [Run the App](#run-the-app)
- [Project Structure](#project-structure)
- [User Workflows](#user-workflows)
  - [Create a Design](#create-a-design)
  - [Design Editor Essentials](#design-editor-essentials)
  - [Generate and Download QR Codes](#generate-and-download-qr-codes)
  - [Rename and Regenerate QR Codes](#rename-and-regenerate-qr-codes)
  - [Public Preview & Scans](#public-preview--scans)
  - [Dashboard & Analytics](#dashboard--analytics)
- [API Reference](#api-reference)
  - [Auth & Session](#auth--session)
  - [Designs](#designs)
  - [QR Codes](#qr-codes)
  - [Scans](#scans)
  - [Dashboard Overview](#dashboard-overview)
- [Internationalization (i18n)](#internationalization-i18n)
- [Security & Compliance](#security--compliance)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [References & Further Reading](#references--further-reading)
- [License](#license)

---

## Overview

Use this app to design branded QR experiences and manage them at scale:
- Build designs visually (Fabric.js canvas) with auto-save, undo/redo, and real-time preview
- Generate QR codes from designs and download in multiple sizes
- Share public previews, capture scans, and view analytics
- Keep customers organized and link designs to brand assets

This project embraces React Server Components and SSR data fetching for performance and security while using client components for rich interactivity.

---

## Who is this for?

- Beginners who want a step-by-step, batteries-included app to learn Next.js 15, RSC, and Supabase
- Product teams who need a QR creation/management portal with auth, RLS, and storage
- Contributors who prefer a typed, tested, and extensible architecture with great DX

---

## Key Features

- **QR Code Management**
  - Create, edit, archive, restore, delete (with “safe bulk” behavior for owned resources)
  - Grid/list views, search, in-place rename, download/export options
- **Design Editor (Fabric.js)**
  - Drag-and-drop canvas, contextual toolbars (text, links, social icons)
  - Auto-save every change, undo/redo, keyboard shortcuts, and real-time preview
  - Templates: create, duplicate, toggle public/private, JSON export-ready data model
- **Customers**
  - CRUD profiles with brand fields and social links
  - CSV import and typed mapping
- **Analytics**
  - Dashboard cards: total designs, QR codes, customers, scans
  - Per-design stats via `/api/qr-codes/[id]` and scan tracking via `/api/scan/[id]`
- **Production Essentials**
  - Supabase SSR auth with cookie refresh in middleware
  - Strict env validation via `@t3-oss/env-nextjs`
  - i18n with `next-intl` and locale-aware routing
  - Optional Arcjet protection and Sentry client monitoring

---

## Architecture

High-level view of the runtime components and data flow:

```mermaid
flowchart TD
  Browser["React 19 UI (RSC + Client)"] -->|Fetch| API["Next.js App Router API (src/app/api)"]
  API -->|SSR Auth + RLS| DB[(Supabase Postgres)]
  API -->|Storage SDK| Storage[(Supabase Storage)]
  API -->|Service Role (server-only)| DB
  Browser -->|Public POST| ScanEndpoint["/api/scan/[id]"]
  ScanEndpoint --> DB
  Browser -->|GET| QRStats["/api/qr-codes/[id]"]
  QRStats -->|Service Role| DB
  subgraph Security
    Arcjet[Arcjet Bot/Rate Rules]
    RLS[Row-Level Security]
  end
  Browser --> Arcjet
  DB --> RLS
```

- **Routing**: App Router under `src/app`, locale segment at `src/app/[locale]`, API routes under `src/app/api`
- **Auth**: Supabase SSR clients in `src/utils/supabase/*` with session refresh in `src/middleware.ts`
- **State**: Local hooks and Zustand stores (editor/UI)
- **Data**: Postgres schema + RLS under `src/utils/supabase/migrations`
- **Storage**: Buckets `designs` and `customer-logos` with RLS policies and ownership checks

---

## Data Model

Core tables and important columns (see SQL in `src/utils/supabase/migrations`):

- `designs` (`20240730120000_create_designs_table.sql`)
  - id, user_id, name, description, tags[]
  - canvas_data JSONB, preview_url, qr_code_url, qr_code_data
  - is_template, is_public, is_archived
  - created_at, updated_at (trigger auto-updates)
  - RLS: owners can CRUD; everyone can read `is_public = true`
- `customers` (`20240728120000_create_customers_table.sql`)
  - Linked to `auth.users` via user_id
  - Typical business fields: name, email (unique per user), phone, website, brand_color, social links
  - RLS: owners-only CRUD/select
- `qr_code_scans` (`20240804120000_create_qr_code_scans_table.sql`)
  - design_id (FK to `designs`), device/browser/os/referrer/ip, created_at
  - Indexes on `design_id`, `created_at`
  - RLS: owners can select scans of their designs; insert allowed for `authenticated, anon` (to record public scans)
- Storage policies (`20240731120000_update_storage_rls_policies.sql`)
  - Bucket `designs` allows owners to upload/select/update/delete their own assets via `private.user_is_design_owner()`

Types are mirrored in `src/types/design.ts` and `src/types/customer.ts` for end-to-end type safety.

---

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Radix UI
- **Editor**: Fabric.js, Framer Motion
- **Data/Infra**: Supabase (Auth/DB/Storage), Next.js API Routes
- **Security/Monitoring**: Arcjet (bot/rate rules), Sentry (client)
- **DX**: ESLint, Vitest, Playwright, Storybook, Husky, Commitizen, Semantic Release (optional), Checkly/Percy (optional)

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- Supabase project (URL + anon key + service role key)

### Environment Variables

Environment is validated by `src/libs/Env.ts`. Required vs optional:

- Server-only
  - `SUPABASE_SERVICE_ROLE_KEY` (required) — service role used for server-only analytics/ops
  - `ARCJET_KEY` (optional; starts with `ajkey_`) — enable Arcjet protection
  - `DATABASE_URL` (optional) — if you use a direct Postgres connection
- Client-exposed
  - `NEXT_PUBLIC_SUPABASE_URL` (required) — Supabase URL
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (required) — Supabase anon key
  - `NEXT_PUBLIC_APP_URL` (optional) — canonical app URL
- Other optional (see `env.example`): SMTP, AWS S3, GA ID, etc.
  - Note: `NEXTAUTH_*` keys exist in `env.example` but are not used in the current Supabase-auth setup.

Create your `.env.local` from the template:

```bash
cp env.example .env.local
```

Set at minimum:

```env
NEXT_PUBLIC_SUPABASE_URL="https://YOUR-PROJECT.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_PUBLIC_ANON_KEY"
SUPABASE_SERVICE_ROLE_KEY="YOUR_SERVICE_ROLE_KEY"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Local Setup

```bash
git clone https://github.com/code-huddle/qr-profile-management.git
cd qr-profile-management
npm ci
```

### Apply Database Migrations

You can apply the SQL migrations using any of these methods:

- Supabase SQL Editor: open each file under `src/utils/supabase/migrations` and execute
- Supabase CLI: convert/apply as needed (requires `supabase/config.toml` if you choose CLI workflow)

Apply in chronological order, especially:
- `20240730120000_create_designs_table.sql`
- `20240728120000_create_customers_table.sql`
- `20240802120000_add_qr_code_url_to_designs.sql`
- `20240805120000_add_qr_code_data_to_designs.sql`
- `20240804120000_create_qr_code_scans_table.sql`
- `20240731120000_update_storage_rls_policies.sql`

Also create the following Storage buckets if not present:
- `designs`
- `customer-logos`

### Run the App

```bash
npm run dev
# Visit http://localhost:3000
```

Useful:
- `npm run dev:next` — start only Next.js
- `npm run clean` — remove `.next`, `out`, `coverage`

---

## Project Structure

```text
src/
  app/
    [locale]/            # Locale-aware user-facing routes
      (auth)/
      (main)/            # Landing redirects to dashboard
      dashboard/         # Protected: analytics, QR codes, customers, settings
      design/            # Design editor, templates, previews
      [identifier]/      # Public previews (direct access)
    api/                 # API routes (Supabase-backed)
    global-error.tsx     # Client error boundary with Sentry capture
  components/
    dashboard/           # Dashboard widgets and charts
    design-editor/       # Fabric.js editor (canvas, toolbars, dialogs)
    qr/                  # QR management UI
    customers/           # Customer CRUD UI + CSV import
    ui/                  # UI primitives
  hooks/                 # Reusable hooks (design, QR, toasts)
  libs/                  # Arcjet, Env, i18n, Logger
  utils/                 # Helpers, Supabase clients, migrations
    supabase/
      migrations/        # SQL migrations (customers, designs, policies)
  services/              # Client-side service layer (designs, storage, etc.)
  stores/                # Zustand stores
  styles/                # Tailwind global styles
```

---

## User Workflows

### Create a Design

- From Dashboard, “Create QR Code” or `/[locale]/design`
- The Design Type dialog lets you start a Blank Design (others may be coming soon)
- Design creation uses `DesignCreationStepsDialog` to name and describe the design, then redirects into the editor

### Design Editor Essentials

Under `src/components/design-editor`:
- Auto-save: every change is persisted via `useCanvasAutoSave` (default interval 2000ms; configurable)
- Undo/Redo: client-side history for canvas edits
- Canvas properties saved at the design level: width, height, background color, entire Fabric JSON
- Contextual toolbars for text, links, and social icons; double-click elements to edit
- Real-time preview pane reflects canvas changes immediately

### Generate and Download QR Codes

- When a design is published to a QR code, we store:
  - `qr_code_url`: PNG in Supabase Storage bucket `designs/qr-codes/{designId}/...`
  - `qr_code_data`: SVG string to enable high-resolution downloads
- Download options (in `DownloadModal`): PNG with selectable resolution; SVG-powered upscales for crisp output

### Rename and Regenerate QR Codes

- Renaming a design updates its slug via `generateSlug()` and prompts regeneration by clearing `qr_code_url` and `qr_code_data`
- The UI guides you to re-generate to match the new preview URL

### Public Preview & Scans

- Public preview route: `/[locale]/[identifier]` (identifier = slug or id)
- When a QR code is scanned, clients POST to `/api/scan/[id]` (public)
  - Records device type, browser, OS, referrer, and IP (best-effort) into `qr_code_scans`
- Per-design analytics are available via `/api/qr-codes/[id]` (public GET)

### Dashboard & Analytics

- Overview counts are derived from user-scoped data (designs, templates, customers, scans)
- UI pulls per-design scan totals by calling `/api/qr-codes/[id]` for the user’s QR designs
- Sample chart data is included for a friendly first-run experience

---

## API Reference

All routes live under `src/app/api` (App Router handlers). Unless noted, errors return `{ error: string }` with appropriate status.

### Auth & Session

- SSR Supabase client in middleware (`src/middleware.ts`) refreshes sessions for RSC
- Server clients: `server-app.ts` (SSR with `next/headers`), `api.ts` (Pages/API compat), `server-service.ts` (service role, server-only)

### Designs

- `GET /api/designs` (auth)
  - Returns all designs for the signed-in user
- `POST /api/designs` (auth)
  - Body: partial design; slug auto-generated; owner set to current user
- `GET /api/designs/[id]` (auth optional)
  - If unauthenticated: returns only public designs
  - If authenticated: returns user-owned or public designs
- `PUT /api/designs/[id]` (auth)
  - Owner-only update; regenerates unique slug when name changes
- `DELETE /api/designs/[id]` (auth)
  - Owner-only; deletes related `designs` bucket assets (preview + QR images)

Example:

```bash
curl -X GET "http://localhost:3000/api/designs" -H "Cookie: your_auth_cookie_here"
```

### QR Codes

- `GET /api/qr-codes/[id]` (public)
  - Returns QR metadata and analytics rollups: total scans, last scan, scans by date/country/device
  - Uses the service role on the server to aggregate scans efficiently

Example response:

```json
{
  "id": "<uuid>",
  "name": "My QR",
  "qrCodeUrl": "https://.../designs/qr-codes/<id>/<file>.png",
  "createdAt": "2024-08-01T12:34:56.000Z",
  "updatedAt": "2024-08-02T09:12:00.000Z",
  "scans": 42,
  "lastScan": "2024-08-03T10:00:00.000Z",
  "scansByDate": { "2024-08-03": 3 },
  "scansByCountry": { "US": 20, "Unknown": 22 },
  "scansByDevice": { "mobile": 30, "desktop": 12 }
}
```

### Scans

- `POST /api/scan/[id]` (public)
  - Records a scan event for a design if not archived

```bash
curl -X POST "http://localhost:3000/api/scan/<design-id>"
```

### Dashboard Overview

- `GET /api/dashboard/overview` (auth)
  - Returns `{ totalQrCodes, activeTemplates, totalCustomers, totalScans }` for the user

---

## Internationalization (i18n)

- Locale-aware routes live under `src/app/[locale]`
- `next-intl` middleware configured in `src/middleware.ts`
- Routing and supported locales defined by `src/libs/i18nNavigation.ts` and `src/utils/AppConfig.ts` (default: `en`)

---

## Security & Compliance

- **Auth & RLS**: Supabase RLS ensures users can only access their own rows. Public access is explicit (`is_public = true`).
- **Service Role**: Used server-side only (never exposed to the browser) to compute cross-row analytics where needed.
- **Storage RLS**: Ownership-aware policies restrict preview/QR image operations to design owners.
- **Arcjet (optional)**: Bot detection/rate rules gate requests in `src/app/[locale]/layout.tsx`.
- **Sentry (optional)**: Client error monitoring via `sentry.client.config.ts`.
- **PII**: QR scans capture metadata (IP best-effort, UA, referrer, coarse device/browser/OS); review and update per your privacy policy.

---

## Testing

- Unit/Integration: Vitest (`npm run test`)
- E2E: Playwright (`npm run test:e2e`) — requires browsers installed
- Visual: Percy (optional)

Quick start:

```bash
npm run lint
npm run check-types
npm run test
```

---

## Deployment

### Vercel

1. Connect repository
2. Add environment variables from `.env.local`
3. Deploy

### Other Hosts

```bash
npm run build
npm run start
```

Ensure all env variables are present at runtime and Supabase is reachable.

---

## Troubleshooting

- **401/403 on API routes**
  - Check Supabase session (auth cookie), middleware session refresh, and RLS policies
- **404 for public design/QR**
  - Confirm `is_public = true` and design exists; archived designs return 410
- **Storage access errors**
  - Buckets `designs` and `customer-logos` must exist; verify storage RLS policies
- **Missing analytics**
  - Ensure `SUPABASE_SERVICE_ROLE_KEY` is set server-side; scans table exists with RLS
- **Internationalization issues**
  - Confirm `AppConfig.locales` and route matchers in `src/middleware.ts`
- **Build errors**
  - Use Node 20+, run `npm ci`, and verify TypeScript and ESLint pass locally

---

## Contributing

We welcome contributions!

- Conventional Commits with Commitizen:

```bash
npm run commit
```

- Before pushing:

```bash
npm run lint
npm run check-types
npm run test
```

Open a PR with a clear description and add tests where relevant. Husky hooks are configured to help keep quality high.

---

## References & Further Reading

Practical guidance on excellent project documentation and structure:
- How to document your technical projects — NextWork’s Newsletter: [How to Document your Technical Projects](https://blog.nextwork.org/p/how-to-document-your-technical-projects)
- Project documentation made easy — Sonat: [Project Documentation Made Easy: A Step-by-Step Guide](https://sonat.com/@sonat/articles/v1-0-0/project-documentation-made-easy-a-step-by-step-guide)
- GeeksforGeeks — [How to Create Project Documentation with Examples?](https://www.geeksforgeeks.org/how-to-create-project-documentation-with-examples/)

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE).
