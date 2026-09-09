import { PDFDocument } from "pdf-lib";
import { ProcessingError } from "./errors";
import type { ToolContext, ToolProcessor } from "../tool-engine/types";

const MAX_PDF_BYTES = 20 * 1024 * 1024;

export function createCompressPdfProcessor(): ToolProcessor {
  return {
    async process(input: File, context?: ToolContext) {
      if (typeof document === "undefined") {
        throw new ProcessingError("BROWSER_UNSUPPORTED", "PDF compression requires a browser environment.");
      }
      if (input.type !== "application/pdf") {
        throw new ProcessingError("UNSUPPORTED_FORMAT", "Please select a PDF file.");
      }
      if (input.size === 0) {
        throw new ProcessingError("INVALID_FILE", "The selected PDF is empty.");
      }
      if (input.size > MAX_PDF_BYTES) {
        throw new ProcessingError("FILE_TOO_LARGE", "PDF files are limited to 20 MB in this browser workflow.");
      }

      context?.onProgress?.(10);
      const source = await input.arrayBuffer();
      const pdf = await PDFDocument.load(source, { ignoreEncryption: false });
      context?.onProgress?.(45);

      // Re-saving with object streams consolidates PDF objects and removes
      // unnecessary serialization overhead without rasterizing page content.
      pdf.setTitle("");
      pdf.setAuthor("");
      pdf.setSubject("");
      pdf.setKeywords([]);
      pdf.setProducer("Pixora");
      pdf.setCreator("Pixora PDF Compressor");

      const compressed = await pdf.save({
        useObjectStreams: true,
        addDefaultPage: false,
        updateFieldAppearances: false,
      });
      context?.onProgress?.(90);

      // Compression is never allowed to silently return a larger file.
      const output = compressed.byteLength < input.size ? compressed : new Uint8Array(source);
      context?.onProgress?.(95);

      return new File([output], "pixora-compressed.pdf", {
        type: "application/pdf",
        lastModified: Date.now(),
      });
    },
  };
}
