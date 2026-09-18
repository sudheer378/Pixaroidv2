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
    expect(tool).toBeDefined();
    expect(getToolById(tool!.id)).toEqual(tool);
    expect(getToolBySlug(tool!.slug)).toEqual(tool);
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

  // --- invariants added after the full-repo audit ---

  it("keeps id and slug identical for every tool", () => {
    // Both lookup tables (widgets and processors) key on slug; a tool whose id
    // diverges silently resolves in one and not the other.
    for (const tool of toolRegistry) {
      expect(tool.id, `id/slug mismatch for ${tool.id}`).toBe(tool.slug);
    }
  });

  it("never lists a tool as its own related tool", () => {
    for (const tool of toolRegistry) {
      expect(tool.relatedTools, `${tool.id} references itself`).not.toContain(tool.id);
    }
  });

  it("keeps SEO titles within the 60-character SERP limit", () => {
    for (const tool of toolRegistry) {
      expect(tool.seo.title.length, `title too long: ${tool.seo.title}`).toBeLessThanOrEqual(60);
    }
    for (const category of toolCategories) {
      expect(
        category.seoTitle.length,
        `category title too long: ${category.seoTitle}`,
      ).toBeLessThanOrEqual(60);
    }
  });

  it("keeps meta descriptions within the 160-character limit", () => {
    for (const tool of toolRegistry) {
      expect(tool.seo.description.length, `description too long: ${tool.slug}`).toBeLessThanOrEqual(160);
    }
    for (const category of toolCategories) {
      expect(category.seoDescription.length, `category description: ${category.slug}`).toBeLessThanOrEqual(160);
    }
  });

  it("gives every tool a unique title and description", () => {
    const titles = toolRegistry.map((tool) => tool.seo.title);
    const descriptions = toolRegistry.map((tool) => tool.seo.description);
    expect(new Set(titles).size, "duplicate SEO titles").toBe(titles.length);
    expect(new Set(descriptions).size, "duplicate meta descriptions").toBe(descriptions.length);
  });

  it("gives every tool keywords and a unique category slug", () => {
    for (const tool of toolRegistry) {
      expect(tool.seo.keywords.length, `keywords for ${tool.slug}`).toBeGreaterThan(0);
    }
    const slugs = toolCategories.map((category) => category.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("declares output formats on file tools and no file fields on interactive tools", () => {
    for (const tool of toolRegistry) {
      if (tool.kind === "file") {
        expect(tool.outputFormats?.length, `outputs for ${tool.slug}`).toBeGreaterThan(0);
      } else {
        expect(tool.inputFormats, `${tool.slug} is interactive but declares inputFormats`).toBeUndefined();
        expect(tool.outputFormats, `${tool.slug} is interactive but declares outputFormats`).toBeUndefined();
        expect(tool.multiFile, `${tool.slug} is interactive but declares multiFile`).toBeUndefined();
      }
    }
  });
});
