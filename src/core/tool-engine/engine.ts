import { ProcessingError } from "../processing/errors";
import { validateFile } from "../processing/validate-file";
import type { ToolDefinition } from "../tools/types";
import type { ToolContext, ToolProcessor, ToolRunResult } from "./types";

export class ToolEngine {
  async run(
    definition: ToolDefinition,
    processor: ToolProcessor,
    input: File | File[],
    context?: ToolContext,
  ): Promise<ToolRunResult> {
    const files = Array.isArray(input) ? input : [input];
    const accepted = definition.inputFormats ?? [];

    const primary = files[0];
    if (!primary) {
      throw new ProcessingError("FILE_REQUIRED", "Please select a file to continue.");
    }

    if (accepted.length > 0) {
      for (const file of files) {
        // Some formats (notably HEIC on Windows) report an empty MIME type;
        // let the processor perform content-level validation for mime, but
        // still enforce size checks.
        if (file.type === "") {
          validateFile(file, { acceptedMimeTypes: [], maxBytes: 100 * 1024 * 1024, allowEmptyMime: true });
          continue;
        }
        validateFile(file, { acceptedMimeTypes: accepted, maxBytes: 100 * 1024 * 1024 });
      }
    }

    const startedAt = performance.now();

    try {
      context?.onStatus?.("processing");
      context?.onProgress?.(5);
      const output = await processor.process(definition.multiFile ? files : primary, context);
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
