# Pixaroidv2 (Pixora) — Full Repository Audit

**Date:** 2026-09-17 · **Branch:** `arena/01a0ae14-pixaroidv2` · **Base commit:** `e0dcd69`
**Scope:** all 72 tracked files (~6,700 LOC of `src` + `tests`), config, CI, docs.

---

## 1. Verdict

**Overall: B+ / healthy.** This is a well-structured, genuinely static Next.js 16 site with a clean
separation between pure logic (`src/core/**`) and React presentation. Every quality gate passes on a
clean checkout, there are no security vulnerabilities, no `any`, no `@ts-ignore`, no dead TODOs, and
no broken links in the internal tool graph.

The defects that remain are **not correctness bugs in shipped tool logic** — they are gaps in
SEO surface polish, test coverage of the file-processing half of the product, and one piece of
dead code. Nothing here blocks deployment; items in §3 are what I'd fix before a real launch.

### Gate results (verified, clean `npm install`)

| Gate | Command | Result |
|---|---|---|
| Typecheck | `tsc --noEmit` | ✅ clean |
| Lint | `eslint .` | ✅ 0 errors, 0 warnings |
| Tests | `vitest run` | ✅ 70 passed / 10 files |
| Build | `next build` | ✅ 47 pages prerendered, 0 errors |
| Runtime | `next start` + 18 routes | ✅ all 200; unknown routes correctly 404 |
| Deps | `npm audit --omit=dev` | ✅ 0 vulnerabilities |

### Registry integrity (verified programmatically)

32 tools · 32 unique ids · 32 unique slugs · 0 duplicates · 0 broken `relatedTools` references ·
0 self-references · 0 `planned` stubs · every one of the 12 `file` tools resolves to a real
processor · every one of the 20 `interactive` tools resolves to a real widget · 0 orphan widgets ·
0 duplicate SEO titles or descriptions.

---

## 2. Architecture assessment

**Strengths worth preserving:**

- **Pure-core boundary is real, not aspirational.** `src/core/interactive/*.ts` contains zero DOM
  references, which is exactly why 70 tests run in a `node` environment with no jsdom setup.
- **Correct privacy claim.** I checked every network-capable API: there is no `fetch`, no API route,
  no server action, no telemetry, and no third-party script. The "nothing is uploaded" copy on the
  homepage, footer and 32 tool pages is factually true. This matters because it is a legal claim.
- **Genuinely good algorithms.** `calculateAge` uses a clamped-anniversary method (handles a Jan-31
  birthday in February); `convertZonedTime` iterates to a fixed point against `Intl` rather than
  assuming a static offset (handles DST); `generatePassword` guarantees one char per selected pool
  *then* Fisher-Yates shuffles so the guarantee isn't positionally predictable; `decodeBase64` uses
  `TextDecoder(..., {fatal: true})` to reject binary masquerading as text. These are the versions of
  these functions that most sites get wrong.
- **Resource discipline in the heavy paths.** `pdf-to-jpg` and `compress-pdf` both clamp total canvas
  pixels (25M / 16M), cap page count, zero out canvas dimensions in a `finally`, call `page.cleanup()`
  per page and `pdf.destroy()` at the end. `bitmap.close()` is paired everywhere. No leaks found.
- **CI mirrors local gates exactly** — typecheck, lint, test, production build, with concurrency
  cancellation and a 15-minute timeout.

**Structural observations:**

- Two parallel image pipelines exist: `src/core/processing/compress-image.ts` (canvas, main thread)
  and `src/tools/image/*` (used by the actual processors). The `src/tools/` top-level directory
  holding only `image/` is an odd sibling to `src/core/` — it reads as an incomplete migration.
- `src/core/processing/types.ts` retains `ProcessingErrorInfo` and `ProcessingResult`, both unused,
  both explicitly documented as legacy. Same for `ToolRunFailure` in `tool-engine/types.ts`.

---

## 3. Findings

Ordered by what I'd actually fix first.

### 🔴 High — worth fixing before launch

