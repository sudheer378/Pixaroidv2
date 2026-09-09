import { compressImage, type ImageCompressionOptions } from "@/core/processing/compress-image";
import { imageToImageProcessor } from "@/core/processing/image-processor";
import type { ToolProcessor } from "@/core/tool-engine/types";

export const imageConversionProcessors: Record<string, ToolProcessor> = {
  "jpg-to-png": imageToImageProcessor("image/png"),
  "png-to-jpg": imageToImageProcessor("image/jpeg"),
  "jpg-to-webp": imageToImageProcessor("image/webp"),
  "webp-to-jpg": imageToImageProcessor("image/jpeg"),
};

export function createCompressionProcessor(options: ImageCompressionOptions = {}): ToolProcessor {
  return {
    process: async (input, context) => {
      context?.onProgress?.(15);
      const result = await compressImage(input, options);
      context?.onProgress?.(95);
      return result.blob;
    },
  };
}
