import { describe, expect, it } from "vitest";
import { getToolById, getToolBySlug, getToolsByCategory, toolRegistry } from "@/core/tools/registry";
import { toolCategories } from "@/core/tools/categories";

describe("Pixora tool registry", () => {
  it("contains all live tools", () => {
    expect(toolRegistry.length).toBeGreaterThanOrEqual(30);
    expect(toolRegistry.every((tool) => tool.status === "live")).toBe(true);
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

  it("assigns every tool to a known category", () => {
    const categoryIds = new Set(toolCategories.map((category) => category.id));
    for (const tool of toolRegistry) {
      expect(categoryIds.has(tool.category)).toBe(true);
    }
  });

  it("has at least one tool per category", () => {
    for (const category of toolCategories) {
      expect(getToolsByCategory(category.id).length).toBeGreaterThan(0);
    }
  });

  it("provides complete SEO content for every tool", () => {
    for (const tool of toolRegistry) {
      expect(tool.seo.title.length).toBeGreaterThan(10);
      expect(tool.seo.title.length).toBeLessThanOrEqual(70);
      expect(tool.seo.description.length).toBeGreaterThan(50);
      expect(tool.seo.description.length).toBeLessThanOrEqual(170);
      expect(tool.seo.directAnswer.length).toBeGreaterThan(50);
      expect(tool.seo.howTo.length).toBeGreaterThanOrEqual(3);
      expect(tool.seo.faqs.length).toBeGreaterThanOrEqual(2);
      for (const faq of tool.seo.faqs) {
        expect(faq.answer.length).toBeGreaterThan(40);
      }
    }
  });

  it("only references known related tools", () => {
    for (const tool of toolRegistry) {
      for (const relatedId of tool.relatedTools) {
        const related = getToolById(relatedId) ?? getToolBySlug(relatedId);
        expect(related, `related tool ${relatedId} referenced by ${tool.id}`).toBeDefined();
      }
    }
  });

  it("requires input formats on file tools", () => {
    for (const tool of toolRegistry) {
      if (tool.kind === "file") {
        expect(tool.inputFormats && tool.inputFormats.length > 0, `inputs for ${tool.id}`).toBe(true);
      }
    }
  });
});
