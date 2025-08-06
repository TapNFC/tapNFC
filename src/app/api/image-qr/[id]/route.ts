import type { NextRequest } from 'next/server';
import { Buffer } from 'node:buffer';
import { NextResponse } from 'next/server';
import { createAppServerClient } from '@/utils/supabase/server-app';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const supabase = createAppServerClient();

    // Get the design data from the database
    const { data: design, error } = await supabase
      .from('designs')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !design) {
      console.error(`Error fetching design ${id}:`, error);
      return new NextResponse('Design not found', { status: 404 });
    }

    // Check if design is an image-to-qr type and has image data in canvas_data
    const canvasData = design.canvas_data;
    let imageUrl = null;

    // Try to find image data in various possible locations
    if (canvasData?.metadata?.imageUrl) {
      imageUrl = canvasData.metadata.imageUrl;
    } else if (canvasData?.imageUrl) {
      imageUrl = canvasData.imageUrl;
    } else if (canvasData?.objects) {
      // Look for image objects in the canvas
      const imageObject = canvasData.objects.find((obj: any) => obj.type === 'image' && obj.src);
      if (imageObject) {
        imageUrl = imageObject.src;
      }
    }

    if (!imageUrl) {
      return new NextResponse('Image data not found in design', { status: 404 });
    }

    // The imageUrl should be a data URL (base64 encoded)
    // Extract the content type and base64 data
    const matches = imageUrl.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);

    if (!matches || matches.length !== 3) {
      return new NextResponse('Invalid image data format', { status: 500 });
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
        'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
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
