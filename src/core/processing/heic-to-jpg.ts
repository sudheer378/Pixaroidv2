import { heicTo, isHeic } from "heic-to";
import { ProcessingError } from "./errors";
import type { ToolContext, ToolProcessor } from "../tool-engine/types";

export function createHeicToJpgProcessor(): ToolProcessor {
  return {
    async process(input: File, context?: ToolContext) {
      if (typeof window === "undefined" || typeof document === "undefined") {
        throw new ProcessingError("BROWSER_UNSUPPORTED", "HEIC conversion requires a browser environment.");
      }

      context?.onProgress?.(10);

      let detected = false;
      try {
        detected = await isHeic(input);
      } catch {
        throw new ProcessingError("INVALID_FILE", "The selected file could not be identified as a HEIC or HEIF image.");
      }

      if (!detected) {
        throw new ProcessingError("UNSUPPORTED_FORMAT", "Please select a valid HEIC or HEIF image.");
      }

      context?.onProgress?.(25);

      try {
        const result = await heicTo({
          blob: input,
          type: "image/jpeg",
          quality: 0.92,
        });

        context?.onProgress?.(95);

        return new File([result], "pixora-converted.jpg", {
          type: "image/jpeg",
          lastModified: Date.now(),
        });
      } catch {
        throw new ProcessingError(
          "PROCESSING_FAILED",
          "The HEIC image could not be converted. Please try another HEIC or HEIF file.",
        );
      }
    },
  };
}
