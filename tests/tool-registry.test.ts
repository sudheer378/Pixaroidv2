import { describe, expect, it } from "vitest";
import { getToolById, getToolBySlug, toolRegistry } from "@/core/tools/registry";

describe("Pixora tool registry", () => {
  it("contains exactly the ten Phase 1 tools", () => {
    expect(toolRegistry).toHaveLength(10);
    expect(toolRegistry.every((tool) => tool.status === "phase-1")).toBe(true);
  });

  it("keeps ids and slugs unique", () => {
    expect(new Set(toolRegistry.map((tool) => tool.id)).size).toBe(toolRegistry.length);
    expect(new Set(toolRegistry.map((tool) => tool.slug)).size).toBe(toolRegistry.length);
  });

  it("resolves tools through both id and slug", () => {
    const tool = toolRegistry[0];
    expect(getToolById(tool.id)).toEqual(tool);
    expect(getToolBySlug(tool.slug)).toEqual(tool);
  });
});
