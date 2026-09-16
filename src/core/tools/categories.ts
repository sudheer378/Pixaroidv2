import type { ToolCategory, ToolCategoryMeta } from "./types";

export const toolCategories: readonly ToolCategoryMeta[] = [
  {
    id: "pdf",
    slug: "pdf",
    label: "PDF Tools",
    shortLabel: "PDF",
    description: "Merge, split, compress and convert PDF files directly in your browser.",
    seoTitle: "Free Online PDF Tools — Merge, Split, Compress & Convert",
    seoDescription:
      "Free online PDF tools: merge PDF, split PDF, compress PDF, JPG to PDF and PDF to JPG. Files are processed in your browser and never uploaded.",
    accent: "rose",
  },
  {
    id: "image",
    slug: "image",
    label: "Image Tools",
    shortLabel: "Image",
    description: "Compress, resize and convert JPG, PNG, WebP and HEIC images.",
    seoTitle: "Free Online Image Tools — Compress, Resize & Convert",
    seoDescription:
      "Free online image tools: compress images, resize images and convert JPG, PNG, WebP and HEIC. Private, browser-based processing with no uploads.",
    accent: "violet",
  },
  {
    id: "calculator",
    slug: "calculators",
    label: "Calculators",
    shortLabel: "Calculators",
    description: "BMI, age, percentage, loan, tip, date and unit conversion calculators.",
    seoTitle: "Free Online Calculators — BMI, Age, Percentage, Loan & More",
    seoDescription:
      "Free online calculators: BMI calculator, age calculator, percentage calculator, loan repayment calculator, tip calculator, date calculator and unit converter.",
    accent: "emerald",
  },
  {
    id: "text",
    slug: "text",
    label: "Text Tools",
    shortLabel: "Text",
    description: "Count words and characters, convert letter case and generate placeholder text.",
    seoTitle: "Free Online Text Tools — Word Counter, Case Converter & More",
    seoDescription:
      "Free online text tools: word counter, character counter, case converter and lorem ipsum generator. Fast, private and free — no sign-up required.",
    accent: "sky",
  },
  {
    id: "generator",
    slug: "generators",
    label: "Generators",
    shortLabel: "Generators",
    description: "Create QR codes, strong passwords, random numbers and more in one click.",
    seoTitle: "Free Online Generators — QR Code, Password & Random Number",
    seoDescription:
      "Free online generators: QR code generator, strong password generator and random number generator. Everything runs in your browser — nothing is stored.",
    accent: "amber",
  },
  {
    id: "developer",
    slug: "developer",
    label: "Developer Tools",
    shortLabel: "Developer",
    description: "Format JSON, encode Base64, generate UUIDs and hashes, convert colors and time zones.",
    seoTitle: "Free Online Developer Tools — JSON, Base64, UUID, Hash & Color",
    seoDescription:
      "Free developer tools: JSON formatter, Base64 encoder/decoder, UUID generator, MD5/SHA hash generator, color converter and time zone converter.",
    accent: "cyan",
  },
];

export function getCategoryById(id: ToolCategory): ToolCategoryMeta {
  const match = toolCategories.find((category) => category.id === id);
  if (!match) throw new Error(`Unknown tool category: ${id}`);
  return match;
}

export function getCategoryBySlug(slug: string): ToolCategoryMeta | undefined {
  return toolCategories.find((category) => category.slug === slug);
}
