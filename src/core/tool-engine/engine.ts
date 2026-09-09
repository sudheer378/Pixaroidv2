import { ProcessingError } from "../processing/errors";
import { validateFile } from "../processing/validate-file";
import type { ToolDefinition } from "../tools/types";
import type { ToolProcessor, ToolRunResult } from "./types";

export class ToolEngine {
  async run(
    definition: ToolDefinition,
    processor: ToolProcessor,
    input: File,
    context?: Parameters<ToolProcessor["process"]>[1],
  ): Promise<ToolRunResult> {
    validateFile(input, {
      acceptedMimeTypes: definition.inputFormats,
    });

    const startedAt = performance.now();

    try {
      context?.onStatus?.("processing");
      context?.onProgress?.(5);
      const output = await processor.process(input, context);
      context?.onProgress?.(100);
      context?.onStatus?.("completed");

      return {
        output,
        durationMs: Math.round(performance.now() - startedAt),
      };
    } catch (error) {
      context?.onStatus?.("error");
      if (error instanceof ProcessingError) throw error;
      throw new ProcessingError(
        "PROCESSING_FAILED",
        error instanceof Error ? error.message : "The tool could not process this file.",
      );
    }
  }
}
