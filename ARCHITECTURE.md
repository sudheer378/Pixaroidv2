# Pixora V2 Architecture

## Product boundary
Pixora is a privacy-first suite of free online tools: PDF, image, calculator, text, generator and developer utilities. All 32 tools run entirely in the browser — no file or user data ever reaches a server.

## Core flow

**File tools:** Page → Tool Definition → Tool Engine → Validation → Processor → Browser processing → Result → Download.

**Interactive tools:** Page → Tool Definition → Interactive widget (client component) → Pure logic module (`src/core/interactive/*`) → Live result.

## Principles

1. SEO, GEO and AEO are first-class application concerns.
2. Tool definitions are the single source of truth for routing, metadata, on-page content (direct answer, how-to, FAQs) and structured data.
3. Processing and calculation logic never lives inside page components — it lives in pure, unit-tested modules.
4. Browser-first processing always; no server processing path exists.
5. Monetization (ad slots) is isolated from tool processing and reserves fixed space (zero CLS).
6. New tools are registered through the `ToolDefinition` contract, not duplicated page code.
7. Indexable pages must satisfy a real search intent with genuinely useful functionality and content.
8. Privacy claims must match the actual processing path.

## Layout

- `src/core/tools/` — registry (split per category), categories, types.
- `src/core/tool-engine/` — file-tool engine, processor map, run-tool entry.
- `src/core/processing/` — file processors (merge/split/compress PDF, conversions, HEIC…).
- `src/core/interactive/` — pure logic for calculators, text tools, generators, developer tools.
- `src/components/tools/` — file workspace + interactive widgets (one dispatch map).
- `src/components/seo/json-ld.tsx` — WebApplication, FAQPage, HowTo, BreadcrumbList schema.
- `src/components/layout/ad-slot.tsx` — AdSense-ready fixed-size placeholders.
- `src/app/` — home, `/{category}` hubs, `/tools/{slug}` pages, static pages, sitemap, robots.

## Tool catalogue (32 live)

- **PDF:** Merge, Split, Compress, JPG→PDF (multi-image), PDF→JPG.
- **Image:** Compressor, Resizer, JPG↔PNG, JPG↔WebP, HEIC→JPG.
- **Calculators:** BMI, Age, Percentage, Loan, Tip, Date, Unit converter.
- **Text:** Word counter, Character counter, Case converter, Lorem ipsum.
- **Generators:** QR code (URL/text/Wi-Fi/email, PNG+SVG), Password, Random number.
- **Developer:** JSON formatter, Base64, UUID, Hash (SHA family), Color converter, Time zone converter.

## Discovery layers

- SEO: crawlable static pages, per-tool canonical, unique titles/descriptions, one H1, breadcrumbs, category hubs, sitemap, internal linking.
- GEO: entity clarity, factual capability claims, explicit limits and privacy behavior in page copy.
- AEO: every tool page opens with a direct, snippet-ready answer; FAQ and HowTo content is stored in the tool definition and rendered both on-page and as JSON-LD.

## Growth

Add a tool by (1) writing its `ToolDefinition` in the category registry file, (2) adding a processor (file tools) or a pure logic module + widget (interactive tools), and (3) registering the widget/processor in the dispatch map. Routing, metadata, schema, sitemap and internal links follow automatically.
