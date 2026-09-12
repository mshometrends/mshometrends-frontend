import { getApiV1Url } from '../api/config';

export interface CloudinaryImageData {
  url: string;
  public_id: string;
  format?: string;
  width?: number;
  height?: number;
  bytes?: number;
}

export interface UploadApiResponse {
  success: boolean;
  message: string;
  image?: CloudinaryImageData;
}

/**
 * Extracts authorization headers from storage for secure media management
 */
const getAuthHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {};
  if (typeof window !== 'undefined') {
    try {
      const adminToken =
        sessionStorage.getItem('ms_admin_token') ||
        localStorage.getItem('ms_admin_token') ||
        sessionStorage.getItem('ms_admin_key');

      if (adminToken) {
        headers['Authorization'] = `Bearer ${adminToken}`;
        headers['x-admin-key'] = adminToken;
      }
    } catch {
      // Safe fallback if storage unavailable
    }
  }
  return headers;
};

/**
 * Upload an image file to the Express backend, which streams it to Cloudinary.
 * @param file - File object selected from <input type="file">
 * @param onProgress - Optional callback for upload progress
 */
export async function uploadImage(
  file: File,
  onProgress?: (progressPercent: number) => void
): Promise<CloudinaryImageData> {
  if (!file) {
    throw new Error('No image file provided for upload.');
  }

  // Validate client side MIME type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type.toLowerCase())) {
    throw new Error('Unsupported format. Please select a JPG, JPEG, PNG, or WEBP image.');
  }

  // Max 10MB client check
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('Image file size exceeds maximum 10MB limit.');
  }

  const formData = new FormData();
  formData.append('image', file);

  if (onProgress) onProgress(20);

  const uploadEndpoint = getApiV1Url('/upload/image');
  const headers = getAuthHeaders();

  try {
    const response = await fetch(uploadEndpoint, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (onProgress) onProgress(80);

    const rawText = await response.text();
    let data: UploadApiResponse;
    try {
      data = JSON.parse(rawText);
    } catch {
      console.error('[Upload Service Error] Non-JSON response received:', rawText.slice(0, 300));
      throw new Error(`Upload endpoint (${uploadEndpoint}) returned unexpected response (${response.status} ${response.statusText}).`);
    }

    if (!response.ok || !data.success || !data.image) {
      throw new Error(data.message || `Image upload failed (HTTP ${response.status}).`);
    }

    if (onProgress) onProgress(100);

    return data.image;
  } catch (error: any) {
    console.error('[Upload Service Error]', error);
    throw new Error(error.message || 'Failed to connect to image upload endpoint.');
  }
}

/**
 * Delete an image asset from Cloudinary by its public_id
 * @param publicId - Cloudinary public_id
 */
export async function deleteImage(publicId: string): Promise<boolean> {
  if (!publicId) return true;

  const deleteEndpoint = getApiV1Url('/upload/image');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...getAuthHeaders(),
  };

  try {
    const response = await fetch(deleteEndpoint, {
      method: 'DELETE',
      headers,
      body: JSON.stringify({ public_id: publicId }),
    });

    const rawText = await response.text();
    try {
      const data = JSON.parse(rawText);
      return data.success === true;
    } catch {
      return response.ok;
    }
  } catch (error) {
    console.error('[Delete Service Error]', error);
    return false;
  }
}
