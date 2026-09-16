import {
  createCompressionProcessor,
  createImageConversionProcessor,
  createResizeProcessor,
} from "../../tools/image/processors";
import { createCompressPdfProcessor } from "../processing/compress-pdf";
import { createHeicToJpgProcessor } from "../processing/heic-to-jpg";
import { createJpgToPdfProcessor } from "../processing/jpg-to-pdf";
import { createMergePdfProcessor } from "../processing/merge-pdf";
import { createPdfToJpgProcessor } from "../processing/pdf-to-jpg";
import { createSplitPdfProcessor } from "../processing/split-pdf";
import type { ToolProcessor } from "./types";

export function getDefaultProcessor(slug: string): ToolProcessor | null {
  switch (slug) {
    case "image-compressor": return createCompressionProcessor();
    case "jpg-to-png": return createImageConversionProcessor("image/png", "pixora-converted.png");
    case "png-to-jpg": return createImageConversionProcessor("image/jpeg", "pixora-converted.jpg");
    case "jpg-to-webp": return createImageConversionProcessor("image/webp", "pixora-converted.webp");
    case "webp-to-jpg": return createImageConversionProcessor("image/jpeg", "pixora-converted.jpg");
    case "image-resizer": return createResizeProcessor();
    case "jpg-to-pdf": return createJpgToPdfProcessor();
    case "compress-pdf": return createCompressPdfProcessor();
    case "heic-to-jpg": return createHeicToJpgProcessor();
    case "pdf-to-jpg": return createPdfToJpgProcessor();
    case "merge-pdf": return createMergePdfProcessor();
    case "split-pdf": return createSplitPdfProcessor();
    default: return null;
  }
}
