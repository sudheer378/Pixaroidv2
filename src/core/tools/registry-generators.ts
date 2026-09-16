import type { ToolDefinition } from "./types";

export const generatorTools: ToolDefinition[] = [
  {
    id: "qr-code-generator",
    slug: "qr-code-generator",
    name: "QR Code Generator",
    category: "generator",
    kind: "interactive",
    description: "Create QR codes for links, text, Wi-Fi and email — download as PNG or SVG.",
    primaryIntent: "generate a QR code",
    processingMode: "browser",
    seo: {
      title: "QR Code Generator — Free QR Codes for Links, Wi-Fi & Text",
      description:
        "Free QR code generator. Create QR codes for URLs, text, Wi-Fi networks and email, customise colours and download as PNG or SVG. No sign-up, no watermark.",
      h1: "QR Code Generator",
      directAnswer:
        "Enter a link, text, Wi-Fi details or an email address and a scannable QR code is generated instantly in your browser. Download it as a high-resolution PNG or a crisp vector SVG — free, with no watermark and no expiry.",
      howTo: [
        "Choose the QR type: URL, text, Wi-Fi or email.",
        "Enter your content (the code updates live).",
        "Optionally adjust size and colours.",
        "Download as PNG or SVG.",
      ],
      faqs: [
        {
          question: "Do these QR codes expire?",
          answer:
            "No. These are static QR codes — the content is encoded directly in the pattern, so they work forever and never depend on a third-party redirect service.",
        },
        {
          question: "How do I make a QR code for my Wi-Fi?",
          answer:
            "Choose the Wi-Fi type, enter your network name (SSID), password and security type. Scanning the code on any modern phone joins the network automatically without typing the password.",
        },
        {
          question: "What size should a printed QR code be?",
          answer:
            "A rough rule: minimum size = scanning distance ÷ 10. A code scanned from 25 cm (a flyer) should be at least 2.5 cm wide; a poster scanned from 2 m needs about 20 cm. Always print with high contrast and a quiet border.",
        },
        {
          question: "Is my data uploaded when generating a QR code?",
          answer:
            "No. The code is generated entirely in your browser — your links, Wi-Fi passwords and text never leave your device.",
        },
      ],
      keywords: ["qr code generator", "free qr code", "qr code maker", "wifi qr code"],
    },
    relatedTools: ["password-generator", "random-number-generator", "uuid-generator"],
    status: "live",
  },
  {
    id: "password-generator",
    slug: "password-generator",
    name: "Password Generator",
    category: "generator",
    kind: "interactive",
    description: "Generate strong random passwords with custom length and character sets.",
    primaryIntent: "generate a strong password",
    processingMode: "browser",
    seo: {
      title: "Password Generator — Strong Random Passwords Online",
      description:
        "Free strong password generator. Create random passwords up to 64 characters with symbols, numbers and mixed case, generated securely in your browser.",
      h1: "Strong Password Generator",
      directAnswer:
        "Click Generate to create a cryptographically random password using your browser's secure random number generator. A 16-character password with mixed case, numbers and symbols has ~105 bits of entropy — effectively uncrackable by brute force.",
      howTo: [
        "Choose a length (16+ recommended).",
        "Toggle uppercase, lowercase, numbers and symbols.",
        "Click Generate, then Copy.",
      ],
      faqs: [
        {
          question: "What makes a password strong?",
          answer:
            "Length and randomness. Every extra character multiplies the search space; a random 16-character mixed password would take longer than the age of the universe to brute-force, while a common 8-character word-based password can fall in minutes.",
        },
        {
          question: "Is it safe to generate passwords online?",
          answer:
            "Here, yes: passwords are generated with the Web Crypto API entirely on your device, never transmitted, stored or logged. You can even disconnect from the internet and the generator still works.",
        },
        {
          question: "How should I store my passwords?",
          answer:
            "Use a reputable password manager and a unique password per site. Never reuse passwords — breaches on one site are replayed against others within hours.",
        },
      ],
      keywords: ["password generator", "strong password", "random password", "secure password generator"],
    },
    relatedTools: ["random-number-generator", "uuid-generator", "hash-generator"],
    status: "live",
  },
  {
    id: "random-number-generator",
    slug: "random-number-generator",
    name: "Random Number Generator",
    category: "generator",
    kind: "interactive",
    description: "Generate random numbers in any range, with or without duplicates.",
    primaryIntent: "generate a random number",
    processingMode: "browser",
    seo: {
      title: "Random Number Generator — Pick Numbers in Any Range",
      description:
        "Free random number generator. Pick one or many random numbers between any minimum and maximum, with or without repeats. Great for draws and raffles.",
      h1: "Random Number Generator",
      directAnswer:
        "Set a minimum and maximum, choose how many numbers you need, and click Generate. Numbers are drawn using your browser's cryptographically secure randomness, with an option to prevent duplicates — ideal for raffles, draws and random picks.",
      howTo: [
        "Enter the minimum and maximum of your range.",
        "Choose how many numbers to generate.",
        "Toggle 'no duplicates' if you're drawing winners.",
        "Click Generate.",
      ],
      faqs: [
        {
          question: "Are the numbers truly random?",
          answer:
            "They use the Web Crypto API (crypto.getRandomValues), a cryptographically secure source — far stronger than basic Math.random and suitable for fair draws and raffles.",
        },
        {
          question: "Can I draw raffle winners without repeats?",
          answer:
            "Yes — enable 'no duplicates' and each number in the range can be drawn at most once, like pulling numbered balls from a bag without putting them back.",
        },
      ],
      keywords: ["random number generator", "number picker", "raffle number generator", "rng"],
    },
    relatedTools: ["password-generator", "uuid-generator", "qr-code-generator"],
    status: "live",
  },
];
