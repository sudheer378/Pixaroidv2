import { PDFDocument } from "pdf-lib";
import { ProcessingError } from "./errors";
import type { ToolContext, ToolProcessor } from "../tool-engine/types";

function assertBrowserSupport(): void {
  if (typeof document === "undefined" || typeof createImageBitmap === "undefined") {
    throw new ProcessingError("BROWSER_UNSUPPORTED", "JPG to PDF requires browser image support.");
  }
}

export function createJpgToPdfProcessor(): ToolProcessor {
  return {
    async process(input: File, context?: ToolContext) {
      assertBrowserSupport();
      context?.onProgress?.(10);

      const bitmap = await createImageBitmap(input);
      try {
        const canvas = document.createElement("canvas");
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new ProcessingError("BROWSER_UNSUPPORTED", "Could not create an image canvas.");
        ctx.drawImage(bitmap, 0, 0);
        context?.onProgress?.(35);

        const jpegBlob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(
            (blob) => (blob ? resolve(blob) : reject(new Error("Could not prepare the JPG image."))),
            "image/jpeg",
            0.95,
          );
        });

        const bytes = new Uint8Array(await jpegBlob.arrayBuffer());
        const pdf = await PDFDocument.create();
        const image = await pdf.embedJpg(bytes);
        const page = pdf.addPage([image.width, image.height]);
        page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
        context?.onProgress?.(75);

        const pdfBytes = await pdf.save();
        context?.onProgress?.(95);
        return new File([pdfBytes], "pixora-converted.pdf", {
          type: "application/pdf",
          lastModified: Date.now(),
        });
      } finally {
        bitmap.close();
      }
    },
  };
}
