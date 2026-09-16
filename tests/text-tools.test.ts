import { describe, expect, it } from "vitest";
import { analyzeText, convertCase, generateLorem } from "@/core/interactive/text";

describe("Text analysis", () => {
  it("counts words, characters and sentences", () => {
    const stats = analyzeText("Hello world. This is Pixora!");
    expect(stats.words).toBe(5);
    expect(stats.sentences).toBe(2);
    expect(stats.characters).toBe(28);
    expect(stats.charactersNoSpaces).toBe(24);
  });

  it("handles empty text", () => {
    const stats = analyzeText("");
    expect(stats.words).toBe(0);
    expect(stats.sentences).toBe(0);
    expect(stats.paragraphs).toBe(0);
  });

  it("counts paragraphs", () => {
    const stats = analyzeText("Para one.\n\nPara two.\n\nPara three.");
    expect(stats.paragraphs).toBe(3);
  });
});

describe("Case converter", () => {
  it("converts basic cases", () => {
    expect(convertCase("hello world", "upper")).toBe("HELLO WORLD");
    expect(convertCase("HELLO WORLD", "lower")).toBe("hello world");
  });

  it("converts sentence case", () => {
    expect(convertCase("HELLO THERE. HOW ARE YOU?", "sentence")).toBe("Hello there. How are you?");
  });

  it("converts title case with small words", () => {
    expect(convertCase("the quick brown fox jumps over the lazy dog", "title"))
      .toBe("The Quick Brown Fox Jumps Over the Lazy Dog");
  });

  it("converts programming cases", () => {
    expect(convertCase("my variable name", "camel")).toBe("myVariableName");
    expect(convertCase("my variable name", "pascal")).toBe("MyVariableName");
    expect(convertCase("my variable name", "snake")).toBe("my_variable_name");
    expect(convertCase("myVariableName", "kebab")).toBe("my-variable-name");
  });
});

describe("Lorem ipsum generator", () => {
  const fixedRandom = () => 0.5;

  it("generates the requested number of words", () => {
    const output = generateLorem("words", 25, fixedRandom);
    expect(output.split(/\s+/).length).toBe(25);
  });

  it("generates paragraphs separated by blank lines", () => {
    const output = generateLorem("paragraphs", 3, fixedRandom);
    expect(output.split("\n\n").length).toBe(3);
    expect(output.startsWith("Lorem ipsum")).toBe(true);
  });

  it("clamps extreme requests", () => {
    const output = generateLorem("paragraphs", 9999, fixedRandom);
    expect(output.split("\n\n").length).toBeLessThanOrEqual(50);
  });
});
