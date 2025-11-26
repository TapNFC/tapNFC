# QR Profile Management - Backend Structure

This document outlines the backend architecture, data models, and API endpoints required to replace the client-side IndexedDB implementation with a proper backend server.

## Data Models and Schema

Based on the current IndexedDB implementation, the following database models should be created:

### 1. Design

The Design model represents user-created designs that can be converted to QR codes.

```typescript
type Design = {
  id: string; // Unique identifier
  userId: string; // Reference to user who created the design
  canvasData: object; // JSON representation of the Fabric.js canvas data
  metadata: {
    width: number; // Canvas width
    height: number; // Canvas height
    backgroundColor: string; // Background color (hex)
    title?: string; // Optional title
    description?: string; // Optional description
    imageUrl?: string; // Optional image URL (for image-to-qr type)
    designType?: string; // Type of design ('standard', 'image-to-qr', etc.)
  };
  createdAt: Date; // Creation timestamp
  updatedAt: Date; // Last update timestamp
  isPublic: boolean; // Whether design is publicly accessible
  expiresAt?: Date; // Optional expiration date for shared designs
};
```

### 2. Template

The Template model represents reusable design templates.

```typescript
type Template = {
  id: string; // Unique identifier
  userId: string; // Reference to user who created the template
  name: string; // Template name
  description?: string; // Optional description
  category: string; // Category for organization/filtering
  canvasData: object; // JSON representation of the Fabric.js canvas data
  thumbnail?: string; // Optional thumbnail image (base64 or URL)
  isPublic: boolean; // Whether template is public/shared
  isPremium?: boolean; // Whether template requires premium subscription
  downloads: number; // Number of times the template has been used
  rating?: number; // Average user rating
  createdAt: Date; // Creation timestamp
  updatedAt: Date; // Last update timestamp
};
```

### 3. QrCode

The QrCode model represents generated QR codes with tracking capabilities.

```typescript
type QrCode = {
  id: string; // Unique identifier
  userId: string; // Reference to user who created the QR code
  designId: string; // Reference to the design used
  type: string; // Type of QR code ('URL', 'vCard', 'WiFi', etc.)
  data: string; // Encoded data (URL, text, etc.)
  title: string; // User-friendly title
  description?: string; // Optional description
  customization: {
    foregroundColor: string; // QR code foreground color
    backgroundColor: string; // QR code background color
    logo?: string; // Optional logo embedded in QR code
    style?: string; // Style identifier ('style-none', 'style-dots', etc.)
    includeMargin: boolean; // Whether margin is included
    size: number; // Size in pixels
  };
  analytics: {
    scans: number; // Total scan count
    uniqueScans: number; // Unique visitors scan count
    lastScan?: Date; // Last scan timestamp
  };
  status: string; // Status ('Active', 'Inactive', 'Draft')
  isFavorite: boolean; // Whether marked as favorite by user
  createdAt: Date; // Creation timestamp
  updatedAt: Date; // Last update timestamp
};
```

### 4. ScanEvent

The ScanEvent model tracks individual QR code scans.

```typescript
type ScanEvent = {
  id: string; // Unique identifier
  qrCodeId: string; // Reference to scanned QR code
  timestamp: Date; // When scan occurred
  ipAddress?: string; // IP address (anonymized if needed for privacy)
  userAgent?: string; // Device/browser info
  location?: { // Geographic location (if available)
    country?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
  };
  referrer?: string; // Referring URL/source
  sessionId?: string; // Session identifier for unique visitor tracking
};
```

### 5. User

The User model for authentication and user management.

