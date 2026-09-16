import { ProcessingError } from "./errors";

const DEFAULT_MAX_BYTES = 20 * 1024 * 1024;

export type FileValidationOptions = {
  acceptedMimeTypes: readonly string[];
  maxBytes?: number;
  /** When true, skip MIME check (for HEIC on Windows which reports empty type) but still validate size. */
  allowEmptyMime?: boolean;
};

export function validateFile(file: File, options: FileValidationOptions): File {
  if (!file) {
    throw new ProcessingError("FILE_REQUIRED", "Please select a file to continue.");
  }

  if (file.size === 0) {
    throw new ProcessingError("INVALID_FILE", "The selected file is empty.");
  }

  const maxBytes = options.maxBytes ?? DEFAULT_MAX_BYTES;
  if (file.size > maxBytes) {
    throw new ProcessingError(
      "FILE_TOO_LARGE",
      `File is larger than the ${Math.round(maxBytes / 1024 / 1024)} MB limit.`,
    );
  }

  if (!options.allowEmptyMime && options.acceptedMimeTypes.length > 0) {
    if (!options.acceptedMimeTypes.includes(file.type)) {
      throw new ProcessingError(
        "UNSUPPORTED_FORMAT",
        `Unsupported file type: ${file.type || "unknown"}.`,
      );
    }
  }

  return file;
}
