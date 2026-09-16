import { describe, expect, it } from "vitest";
import { parsePageRange } from "@/core/processing/split-pdf";

describe("Split PDF page range parsing", () => {
  it("parses simple ranges", () => {
    expect(parsePageRange("1-3", 10)).toEqual([1, 2, 3]);
  });

  it("parses mixed lists and ranges", () => {
    expect(parsePageRange("2,5,7-9", 10)).toEqual([2, 5, 7, 8, 9]);
  });

  it("deduplicates and sorts", () => {
    expect(parsePageRange("3,1-3,2", 10)).toEqual([1, 2, 3]);
  });

  it("ignores whitespace", () => {
    expect(parsePageRange(" 1 - 2 , 4 ", 10)).toEqual([1, 2, 4]);
  });

  it("rejects out-of-bounds pages", () => {
    expect(() => parsePageRange("0-2", 10)).toThrow();
    expect(() => parsePageRange("11", 10)).toThrow();
    expect(() => parsePageRange("5-2", 10)).toThrow();
  });

  it("rejects garbage input", () => {
    expect(() => parsePageRange("abc", 10)).toThrow();
    expect(() => parsePageRange("", 10)).toThrow();
  });
});
