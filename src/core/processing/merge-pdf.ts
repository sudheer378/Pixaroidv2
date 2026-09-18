import { PDFDocument } from "pdf-lib";
import { ProcessingError } from "./errors";
import type { ToolContext, ToolProcessor } from "../tool-engine/types";

const MAX_FILES = 20;
const MAX_TOTAL_BYTES = 100 * 1024 * 1024;

function blobFromBytes(bytes: Uint8Array): Blob {
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return new Blob([copy.buffer], { type: "application/pdf" });
}

export function createMergePdfProcessor(): ToolProcessor {
  return {
    async process(input: File | File[], context?: ToolContext) {
      const files = Array.isArray(input) ? input : [input];

      if (files.length < 2) {
        throw new ProcessingError("INVALID_FILE", "Select at least two PDF files to merge.");
      }
      if (files.length > MAX_FILES) {
        throw new ProcessingError("FILE_TOO_LARGE", `You can merge up to ${MAX_FILES} PDFs at once.`);
      }
      const totalBytes = files.reduce((sum, file) => sum + file.size, 0);
      if (totalBytes > MAX_TOTAL_BYTES) {
        throw new ProcessingError("FILE_TOO_LARGE", "Combined size is limited to 100 MB.");
      }

      // Validate every type upfront: cheaper than parsing, and it reports the
      // offending file immediately instead of after earlier files are parsed.
      for (const file of files) {
        if (file.type !== "application/pdf") {
          throw new ProcessingError("UNSUPPORTED_FORMAT", `${file.name} is not a PDF file.`);
        }
      }

      const merged = await PDFDocument.create();
      merged.setProducer("Pixora");
      merged.setCreator("Pixora Merge PDF");

      for (const [index, file] of files.entries()) {
        // Loading and page extraction share one guard: pdf-lib accepts some
        // malformed files at load and only fails when the page tree is walked,
        // which would otherwise surface a raw TypeError to the user.
        try {
          const source = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: false });
          const pages = await merged.copyPages(source, source.getPageIndices());
          for (const page of pages) merged.addPage(page);
        } catch (cause) {
          if (cause instanceof ProcessingError) throw cause;
          throw new ProcessingError(
            "INVALID_FILE",
            `${file.name} could not be read. It may be corrupted or password protected.`,
          );
        }
        context?.onProgress?.(Math.round(((index + 1) / files.length) * 90));
      }

      const bytes = await merged.save({ useObjectStreams: true, addDefaultPage: false });
      context?.onProgress?.(98);
      return new File([blobFromBytes(bytes)], "pixora-merged.pdf", {
        type: "application/pdf",
        lastModified: Date.now(),
      });
    },
  };
}