**H1. The entire Web Worker pipeline is dead code.**
`src/core/tool-engine/browser-worker.ts` (61 lines) and `src/workers/image.worker.ts` (55 lines) are
never imported by anything — verified across `src` and `tests`. All image work runs on the main
thread via `src/tools/image/processors.ts`, so large images will jank the UI on the very pages this
code was written to protect. Both files carry "fixed" comments describing bugs repaired in code that
never executes. Either wire `processImageInWorker` into the image processors (the real fix — it also
makes `OffscreenCanvas` available) or delete both files. Leaving them is the worst option: 116 lines
of maintained, typechecked, never-run code that implies a guarantee the product doesn't provide.

**H2. No `og:image`, no favicon, no `public/` directory.**
The layout declares `twitter:card: "summary_large_image"` but never supplies an image, so every
social share of all 47 pages renders as a bare text card — and `summary_large_image` without an image
degrades worse than `summary` would. There is also no `icon.png`/`favicon.ico` and no `public/` dir
at all. For a site whose entire strategy is organic search and sharing, this is the highest-leverage
fix in the report. Add `src/app/opengraph-image.tsx` (Next generates it at build) and `src/app/icon.png`.

**H3. Zero test coverage on the file-processing half of the product.**
18 modules have no test at all, and the untested set is precisely the risky set: `merge-pdf`,
`validate-file`, `engine.ts`, `run-tool.ts`, `processors.ts`, `compress-image.ts`, and all six
registry files. The 70 existing tests cover pure calculators/text/generators plus *pure helpers*
extracted from the PDF modules (`parsePageRange`, `resolvePdfCompressionPreset`) — the PDF tests are
thin wrappers around those helpers, not the processors. `ToolEngine.run`'s validation branching (the
empty-MIME HEIC bypass in particular) and `validateFile`'s limits are pure, synchronous, and trivially
testable today with no jsdom. Also: the registry-integrity checks I ran ad-hoc for this audit belong
in `tests/tool-registry.test.ts` as permanent regression guards.

### 🟡 Medium

**M1. Homepage has no canonical URL.** Confirmed by fetching `/`: every other route sets
`alternates.canonical`, but `src/app/layout.tsx` and `src/app/page.tsx` set none, so `/` is the only
page in the site without one. It's also the page most likely to be reached via tracking params.

**M2. `sitemap.ts` omits `lastModified` on all 43 entries.** Crawlers use it for recrawl scheduling;
its absence weakens the `changeFrequency`/`priority` hints that are already there.

**M3. Three SEO titles exceed the 60-char SERP truncation limit** — and one of them is the site's own
`character-counter` tool, which ships a 60-char "SEO title tag" limit in `platformLimits`. The site
fails its own tool's rule:
- 64 — `character-counter`: "Character Counter — Count Characters Online with Platform Limits"
- 63 — `bmi-calculator`: "BMI Calculator — Check Your Body Mass Index (Metric & Imperial)"
- 62 — `developer` category: "Free Online Developer Tools — JSON, Base64, UUID, Hash & Color"

**M4. `base64-encoder` is the only tool whose `id` ≠ `slug`** (slug is `base64-encode-decode`). Every
other tool holds the invariant. `InteractiveWorkspace` keys its widget map on `id` while
`getDefaultProcessor` keys on `slug`, so this inconsistency is a live trap for the next contributor.
Either enforce `id === slug` with a test, or key both maps on the same field.

**M5. `@types/qrcode` is in `dependencies`, not `devDependencies`.** Types are build-time only; this
ships an unnecessary package to production installs. The other five `@types/*` are correctly placed.

**M6. `geoSignals` and `analyticsEvents` are exported but never consumed.** `geoSignals` in particular
contains carefully written `factualClaims` that read like they were intended for JSON-LD output —
they currently reach no crawler. Either emit them (e.g. into the `WebApplication`/`Organization`
schema) or drop them.

### 🟢 Low / polish

