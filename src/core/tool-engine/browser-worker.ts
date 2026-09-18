import { ProcessingError } from "../processing/errors";

export type WorkerImageOptions = {
  outputType?: string;
  quality?: number;
  width?: number;
  height?: number;
};

let worker: Worker | null = null;

/**
 * Whether the worker pipeline can run here. Requires Workers (for the
 * off-main-thread hop) and OffscreenCanvas, which the worker uses to draw —
 * Safari only gained the latter in 16.4, so callers must keep a main-thread
 * fallback rather than treating this as always true.
 */
export function canUseImageWorker(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof Worker !== "undefined" &&
    typeof OffscreenCanvas !== "undefined"
  );
}

function getWorker(): Worker {
  if (!canUseImageWorker()) {
    throw new ProcessingError("BROWSER_UNSUPPORTED", "Web Workers are unavailable in this browser.");
  }
  worker ??= new Worker(new URL("../../workers/image.worker.ts", import.meta.url));
  return worker;
}

export async function processImageInWorker(file: File, options: WorkerImageOptions = {}): Promise<Blob> {
  const activeWorker = getWorker();
  const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2);
  const input = await file.arrayBuffer();

  return new Promise<Blob>((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      activeWorker.removeEventListener("message", handleMessage);
      reject(new ProcessingError("PROCESSING_FAILED", "Image worker timed out."));
    }, 30_000);

    const handleMessage = (event: MessageEvent) => {
      const message = event.data as { id: string; type: string; output?: ArrayBuffer; mimeType?: string; message?: string };
      if (message.id !== id) return;

      if (message.type === "result" && message.output) {
        window.clearTimeout(timeout);
        activeWorker.removeEventListener("message", handleMessage);
        // Use actual mime from worker if available, falling back to requested type.
        resolve(new Blob([message.output], { type: message.mimeType ?? options.outputType ?? "image/webp" }));
      } else if (message.type === "error") {
        window.clearTimeout(timeout);
        activeWorker.removeEventListener("message", handleMessage);
        reject(new ProcessingError("PROCESSING_FAILED", message.message ?? "Worker processing failed."));
      }
    };

    activeWorker.addEventListener("message", handleMessage);
    activeWorker.postMessage(
      {
        id,
        input,
        mimeType: file.type,
        outputType: options.outputType,
        quality: options.quality,
        width: options.width,
        height: options.height,
      },
      [input],
    );
  });
}
