import { describe, expect, it } from "vitest";
import {
  colorFromHex,
  convertZonedTime,
  decodeBase64,
  encodeBase64,
  formatJson,
  generatePassword,
  generateRandomNumbers,
  generateUuids,
} from "@/core/interactive/generators";

describe("Password generator", () => {
  it("respects length and character sets", () => {
    const password = generatePassword({ length: 20, uppercase: true, lowercase: true, numbers: true, symbols: true });
    expect(password).toHaveLength(20);
    expect(/[A-Z]/.test(password)).toBe(true);
    expect(/[a-z]/.test(password)).toBe(true);
    expect(/[0-9]/.test(password)).toBe(true);
  });

  it("throws when no character sets selected", () => {
    expect(() =>
      generatePassword({ length: 16, uppercase: false, lowercase: false, numbers: false, symbols: false }),
    ).toThrow();
  });
});

describe("Random number generator", () => {
  it("stays within range", () => {
    const numbers = generateRandomNumbers(1, 10, 100, false);
    expect(numbers.every((n) => n >= 1 && n <= 10)).toBe(true);
  });

  it("produces unique numbers when requested", () => {
    const numbers = generateRandomNumbers(1, 50, 50, true);
    expect(new Set(numbers).size).toBe(50);
  });

  it("rejects impossible unique draws", () => {
    expect(() => generateRandomNumbers(1, 5, 10, true)).toThrow();
  });
});

describe("UUID generator", () => {
  it("generates valid v4 UUIDs", () => {
    const uuids = generateUuids(10);
    expect(uuids).toHaveLength(10);
    for (const uuid of uuids) {
      expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    }
    expect(new Set(uuids).size).toBe(10);
  });
});

describe("Base64", () => {
  it("round-trips unicode text", () => {
    const original = "Hello, wörld! 你好 🎉";
    expect(decodeBase64(encodeBase64(original))).toBe(original);
  });

  it("encodes known values", () => {
    expect(encodeBase64("Hello, world!")).toBe("SGVsbG8sIHdvcmxkIQ==");
  });

  it("rejects invalid base64", () => {
    expect(() => decodeBase64("not base64 at all!!!")).toThrow();
  });
});

describe("JSON formatter", () => {
  it("formats valid JSON", () => {
    const result = formatJson('{"a":1}', 2);
    expect(result.ok).toBe(true);
    expect(result.output).toBe('{\n  "a": 1\n}');
  });

  it("minifies JSON", () => {
    const result = formatJson('{\n  "a": 1\n}', "minify");
    expect(result.output).toBe('{"a":1}');
  });

  it("reports invalid JSON", () => {
    const result = formatJson("{a: 1,}", 2);
    expect(result.ok).toBe(false);
    expect(result.error).toBeTruthy();
  });
});

describe("Color converter", () => {
  it("converts hex to rgb and hsl", () => {
    const color = colorFromHex("#2563eb");
    expect(color?.rgb).toEqual({ r: 37, g: 99, b: 235 });
    expect(color?.hsl.h).toBe(221);
  });

  it("expands shorthand hex", () => {
    expect(colorFromHex("#fff")?.rgb).toEqual({ r: 255, g: 255, b: 255 });
  });

  it("rejects invalid hex", () => {
    expect(colorFromHex("#zzz")).toBeNull();
  });
});

describe("Time zone converter", () => {
  it("converts New York winter time to London", () => {
    const result = convertZonedTime("2026-01-15", "09:00", "America/New_York", "Europe/London");
    expect(result.time).toBe("14:00");
    expect(result.dayLabel).toBe("same day");
  });

  it("handles day rollover to Sydney", () => {
    const result = convertZonedTime("2026-01-15", "20:00", "America/New_York", "Australia/Sydney");
    expect(result.dayLabel).toBe("next day");
  });

  it("applies DST for summer dates", () => {
    // July: New York is UTC-4, London is UTC+1 → 5 hour gap.
    const result = convertZonedTime("2026-07-15", "09:00", "America/New_York", "Europe/London");
    expect(result.time).toBe("14:00");
  });
});
