import { isSupabaseConfigured, supabase } from '../config/supabase.js';

export const storageService = {
  /**
   * Upload a file to Supabase Storage bucket ('documents', 'photos', 'evidence', 'certificates')
   * @param {string} bucket - The Supabase storage bucket name
   * @param {string} path - File destination path
   * @param {Buffer} fileBuffer - File binary data
   * @param {string} mimeType - Content type
   * @returns {Promise<string>} Public or relative URL
   */
  async uploadFile(bucket, path, fileBuffer, mimeType = 'application/octet-stream') {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(path, fileBuffer, {
            contentType: mimeType,
            upsert: true
          });

        if (!error && data) {
          const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);
          return urlData?.publicUrl || `/uploads/${path}`;
        } else {
          console.warn(`Supabase storage upload error in bucket "${bucket}":`, error?.message);
        }
      } catch (err) {
        console.warn('Supabase storage exception, using local path:', err.message);
      }
    }

    // Default local fallback path
    return `/uploads/${path}`;
  },

  /**
   * Check if Supabase Storage is live and configured
   */
  isConfigured() {
    return isSupabaseConfigured;
  }
};
