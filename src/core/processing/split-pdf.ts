import { PDFDocument } from "pdf-lib";
import { zipSync } from "fflate";
import { ProcessingError } from "./errors";
import type { ToolContext, ToolProcessor } from "../tool-engine/types";

const MAX_PAGES = 500;

export type SplitMode = "range" | "all";

export function parsePageRange(rangeText: string, pageCount: number): number[] {
  const cleaned = rangeText.replace(/\s+/g, "");
  if (!cleaned) {
    throw new ProcessingError("INVALID_FILE", "Enter a page range such as 1-3 or 2,5,7.");
  }

  const pages = new Set<number>();
  for (const segment of cleaned.split(",")) {
    const rangeMatch = segment.match(/^(\d+)-(\d+)$/);
    const singleMatch = segment.match(/^(\d+)$/);

    if (rangeMatch) {
      const start = Number(rangeMatch[1]);
      const end = Number(rangeMatch[2]);
      if (start < 1 || end > pageCount || start > end) {
        throw new ProcessingError("INVALID_FILE", `Range ${segment} is outside pages 1-${pageCount}.`);
      }
      for (let page = start; page <= end; page += 1) pages.add(page);
    } else if (singleMatch) {
      const page = Number(singleMatch[1]);
      if (page < 1 || page > pageCount) {
        throw new ProcessingError("INVALID_FILE", `Page ${page} is outside pages 1-${pageCount}.`);
      }
      pages.add(page);
    } else {
      throw new ProcessingError("INVALID_FILE", `Could not understand "${segment}". Use formats like 1-3 or 2,5.`);
    }
  }

  return [...pages].sort((a, b) => a - b);
}

function blobFromBytes(bytes: Uint8Array, type: string): Blob {
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return new Blob([copy.buffer], { type });
}

function baseName(name: string): string {
  return name.replace(/\.pdf$/i, "") || "pixora-split";
}

export function createSplitPdfProcessor(): ToolProcessor {
  return {
    async process(input: File | File[], context?: ToolContext) {
      const file = Array.isArray(input) ? input[0] : input;
      if (!file) {
        throw new ProcessingError("FILE_REQUIRED", "Select a PDF file to split.");
      }
      const mode = (context?.options?.mode as SplitMode | undefined) ?? "range";
      const rangeText = (context?.options?.range as string | undefined) ?? "";

      let source: PDFDocument;
      try {
        source = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: false });
      } catch {
        throw new ProcessingError("INVALID_FILE", "The PDF could not be read. It may be corrupted or password protected.");
      }

      const pageCount = source.getPageCount();
      if (pageCount < 1) {
        throw new ProcessingError("INVALID_FILE", "The PDF does not contain any pages.");
      }
      if (pageCount > MAX_PAGES) {
        throw new ProcessingError("FILE_TOO_LARGE", `PDFs are limited to ${MAX_PAGES} pages.`);
      }

      context?.onProgress?.(15);
      const stem = baseName(file.name);

      if (mode === "range") {
        const pages = parsePageRange(rangeText, pageCount);
        const output = await PDFDocument.create();
        const copied = await output.copyPages(source, pages.map((page) => page - 1));
        for (const page of copied) output.addPage(page);
        context?.onProgress?.(80);
        const bytes = await output.save({ useObjectStreams: true, addDefaultPage: false });
        return new File([blobFromBytes(bytes, "application/pdf")], `${stem}-pages.pdf`, {
          type: "application/pdf",
          lastModified: Date.now(),
        });
      }

      // Split every page into its own PDF, zipped.
      const entries: Record<string, Uint8Array> = {};
      for (let index = 0; index < pageCount; index += 1) {
        const output = await PDFDocument.create();
        const [page] = await output.copyPages(source, [index]);
        output.addPage(page);
        entries[`${stem}-page-${index + 1}.pdf`] = await output.save({
          useObjectStreams: true,
          addDefaultPage: false,
        });
        context?.onProgress?.(15 + Math.round(((index + 1) / pageCount) * 75));
      }

      if (pageCount === 1) {
        const only = Object.values(entries)[0];
        if (!only) {
          throw new ProcessingError("PROCESSING_FAILED", "The PDF page could not be extracted.");
        }
        return new File([blobFromBytes(only, "application/pdf")], `${stem}-page-1.pdf`, {
          type: "application/pdf",
          lastModified: Date.now(),
        });
      }

      const archive = zipSync(entries, { level: 0 });
      return new File([blobFromBytes(archive, "application/zip")], `${stem}-pages.zip`, {
        type: "application/zip",
        lastModified: Date.now(),
      });
    },
  };
}
