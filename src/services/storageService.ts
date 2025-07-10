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
};
