import { describe, expect, it } from "vitest";
import { extensionForMime } from "@/core/processing/image-output";

describe("image output helpers", () => {
  it("maps supported image MIME types to extensions", () => {
    expect(extensionForMime("image/jpeg")).toBe("jpg");
    expect(extensionForMime("image/png")).toBe("png");
    expect(extensionForMime("image/webp")).toBe("webp");
  });
});
