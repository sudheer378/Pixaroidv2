import type { ToolDefinition } from "./types";

export const developerTools: ToolDefinition[] = [
  {
    id: "json-formatter",
    slug: "json-formatter",
    name: "JSON Formatter",
    category: "developer",
    kind: "interactive",
    description: "Format, validate and minify JSON with clear error messages.",
    primaryIntent: "format and validate JSON",
    processingMode: "browser",
    seo: {
      title: "JSON Formatter — Beautify, Validate & Minify JSON Online",
      description:
        "Free JSON formatter and validator. Beautify JSON with proper indentation, minify for production, and get clear error messages for invalid JSON.",
      h1: "JSON Formatter & Validator",
      directAnswer:
        "Paste JSON and click Format to pretty-print it with 2-space indentation, or Minify to strip whitespace. Invalid JSON produces a clear error with the position of the problem — all processed locally in your browser.",
      howTo: [
        "Paste your JSON into the input box.",
        "Click Format (pretty-print) or Minify.",
        "Fix any reported syntax errors.",
        "Copy the result.",
      ],
      faqs: [
        {
          question: "Why is my JSON invalid?",
          answer:
            "The most common causes: trailing commas after the last item, single quotes instead of double quotes, unquoted keys, and comments (JSON does not allow them). The validator reports the exact character position of the first error.",
        },
        {
          question: "Is my JSON data sent to a server?",
          answer:
            "No. Parsing and formatting use your browser's built-in JSON engine — API keys, tokens or customer data in your JSON never leave your machine.",
        },
      ],
      keywords: ["json formatter", "json validator", "json beautifier", "json minify"],
    },
    relatedTools: ["base64-encoder", "hash-generator", "uuid-generator"],
    status: "live",
  },
  {
    id: "base64-encoder",
    slug: "base64-encode-decode",
    name: "Base64 Encode / Decode",
    category: "developer",
    kind: "interactive",
    description: "Encode text to Base64 or decode Base64 back to text, with full Unicode support.",
    primaryIntent: "encode or decode Base64",
    processingMode: "browser",
    seo: {
      title: "Base64 Encode & Decode — Free Online Converter",
      description:
        "Free Base64 encoder and decoder. Convert text to Base64 and decode Base64 to text with full Unicode support. Runs in your browser — nothing uploaded.",
      h1: "Base64 Encode / Decode",
      directAnswer:
        "Type or paste text and it is encoded to Base64 instantly; paste Base64 in decode mode to get the original text back. Full UTF-8 support means emojis and non-Latin scripts round-trip correctly.",
      howTo: [
        "Choose Encode or Decode.",
        "Paste your text or Base64 string.",
        "Copy the converted output.",
      ],
      faqs: [
        {
          question: "What is Base64 used for?",
          answer:
            "Base64 represents binary data using 64 safe ASCII characters so it can travel through text-only channels — email attachments (MIME), data URLs for inline images, JWT tokens and basic HTTP authentication headers.",
        },
        {
          question: "Is Base64 encryption?",
          answer:
            "No. Base64 is an encoding, not encryption — anyone can decode it instantly. Never use it to protect passwords or secrets; it only makes data transport-safe, not confidential.",
        },
      ],
      keywords: ["base64 encode", "base64 decode", "base64 converter", "decode base64 online"],
    },
    relatedTools: ["json-formatter", "hash-generator", "uuid-generator"],
    status: "live",
  },
  {
    id: "uuid-generator",
    slug: "uuid-generator",
    name: "UUID Generator",
    category: "developer",
    kind: "interactive",
    description: "Generate random version 4 UUIDs, one at a time or in bulk.",
    primaryIntent: "generate a UUID",
    processingMode: "browser",
    seo: {
      title: "UUID Generator — Random v4 UUIDs Online (Bulk Supported)",
      description:
        "Free UUID v4 generator. Create one or hundreds of random universally unique identifiers, generated securely in your browser. Copy with one click.",
      h1: "UUID Generator",
      directAnswer:
        "Click Generate to create a random version 4 UUID like 3f2b4a1e-9c7d-4e8a-b1f0-6a5d2c9e8f47. UUIDs are generated with your browser's crypto API; the chance of two v4 UUIDs colliding is about 1 in 5.3 undecillion.",
      howTo: [
        "Choose how many UUIDs you need.",
        "Click Generate.",
        "Copy one UUID or the whole list.",
      ],
      faqs: [
        {
          question: "What is a UUID?",
          answer:
            "A universally unique identifier is a 128-bit value written as 36 characters (32 hex digits and 4 hyphens). Version 4 UUIDs are generated from random data and are the most widely used type for database keys, request IDs and distributed systems.",
        },
        {
          question: "Can two UUIDs ever be the same?",
          answer:
            "In theory yes, in practice no: v4 UUIDs have 122 random bits, so you would need to generate about 2.7×10¹⁸ UUIDs to reach even a 50% chance of one collision.",
        },
      ],
      keywords: ["uuid generator", "guid generator", "uuid v4", "random uuid"],
    },
    relatedTools: ["password-generator", "hash-generator", "random-number-generator"],
    status: "live",
  },
  {
    id: "hash-generator",
    slug: "hash-generator",
    name: "Hash Generator",
    category: "developer",
    kind: "interactive",
    description: "Compute SHA-256, SHA-1, SHA-384 and SHA-512 hashes of any text.",
    primaryIntent: "generate a hash",
    processingMode: "browser",
    seo: {
      title: "Hash Generator — SHA-256, SHA-1 & SHA-512 Online",
      description:
        "Free hash generator. Compute SHA-256, SHA-1, SHA-384 and SHA-512 hashes of any text instantly in your browser. Nothing is uploaded or stored.",
      h1: "Hash Generator",
      directAnswer:
        "Type or paste text and Pixora computes its SHA-256, SHA-1, SHA-384 and SHA-512 hashes instantly using the Web Crypto API. The same input always yields the same hash, and even a one-character change produces a completely different result.",
      howTo: [
        "Paste or type the text to hash.",
        "All hash algorithms compute automatically.",
        "Copy the hash you need.",
      ],
      faqs: [
        {
          question: "What is a hash used for?",
          answer:
            "Hashes verify integrity (checking downloads haven't been tampered with), store passwords safely (with salt and a slow KDF), deduplicate data and sign content. They are one-way: you cannot recover the input from the hash.",
        },
        {
          question: "Which hash algorithm should I use?",
          answer:
            "SHA-256 is the modern default. SHA-1 and MD5 are broken for security purposes (collisions can be manufactured) and should only be used for non-security checksums or legacy compatibility.",
        },
      ],
      keywords: ["hash generator", "sha256 generator", "sha1 hash", "checksum generator"],
    },
    relatedTools: ["base64-encoder", "uuid-generator", "password-generator"],
    status: "live",
  },
  {
    id: "color-converter",
    slug: "color-converter",
    name: "Color Converter",
    category: "developer",
    kind: "interactive",
    description: "Pick a color and convert between HEX, RGB and HSL instantly.",
    primaryIntent: "convert HEX to RGB",
    processingMode: "browser",
    seo: {
      title: "Color Converter — HEX to RGB, RGB to HSL Online",
      description:
        "Free color converter and picker. Convert between HEX, RGB and HSL, preview the color live and copy any format with one click.",
      h1: "Color Converter",
      directAnswer:
        "Pick a color or paste any HEX, RGB or HSL value and all formats update instantly with a live preview. For example, #2563eb equals rgb(37, 99, 235) and hsl(221, 83%, 53%).",
      howTo: [
        "Pick a color with the picker, or paste a HEX/RGB/HSL value.",
        "All formats convert instantly with a live swatch.",
        "Copy the format you need.",
      ],
      faqs: [
        {
          question: "How do I convert HEX to RGB?",
          answer:
            "Split the 6-digit HEX code into three pairs and convert each pair from hexadecimal to decimal: #ff6600 → ff=255, 66=102, 00=0 → rgb(255, 102, 0). The tool does this instantly in both directions.",
        },
        {
          question: "When should I use HSL instead of RGB?",
          answer:
            "HSL (hue, saturation, lightness) matches how people think about color, which makes it easier to create consistent palettes — keep the hue fixed and vary lightness for shades, or shift the hue for complementary colors.",
        },
      ],
      keywords: ["hex to rgb", "color converter", "rgb to hsl", "color picker online"],
    },
    relatedTools: ["json-formatter", "base64-encoder", "qr-code-generator"],
    status: "live",
  },
  {
    id: "timezone-converter",
    slug: "timezone-converter",
    name: "Time Zone Converter",
    category: "developer",
    kind: "interactive",
    description: "Convert any time between world time zones — perfect for scheduling across countries.",
    primaryIntent: "convert time between time zones",
    processingMode: "browser",
    seo: {
      title: "Time Zone Converter — Compare World Times Online",
      description:
        "Free time zone converter. Convert any date and time between New York, London, Berlin, Sydney, Auckland and 20+ world cities, with DST handled automatically.",
      h1: "Time Zone Converter",
      directAnswer:
        "Pick a date, a time and a source city, and Pixora shows the equivalent local time in major cities worldwide, with daylight saving handled automatically. When it's 9:00 AM in New York, it's 2:00 PM in London and 11:00 PM in Sydney (winter time).",
      howTo: [
        "Choose the source time zone (city).",
        "Set the date and time.",
        "Read the converted time for every listed city, or add your own.",
      ],
      faqs: [
        {
          question: "How is daylight saving time handled?",
          answer:
            "Conversions use the IANA time zone database built into your browser, so DST transitions in each region are applied automatically for the specific date you choose — a common source of manual scheduling errors.",
        },
        {
          question: "What's the time difference between the US and Australia?",
          answer:
            "Sydney is 14-16 hours ahead of New York depending on the season, because the two hemispheres observe DST at opposite times of year. That's why picking an actual date matters — this tool does it for you.",
        },
      ],
      keywords: ["time zone converter", "world clock", "time difference", "utc converter"],
    },
    relatedTools: ["date-calculator", "age-calculator", "unit-converter"],
    status: "live",
  },
];
