export type ProcessingStatus = "idle" | "validating" | "ready" | "processing" | "completed" | "error";

export interface ProcessingError {
  code:
    | "FILE_TOO_LARGE"
    | "UNSUPPORTED_FORMAT"
    | "INVALID_FILE"
    | "PROCESSING_FAILED"
    | "BROWSER_UNSUPPORTED"
    | "MEMORY_LIMIT"
    | "SERVER_ERROR"
    | "RATE_LIMITED"
    | "UNKNOWN_ERROR";
  message: string;
  recoverable: boolean;
}

export interface ProcessingResult<T = Blob> {
  output: T;
  filename: string;
  mimeType: string;
  sizeBytes?: number;
}
