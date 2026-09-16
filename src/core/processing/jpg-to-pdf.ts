import { PDFDocument } from "pdf-lib";
import { ProcessingError } from "./errors";
import type { ToolContext, ToolProcessor } from "../tool-engine/types";

const MAX_FILES = 50;

function assertBrowserSupport(): void {
  if (typeof document === "undefined" || typeof createImageBitmap === "undefined") {
    throw new ProcessingError("BROWSER_UNSUPPORTED", "JPG to PDF requires browser image support.");
  }
}

function blobFromBytes(bytes: Uint8Array): Blob {
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return new Blob([copy.buffer], { type: "application/pdf" });
}

async function imageToJpegBytes(input: File): Promise<Uint8Array> {
  const bitmap = await createImageBitmap(input);
  try {
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new ProcessingError("BROWSER_UNSUPPORTED", "Could not create an image canvas.");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bitmap, 0, 0);

    const jpegBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("Could not prepare the image."))),
        "image/jpeg",
        0.95,
      );
    });

    return new Uint8Array(await jpegBlob.arrayBuffer());
  } finally {
    bitmap.close();
  }
}

export function createJpgToPdfProcessor(): ToolProcessor {
  return {
    async process(input: File | File[], context?: ToolContext) {
      assertBrowserSupport();
      const files = Array.isArray(input) ? input : [input];

      if (files.length === 0) {
        throw new ProcessingError("FILE_REQUIRED", "Select at least one image.");
      }
      if (files.length > MAX_FILES) {
        throw new ProcessingError("FILE_TOO_LARGE", `You can convert up to ${MAX_FILES} images at once.`);
      }

      const pdf = await PDFDocument.create();
      pdf.setProducer("Pixora");
      pdf.setCreator("Pixora JPG to PDF");

      for (let index = 0; index < files.length; index += 1) {
        const bytes = await imageToJpegBytes(files[index]);
        const image = await pdf.embedJpg(bytes);
        const page = pdf.addPage([image.width, image.height]);
        page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
        context?.onProgress?.(5 + Math.round(((index + 1) / files.length) * 85));
      }

      const pdfBytes = await pdf.save();
      context?.onProgress?.(97);
      return new File([blobFromBytes(pdfBytes)], "pixora-converted.pdf", {
        type: "application/pdf",
        lastModified: Date.now(),
      });
    },
  };
}