```typescript
type User = {
  id: string; // Unique identifier
  email: string; // Email address
  name: string; // Full name
  password?: string; // Hashed password (for email/password auth)
  authProviders: { // OAuth providers
    google?: string; // Google ID
    github?: string; // GitHub ID
  };
  profile: {
    avatar?: string; // Profile picture
    phone?: string; // Phone number
    location?: string; // Location
    bio?: string; // Biography
  };
  subscription: {
    plan: string; // 'Free', 'Pro', 'Enterprise'
    status: string; // 'Active', 'Inactive', 'Trial'
    expiresAt?: Date; // When subscription expires
    paymentId?: string; // Reference to payment system
  };
  statistics: {
    qrCodesCreated: number; // Count of created QR codes
    totalScans: number; // Total scans across all QR codes
    templatesUsed: number; // Count of templates used
  };
  settings: {
    theme?: string; // UI theme preference
    language?: string; // Preferred language
    notifications?: object; // Notification preferences
  };
  createdAt: Date; // Account creation timestamp
  updatedAt: Date; // Last update timestamp
  lastLogin?: Date; // Last login timestamp
};
```

### 6. Customer

The Customer model for managing client/customer information.

```typescript
type Customer = {
  id: string; // Unique identifier
  userId: string; // Reference to user who created the customer
  name: string; // Customer name
  email: string; // Email address
  phone?: string; // Phone number
  logo?: string; // Customer logo
  brandColor: string; // Primary brand color
  website?: string; // Website URL
  socialLinks: { // Social media profiles
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };
  qrCodeId?: string; // Reference to default QR code for customer
  status: string; // 'Active', 'Inactive', 'Draft'
  createdAt: Date; // Creation timestamp
  updatedAt: Date; // Last update timestamp
};
```

## Database Relationships

The following relationships should be implemented:

1. User -> Designs (One-to-Many)
2. User -> Templates (One-to-Many)
3. User -> QR Codes (One-to-Many)
4. User -> Customers (One-to-Many)
5. Design -> QR Codes (One-to-Many)
6. QR Code -> Scan Events (One-to-Many)

## API Endpoints

Based on the IndexedDB implementation and UI requirements, the following RESTful API endpoints should be created:

### Authentication

```
POST   /api/auth/register                # Register new user
POST   /api/auth/login                   # Login with email/password
POST   /api/auth/refresh                 # Refresh authentication token
POST   /api/auth/{provider}/callback     # OAuth callback for providers
GET    /api/auth/me                      # Get current user profile
PUT    /api/auth/me                      # Update current user profile
POST   /api/auth/logout                  # Logout user
POST   /api/auth/forgot-password         # Request password reset
POST   /api/auth/reset-password          # Reset password with token
```

### Designs

```
GET    /api/designs                      # List user's designs
POST   /api/designs                      # Create new design
GET    /api/designs/{id}                 # Get design by ID
PUT    /api/designs/{id}                 # Update design
DELETE /api/designs/{id}                 # Delete design
POST   /api/designs/sample               # Create sample designs for user
```

### Templates

```
GET    /api/templates                    # List templates (user's + public)
POST   /api/templates                    # Create new template
GET    /api/templates/{id}               # Get template by ID
PUT    /api/templates/{id}               # Update template
DELETE /api/templates/{id}               # Delete template
GET    /api/templates/categories         # Get template categories
GET    /api/templates/public             # Get public templates
```

### QR Codes

```
GET    /api/qr-codes                     # List user's QR codes
POST   /api/qr-codes                     # Generate new QR code
GET    /api/qr-codes/{id}                # Get QR code by ID
PUT    /api/qr-codes/{id}                # Update QR code
DELETE /api/qr-codes/{id}                # Delete QR code
GET    /api/qr-codes/{id}/analytics      # Get QR code analytics
POST   /api/qr-codes/{id}/favorite       # Toggle favorite status
```

### Image to QR

```
POST   /api/image-qr                     # Create image-to-QR design
GET    /api/image-qr/{id}                # Get image from design
POST   /api/image-qr/{id}/generate       # Generate QR code from image
```

### Scan Events

```
GET    /api/scan-events                  # List all scan events (with filtering)
GET    /api/scan-events/{qrCodeId}       # Get scans for specific QR code
POST   /api/scan/{shortCode}             # Record scan event (public endpoint)
```

### Customers

```
GET    /api/customers                    # List user's customers
POST   /api/customers                    # Create new customer
GET    /api/customers/{id}               # Get customer by ID
PUT    /api/customers/{id}               # Update customer
DELETE /api/customers/{id}               # Delete customer
POST   /api/customers/import             # Import customers from CSV
```

