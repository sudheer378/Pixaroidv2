import { ProcessingError } from "../processing/errors";

export type WorkerImageOptions = {
  outputType?: string;
  quality?: number;
  width?: number;
  height?: number;
};

let worker: Worker | null = null;

function getWorker(): Worker {
  if (typeof window === "undefined" || typeof Worker === "undefined") {
    throw new ProcessingError("BROWSER_UNSUPPORTED", "Web Workers are unavailable in this browser.");
  }
  worker ??= new Worker(new URL("../../workers/image.worker.ts", import.meta.url));
  return worker;
}

export async function processImageInWorker(file: File, options: WorkerImageOptions = {}): Promise<Blob> {
  const activeWorker = getWorker();
  const id = crypto.randomUUID();
  const input = await file.arrayBuffer();

  return new Promise<Blob>((resolve, reject) => {
    const handleMessage = (event: MessageEvent) => {
      const message = event.data as { id: string; type: string; output?: ArrayBuffer; mimeType?: string; message?: string };
      if (message.id !== id) return;

      if (message.type === "result" && message.output) {
        activeWorker.removeEventListener("message", handleMessage);
        resolve(new Blob([message.output], { type: options.outputType ?? message.mimeType ?? "image/webp" }));
      } else if (message.type === "error") {
        activeWorker.removeEventListener("message", handleMessage);
        reject(new ProcessingError("PROCESSING_FAILED", message.message ?? "Worker processing failed."));
      }
    };

    activeWorker.addEventListener("message", handleMessage);
    activeWorker.postMessage(
      { id, input, mimeType: file.type, width: options.width, height: options.height },
      [input],
    );
  });
}
