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

export function createResizeProcessor(width: number, height: number, outputType = "image/png"): ToolProcessor {
  if (width <= 0 || height <= 0) {
    throw new ProcessingError("PROCESSING_FAILED", "Resize dimensions must be positive.");
  }

  return {
    async process(input: File, context?: ToolContext) {
      const image = await decodeImage(input, context);
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new ProcessingError("BROWSER_UNSUPPORTED", "This browser cannot resize images.");
      }
      ctx.drawImage(image, 0, 0, width, height);
      context?.onProgress?.(75);
      const blob = await canvasToBlob(canvas, outputType, 0.92);
      context?.onProgress?.(95);
      return new File([blob], `pixora-resized.${extensionFor(outputType)}`, { type: outputType });
    },
  };
}

function extensionFor(type: string): string {
  if (type === "image/jpeg") return "jpg";
  if (type === "image/webp") return "webp";
  return "png";
}