### Public Access

```
GET    /api/{identifier}                 # Get public design preview
GET    /api/share/{shortCode}            # Access shared design by short code
```

### User Dashboard

```
GET    /api/dashboard/stats              # Get dashboard statistics
GET    /api/dashboard/recent-activity    # Get recent activity
GET    /api/dashboard/analytics          # Get analytics overview
```

## Storage Considerations

### Design Data Storage

The `canvasData` field in both Design and Template models contains serialized Fabric.js canvas data, which can be large. Consider these approaches:

1. **JSON Column**: Store directly in a JSON column in PostgreSQL or similar DB
2. **Document DB**: Use MongoDB or similar for flexible schema storage
3. **Blob Storage**: For very large designs, consider storing in a blob storage service and keeping only a reference in the database

### Image Storage

For images (logos, QR codes, thumbnails):

1. **Object Storage**: Use AWS S3, Google Cloud Storage, or similar
2. **CDN Integration**: Configure a CDN for fast image delivery
3. **Image Processing**: Implement image processing service for thumbnails and optimizations

## API Implementation Details

### Security

1. **Authentication**: JWT-based authentication with refresh tokens
2. **CORS**: Configure proper CORS policies
3. **Rate Limiting**: Implement rate limiting to prevent abuse
4. **Input Validation**: Validate all user input
5. **Access Control**: Ensure users can only access their own resources

### Performance

1. **Caching**: Implement Redis or similar caching for frequently accessed data
2. **Pagination**: All list endpoints should support pagination
3. **Filtering**: Support filtering on list endpoints
4. **Compression**: Enable gzip/brotli compression for responses

### QR Code Generation

1. Implement server-side QR code generation service that matches the client-side implementation
2. Support customization options: colors, logo embedding, styling, margins
3. Generate both SVG and PNG formats with various resolutions

## Migration Strategy

To migrate from client-side IndexedDB to the backend:

1. Create an API endpoint for importing data from IndexedDB
2. Add functionality in the frontend to detect when a user has local data
3. Prompt users to migrate their data to the server
4. After successful migration, clear local IndexedDB data

// Example migration API
POST /api/migrate/from-local
```json
{
  "designs": [], /* Array of designs from IndexedDB */
  "templates": [] /* Array of templates from IndexedDB */
}
```

## Example Implementation Notes

### Database Selection

1. **Primary Database**: PostgreSQL for relational data (users, qr codes, analytics)
2. **Document Store**: MongoDB for design and template canvas data (or JSON columns in PostgreSQL)
3. **Caching**: Redis for performance optimization
4. **Search**: Elasticsearch for advanced search capabilities across designs and templates

### Technology Stack Recommendations

1. **API Framework**: Node.js with Express/NestJS or Django REST Framework
2. **Authentication**: JWT with OAuth support
3. **Storage**: S3-compatible storage for images and exports
4. **QR Generation**: Server-side implementation of QR code generation library
5. **Analytics**: Time-series database for tracking QR code scans at scale

### Scaling Considerations

1. **Stateless API**: Ensure API servers are stateless for horizontal scaling
2. **Database Sharding**: Plan for database sharding if scan events grow rapidly
3. **CDN**: Use CDN for generated QR codes and images
4. **Serverless Functions**: Consider serverless functions for QR code generation and image processing

## Webhook Integration

Add webhook support for integrating with external systems:

```
POST   /api/webhooks                     # Create webhook subscription
GET    /api/webhooks                     # List webhook subscriptions
DELETE /api/webhooks/{id}                # Delete webhook subscription
```

Events to trigger webhooks:
- QR code scanned
- Design created/updated
- Customer added

## Analytics Engine

Design a dedicated analytics engine for QR code performance:

1. **Real-time Tracking**: Track scans in real-time
2. **Aggregation Pipeline**: Aggregate scan data for dashboards
3. **Reports**: Generate scheduled reports for users
4. **Export**: Allow exporting analytics data in various formats
