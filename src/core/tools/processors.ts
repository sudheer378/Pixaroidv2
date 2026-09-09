import { compressImage, type ImageCompressionOptions } from "@/core/processing/compress-image";
import { imageToImageProcessor } from "@/core/processing/image-processor";
import type { ToolProcessor } from "@/core/processing/types";

export const imageConversionProcessors: Record<string, ToolProcessor> = {
  "jpg-to-png": imageToImageProcessor("image/png"),
  "png-to-jpg": imageToImageProcessor("image/jpeg"),
  "jpg-to-webp": imageToImageProcessor("image/webp"),
  "webp-to-jpg": imageToImageProcessor("image/jpeg"),
};

export function createCompressionProcessor(options: ImageCompressionOptions = {}): ToolProcessor<File, Blob> {
  return { process: (input) => compressImage(input, options).then((result) => result.blob) };
}
