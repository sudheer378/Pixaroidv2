import { describe, expect, it } from "vitest";

import { createJpgToPdfProcessor } from "@/core/processing/jpg-to-pdf";

describe("JPG to PDF processor", () => {
  it("creates a processor with the shared ToolProcessor contract", () => {
    const processor = createJpgToPdfProcessor();
    expect(typeof processor.process).toBe("function");
  });
});
