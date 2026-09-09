import { PDFDocument } from "pdf-lib";
import { ProcessingError } from "./errors";
import type { ToolContext, ToolProcessor } from "../tool-engine/types";

const MAX_PDF_BYTES = 20 * 1024 * 1024;
const MAX_PAGES = 100;
const MAX_RASTER_PIXELS = 16_000_000;
const RASTER_SCALE = 1.5;
const RASTER_JPEG_QUALITY = 0.76;

export type PdfCompressionPreset = "balanced" | "strong";

export function resolvePdfCompressionPreset(context?: ToolContext): PdfCompressionPreset {
  return context?.options?.preset === "strong" ? "strong" : "balanced";
}

function assertBrowserSupport(): void {
  if (typeof window === "undefined" || typeof document === "undefined") {
    throw new ProcessingError("BROWSER_UNSUPPORTED", "PDF compression requires browser processing.");
  }
}

function throwIfAborted(context?: ToolContext): void {
  if (context?.signal?.aborted) {
    throw new ProcessingError("PROCESSING_FAILED", "PDF compression was cancelled.");
  }
}

async function structuralCompression(source: ArrayBuffer, context?: ToolContext): Promise<Uint8Array> {
  throwIfAborted(context);
  const pdf = await PDFDocument.load(source, { ignoreEncryption: false });
  try {
    // Keep this pass lossless: it preserves selectable text, vector graphics,
    // annotations and form structure while reducing serialization overhead.
    pdf.setTitle("");
    pdf.setAuthor("");
    pdf.setSubject("");
    pdf.setKeywords([]);
    pdf.setProducer("Pixora");
    pdf.setCreator("Pixora PDF Compressor");

    return await pdf.save({
      useObjectStreams: true,
      addDefaultPage: false,
      updateFieldAppearances: false,
    });
  } finally {
    pdf.flush();
  }
}

function rasterScale(width: number, height: number): number {
  const requested = width * height * RASTER_SCALE * RASTER_SCALE;
  if (requested <= MAX_RASTER_PIXELS) return RASTER_SCALE;
  return Math.sqrt(MAX_RASTER_PIXELS / (width * height));
}

async function rasterCompression(source: ArrayBuffer, context?: ToolContext): Promise<Uint8Array> {
  throwIfAborted(context);
  const pdfjs = await import("pdfjs-dist/build/pdf.mjs");
  const sourceBytes = new Uint8Array(source);
  const pdf = await pdfjs.getDocument({ data: sourceBytes, disableWorker: true }).promise;

  try {
    if (pdf.numPages < 1) {
      throw new ProcessingError("INVALID_FILE", "The PDF does not contain any pages.");
    }
    if (pdf.numPages > MAX_PAGES) {
      throw new ProcessingError("FILE_TOO_LARGE", `PDFs are limited to ${MAX_PAGES} pages for strong browser compression.`);
    }

    const outputPdf = await PDFDocument.create();

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      throwIfAborted(context);
      const page = await pdf.getPage(pageNumber);
      const baseViewport = page.getViewport({ scale: 1 });
      const scale = rasterScale(baseViewport.width, baseViewport.height);
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.ceil(viewport.width));
      canvas.height = Math.max(1, Math.ceil(viewport.height));

      try {
        const ctx = canvas.getContext("2d", { alpha: false });
        if (!ctx) {
          throw new ProcessingError("BROWSER_UNSUPPORTED", "Could not create an image canvas for PDF compression.");
        }
        await page.render({ canvasContext: ctx, viewport }).promise;
        const jpegBlob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(
            (blob) => blob ? resolve(blob) : reject(new Error("Could not encode the PDF page.")),
            "image/jpeg",
            RASTER_JPEG_QUALITY,
          );
        });
        const jpegBytes = new Uint8Array(await jpegBlob.arrayBuffer());
        const image = await outputPdf.embedJpg(jpegBytes);
        const outputPage = outputPdf.addPage([image.width, image.height]);
        outputPage.drawImage(image, {
          x: 0,
          y: 0,
          width: image.width,
          height: image.height,
        });
      } finally {
        canvas.width = 0;
        canvas.height = 0;
        page.cleanup();
      }

      context?.onProgress?.(45 + Math.round((pageNumber / pdf.numPages) * 45));
    }

    return await outputPdf.save({ useObjectStreams: true, addDefaultPage: false });
  } finally {
    await pdf.destroy();
  }
}

export function createCompressPdfProcessor(): ToolProcessor {
  return {
    async process(input: File, context?: ToolContext) {
      assertBrowserSupport();
      if (input.type !== "application/pdf") {
        throw new ProcessingError("UNSUPPORTED_FORMAT", "Please select a PDF file.");
      }
      if (input.size === 0) {
        throw new ProcessingError("INVALID_FILE", "The selected PDF is empty.");
      }
      if (input.size > MAX_PDF_BYTES) {
        throw new ProcessingError("FILE_TOO_LARGE", "PDF files are limited to 20 MB in this browser workflow.");
      }

      throwIfAborted(context);
      context?.onProgress?.(5);
      const source = await input.arrayBuffer();
      const structural = await structuralCompression(source, context);
      context?.onProgress?.(40);

      let best = structural;
      if (resolvePdfCompressionPreset(context) === "strong" && structural.byteLength >= input.size) {
        const rasterized = await rasterCompression(source, context);
        if (rasterized.byteLength < best.byteLength) best = rasterized;
      }

      // Never return a larger file. Balanced mode is lossless; strong mode may
      // rasterize image-heavy PDFs, but only when that produces a smaller file.
      const output = best.byteLength < input.size ? best : new Uint8Array(source);
      context?.onProgress?.(95);

      return new File([output], "pixora-compressed.pdf", {
        type: "application/pdf",
        lastModified: Date.now(),
      });
    },
  };
}
