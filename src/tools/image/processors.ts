import { compressImage } from "../../core/processing/compress-image";
import { ProcessingError } from "../../core/processing/errors";
import { canUseImageWorker, processImageInWorker } from "../../core/tool-engine/browser-worker";
import type { ToolContext, ToolProcessor } from "../../core/tool-engine/types";
import { canvasFromImage, canvasToBlob, decodeImage } from "./common";

/**
 * Runs the decode/encode off the main thread when the browser supports it, so
 * large images don't jank the UI. Falls back to the main-thread canvas path on
 * any worker failure, since a slow result beats a broken tool.
 */
async function encodeImage(
  input: File,
  outputType: string,
  quality: number,
  context?: ToolContext,
  width?: number,
  height?: number,
): Promise<Blob> {
  if (canUseImageWorker()) {
    try {
      const blob = await processImageInWorker(input, { outputType, quality, width, height });
      context?.onProgress?.(90);
      return blob;
    } catch {
      // Fall through to the main-thread path below.
    }
  }

  const image = await decodeImage(input, context);
  if (width === undefined && height === undefined) {
    const canvas = canvasFromImage(image);
    context?.onProgress?.(70);
    return canvasToBlob(canvas, outputType, quality);
  }

  const canvas = document.createElement("canvas");
  canvas.width = width ?? image.naturalWidth;
  canvas.height = height ?? image.naturalHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new ProcessingError("BROWSER_UNSUPPORTED", "This browser cannot resize images.");
  }
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  context?.onProgress?.(75);
  return canvasToBlob(canvas, outputType, quality);
}

/** Reads intrinsic dimensions, preferring the cheap `createImageBitmap` path. */
async function readImageSize(input: File): Promise<{ width: number; height: number }> {
  if (typeof createImageBitmap === "function") {
    const bitmap = await createImageBitmap(input);
    try {
      return { width: bitmap.width, height: bitmap.height };
    } finally {
      bitmap.close();
    }
  }
  const image = await decodeImage(input);
  return { width: image.naturalWidth, height: image.naturalHeight };
}

export function createImageConversionProcessor(outputType: string, outputName: string): ToolProcessor {
  return {
    async process(input: File, context?: ToolContext) {
      const blob = await encodeImage(input, outputType, 0.92, context);
      context?.onProgress?.(95);
      return new File([blob], outputName, { type: outputType });
    },
  };
}

export function createCompressionProcessor(): ToolProcessor {
  return {
    async process(input: File, context?: ToolContext) {
      context?.onProgress?.(15);

      // Target-size search needs repeated re-encodes of one decoded bitmap, which
      // the single-shot worker protocol can't express — keep that on the main
      // thread and use the worker only for the simple quality-only case.
      if (canUseImageWorker()) {
        try {
          const outputType =
            input.type === "image/png" ? "image/png" : input.type === "image/webp" ? "image/webp" : "image/jpeg";
          const blob = await processImageInWorker(input, { outputType, quality: 0.82 });
          context?.onProgress?.(95);
          return new File([blob], `pixora-compressed.${extensionFor(blob.type)}`, { type: blob.type });
        } catch {
          // Fall through to the main-thread compressor.
        }
      }

      const result = await compressImage(input);
      context?.onProgress?.(95);
      return new File([result.blob], `pixora-compressed.${extensionFor(result.blob.type)}`, {
        type: result.blob.type,
      });
    },
  };
}

export function createResizeProcessor(defaultWidth = 1200, defaultHeight = 1200): ToolProcessor {
  return {
    async process(input: File, context?: ToolContext) {
      const requestedWidth = Number(context?.options?.width) || 0;
      const requestedHeight = Number(context?.options?.height) || 0;
      const outputType = input.type === "image/png" ? "image/png" : input.type === "image/webp" ? "image/webp" : "image/jpeg";

      const { width: sourceWidth, height: sourceHeight } = await readImageSize(input);

      let width = requestedWidth;
      let height = requestedHeight;
      if (width > 0 && height <= 0) {
        height = Math.max(1, Math.round((width / sourceWidth) * sourceHeight));
      } else if (height > 0 && width <= 0) {
        width = Math.max(1, Math.round((height / sourceHeight) * sourceWidth));
      } else if (width <= 0 && height <= 0) {
        const scale = Math.min(1, defaultWidth / sourceWidth, defaultHeight / sourceHeight);
        width = Math.max(1, Math.round(sourceWidth * scale));
        height = Math.max(1, Math.round(sourceHeight * scale));
      }

      if (width > 10000 || height > 10000) {
        throw new ProcessingError("PROCESSING_FAILED", "Maximum output dimension is 10,000 pixels.");
      }

      const blob = await encodeImage(input, outputType, 0.92, context, width, height);
      context?.onProgress?.(95);
      return new File([blob], `pixora-resized-${width}x${height}.${extensionFor(outputType)}`, { type: outputType });
    },
  };
}

function extensionFor(type: string): string {
  if (type === "image/jpeg") return "jpg";
  if (type === "image/webp") return "webp";
  return "png";
}
