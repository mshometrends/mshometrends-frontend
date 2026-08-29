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

  try {
    const response = await fetch('/api/upload/image', {
      method: 'POST',
      body: formData,
    });

    if (onProgress) onProgress(80);

    const data: UploadApiResponse = await response.json();

    if (!response.ok || !data.success || !data.image) {
      throw new Error(data.message || 'Image upload failed.');
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

  try {
    const response = await fetch('/api/upload/image', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ public_id: publicId }),
    });

    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error('[Delete Service Error]', error);
    return false;
  }
}
