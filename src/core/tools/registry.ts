import type { ToolCategory, ToolDefinition } from "./types";
import { pdfTools } from "./registry-pdf";
import { imageTools } from "./registry-image";
import { calculatorTools } from "./registry-calculators";
import { textTools } from "./registry-text";
import { generatorTools } from "./registry-generators";
import { developerTools } from "./registry-developer";

export const toolRegistry: readonly ToolDefinition[] = [
  ...pdfTools,
  ...imageTools,
  ...calculatorTools,
  ...textTools,
  ...generatorTools,
  ...developerTools,
];

export function getToolById(id: string): ToolDefinition | undefined {
  return toolRegistry.find((tool) => tool.id === id);
}

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return toolRegistry.find((tool) => tool.slug === slug);
}

export function getToolsByCategory(category: ToolCategory): ToolDefinition[] {
  return toolRegistry.filter((tool) => tool.category === category);
}
