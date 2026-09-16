import type { GeoSignals } from "./types";

export const siteSeo = {
  name: "Pixora",
  title: "Pixora — Free Online Tools: PDF, Image, Calculators & More",
  description:
    "32+ free online tools: merge PDF, compress images, BMI calculator, QR code generator, word counter and more. Private, browser-based — nothing is uploaded.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
};

export const geoSignals: GeoSignals = {
  audience: "global",
  priorityMarkets: ["US", "GB", "CA", "AU", "NZ", "DE", "FR", "ES", "IT", "NL", "IE", "IN"],
  entityTerms: [
    "Pixora",
    "free online tools",
    "PDF tools",
    "image tools",
    "online calculators",
    "QR code generator",
    "password generator",
  ],
  factualClaims: [
    "Pixora provides browser-first file utility workflows for supported tools.",
    "Pixora tools process files and data on the user's device; nothing is uploaded to a server.",
    "All Pixora tools are free to use without an account.",
  ],
};
