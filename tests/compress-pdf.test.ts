import { describe, expect, it } from "vitest";
import { createCompressPdfProcessor, resolvePdfCompressionPreset } from "@/core/processing/compress-pdf";

describe("PDF compression processor", () => {
  it("creates a processor with the shared ToolProcessor contract", () => {
    const processor = createCompressPdfProcessor();
    expect(typeof processor.process).toBe("function");
  });

  it("defaults to balanced compression", () => {
    expect(resolvePdfCompressionPreset()).toBe("balanced");
    expect(resolvePdfCompressionPreset({ options: {} })).toBe("balanced");
  });

  it("accepts the strong compression preset", () => {
    expect(resolvePdfCompressionPreset({ options: { preset: "strong" } })).toBe("strong");
  });

  it("rejects arbitrary preset values", () => {
    expect(resolvePdfCompressionPreset({ options: { preset: "maximum" } })).toBe("balanced");
  });
});
