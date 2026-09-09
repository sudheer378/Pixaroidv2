import { ProcessingError } from "../../core/processing/errors";
import type { ToolContext } from "../../core/tool-engine/types";

export async function decodeImage(file: File, context?: ToolContext): Promise<HTMLImageElement> {
  if (typeof createImageBitmap === "function") {
    const bitmap = await createImageBitmap(file);
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bitmap.close();
      throw new ProcessingError("BROWSER_UNSUPPORTED", "This browser cannot create an image canvas.");
    }
    ctx.drawImage(bitmap, 0, 0);
    bitmap.close();
    context?.onProgress?.(35);
    const image = new Image();
    image.src = canvas.toDataURL("image/png");
    await image.decode();
    return image;
  }

  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    context?.onProgress?.(35);
    return image;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function canvasFromImage(image: HTMLImageElement): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new ProcessingError("BROWSER_UNSUPPORTED", "This browser cannot create a processing canvas.");
  }
  ctx.drawImage(image, 0, 0);
  return canvas;
}

export async function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality?: number,
): Promise<Blob> {
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));
  if (!blob) {
    throw new ProcessingError("PROCESSING_FAILED", "The browser could not encode the output image.");
  }
  return blob;
}
