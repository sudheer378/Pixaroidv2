type WorkerRequest = {
  id: string;
  input: ArrayBuffer;
  mimeType: string;
  width?: number;
  height?: number;
};

type WorkerResponse =
  | { id: string; type: "progress"; value: number }
  | { id: string; type: "result"; output: ArrayBuffer; mimeType: string }
  | { id: string; type: "error"; message: string };

type WorkerScope = {
  onmessage: ((event: MessageEvent<WorkerRequest>) => void | Promise<void>) | null;
  postMessage(message: WorkerResponse, transfer?: Transferable[]): void;
};

const workerScope = self as unknown as WorkerScope;

workerScope.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  const request = event.data;
  try {
    const blob = new Blob([request.input], { type: request.mimeType });
    const bitmap = await createImageBitmap(blob);
    const width = request.width ?? bitmap.width;
    const height = request.height ?? bitmap.height;

    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("OffscreenCanvas is unavailable.");

    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();
    workerScope.postMessage({ id: request.id, type: "progress", value: 70 });

    const output = await canvas.convertToBlob({ type: "image/webp", quality: 0.92 });
    const buffer = await output.arrayBuffer();
    workerScope.postMessage(
      { id: request.id, type: "result", output: buffer, mimeType: output.type },
      [buffer],
    );
  } catch (error) {
    workerScope.postMessage({
      id: request.id,
      type: "error",
      message: error instanceof Error ? error.message : "Worker processing failed.",
    });
  }
};
