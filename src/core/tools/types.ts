export type ToolCategory = "compression" | "conversion" | "resize" | "ai" | "pdf";

export type ProcessingMode = "browser" | "server" | "hybrid";

export interface ToolDefinition {
  id: string;
  slug: string;
  name: string;
  category: ToolCategory;
  description: string;
  primaryIntent: string;
  processingMode: ProcessingMode;
  inputFormats: readonly string[];
  outputFormats: readonly string[];
  seo: {
    title: string;
    description: string;
    h1: string;
    questions: readonly string[];
  };
  relatedTools: readonly string[];
  status: "phase-1" | "planned";
}

export interface ToolProcessor<Input = unknown, Output = unknown> {
  process(input: Input): Promise<Output>;
}
