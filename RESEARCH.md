# SaaS Tools Website — Keyword & Market Research

Target markets: United States, United Kingdom, EU (Germany, France, Spain, Italy, Netherlands), Australia, New Zealand, Canada.

Volumes below are approximate **global monthly searches** (English-dominant), aggregated from industry keyword data. All chosen tools have strong volume in every target country and can run 100% in the browser (fast, private, zero server cost — great for AdSense margins).

## Tier 1 — Highest volume, build first

| Tool | Primary keyword | Est. global/mo | Notes for target markets |
|---|---|---|---|
| BMI Calculator | bmi calculator | 5M+ | Massive in UK, AU, NZ, US. Metric + imperial required |
| Age Calculator | age calculator | 4M+ | Strong everywhere |
| Merge PDF | merge pdf / combine pdf | 3.5M+ | #1 PDF intent worldwide |
| QR Code Generator | qr code generator | 2.5M+ | High volume in all markets, high CPC |
| Percentage Calculator | percentage calculator | 1.8M+ | Very strong UK/AU/NZ |
| Password Generator | password generator | 1.5M+ | High CPC (security advertisers) |
| Word Counter | word counter | 1.2M+ | Students/writers, US/UK/AU heavy |
| Compress PDF | compress pdf | 1.2M+ | Universal intent |
| JPG to PDF | jpg to pdf | 1.5M+ | Universal intent |
| Random Number Generator | random number generator | 900k+ | Simple, sticky, US/UK heavy |

## Tier 2 — High volume, strong intent

| Tool | Primary keyword | Est. global/mo | Notes |
|---|---|---|---|
| Split PDF | split pdf | 500k+ | Completes the PDF suite |
| PDF to JPG | pdf to jpg | 800k+ | |
| Image Compressor | compress image | 700k+ | |
| Image Resizer | resize image | 900k+ | |
| Unit Converter | unit converter | 500k+ | Metric↔imperial: perfect for US↔EU/AU/NZ traffic |
| Lorem Ipsum Generator | lorem ipsum generator | 500k+ | Designers/devs, high in US/DE/NL |
| Character Counter | character counter | 400k+ | Social media limits |
| Date Calculator | days between dates | 600k+ | Strong US/UK |
| Loan / Mortgage Repayment Calculator | loan calculator | 1M+ | Very high CPC in US/UK/AU |
| Tip Calculator | tip calculator | 300k+ | US-specific but high |

## Tier 3 — Developer & utility (lower volume, very high loyalty/return rate)

| Tool | Primary keyword | Est. global/mo |
|---|---|---|
| Case Converter | case converter / uppercase to lowercase | 250k+ |
| Base64 Encode/Decode | base64 decode | 400k+ |
| JSON Formatter | json formatter | 300k+ |
| UUID Generator | uuid generator | 150k+ |
| Hash Generator | md5 / sha256 generator | 200k+ |
| Color Picker / Converter | hex to rgb, color picker | 700k+ |
| Timezone Converter | time zone converter | 200k+ | Great AU/NZ ↔ US/EU angle |
| Image Format Converters | png to jpg, webp to jpg, heic to jpg | 1M+ combined |

## Why these win in US/EU/AU/NZ

1. **Language-neutral or English-first** — all target countries search these terms in English (calculators/PDF terms are near-identical in DE/FR/NL too).
2. **Browser-only processing** — no server cost per user, "files never leave your device" is a strong EU/GDPR-friendly privacy pitch.
3. **AdSense economics** — password/loan/QR tools have high CPCs; calculators have huge volume; PDF tools have huge session counts.
4. **Answer-Engine friendly** — each page gets FAQ schema + direct answers, which wins featured snippets and AI-search citations in these markets.

## SEO architecture plan

- One canonical URL per intent: `/tools/<slug>` + category hubs (`/pdf`, `/calculators`, `/text`, `/generators`, `/image`, `/developer`)
- Per-page: unique title/description, one H1, direct answer paragraph, how-to steps, FAQ (with `FAQPage` + `SoftwareApplication`/`HowTo` JSON-LD), related tools
- Sitemap + robots + breadcrumbs (`BreadcrumbList` schema)
- AdSense-ready: fixed-size reserved ad slots (no CLS) — top-of-content, in-content, sidebar/footer
- hreflang deferred until real localized content exists (per your existing spec — correct call)
