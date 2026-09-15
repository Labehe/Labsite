/**
 * High-performance client-side image compression utility
 * Resizes large camera/phone/web images and compresses them into lightweight base64 data URLs (~30-80KB)
 * to prevent browser localStorage quota exceeded errors and speed up page loading.
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 to 1.0 (default: 0.82)
  mimeType?: "image/jpeg" | "image/webp" | "image/png";
}

/**
 * Compresses an image File or Blob using HTML Canvas.
 */
export async function compressImage(
  fileOrBlob: File | Blob | string,
  options: CompressionOptions = {}
): Promise<string> {
  const {
    maxWidth = 1000,
    maxHeight = 1000,
    quality = 0.82,
    mimeType = "image/jpeg",
  } = options;

  // If string, check if it's an SVG or already a tiny data URL / http url
  if (typeof fileOrBlob === "string") {
    if (fileOrBlob.startsWith("http://") || fileOrBlob.startsWith("https://") || fileOrBlob.startsWith("/")) {
      return fileOrBlob;
    }
    if (fileOrBlob.startsWith("data:image/svg+xml")) {
      return fileOrBlob;
    }
    // If it's a data URL under 60KB, return as is
    if (fileOrBlob.startsWith("data:") && fileOrBlob.length < 60 * 1024) {
      return fileOrBlob;
    }
  }

  // If file is SVG, read as text/dataURL directly
  if (fileOrBlob instanceof File && fileOrBlob.type === "image/svg+xml") {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(fileOrBlob);
    });
  }

  // Load image into HTML Image object
  const img = new Image();
  const objectUrl =
    typeof fileOrBlob === "string"
      ? fileOrBlob
      : URL.createObjectURL(fileOrBlob);

  try {
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = (e) => reject(new Error("Failed to load image for compression"));
      img.src = objectUrl;
    });

    let width = img.naturalWidth || img.width;
    let height = img.naturalHeight || img.height;

    if (width <= 0 || height <= 0) {
      width = 800;
      height = 800;
    }

    // Calculate aspect ratio preserving dimensions
    if (width > maxWidth || height > maxHeight) {
      const ratio = Math.min(maxWidth / width, maxHeight / height);
      width = Math.round(width * ratio);
      height = Math.round(height * ratio);
    }

    // Create offscreen canvas
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d", { alpha: mimeType !== "image/jpeg" });
    if (!ctx) {
      throw new Error("Could not get 2d context for image compression");
    }

    // Fill white background for JPEG to handle transparency cleanly
    if (mimeType === "image/jpeg") {
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, width, height);
    }

    // High quality scaling
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, width, height);

    // Export compressed Data URL
    const compressedDataUrl = canvas.toDataURL(mimeType, quality);
    return compressedDataUrl;
  } finally {
    // Revoke blob url if created
    if (typeof fileOrBlob !== "string") {
      URL.revokeObjectURL(objectUrl);
    }
  }
}

/**
 * Helper to safely compress a File or return fallback if error.
 */
export async function safeCompressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<string> {
  try {
    return await compressImage(file, options);
  } catch (err) {
    console.warn("Canvas compression fallback to standard FileReader:", err);
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}
