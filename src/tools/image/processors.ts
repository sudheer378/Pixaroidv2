import { compressImage } from "../../core/processing/compress-image";
import { ProcessingError } from "../../core/processing/errors";
import type { ToolContext, ToolProcessor } from "../../core/tool-engine/types";
import { canvasFromImage, canvasToBlob, decodeImage } from "./common";

export function createImageConversionProcessor(outputType: string, outputName: string): ToolProcessor {
  return {
    async process(input: File, context?: ToolContext) {
      const image = await decodeImage(input, context);
      const canvas = canvasFromImage(image);
      context?.onProgress?.(70);
      const blob = await canvasToBlob(canvas, outputType, 0.92);
      context?.onProgress?.(95);
      return new File([blob], outputName, { type: outputType });
    },
  };
}

export function createCompressionProcessor(): ToolProcessor {
  return {
    async process(input: File, context?: ToolContext) {
      context?.onProgress?.(15);
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

      const image = await decodeImage(input, context);
      const sourceWidth = image.naturalWidth;
      const sourceHeight = image.naturalHeight;

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

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new ProcessingError("BROWSER_UNSUPPORTED", "This browser cannot resize images.");
      }
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(image, 0, 0, width, height);
      context?.onProgress?.(75);
      const blob = await canvasToBlob(canvas, outputType, 0.92);
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
