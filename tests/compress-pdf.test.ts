import { describe, expect, it } from "vitest";
import { createCompressPdfProcessor } from "@/core/processing/compress-pdf";

describe("PDF compression processor", () => {
  it("creates a processor with the expected process contract", () => {
    const processor = createCompressPdfProcessor();
    expect(processor).toHaveProperty("process");
    expect(typeof processor.process).toBe("function");
  });
});
