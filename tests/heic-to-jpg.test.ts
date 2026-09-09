import { describe, expect, it } from "vitest";
import { createHeicToJpgProcessor } from "@/core/processing/heic-to-jpg";

describe("HEIC to JPG processor", () => {
  it("creates a processor with the shared ToolProcessor contract", () => {
    const processor = createHeicToJpgProcessor();
    expect(typeof processor.process).toBe("function");
  });
});
