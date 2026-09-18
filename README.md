# Pixora V2

Free, privacy-first online tools platform: PDF, image, calculator, text, generator and developer tools targeting high-search-volume intents in the US, UK, EU, Canada, Australia and New Zealand. The tool count and page count are derived from `src/core/tools/registry.ts` at build time — see the build output for current totals.

- **Everything runs in the browser** — files and data are never uploaded.
- **SEO/AEO-first** — every tool page ships a direct answer, how-to steps, real FAQ answers and FAQPage/HowTo/WebApplication/Breadcrumb JSON-LD.
- **AdSense-ready** — fixed-size ad placeholders reserve space (zero CLS).

## Commands

```bash
npm install
npm run dev        # local dev server
npm run build      # production build (fully static)
npm test           # vitest unit tests
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```

Set `NEXT_PUBLIC_SITE_URL` to the production origin before deploying (used for canonicals, sitemap and JSON-LD).

See `ARCHITECTURE.md` for structure and `RESEARCH.md` for the keyword/market research behind the tool selection.
