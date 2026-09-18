/** Pure logic for text tools. Fully unit-testable. */

// ---------- Word / character counting ----------

export interface TextStats {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  sentences: number;
  paragraphs: number;
  readingTimeMinutes: number;
  speakingTimeMinutes: number;
}

const READING_WPM = 225;
const SPEAKING_WPM = 140;

export function analyzeText(text: string): TextStats {
  const trimmed = text.trim();
  const words = trimmed === "" ? 0 : trimmed.split(/\s+/).length;
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, "").length;
  const sentences = trimmed === "" ? 0 : (trimmed.match(/[.!?]+(?=\s|$)/g)?.length ?? (words > 0 ? 1 : 0));
  const paragraphs = trimmed === "" ? 0 : trimmed.split(/\n\s*\n+/).filter((p) => p.trim() !== "").length;

  return {
    words,
    characters,
    charactersNoSpaces,
    sentences: sentences === 0 && words > 0 ? 1 : sentences,
    paragraphs,
    readingTimeMinutes: words / READING_WPM,
    speakingTimeMinutes: words / SPEAKING_WPM,
  };
}

export const platformLimits = [
  { id: "x", label: "X (Twitter) post", limit: 280 },
  { id: "instagram", label: "Instagram caption", limit: 2200 },
  { id: "linkedin", label: "LinkedIn post", limit: 3000 },
  { id: "sms", label: "SMS segment", limit: 160 },
  { id: "meta-title", label: "SEO title tag", limit: 60 },
  { id: "meta-description", label: "SEO meta description", limit: 160 },
] as const;

// ---------- Case conversion ----------

const SMALL_WORDS = new Set([
  "a", "an", "and", "as", "at", "but", "by", "for", "if", "in", "nor",
  "of", "on", "or", "so", "the", "to", "up", "yet",
]);

export type CaseStyle =
  | "upper"
  | "lower"
  | "title"
  | "sentence"
  | "camel"
  | "pascal"
  | "snake"
  | "kebab";

export function convertCase(text: string, style: CaseStyle): string {
  switch (style) {
    case "upper":
      return text.toUpperCase();
    case "lower":
      return text.toLowerCase();
    case "sentence":
      return text
        .toLowerCase()
        .replace(/(^\s*[a-z])|([.!?]\s+[a-z])/g, (match) => match.toUpperCase());
    case "title":
      return text
        .toLowerCase()
        .split(/(\s+)/)
        .map((word, index, parts) => {
          if (/^\s+$/.test(word) || word === "") return word;
          const isFirstOrLast = index === 0 || index === parts.length - 1;
          if (!isFirstOrLast && SMALL_WORDS.has(word)) return word;
          return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join("");
    case "camel": {
      const words = splitWords(text);
      return words
        .map((word, index) => (index === 0 ? word.toLowerCase() : capitalize(word)))
        .join("");
    }
    case "pascal":
      return splitWords(text).map(capitalize).join("");
    case "snake":
      return splitWords(text).map((word) => word.toLowerCase()).join("_");
    case "kebab":
      return splitWords(text).map((word) => word.toLowerCase()).join("-");
  }
}

function splitWords(text: string): string[] {
  return text
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean);
}

function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

// ---------- Lorem ipsum ----------

const LOREM_WORDS = (
  "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore " +
  "et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip " +
  "ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum eu fugiat nulla " +
  "pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim " +
  "id est laborum"
).split(" ");

/** LOREM_WORDS is non-empty, so the fallback is unreachable; it satisfies noUncheckedIndexedAccess. */
function randomLoremWord(random: () => number): string {
  return LOREM_WORDS[Math.floor(random() * LOREM_WORDS.length)] ?? "lorem";
}

function loremSentence(random: () => number): string {
  const length = 6 + Math.floor(random() * 10);
  const words: string[] = [];
  for (let i = 0; i < length; i += 1) {
    words.push(randomLoremWord(random));
  }
  const sentence = words.join(" ");
  return sentence.charAt(0).toUpperCase() + sentence.slice(1) + ".";
}

export type LoremUnit = "paragraphs" | "sentences" | "words";

export function generateLorem(unit: LoremUnit, count: number, random: () => number = Math.random): string {
  const clamped = Math.max(1, Math.min(count, unit === "words" ? 1000 : 50));

  if (unit === "words") {
    const words = ["Lorem", "ipsum"];
    while (words.length < clamped) {
      words.push(randomLoremWord(random));
    }
    return words.slice(0, clamped).join(" ") + ".";
  }

  if (unit === "sentences") {
    const sentences: string[] = ["Lorem ipsum dolor sit amet, consectetur adipiscing elit."];
    while (sentences.length < clamped) sentences.push(loremSentence(random));
    return sentences.slice(0, clamped).join(" ");
  }

  const paragraphs: string[] = [];
  for (let p = 0; p < clamped; p += 1) {
    const sentenceCount = 4 + Math.floor(random() * 4);
    const sentences: string[] = [];
    if (p === 0) sentences.push("Lorem ipsum dolor sit amet, consectetur adipiscing elit.");
    while (sentences.length < sentenceCount) sentences.push(loremSentence(random));
    paragraphs.push(sentences.join(" "));
  }
  return paragraphs.join("\n\n");
}
