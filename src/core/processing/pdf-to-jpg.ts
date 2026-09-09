import { zipSync } from "fflate";
import { ProcessingError } from "./errors";
import type { ToolContext, ToolProcessor } from "../tool-engine/types";

const RENDER_SCALE = 2;
const JPEG_QUALITY = 0.92;
const MAX_PAGES = 100;
const MAX_CANVAS_PIXELS = 25_000_000;

function assertBrowserSupport(): void {
  if (typeof window === "undefined" || typeof document === "undefined") {
    throw new ProcessingError("BROWSER_UNSUPPORTED", "PDF to JPG requires browser processing.");
  }
}

function pageScale(width: number, height: number): number {
  const requestedPixels = width * height * RENDER_SCALE * RENDER_SCALE;
  if (requestedPixels <= MAX_CANVAS_PIXELS) return RENDER_SCALE;
  return Math.sqrt(MAX_CANVAS_PIXELS / (width * height));
}

function baseName(name: string): string {
  return name.replace(/\.pdf$/i, "") || "pixora-pdf";
}

function blobFromBytes(bytes: Uint8Array): Blob {
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return new Blob([copy.buffer], { type: "application/zip" });
}

export function createPdfToJpgProcessor(): ToolProcessor {
  return {
    async process(input: File, context?: ToolContext) {
      assertBrowserSupport();
      context?.onProgress?.(2);

      const pdfjs = await import("pdfjs-dist/build/pdf.mjs");
      const pdf = await pdfjs.getDocument({
        data: new Uint8Array(await input.arrayBuffer()),
        disableWorker: true,
      }).promise;

      try {
        if (pdf.numPages < 1) {
          throw new ProcessingError("INVALID_FILE", "The PDF does not contain any pages.");
        }
        if (pdf.numPages > MAX_PAGES) {
          throw new ProcessingError("FILE_TOO_LARGE", `PDFs are limited to ${MAX_PAGES} pages for browser processing.`);
        }

        const outputs: File[] = [];
        const stem = baseName(input.name);

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
          const page = await pdf.getPage(pageNumber);
          const baseViewport = page.getViewport({ scale: 1 });
          const scale = pageScale(baseViewport.width, baseViewport.height);
          const viewport = page.getViewport({ scale });
          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.ceil(viewport.width));
          canvas.height = Math.max(1, Math.ceil(viewport.height));
          const ctx = canvas.getContext("2d", { alpha: false });

          if (!ctx) {
            throw new ProcessingError("BROWSER_UNSUPPORTED", "Could not create an image canvas.");
          }

          try {
            await page.render({ canvasContext: ctx, viewport }).promise;
            const blob = await new Promise<Blob>((resolve, reject) => {
              canvas.toBlob(
                (value) => value ? resolve(value) : reject(new Error("Could not encode the PDF page as JPG.")),
                "image/jpeg",
                JPEG_QUALITY,
              );
            });
            outputs.push(new File([blob], `${stem}-page-${pageNumber}.jpg`, {
              type: "image/jpeg",
              lastModified: Date.now(),
            }));
          } finally {
            canvas.width = 0;
            canvas.height = 0;
            page.cleanup();
          }

          context?.onProgress?.(5 + Math.round((pageNumber / pdf.numPages) * 90));
        }

        if (outputs.length === 1) return outputs[0];

        const entries: Record<string, Uint8Array> = {};
        for (const file of outputs) {
          entries[file.name] = new Uint8Array(await file.arrayBuffer());
        }
        const archive = zipSync(entries, { level: 0 });
        context?.onProgress?.(100);
        return new File([blobFromBytes(archive)], `${stem}-jpg-images.zip`, {
          type: "application/zip",
          lastModified: Date.now(),
        });
      } finally {
        await pdf.destroy();
      }
    },
  };
}
