import { createImageConversionProcessor, createResizeProcessor } from "../../tools/image/processors";
import type { ToolProcessor } from "./types";

export function getDefaultProcessor(slug: string): ToolProcessor | null {
  switch (slug) {
    case "jpg-to-png":
      return createImageConversionProcessor("image/png", "pixora-converted.png");
    case "png-to-jpg":
      return createImageConversionProcessor("image/jpeg", "pixora-converted.jpg");
    case "jpg-to-webp":
      return createImageConversionProcessor("image/webp", "pixora-converted.webp");
    case "webp-to-jpg":
      return createImageConversionProcessor("image/jpeg", "pixora-converted.jpg");
    case "resize-image":
      return createResizeProcessor(1200, 1200, "image/jpeg");
    default:
      return null;
  }
}
