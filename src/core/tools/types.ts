export type ToolCategory =
  | "pdf"
  | "image"
  | "calculator"
  | "text"
  | "generator"
  | "developer";

export type ToolKind = "file" | "interactive";

export type ProcessingMode = "browser" | "server" | "hybrid";

export interface ToolFaq {
  question: string;
  answer: string;
}

export interface ToolSeo {
  title: string;
  description: string;
  h1: string;
  /** Direct, snippet-ready answer to the primary intent (AEO). */
  directAnswer: string;
  /** Ordered how-to steps rendered on-page and in HowTo schema. */
  howTo: readonly string[];
  /** Questions with real answers, rendered on-page and in FAQPage schema. */
  faqs: readonly ToolFaq[];
  /** Secondary keywords this page also satisfies. */
  keywords: readonly string[];
}

export interface ToolDefinition {
  id: string;
  slug: string;
  name: string;
  category: ToolCategory;
  kind: ToolKind;
  description: string;
  primaryIntent: string;
  processingMode: ProcessingMode;
  /** MIME types accepted — file tools only. */
  inputFormats?: readonly string[];
  outputFormats?: readonly string[];
  /** Whether the tool accepts multiple files at once. */
  multiFile?: boolean;
  seo: ToolSeo;
  relatedTools: readonly string[];
  status: "live" | "planned";
}

export interface ToolCategoryMeta {
  id: ToolCategory;
  slug: string;
  label: string;
  shortLabel: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  accent: string;
}
