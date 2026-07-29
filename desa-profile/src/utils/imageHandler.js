/**
 * Image Handler Utilities
 * Untuk manage upload, compression, dan base64 conversion
 */

/**
 * Convert File ke Base64 string
 * @param {File} file - File image
 * @returns {Promise<string>} - Base64 string
 */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Compress image file sebelum convert ke base64
 * @param {File} file - Original file
 * @param {number} maxWidth - Max width dalam pixel
 * @param {number} maxHeight - Max height dalam pixel
 * @param {number} quality - Quality 0-1 (default 0.8)
 * @returns {Promise<string>} - Base64 compressed image
 */
export function compressImage(file, maxWidth = 1200, maxHeight = 1200, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Calculate new dimensions
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        // Create canvas dan compress
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert ke base64
        const base64 = canvas.toDataURL('image/jpeg', quality);
        resolve(base64);
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target.result;
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Get file size dalam MB
 * @param {File} file
 * @returns {number}
 */
export function getFileSizeMB(file) {
  return file.size / (1024 * 1024);
}

/**
 * Validate image file
 * @param {File} file
 * @returns {object} { valid: boolean, error?: string }
 */
export function validateImageFile(file) {
  const maxSizeMB = 5;
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

  if (!file) {
    return { valid: false, error: 'No file selected' };
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Only JPG, PNG, WebP, and GIF allowed' };
  }

  if (getFileSizeMB(file) > maxSizeMB) {
    return { valid: false, error: `File must be smaller than ${maxSizeMB}MB` };
  }

  return { valid: true };
}

/**
 * Handle file upload dengan validation dan compression
 * @param {File} file
 * @param {number} maxWidth
 * @param {number} maxHeight
 * @returns {Promise<string>} - Base64 image
 */
export async function handleImageUpload(file, maxWidth = 1200, maxHeight = 1200) {
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  try {
    const base64 = await compressImage(file, maxWidth, maxHeight, 0.8);
    return base64;
  } catch (error) {
    throw new Error(`Image processing failed: ${error.message}`);
  }
}
