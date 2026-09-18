import { describe, expect, it } from "vitest";
import { createMergePdfProcessor } from "@/core/processing/merge-pdf";
import { ProcessingError } from "@/core/processing/errors";

function pdf(name: string, sizeBytes = 1024): File {
  const file = new File(["%PDF-1.4"], name, { type: "application/pdf" });
  Object.defineProperty(file, "size", { value: sizeBytes });
  return file;
}

/**
 * Guard-clause coverage. The pdf-lib merge itself needs real PDF bytes and is
 * exercised in the browser; these assertions pin the input contract, which is
 * where the user-facing error messages come from.
 */
describe("merge-pdf guards", () => {
  const processor = createMergePdfProcessor();

  it("requires at least two files", async () => {
    await expect(processor.process([pdf("only.pdf")])).rejects.toThrowError(/at least two/i);
    await expect(processor.process(pdf("single.pdf"))).rejects.toThrowError(ProcessingError);
  });

  it("rejects more than 20 files", async () => {
    const files = Array.from({ length: 21 }, (_, i) => pdf(`doc-${i}.pdf`));
    await expect(processor.process(files)).rejects.toThrowError(/up to 20/i);
  });

  it("rejects a combined size over 100 MB", async () => {
    const files = [pdf("a.pdf", 60 * 1024 * 1024), pdf("b.pdf", 60 * 1024 * 1024)];
    await expect(processor.process(files)).rejects.toThrowError(/100 MB/);
  });

  it("rejects a non-PDF file and names it in the message", async () => {
    const notPdf = new File(["x"], "photo.jpg", { type: "image/jpeg" });
    await expect(processor.process([pdf("a.pdf"), notPdf])).rejects.toThrowError(/photo\.jpg is not a PDF/);
  });

  it("surfaces a readable error for unparseable PDF bytes", async () => {
    await expect(processor.process([pdf("a.pdf"), pdf("b.pdf")])).rejects.toThrowError(
      /could not be read|corrupted|password/i,
    );
  });
});
