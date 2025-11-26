import { createClient } from '@/utils/supabase/client';

// Helper function to convert a data URL to a Blob
function dataURLtoBlob(dataurl: string) {
  const arr = dataurl.split(',');
  if (arr.length < 2 || !arr[0] || !arr[1]) {
    throw new Error('Invalid data URL format');
  }

  const mimeMatch = arr[0].match(/:(.*?);/);
  if (!mimeMatch || !mimeMatch[1]) {
    throw new Error('Could not extract MIME type from data URL');
  }
  const mime = mimeMatch[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

export const storageService = {
  /**
   * Uploads a customer logo to Supabase Storage.
   * @param base64 - The base64 encoded image data.
   * @param userId - The ID of the user uploading the file, for namespacing.
   * @returns The public URL of the uploaded file.
   */
  async uploadCustomerLogo(base64: string, userId: string): Promise<string> {
    try {
      const supabase = createClient();
      const file = dataURLtoBlob(base64);
      const fileExt = file.type.split('/')[1];
      const filePath = `${userId}/${new Date().getTime()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('customer-logos')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicUrlData } = supabase.storage
        .from('customer-logos')
        .getPublicUrl(filePath);

      if (!publicUrlData) {
        throw new Error('Could not get public URL for the uploaded file.');
      }

      return publicUrlData.publicUrl;
    } catch (error: any) {
      console.error('Error uploading customer logo:', error);
      throw new Error(`Failed to upload logo: ${error.message}`);
    }
  },

  /**
   * Deletes a customer logo from Supabase Storage.
   * @param fileUrl - The public URL of the file to delete.
   */
  async deleteCustomerLogo(fileUrl: string): Promise<void> {
    try {
      const supabase = createClient();
      const url = new URL(fileUrl);
      const filePath = url.pathname.split(`/customer-logos/`)[1];

      if (!filePath) {
        return;
      }

      const { error } = await supabase.storage
        .from('customer-logos')
        .remove([filePath]);

      if (error) {
        // It's okay if the file doesn't exist, so we can ignore 'Not Found' errors
        if (error.message !== 'The resource was not found') {
          throw error;
        }
      }
    } catch (error: any) {
      console.error('Error deleting customer logo:', error);
      // We don't re-throw here to avoid blocking the main UI operation if deletion fails
    }
  },

  async uploadDesignPreview(designId: string, dataUrl: string): Promise<string | null> {
    try {
      const supabase = createClient();
      const blob = await (await fetch(dataUrl)).blob();
      const filePath = `public/${designId}/${Date.now()}.png`;

      const { error: uploadError } = await supabase.storage
        .from('designs')
        .upload(filePath, blob, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from('designs').getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading design preview:', error);
      // We'll show toast from the calling function.
      return null;
    }
  },

  /**
   * Uploads a QR code to Supabase Storage.
   * @param designId - The ID of the design associated with the QR code.
   * @param qrCodeSvg - The SVG element or canvas containing the QR code.
   * @param styleId - Optional style ID of the QR code.
   * @returns An object with the public URL of the uploaded QR code image and the SVG data.
   */
  async uploadQrCode(designId: string, qrCodeSvg: SVGElement | HTMLCanvasElement, styleId?: string): Promise<{ publicUrl: string | null; svgData: string | null }> {
    try {
      const supabase = createClient();
      let blob: Blob;
      let svgData: string | null = null;

      // Convert SVG to PNG blob
      if (qrCodeSvg instanceof SVGElement) {
        // Store the SVG data for future use
        svgData = new XMLSerializer().serializeToString(qrCodeSvg);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const svgUrl = URL.createObjectURL(svgBlob);

        // Create an image from the SVG
        const img = await new Promise<HTMLImageElement>((resolve, reject) => {
          const image = new Image();
          image.onload = () => resolve(image);
          image.onerror = () => reject(new Error('Failed to load SVG as image'));
          image.src = svgUrl;
        });

        // Draw the image on a canvas
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        // Get blob from canvas
        blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob((b) => {
            if (b) {
              resolve(b);
            } else {
              reject(new Error('Failed to convert canvas to blob'));
            }
          }, 'image/png');
        });

        // Clean up
        URL.revokeObjectURL(svgUrl);
      } else {
        // If it's already a canvas, just get the blob
        blob = await new Promise<Blob>((resolve, reject) => {
          qrCodeSvg.toBlob((b) => {
            if (b) {
              resolve(b);
            } else {
              reject(new Error('Failed to convert canvas to blob'));
            }
          }, 'image/png');
        });
        // For canvas elements, we don't have SVG data
        svgData = null;
      }

      // Create a unique file path
      const timestamp = Date.now();
      const styleSuffix = styleId ? `-${styleId}` : '';
      const filePath = `qr-codes/${designId}/${timestamp}${styleSuffix}.png`;

      // Upload to Supabase
      const { error: uploadError } = await supabase.storage
        .from('designs')
        .upload(filePath, blob, {
          contentType: 'image/png',
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL
      const { data } = supabase.storage
        .from('designs')
        .getPublicUrl(filePath);

      return { publicUrl: data.publicUrl, svgData };
    } catch (error) {
      console.error('Error uploading QR code:', error);
      return { publicUrl: null, svgData: null };
    }
  },

  /**
   * Deletes a design preview from Supabase Storage.
   * @param fileUrl - The public URL of the file to delete.
   */
  async deleteDesignPreview(fileUrl: string): Promise<void> {
    if (!fileUrl) {
      return;
    }

    try {
      const supabase = createClient();
      const url = new URL(fileUrl);
      const filePath = url.pathname.split(`/designs/`)[1];

      if (!filePath) {
        console.warn('Could not extract file path from URL:', fileUrl);
        return;
      }

      const { error } = await supabase.storage.from('designs').remove([filePath]);

      if (error && error.message !== 'The resource was not found') {
        throw error;
      }
    } catch (error: any) {
      console.error('Error deleting design preview:', error);
      // We don't re-throw here to avoid blocking the main UI operation if deletion fails
    }
  },

  /**
   * Deletes QR code images from Supabase Storage.
   * @param designId - The ID of the design whose QR code images should be deleted.
   */
  async deleteQrCodeImages(designId: string): Promise<void> {
    try {
      const supabase = createClient();

      // List all files in the qr-codes/{designId} folder
      const { data: files, error: listError } = await supabase.storage
        .from('designs')
        .list(`qr-codes/${designId}`);

      if (listError) {
        console.warn('Error listing QR code files:', listError);
        return;
      }

      if (files && files.length > 0) {
        // Create array of file paths to delete
        const filePaths = files.map(file => `qr-codes/${designId}/${file.name}`);

        // Delete all QR code images for this design
        const { error: deleteError } = await supabase.storage
          .from('designs')
          .remove(filePaths);

        if (deleteError) {
          console.warn('Error deleting QR code images:', deleteError);
        }
      }
    } catch (error: any) {
      console.error('Error deleting QR code images:', error);
      // We don't re-throw here to avoid blocking the main UI operation if deletion fails
    }
  },
};
