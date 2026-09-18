import type { NextConfig } from "next";

/**
 * The site is fully static and loads no third-party scripts, so the CSP can be
 * strict. `'unsafe-inline'` is required for style-src (Tailwind/Next inject
 * inline styles) and for script-src because Next's bootstrap and the JSON-LD
 * blocks are inline; both are build-time constants with no user input.
 *
 * Sandboxed/preview deployments are served inside an iframe, which the default
 * anti-clickjacking rules would block. Set PIXORA_ALLOW_FRAMING=1 for those
 * environments only — production must stay `none`/`DENY`.
 */
const allowFraming = process.env.PIXORA_ALLOW_FRAMING === "1";

const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  // Tools run locally; blob: covers worker-backed and object-URL downloads.
  "connect-src 'self' blob: data:",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  `frame-ancestors ${allowFraming ? "*" : "'none'"}`,
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  ...(allowFraming ? [] : [{ key: "X-Frame-Options", value: "DENY" }]),
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
