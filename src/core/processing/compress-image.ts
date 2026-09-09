export interface ImageCompressionOptions {
  /** Desired maximum output size in bytes. Omit for quality-only compression. */
  targetBytes?: number;
  /** Initial JPEG/WebP quality, from 0.1 to 1. */
  quality?: number;
  /** Maximum output dimension. Preserves aspect ratio. */
  maxDimension?: number;
  outputType?: "image/jpeg" | "image/webp" | "image/png";
}

export interface ImageCompressionResult {
  blob: Blob;
  width: number;
  height: number;
  quality: number;
}

const DEFAULT_QUALITY = 0.82;
const MIN_QUALITY = 0.2;
const MAX_QUALITY = 0.95;

function clampQuality(value: number): number {
  return Math.min(MAX_QUALITY, Math.max(MIN_QUALITY, value));
}

function scaleDimensions(width: number, height: number, maxDimension?: number) {
  if (!maxDimension || Math.max(width, height) <= maxDimension) return { width, height };
  const scale = maxDimension / Math.max(width, height);
  return { width: Math.max(1, Math.round(width * scale)), height: Math.max(1, Math.round(height * scale)) };
}

function canvasBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Browser could not encode the image."))), type, quality);
  });
}

/**
 * Compresses an image in the browser. Target-size mode uses a bounded binary
 * search over quality and never uploads the user's file to a server.
 */
export async function compressImage(input: Blob, options: ImageCompressionOptions = {}): Promise<ImageCompressionResult> {
  if (typeof document === "undefined" || typeof createImageBitmap === "undefined") {
    throw new Error("Browser image compression is not supported in this environment.");
  }

  const bitmap = await createImageBitmap(input);
  try {
    const { width, height } = scaleDimensions(bitmap.width, bitmap.height, options.maxDimension);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Could not create an image processing canvas.");
    context.drawImage(bitmap, 0, 0, width, height);

    const outputType = options.outputType ?? (input.type === "image/webp" ? "image/webp" : "image/jpeg");
    let quality = clampQuality(options.quality ?? DEFAULT_QUALITY);
    let blob = await canvasBlob(canvas, outputType, quality);

    if (options.targetBytes && outputType !== "image/png" && blob.size > options.targetBytes) {
      let low = MIN_QUALITY;
      let high = quality;
      let best: { blob: Blob; quality: number } | null = null;

      for (let attempt = 0; attempt < 8; attempt += 1) {
        quality = (low + high) / 2;
        const candidate = await canvasBlob(canvas, outputType, quality);
        if (candidate.size <= options.targetBytes) {
          best = { blob: candidate, quality };
          low = quality;
        } else {
          high = quality;
        }
      }

      if (best) {
        blob = best.blob;
        quality = best.quality;
      }
    }

    return { blob, width, height, quality };
  } finally {
    bitmap.close();
  }
}
