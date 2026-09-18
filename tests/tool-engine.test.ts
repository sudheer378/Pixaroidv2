import { describe, expect, it, vi } from "vitest";
import { ToolEngine } from "@/core/tool-engine/engine";
import { ProcessingError } from "@/core/processing/errors";
import type { ToolProcessor } from "@/core/tool-engine/types";
import type { ToolDefinition } from "@/core/tools/types";

function makeFile(name: string, type: string, sizeBytes = 1024): File {
  const file = new File(["x"], name, { type });
  Object.defineProperty(file, "size", { value: sizeBytes });
  return file;
}

function definition(overrides: Partial<ToolDefinition> = {}): ToolDefinition {
  return {
    id: "test-tool",
    slug: "test-tool",
    name: "Test Tool",
    category: "image",
    kind: "file",
    description: "",
    primaryIntent: "",
    processingMode: "browser",
    inputFormats: ["image/jpeg"],
    outputFormats: ["image/png"],
    seo: { title: "", description: "", h1: "", directAnswer: "", howTo: [], faqs: [], keywords: [] },
    relatedTools: [],
    status: "live",
    ...overrides,
  };
}

const passthrough: ToolProcessor = {
  async process(input) {
    const file = Array.isArray(input) ? input[0] : input;
    if (!file) throw new Error("no input file");
    return file;
  },
};

describe("ToolEngine", () => {
  it("runs a processor and reports a duration", async () => {
    const result = await new ToolEngine().run(definition(), passthrough, makeFile("a.jpg", "image/jpeg"));
    expect(result.output).toBeInstanceOf(File);
    expect(result.durationMs).toBeGreaterThanOrEqual(0);
  });

  it("emits progress and status callbacks in order", async () => {
    const statuses: string[] = [];
    const progress: number[] = [];
    await new ToolEngine().run(definition(), passthrough, makeFile("a.jpg", "image/jpeg"), {
      onStatus: (s) => statuses.push(s),
      onProgress: (p) => progress.push(p),
    });
    expect(statuses).toEqual(["processing", "completed"]);
    expect(progress.at(0)).toBe(5);
    expect(progress.at(-1)).toBe(100);
  });

  it("rejects a file whose mime type is not accepted", async () => {
    await expect(
      new ToolEngine().run(definition(), passthrough, makeFile("a.pdf", "application/pdf")),
    ).rejects.toThrowError(ProcessingError);
  });

  it("allows a blank mime type through to the processor (HEIC on Windows)", async () => {
    const spy = vi.fn(passthrough.process);
    const result = await new ToolEngine().run(
      definition({ inputFormats: ["image/heic"] }),
      { process: spy },
      makeFile("IMG.HEIC", ""),
    );
    expect(spy).toHaveBeenCalledOnce();
    expect(result.output).toBeInstanceOf(File);
  });

  it("still enforces the 100 MB cap for blank mime types", async () => {
    await expect(
      new ToolEngine().run(
        definition({ inputFormats: ["image/heic"] }),
        passthrough,
        makeFile("IMG.HEIC", "", 101 * 1024 * 1024),
      ),
    ).rejects.toThrowError(/limit/);
  });

  it("skips validation entirely when the tool declares no input formats", async () => {
    const result = await new ToolEngine().run(
      definition({ inputFormats: undefined }),
      passthrough,
      makeFile("weird.xyz", "application/x-thing"),
    );
    expect(result.output).toBeInstanceOf(File);
  });

  it("passes the whole array to multi-file tools and a single file otherwise", async () => {
    const multi = vi.fn(passthrough.process);
    await new ToolEngine().run(
      definition({ multiFile: true }),
      { process: multi },
      [makeFile("a.jpg", "image/jpeg"), makeFile("b.jpg", "image/jpeg")],
    );
    expect(Array.isArray(multi.mock.calls[0]?.[0])).toBe(true);

    const single = vi.fn(passthrough.process);
    await new ToolEngine().run(
      definition(),
      { process: single },
      [makeFile("a.jpg", "image/jpeg"), makeFile("b.jpg", "image/jpeg")],
    );
    expect(Array.isArray(single.mock.calls[0]?.[0])).toBe(false);
  });

  it("validates every file in a multi-file batch", async () => {
    await expect(
      new ToolEngine().run(definition({ multiFile: true }), passthrough, [
        makeFile("a.jpg", "image/jpeg"),
        makeFile("b.pdf", "application/pdf"),
      ]),
    ).rejects.toThrowError(ProcessingError);
  });

  it("sets error status and preserves a ProcessingError thrown by the processor", async () => {
    const statuses: string[] = [];
    const failing: ToolProcessor = {
      async process() {
        throw new ProcessingError("INVALID_FILE", "bespoke message");
      },
    };
    await expect(
      new ToolEngine().run(definition(), failing, makeFile("a.jpg", "image/jpeg"), {
        onStatus: (s) => statuses.push(s),
      }),
    ).rejects.toMatchObject({ code: "INVALID_FILE", message: "bespoke message" });
    expect(statuses).toContain("error");
  });

  it("wraps an unknown error as PROCESSING_FAILED, keeping the message", async () => {
    const failing: ToolProcessor = {
      async process() {
        throw new Error("canvas exploded");
      },
    };
    await expect(
      new ToolEngine().run(definition(), failing, makeFile("a.jpg", "image/jpeg")),
    ).rejects.toMatchObject({ code: "PROCESSING_FAILED", message: "canvas exploded" });
  });

  it("wraps a non-Error throw with a generic message", async () => {
    const failing: ToolProcessor = {
      async process() {
        throw "just a string";
      },
    };
    await expect(
      new ToolEngine().run(definition(), failing, makeFile("a.jpg", "image/jpeg")),
    ).rejects.toMatchObject({ code: "PROCESSING_FAILED" });
  });
});
