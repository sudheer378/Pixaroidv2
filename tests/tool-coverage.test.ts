import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { toolRegistry } from "@/core/tools/registry";
import { getDefaultProcessor } from "@/core/tool-engine/processors";

/**
 * Guards the two lookup tables that map a registry entry to something that can
 * actually run. A tool can otherwise ship a fully SEO-optimised page whose
 * workspace renders "coming soon" — the failure mode this suite exists to catch.
 */
describe("tool implementation coverage", () => {
  const widgetSource = readFileSync(
    new URL("../src/components/tools/interactive-workspace.tsx", import.meta.url),
    "utf8",
  );
  const mappedWidgets = [...widgetSource.matchAll(/^\s+"([a-z0-9-]+)":/gm)]
    .map((match) => match[1])
    .filter((slug): slug is string => Boolean(slug));

  it("resolves a processor for every file tool", () => {
    for (const tool of toolRegistry.filter((entry) => entry.kind === "file")) {
      expect(getDefaultProcessor(tool.slug), `no processor for ${tool.slug}`).not.toBeNull();
    }
  });

  it("resolves a widget for every interactive tool", () => {
    for (const tool of toolRegistry.filter((entry) => entry.kind === "interactive")) {
      expect(mappedWidgets, `no widget for ${tool.slug}`).toContain(tool.slug);
    }
  });

  it("registers no widget for a tool that does not exist", () => {
    const slugs = new Set(toolRegistry.map((tool) => tool.slug));
    for (const mapped of mappedWidgets) {
      expect(slugs.has(mapped), `orphan widget: ${mapped}`).toBe(true);
    }
  });

  it("returns null for an unknown processor slug", () => {
    expect(getDefaultProcessor("definitely-not-a-tool")).toBeNull();
  });

  it("never returns a processor for an interactive tool", () => {
    for (const tool of toolRegistry.filter((entry) => entry.kind === "interactive")) {
      expect(getDefaultProcessor(tool.slug), `unexpected processor for ${tool.slug}`).toBeNull();
    }
  });
});
