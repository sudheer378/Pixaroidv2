import type { ProcessingError } from "../processing/errors";
import type { ProcessingStatus } from "../processing/types";

export type ToolOptions = Readonly<Record<string, unknown>>;

export type ToolContext = {
  signal?: AbortSignal;
  options?: ToolOptions;
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
