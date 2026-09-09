export function downloadBlob(blob: Blob, filename: string): void {
  if (typeof document === "undefined") throw new Error("Downloads are only available in a browser.");
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener";
  anchor.click();
  queueMicrotask(() => URL.revokeObjectURL(url));
}

export function extensionForMime(mime: string): string {
  switch (mime) {
    case "image/png": return "png";
    case "image/webp": return "webp";
    case "image/jpeg": return "jpg";
    default: return "bin";
  }
}
