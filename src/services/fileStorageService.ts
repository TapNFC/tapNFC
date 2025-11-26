import { createClient } from '@/utils/supabase/client';

export const fileStorageService = {
  /**
   * Uploads a PDF file to Supabase Storage.
   * @param file - The PDF file to upload.
   * @param designId - The ID of the design this file belongs to.
   * @returns The public URL of the uploaded file.
   */
  async uploadPdfFile(file: File, designId: string): Promise<string> {
    try {
      const supabase = createClient();

      // Validate file type
      if (file.type !== 'application/pdf') {
        throw new Error('Only PDF files are allowed');
      }

      // Validate file size (50MB limit)
      if (file.size > 50 * 1024 * 1024) {
        throw new Error('File size must be less than 50MB');
      }

      // Create file path: files/designId/filename
      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.name.replace(/[^a-z0-9.-]/gi, '_')}`;
      const filePath = `files/${designId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('file-storage')
        .upload(filePath, file, {
          contentType: 'application/pdf',
          upsert: false, // Don't overwrite existing files
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL for the uploaded file
      const { data: publicUrlData } = supabase.storage
        .from('file-storage')
        .getPublicUrl(filePath);

      if (!publicUrlData) {
        throw new Error('Could not get public URL for the uploaded file.');
      }

      return publicUrlData.publicUrl;
    } catch (error: any) {
      throw new Error(`Failed to upload PDF: ${error.message}`);
    }
  },

  /**
   * Uploads a vCard file to Supabase Storage.
   * @param vCardContent - The vCard content as a string.
   * @param designId - The ID of the design this vCard belongs to.
   * @returns The public URL of the uploaded vCard file.
   */
  async uploadVCardFile(vCardContent: string, designId: string): Promise<string> {
    try {
      const supabase = createClient();

      // Create vCard blob
      const vCardBlob = new Blob([vCardContent], { type: 'text/vcard' });

      // Create file path: vcards/designId/vcard.vcf
      const timestamp = Date.now();
      const fileName = `${timestamp}_contact.vcf`;
      const filePath = `vcards/${designId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('file-storage')
        .upload(filePath, vCardBlob, {
          contentType: 'text/vcard',
          upsert: false, // Don't overwrite existing files
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL for the uploaded file
      const { data: publicUrlData } = supabase.storage
        .from('file-storage')
        .getPublicUrl(filePath);

      if (!publicUrlData) {
        throw new Error('Could not get public URL for the uploaded vCard file.');
      }

      return publicUrlData.publicUrl;
    } catch (error: any) {
      throw new Error(`Failed to upload vCard: ${error.message}`);
    }
  },

  /**
   * Profile picture upload for vCard removed
   */

  /**
   * Deletes a file from Supabase Storage using its public URL.
   * @param fileUrl - The public URL of the file to delete.
   * @returns Promise that resolves when the file is deleted.
   */
  async deleteFile(fileUrl: string): Promise<void> {
    try {
      const supabase = createClient();

      // Extract the file path from the URL using the helper function
      const filePath = this.getFilePathFromUrl(fileUrl);

      if (!filePath) {
        throw new Error('Could not extract file path from URL');
      }

      const { error } = await supabase.storage
        .from('file-storage')
        .remove([filePath]);

      if (error) {
        throw error;
      }
    } catch (error: any) {
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  },

  /**
   * Deletes a file from Supabase Storage using its storage path.
   * @param filePath - The file path relative to the bucket (e.g. "vcards/<designId>/<file>").
   */
  async deleteFileByPath(filePath: string): Promise<void> {
    try {
      const supabase = createClient();

      const { error } = await supabase.storage
        .from('file-storage')
        .remove([filePath]);

      if (error) {
        throw error;
      }
    } catch (error: any) {
      throw new Error(`Failed to delete file by path: ${error.message}`);
    }
  },

  /**
   * Gets the file path from a public URL.
   * @param fileUrl - The public URL of the file.
   * @returns The file path relative to the bucket.
   */
  getFilePathFromUrl(fileUrl: string): string | null {
    try {
      const url = new URL(fileUrl);
      const pathParts = url.pathname.split('/');
      const bucketIndex = pathParts.findIndex(part => part === 'file-storage');

      if (bucketIndex === -1) {
        return null;
      }

      // Return the path after the bucket name
      return pathParts.slice(bucketIndex + 1).join('/');
    } catch {
      return null;
    }
  },
};
