# Pixora V2 Architecture

## Product boundary
Pixora is a privacy-first image, PDF and AI utility platform. Phase 1 contains ten high-intent tools; later phases extend the registry without redesigning the core.

## Core flow

Page → Tool Definition → Tool Engine → Validation → Processor → Worker/browser or secure server path → Result → Download/next action.

## Principles

1. SEO, GEO and AEO are first-class application concerns.
2. Tool definitions are the single source of truth for routing, metadata and supported capabilities.
3. Processing logic does not live inside page components.
4. Browser-first processing is preferred when technically appropriate.
5. Heavy processing belongs off the main UI thread.
6. Monetization is isolated from tool processing and user workflows.
7. Analytics records the full tool funnel without collecting unnecessary file contents.
8. New tools should be registered through contracts rather than duplicated application code.
9. Indexable pages must satisfy a real search intent and provide useful functionality.
10. Privacy claims must match the actual processing path.

## Phase 1 tools

- Image Compressor
- Image Resizer
- JPG → PNG
- PNG → JPG
- JPG → WebP
- WebP → JPG
- HEIC → JPG
- JPG → PDF
- Compress PDF
- PDF → JPG

## Growth architecture

The registry will later support additional AI, PDF, editor and social-media workflows. Search-intent pages may share processors and configuration while retaining distinct, useful page content.

## Discovery layers

- SEO: crawlable pages, technical metadata, canonicals, sitemaps and internal linking.
- GEO: entity clarity, factual claims, context and source-aware content suitable for generative search systems.
- AEO: direct answers, question coverage, structured explanations and task-first content.
