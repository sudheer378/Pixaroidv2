# Pixaroidv2 (Pixora) — Full Repository Audit

**Audited:** 2026-09-17 · **Branch:** `arena/01a0ae14-pixaroidv2` · **Audit base:** `e0dcd69`
**Scope:** all 72 tracked files (~6,700 LOC of `src` + `tests`), config, CI, docs.

> **Status: all findings resolved.** Every item below has been fixed in this branch.
> §6 records the verification after the fixes; §7 lists follow-ups deliberately left open.

---

## 1. Verdict (as audited)

**Overall: B+ / healthy.** This is a well-structured, genuinely static Next.js 16 site with a clean
separation between pure logic (`src/core/**`) and React presentation. Every quality gate passed on a
clean checkout, with no security vulnerabilities, no `any`, no `@ts-ignore`, no dead TODOs, and no
broken links in the internal tool graph.

The defects found were mostly **not correctness bugs in shipped tool logic** — they were gaps in SEO
surface polish, test coverage of the file-processing half of the product, and one piece of dead code.
One genuine runtime crash was uncovered later, while writing the tests the audit recommended (see B1).

### Gate results at audit time

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
  references, which is exactly why the suite runs in a `node` environment with no jsdom setup.
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
- `src/core/processing/types.ts` retained `ProcessingErrorInfo` and `ProcessingResult`, both unused,
  both explicitly documented as legacy. Same for `ToolRunFailure` in `tool-engine/types.ts`.

---

## 3. Findings

### 🔴 High

**H1. The entire Web Worker pipeline is dead code.** ✅ *Fixed*
`src/core/tool-engine/browser-worker.ts` (61 lines) and `src/workers/image.worker.ts` (55 lines) were
never imported by anything — verified across `src` and `tests`. All image work ran on the main
thread, so large images would jank the UI on the very pages this code was written to protect. Both
files carried "fixed" comments describing bugs repaired in code that never executed.

*Fix:* wired the worker into the image pipeline rather than deleting it. Added `canUseImageWorker()`
(requires `Worker` **and** `OffscreenCanvas` — Safari only gained the latter in 16.4), and a shared
`encodeImage()` helper in `src/tools/image/processors.ts` that routes conversion and resize through
the worker, falling back to the main-thread canvas path on any failure. The compressor uses the
worker only for the quality-only case: target-size search needs repeated re-encodes of one decoded
bitmap, which the single-shot worker protocol can't express, so that path stays on the main thread.

**H2. No `og:image`, no favicon, no `public/` directory.** ✅ *Fixed*
The layout declared `twitter:card: "summary_large_image"` but never supplied an image, so every
social share of all 47 pages rendered as a bare text card — and `summary_large_image` without an
image degrades worse than `summary` would.

