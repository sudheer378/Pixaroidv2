import type { ProcessingError } from "../processing/errors";
import type { ProcessingStatus } from "../processing/types";

export type ToolContext = {
  signal?: AbortSignal;
  onProgress?: (progress: number) => void;
  onStatus?: (status: ProcessingStatus) => void;
};

export type ToolProcessor = {
  process(input: File, context?: ToolContext): Promise<File | Blob>;
};

export type ToolRunResult = {
  output: File | Blob;
  durationMs: number;
};

export type ToolRunFailure = {
  error: ProcessingError | Error;
};
