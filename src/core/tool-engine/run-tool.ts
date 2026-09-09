import { getToolBySlug } from "../tools/registry";
import { ToolEngine } from "./engine";
import { getDefaultProcessor } from "./processors";
import type { ToolContext } from "./types";

const engine = new ToolEngine();

export async function runTool(slug: string, input: File, context?: ToolContext) {
  const definition = getToolBySlug(slug);
  if (!definition) {
    throw new Error(`Unknown Pixora tool: ${slug}`);
  }

  const processor = getDefaultProcessor(slug);
  if (!processor) {
    throw new Error(`Tool processor not implemented yet: ${slug}`);
  }

  return engine.run(definition, processor, input, context);
}