- **L1.** `next.config.ts` sets no security headers. A fully static, script-free site would benefit
  cheaply from `X-Content-Type-Options`, `Referrer-Policy`, and a CSP — and a strict CSP is unusually
  easy here given there are no third-party scripts. Note the JSON-LD uses `dangerouslySetInnerHTML`
  (safe — it's `JSON.stringify` of build-time constants, no user input) but it will need a hash or
  nonce under a strict CSP.
- **L2.** `tsconfig.json` omits `noUncheckedIndexedAccess` and `noImplicitOverride`. The codebase
  indexes arrays freely (`files[0]`, `pools[i][...]`); enabling the former would surface real
  edge cases, though it would require some cleanup.
- **L3.** Dead legacy types: `ProcessingErrorInfo`, `ProcessingResult`, `ToolRunFailure`. Also
  `ProcessingErrorInfo` lists 10 error codes while the live `ProcessingErrorCode` union has 6 — the
  two have silently drifted.
- **L4.** `vitest.config.ts` triggers a Vite config-loader warning on every run (ESM syntax in a
  CJS-loaded file). Fix by renaming to `vitest.config.mts`.
- **L5.** `AdSlot` renders `aria-hidden="true"` on a visible placeholder containing text. Correct
  intent, but once real `<ins class="adsbygoogle">` units go in, `aria-hidden` on an interactive
  iframe container becomes an a11y violation. Flag for the swap.
- **L6.** `tool-workspace.tsx` "% smaller" label is suppressed for `tool.category !== "image"` — so
  the image compressor, the one tool where size reduction is the entire point, never shows its
  savings. Looks like an inverted condition.
- **L7.** The dropzone is `role="button"` with an `onKeyDown` handler, but `Space` doesn't
  `preventDefault()`, so it will also scroll the page on activation.
- **L8.** `README.md` hardcodes "32 tools" and "47 pages" in prose; both are derivable and will rot.
- **L9.** `npm install` in CI rather than `npm ci`, despite a committed `package-lock.json` — CI
  builds aren't reproducible and the lockfile can drift silently.
- **L10.** No `.env.example`, though `.gitignore` explicitly whitelists one (`!.env.example`) and
  `NEXT_PUBLIC_SITE_URL` is required for correct production SEO. The build-time `console.warn`
  fallback is a nice touch, but a checked-in example file is the real fix.

---

## 4. Things I checked that were clean

Worth recording so the next audit doesn't redo them:

- **No secrets** committed; `.gitignore` covers `.env*`, `node_modules`, build output.
- **No `console.log`** anywhere; the single `console.warn` is a deliberate build-time SEO warning.
- **No `any`, no `as any`, no `@ts-ignore`, no `@ts-expect-error`** in the entire codebase.
- **No TODO/FIXME/HACK/XXX** markers.
- **`"use client"` boundary is minimal and correct** — exactly 7 files, all genuinely interactive;
  the registry, SEO and layout trees stay server-side, which is why the build is fully static.
- **`dangerouslySetInnerHTML`** appears once, with build-time constant input only. Not an XSS vector.
- **Error handling** is consistent: a single `ProcessingError` class with a typed code union,
  user-facing messages throughout (no raw stack traces surfaced to users), and `ToolEngine.run`
  wraps unknown throws rather than leaking them.
- **`generateStaticParams` + `dynamicParams = false`** on `[category]`, so unknown categories 404 at
  build time rather than attempting runtime render — confirmed live.
- **Every unit conversion factor I spot-checked is exact**, not rounded: `0.45359237` kg/lb,
  `1609.344` m/mi, `0.028349523125` kg/oz, `4046.8564224` m²/acre, `0.0295735295625` L/US-floz.
- **One `<h1>` per page** on all page types sampled.
- **Blob lifecycle** in `tool-workspace.tsx` revokes object URLs after a 1s delay (correct — immediate
  revocation races the download in some browsers), and `image-output.ts` uses `queueMicrotask`.
- **`acceptFiles` uses a functional `setFiles` update**, avoiding the stale-closure race on rapid
  multi-file adds.

---

## 5. Suggested order of work

1. **H2** — og:image + favicon. Highest ROI, ~30 min, unblocks social/search presentation.
2. **H1** — decide on the worker: wire it up or delete it. Don't leave it ambiguous.
3. **H3** — tests for `validate-file`, `engine`, `merge-pdf`, plus registry-invariant guards
   (the checks in §1 as permanent tests).
4. **M1–M3** — canonical on `/`, `lastModified` in sitemap, trim the three long titles.
5. **M4–M6, L9, L10** — small hygiene batch: `id`/`slug` invariant, `@types/qrcode` move,
   `npm ci`, `.env.example`.
6. **L1, L2** — security headers and stricter TS, as a deliberate follow-up with its own testing.

---

*No files were modified during this audit. `package-lock.json` was touched by `npm install` and*
*restored to its committed state.*
