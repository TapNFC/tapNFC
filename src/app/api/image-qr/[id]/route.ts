import type { NextRequest } from 'next/server';
import { Buffer } from 'node:buffer';
import { NextResponse } from 'next/server';
import { designDB } from '@/lib/indexedDB';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  try {
    // Get the design data
    const design = await designDB.getDesign(id);

    // Check if design exists and is an image-to-qr type
    if (!design || design.metadata.designType !== 'image-to-qr' || !design.metadata.imageUrl) {
      return new NextResponse('Image not found', { status: 404 });
    }

    // Get the image data from the metadata
    const imageUrl = design.metadata.imageUrl;

    // The imageUrl should be a data URL (base64 encoded)
    // Extract the content type and base64 data
    const matches = imageUrl.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);

    if (!matches || matches.length !== 3) {
      return new NextResponse('Invalid image data', { status: 500 });
    }

    const contentType = matches[1];
    const base64Data = matches[2];

    if (!base64Data || !contentType) {
      return new NextResponse('Invalid image data: missing content type or base64 data', { status: 500 });
    }

    const buffer = Buffer.from(base64Data, 'base64');

    // Return the image with appropriate headers for download
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="image-${id}.${getExtensionFromMimeType(contentType)}"`,
      },
    });
  } catch (error) {
    console.error('Error serving image:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// Helper function to get file extension from MIME type
function getExtensionFromMimeType(mimeType: string): string {
  const mimeToExt: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'image/svg+xml': 'svg',
  };

  return mimeToExt[mimeType] || 'jpg';
}
