import { ProcessingError } from "./errors";
import type { ToolProcessor } from "@/core/tool-engine/types";

function assertBrowserSupport(): void {
  if (typeof document === "undefined" || typeof URL === "undefined") {
    throw new ProcessingError(
      "BROWSER_UNSUPPORTED",
      "This image conversion requires a browser with Canvas support.",
    );
  }
}

function extensionForMime(mimeType: string): string {
  switch (mimeType) {
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/jpeg":
      return "jpg";
    default:
      return "bin";
  }
}

export function imageToImageProcessor(outputType: "image/png" | "image/jpeg" | "image/webp"): ToolProcessor {
  return {
    process: async (input, context) => {
      assertBrowserSupport();
      context?.onProgress?.(15);

      const bitmap = await createImageBitmap(input);
      try {
        context?.onProgress?.(45);
        const canvas = document.createElement("canvas");
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          throw new ProcessingError("BROWSER_UNSUPPORTED", "Your browser could not create a 2D canvas.");
        }

        if (outputType === "image/jpeg") {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(bitmap, 0, 0);
        context?.onProgress?.(75);

        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(
            (value) => (value ? resolve(value) : reject(new Error("Image encoding failed."))),
            outputType,
            outputType === "image/jpeg" ? 0.92 : undefined,
          );
        });

        context?.onProgress?.(95);
        return new File([blob], `pixora-converted.${extensionForMime(outputType)}`, {
          type: outputType,
          lastModified: Date.now(),
        });
      } finally {
        bitmap.close();
      }
    },
  };
}
