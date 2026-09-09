export type ProcessingErrorCode =
  | "FILE_REQUIRED"
  | "UNSUPPORTED_FORMAT"
  | "FILE_TOO_LARGE"
  | "INVALID_FILE"
  | "PROCESSING_FAILED"
  | "BROWSER_UNSUPPORTED";

export class ProcessingError extends Error {
  readonly code: ProcessingErrorCode;

  constructor(code: ProcessingErrorCode, message: string) {
    super(message);
    this.name = "ProcessingError";
    this.code = code;
  }
}