*Fix:* added `src/app/opengraph-image.tsx` (1200×630, generated at build via `next/og`, with the tool
count read from the registry so it can't go stale) and `src/app/icon.tsx` (32×32 favicon). Both are
verified serving `200 image/png`, and the build now emits `/opengraph-image` and `/icon` routes.

**H3. Zero test coverage on the file-processing half of the product.** ✅ *Fixed*
18 modules had no test at all, and the untested set was precisely the risky set: `merge-pdf`,
`validate-file`, `engine.ts`, `run-tool.ts`, `processors.ts`, and all six registry files.

*Fix:* added 36 tests across four new files — `tests/validate-file.test.ts` (8),
`tests/tool-engine.test.ts` (11, covering the empty-MIME HEIC bypass, the 100 MB cap, multi-file
dispatch, and all three error-wrapping paths), `tests/merge-pdf.test.ts` (5), and
`tests/tool-coverage.test.ts` (5, asserting every tool resolves to a processor or widget). The
ad-hoc registry checks from this audit are now permanent guards in `tests/tool-registry.test.ts`
(+7). Suite: **70 → 106 tests**.

### 🟡 Medium — all fixed

- **M1. Homepage had no canonical URL.** ✅ Added `alternates: { canonical: "/" }` to
  `src/app/page.tsx`. Scoped to the page rather than the layout, so `/_not-found` doesn't inherit it.
  Verified: `rel="canonical"` now present on `/`.
- **M2. `sitemap.ts` omitted `lastModified` on all 43 entries.** ✅ Added a build timestamp to every
  entry. Verified: 43 `<lastmod>` elements in the served sitemap.
- **M3. Three SEO titles exceeded the 60-char SERP limit** — including `character-counter`, whose own
  tool ships a 60-char "SEO title tag" rule. ✅ All three shortened (64→48, 63→50, 62→48) and a test
  now enforces the limit for every tool and category.
- **M4. `base64-encoder` was the only tool whose `id` ≠ `slug`.** ✅ Aligned the id to the slug, and
  switched `InteractiveWorkspace` to key on `slug` so it matches `getDefaultProcessor`. A test now
  enforces `id === slug` for every tool.
- **M5. `@types/qrcode` was in `dependencies`.** ✅ Moved to `devDependencies`.
- **M6. `geoSignals` and `analyticsEvents` were exported but never consumed.** ✅ `geoSignals` now
  feeds an `Organization` JSON-LD block on the homepage (`knowsAbout`, `areaServed`, and the
  `factualClaims` as `disambiguatingDescription`) — verified in the served HTML. `analyticsEvents`
  was deleted: there is no analytics integration, so it was speculative.

### 🟢 Low — all fixed

- **L1.** ✅ Added CSP, `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`,
  `Permissions-Policy` and HSTS in `next.config.ts`. All six verified on the response.
- **L2.** ✅ Enabled `noUncheckedIndexedAccess` and `noImplicitOverride`. This surfaced **40 latent
  unchecked-index errors**, all fixed with real guards rather than assertions — including genuine
  crash paths in `split-pdf` (empty input array), `engine.ts` (empty file list) and `pdf-to-jpg`.
- **L3.** ✅ Deleted `ProcessingErrorInfo`, `ProcessingResult` and `ToolRunFailure`.
  `ProcessingErrorInfo` had drifted to 10 error codes against the live union's 6.
- **L4.** ✅ Renamed to `vitest.config.mts`; the config-loader warning is gone.
- **L5.** ✅ `AdSlot` no longer puts `aria-hidden` on the container (which would hide a real ad iframe
  from assistive tech). It now carries `role="complementary"` + `aria-label`, with `aria-hidden` on
  the inner filler text only.
- **L6.** ✅ Fixed the inverted condition that suppressed the "% smaller" label for `category ===
  "image"` — the image compressor, where size reduction is the entire point, never showed its savings.
- **L7.** ✅ Dropzone now calls `preventDefault()` on Space so activation doesn't also scroll the page.
- **L8.** ✅ Removed the hardcoded "32 tools" / "47 pages" from `README.md`.
- **L9.** ✅ CI uses `npm ci` instead of `npm install`, so builds respect the lockfile.
- **L10.** ✅ Added `.env.example` documenting `NEXT_PUBLIC_SITE_URL`.

---

## 4. Bugs found while fixing

**B1. `merge-pdf` crashed with a raw `TypeError` on a malformed PDF.** 🔴 *Fixed*
Found by the new `merge-pdf` tests. `PDFDocument.load` accepts some malformed files and only fails
later when `copyPages` walks the page tree — which sat *outside* the try/catch. Users merging a
corrupt PDF saw `Cannot read properties of undefined (reading 'Pages')` instead of the intended
"could not be read. It may be corrupted or password protected."

Load and page extraction now share one guard. Separately, the non-PDF type check was moved out of the
per-file loop and runs upfront: it's cheaper than parsing, and it names the offending file
immediately rather than after earlier files are parsed.

This is exactly the class of defect H3 predicted, and it was invisible to every other gate.

**B2. `package-lock.json` had drifted from `package.json`.** 🟡 *Fixed*
Switching CI to `npm ci` (L9) immediately failed with `Missing: picomatch@2.3.2 from lock file` — the
committed lockfile was not installable. This had been masked because both CI and local dev used
`npm install`, which silently repairs drift. Resynced the lockfile; `npm ci` now succeeds and all
gates pass against it. Had L9 shipped without this, CI would have broken on the next push.

---

## 5. Things I checked that were clean

Worth recording so the next audit doesn't redo them:

- **No secrets** committed; `.gitignore` covers `.env*`, `node_modules`, build output.
- **No `console.log`** anywhere; the single `console.warn` is a deliberate build-time SEO warning.
- **No `any`, no `as any`, no `@ts-ignore`, no `@ts-expect-error`** in the entire codebase.
- **No TODO/FIXME/HACK/XXX** markers.
- **`"use client"` boundary is minimal and correct** — exactly 7 files, all genuinely interactive;
  the registry, SEO and layout trees stay server-side, which is why the build is fully static.
- **`dangerouslySetInnerHTML`** appears once, with build-time constant input only. Not an XSS vector.
- **Error handling** is consistent: a single `ProcessingError` class with a typed code union,
  user-facing messages throughout, and `ToolEngine.run` wraps unknown throws rather than leaking them.
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

## 6. Verification after fixes

| Gate | Before | After |
|---|---|---|
| `tsc --noEmit` | clean | ✅ clean, with 2 stricter flags enabled |
| `eslint .` | 0 problems | ✅ 0 problems |
| `vitest run` | 70 tests / 10 files | ✅ **106 tests / 14 files** |
| `next build` | 47 pages | ✅ **49 pages** (+`/icon`, `/opengraph-image`) |
| Routes | 18 × 200 | ✅ 18 × 200, unknown routes 404 |
| `npm audit --omit=dev` | 0 vulnerabilities | ✅ 0 vulnerabilities |

Also verified on the running server: canonical on `/`, `og:image` at 200 `image/png`, favicon link,
all six security headers, 43 `<lastmod>` entries, the `Organization` JSON-LD claims, and the renamed
`/tools/base64-encode-decode` route.

---

## 7. Deliberately not done

- **`run-tool.ts` and `processors.ts` still have no direct tests.** Both are thin dispatch layers now
  covered indirectly by `tool-coverage.test.ts`, which asserts every registry entry resolves.
- **No React component tests.** Would need jsdom plus a testing-library dependency; the node-only
  suite is currently a deliberate strength. Worth revisiting if the workspace components grow logic.
- **The `src/tools/` vs `src/core/` split is unchanged.** Consolidating is a pure refactor with no
  behavioural payoff, and it would have obscured the substantive diffs in this branch.
- **The CSP allows `'unsafe-inline'` for scripts and styles**, required by Next's inline bootstrap
  and the JSON-LD blocks. Tightening to nonces or hashes is possible but needs care against the
  static export; the current policy is still a large improvement over no CSP.
