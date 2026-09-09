import { describe, expect, it } from "vitest";
import { createPdfToJpgProcessor } from "@/core/processing/pdf-to-jpg";

describe("PDF to JPG processor", () => {
  it("creates a processor with the shared ToolProcessor contract", () => {
    const processor = createPdfToJpgProcessor();
    expect(typeof processor.process).toBe("function");
  });
});
