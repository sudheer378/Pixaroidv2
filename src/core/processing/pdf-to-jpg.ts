import { ProcessingError } from "./errors";
import type { ToolContext, ToolProcessor } from "../tool-engine/types";

function assertBrowserSupport(): void {
  if (typeof window === "undefined" || typeof document === "undefined") {
    throw new ProcessingError("BROWSER_UNSUPPORTED", "PDF to JPG requires browser processing.");
  }
}

export function createPdfToJpgProcessor(): ToolProcessor {
  return {
    async process(input: File, context?: ToolContext) {
      assertBrowserSupport();
      context?.onProgress?.(5);
      const pdfjs = await import("pdfjs-dist/build/pdf.mjs");
      const pdf = await pdfjs.getDocument({ data: new Uint8Array(await input.arrayBuffer()) }).promise;
      try {
        if (pdf.numPages !== 1) {
          throw new ProcessingError("PROCESSING_FAILED", "Multi-page PDF export requires the ZIP workspace and is not yet enabled.");
        }
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new ProcessingError("BROWSER_UNSUPPORTED", "Could not create an image canvas.");
        await page.render({ canvasContext: ctx, viewport }).promise;
        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob((value) => value ? resolve(value) : reject(new Error("Could not encode the PDF page as JPG.")), "image/jpeg", 0.92);
        });
        context?.onProgress?.(100);
        return new File([blob], "pixora-page-1.jpg", { type: "image/jpeg", lastModified: Date.now() });
      } finally {
        await pdf.destroy();
      }
    },
  };
}
