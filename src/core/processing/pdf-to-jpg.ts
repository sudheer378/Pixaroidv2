import { PDFDocument } from "pdfjs-dist";
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
      const data = new Uint8Array(await input.arrayBuffer());
      const loadingTask = pdfjs.getDocument({ data });
      const pdf = await loadingTask.promise;
      const outputs: File[] = [];

      try {
        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
          const page = await pdf.getPage(pageNumber);
          const viewport = page.getViewport({ scale: 2 });
          const canvas = document.createElement("canvas");
          canvas.width = Math.ceil(viewport.width);
          canvas.height = Math.ceil(viewport.height);
          const ctx = canvas.getContext("2d");

          if (!ctx) {
            throw new ProcessingError("BROWSER_UNSUPPORTED", "Could not create an image canvas.");
          }

          await page.render({ canvasContext: ctx, viewport }).promise;
          const blob = await new Promise<Blob>((resolve, reject) => {
            canvas.toBlob(
              (value) => (value ? resolve(value) : reject(new Error("Could not encode the PDF page as JPG."))),
              "image/jpeg",
              0.92,
            );
          });

          outputs.push(new File([blob], `pixora-page-${pageNumber}.jpg`, { type: "image/jpeg" }));
          canvas.width = 0;
          canvas.height = 0;
          context?.onProgress?.(10 + Math.round((pageNumber / pdf.numPages) * 90));
        }
      } finally {
        await pdf.destroy();
      }

      if (outputs.length === 1) return outputs[0];
      throw new ProcessingError(
        "PROCESSING_FAILED",
        "This PDF has multiple pages. Multi-page ZIP export will be added in the next PDF workspace build.",
      );
    },
  };
}
