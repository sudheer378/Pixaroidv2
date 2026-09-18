import { describe, expect, it } from "vitest";
import { validateFile } from "@/core/processing/validate-file";
import { ProcessingError } from "@/core/processing/errors";

function makeFile(name: string, type: string, sizeBytes: number): File {
  const file = new File(["x"], name, { type });
  // File size is read-only; override for size-limit assertions without
  // allocating multi-megabyte buffers in the test run.
  Object.defineProperty(file, "size", { value: sizeBytes });
  return file;
}

const IMAGES = ["image/jpeg", "image/png"] as const;

describe("validateFile", () => {
  it("accepts a file with an allowed mime type and size", () => {
    const file = makeFile("photo.jpg", "image/jpeg", 1024);
    expect(validateFile(file, { acceptedMimeTypes: IMAGES })).toBe(file);
  });

  it("rejects an empty file", () => {
    const file = makeFile("empty.jpg", "image/jpeg", 0);
    expect(() => validateFile(file, { acceptedMimeTypes: IMAGES })).toThrowError(ProcessingError);
    try {
      validateFile(file, { acceptedMimeTypes: IMAGES });
    } catch (error) {
      expect((error as ProcessingError).code).toBe("INVALID_FILE");
    }
  });

  it("rejects an unsupported mime type", () => {
    const file = makeFile("doc.pdf", "application/pdf", 1024);
    try {
      validateFile(file, { acceptedMimeTypes: IMAGES });
      throw new Error("expected a throw");
    } catch (error) {
      expect((error as ProcessingError).code).toBe("UNSUPPORTED_FORMAT");
      expect((error as Error).message).toContain("application/pdf");
    }
  });

  it("reports 'unknown' for a blank mime type when not allowed", () => {
    const file = makeFile("mystery.bin", "", 1024);
    try {
      validateFile(file, { acceptedMimeTypes: IMAGES });
      throw new Error("expected a throw");
    } catch (error) {
      expect((error as Error).message).toContain("unknown");
    }
  });

  it("enforces the default 20 MB limit", () => {
    const file = makeFile("big.jpg", "image/jpeg", 21 * 1024 * 1024);
    try {
      validateFile(file, { acceptedMimeTypes: IMAGES });
      throw new Error("expected a throw");
    } catch (error) {
      expect((error as ProcessingError).code).toBe("FILE_TOO_LARGE");
      expect((error as Error).message).toContain("20 MB");
    }
  });

  it("honours a custom maxBytes limit", () => {
    const file = makeFile("photo.jpg", "image/jpeg", 2 * 1024 * 1024);
    expect(() =>
      validateFile(file, { acceptedMimeTypes: IMAGES, maxBytes: 1024 * 1024 }),
    ).toThrowError(/1 MB limit/);
  });

  it("skips the mime check but still enforces size when allowEmptyMime is set", () => {
    const heic = makeFile("IMG_0001.HEIC", "", 1024);
    expect(validateFile(heic, { acceptedMimeTypes: [], allowEmptyMime: true })).toBe(heic);

    const tooBig = makeFile("IMG_0002.HEIC", "", 50 * 1024 * 1024);
    expect(() =>
      validateFile(tooBig, { acceptedMimeTypes: [], allowEmptyMime: true, maxBytes: 20 * 1024 * 1024 }),
    ).toThrowError(ProcessingError);
  });

  it("skips the mime check when the accepted list is empty", () => {
    const file = makeFile("anything.xyz", "application/x-thing", 1024);
    expect(validateFile(file, { acceptedMimeTypes: [] })).toBe(file);
  });
});
