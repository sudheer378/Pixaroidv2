import type { ToolDefinition } from "./types";

export const imageTools: ToolDefinition[] = [
  {
    id: "image-compressor",
    slug: "image-compressor",
    name: "Image Compressor",
    category: "image",
    kind: "file",
    description: "Compress JPG, PNG and WebP images while balancing file size and visual quality.",
    primaryIntent: "compress an image online",
    processingMode: "browser",
    inputFormats: ["image/jpeg", "image/png", "image/webp"],
    outputFormats: ["image/jpeg", "image/png", "image/webp"],
    seo: {
      title: "Image Compressor — Compress JPG, PNG & WebP Online Free",
      description:
        "Compress images online for free. Reduce JPG, PNG and WebP file size without visible quality loss. Private browser-based compression — no uploads.",
      h1: "Compress an Image Online",
      directAnswer:
        "To compress an image, upload a JPG, PNG or WebP file and click Compress. Pixora re-encodes the image at an optimized quality level in your browser, typically cutting file size by 40-80% with little visible difference.",
      howTo: [
        "Select the image you want to compress.",
        "Click Compress image.",
        "Compare the new file size with the original.",
        "Download the compressed image.",
      ],
      faqs: [
        {
          question: "How do I reduce an image's file size without losing quality?",
          answer:
            "Use lossy compression at a high quality setting (around 80%). At that level JPG and WebP files shrink dramatically while artifacts remain practically invisible at normal viewing sizes.",
        },
        {
          question: "Which format compresses best?",
          answer:
            "WebP usually produces the smallest files at the same visual quality, followed by JPG. PNG is lossless and best kept for graphics, logos and screenshots with sharp edges or transparency.",
        },
        {
          question: "Are my photos uploaded to a server?",
          answer:
            "No. Compression runs entirely in your browser using the canvas API, so your photos never leave your device.",
        },
      ],
      keywords: ["compress image", "reduce image size", "photo compressor", "compress jpg"],
    },
    relatedTools: ["image-resizer", "jpg-to-webp", "compress-pdf"],
    status: "live",
  },
  {
    id: "image-resizer",
    slug: "image-resizer",
    name: "Image Resizer",
    category: "image",
    kind: "file",
    description: "Resize images to exact pixel dimensions with the aspect ratio preserved.",
    primaryIntent: "resize an image online",
    processingMode: "browser",
    inputFormats: ["image/jpeg", "image/png", "image/webp"],
    outputFormats: ["image/jpeg", "image/png", "image/webp"],
    seo: {
      title: "Image Resizer — Resize Images to Exact Pixels Online Free",
      description:
        "Resize images online for free. Set exact width and height in pixels for JPG, PNG and WebP images. Fast, private, browser-based — no uploads.",
      h1: "Resize an Image Online",
      directAnswer:
        "To resize an image, upload it, enter the target width or height in pixels, and click Resize. The aspect ratio is preserved by default so your photo never looks stretched.",
      howTo: [
        "Select the image you want to resize.",
        "Enter a target width and/or height in pixels.",
        "Click Resize image.",
        "Download the resized image.",
      ],
      faqs: [
        {
          question: "How do I resize an image to exact pixel dimensions?",
          answer:
            "Enter the width and height you need before processing. If you enter only one dimension, the other is calculated automatically to keep the original aspect ratio.",
        },
        {
          question: "Does resizing reduce image quality?",
          answer:
            "Downscaling (making an image smaller) keeps images sharp. Upscaling beyond the original size cannot add real detail and may look soft — for best results, resize down rather than up.",
        },
        {
          question: "What sizes do social platforms use?",
          answer:
            "Common targets: 1080×1080 for Instagram posts, 1200×630 for link previews, 1280×720 for YouTube thumbnails and 1500×500 for X headers.",
        },
      ],
      keywords: ["resize image", "change image size", "image dimensions", "photo resizer"],
    },
    relatedTools: ["image-compressor", "jpg-to-png", "png-to-jpg"],
    status: "live",
  },
  {
    id: "jpg-to-png",
    slug: "jpg-to-png",
    name: "JPG to PNG",
    category: "image",
    kind: "file",
    description: "Convert JPG images to lossless PNG format in your browser.",
    primaryIntent: "convert JPG to PNG",
    processingMode: "browser",
    inputFormats: ["image/jpeg"],
    outputFormats: ["image/png"],
    seo: {
      title: "JPG to PNG Converter — Free Online, No Uploads",
      description:
        "Convert JPG to PNG online for free. Lossless PNG output, processed privately in your browser with no uploads and no sign-up.",
      h1: "Convert JPG to PNG",
      directAnswer:
        "To convert JPG to PNG, upload the JPG and click Convert. The image is re-encoded as a lossless PNG in your browser and ready to download in seconds.",
      howTo: [
        "Select a JPG image.",
        "Click Convert to PNG.",
        "Download the PNG file.",
      ],
      faqs: [
        {
          question: "Does converting JPG to PNG improve quality?",
          answer:
            "No — it preserves the current quality exactly, but cannot restore detail already lost by JPG compression. PNG is useful when you need lossless edits or a format that supports transparency going forward.",
        },
        {
          question: "Why is my PNG bigger than the JPG?",
          answer:
            "PNG is lossless, so it stores photographic detail without discarding anything. For photos this typically means a larger file; for graphics with flat colors PNG can actually be smaller.",
        },
      ],
      keywords: ["jpg to png", "jpeg to png", "convert jpg to png free"],
    },
    relatedTools: ["png-to-jpg", "jpg-to-webp", "image-compressor"],
    status: "live",
  },
  {
    id: "png-to-jpg",
    slug: "png-to-jpg",
    name: "PNG to JPG",
    category: "image",
    kind: "file",
    description: "Convert PNG images to smaller, widely compatible JPG files.",
    primaryIntent: "convert PNG to JPG",
    processingMode: "browser",
    inputFormats: ["image/png"],
    outputFormats: ["image/jpeg"],
    seo: {
      title: "PNG to JPG Converter — Free Online, No Uploads",
      description:
        "Convert PNG to JPG online for free. Smaller files, universal compatibility. Private browser-based conversion — your images are never uploaded.",
      h1: "Convert PNG to JPG",
      directAnswer:
        "To convert PNG to JPG, upload the PNG and click Convert. The image is re-encoded as a high-quality JPG in your browser; transparent areas are filled with white since JPG does not support transparency.",
      howTo: [
        "Select a PNG image.",
        "Click Convert to JPG.",
        "Download the JPG file.",
      ],
      faqs: [
        {
          question: "What happens to transparency when converting PNG to JPG?",
          answer:
            "JPG has no alpha channel, so transparent pixels are flattened onto a white background. If you need transparency preserved, keep PNG or use WebP instead.",
        },
        {
          question: "Why convert PNG to JPG?",
          answer:
            "Photographic PNGs are often 3-10× larger than an equivalent JPG. Converting makes files faster to email, upload and load on web pages, with virtually no visible difference for photos.",
        },
      ],
      keywords: ["png to jpg", "png to jpeg", "convert png to jpg free"],
    },
    relatedTools: ["jpg-to-png", "webp-to-jpg", "image-compressor"],
    status: "live",
  },
  {
    id: "jpg-to-webp",
    slug: "jpg-to-webp",
    name: "JPG to WebP",
    category: "image",
    kind: "file",
    description: "Convert JPG images to modern WebP for faster websites and smaller files.",
    primaryIntent: "convert JPG to WebP",
    processingMode: "browser",
    inputFormats: ["image/jpeg"],
    outputFormats: ["image/webp"],
    seo: {
      title: "JPG to WebP Converter — Free Online, No Uploads",
      description:
        "Convert JPG to WebP online for free. Get 25-35% smaller files at the same quality for faster web pages. Private browser-based conversion.",
      h1: "Convert JPG to WebP",
      directAnswer:
        "To convert JPG to WebP, upload the JPG and click Convert. WebP typically produces files 25-35% smaller than JPG at equivalent visual quality, which speeds up page loads and improves Core Web Vitals.",
      howTo: [
        "Select a JPG image.",
        "Click Convert to WebP.",
        "Download the WebP file.",
      ],
      faqs: [
        {
          question: "Why should I use WebP instead of JPG?",
          answer:
            "WebP compresses more efficiently, supports transparency and is supported by every modern browser. Smaller images mean faster pages, lower bandwidth bills and better SEO signals.",
        },
        {
          question: "Is WebP supported everywhere?",
          answer:
            "All current versions of Chrome, Firefox, Safari and Edge support WebP. Only very old software (e.g. some legacy email clients) may not display it.",
        },
      ],
      keywords: ["jpg to webp", "jpeg to webp", "webp converter"],
    },
    relatedTools: ["webp-to-jpg", "image-compressor", "image-resizer"],
    status: "live",
  },
  {
    id: "webp-to-jpg",
    slug: "webp-to-jpg",
    name: "WebP to JPG",
    category: "image",
    kind: "file",
    description: "Convert WebP images to universally supported JPG files.",
    primaryIntent: "convert WebP to JPG",
    processingMode: "browser",
    inputFormats: ["image/webp"],
    outputFormats: ["image/jpeg"],
    seo: {
      title: "WebP to JPG Converter — Free Online, No Uploads",
      description:
        "Convert WebP to JPG online for free. Make WebP images compatible with any app or device. Private browser-based conversion — no uploads.",
      h1: "Convert WebP to JPG",
      directAnswer:
        "To convert WebP to JPG, upload the WebP file and click Convert. The image is re-encoded as a standard JPG that opens in any application, editor or device.",
      howTo: [
        "Select a WebP image.",
        "Click Convert to JPG.",
        "Download the JPG file.",
      ],
      faqs: [
        {
          question: "Why won't my WebP image open in some apps?",
          answer:
            "Some older desktop applications and photo editors predate the WebP format. Converting to JPG guarantees compatibility everywhere while keeping the picture looking the same.",
        },
        {
          question: "Does WebP to JPG conversion lose quality?",
          answer:
            "The conversion re-encodes at 92% JPG quality, which is visually indistinguishable for typical images downloaded from the web.",
        },
      ],
      keywords: ["webp to jpg", "webp to jpeg", "convert webp"],
    },
    relatedTools: ["jpg-to-webp", "png-to-jpg", "heic-to-jpg"],
    status: "live",
  },
  {
    id: "heic-to-jpg",
    slug: "heic-to-jpg",
    name: "HEIC to JPG",
    category: "image",
    kind: "file",
    description: "Convert iPhone HEIC photos to JPG files that open anywhere.",
    primaryIntent: "convert HEIC to JPG",
    processingMode: "browser",
    inputFormats: ["image/heic", "image/heif"],
    outputFormats: ["image/jpeg"],
    seo: {
      title: "HEIC to JPG Converter — Convert iPhone Photos Online Free",
      description:
        "Convert HEIC to JPG online for free. Open iPhone photos on Windows, Android or any app. Private browser-based conversion — photos never uploaded.",
      h1: "Convert HEIC to JPG",
      directAnswer:
        "To convert HEIC to JPG, upload the HEIC photo from your iPhone and click Convert. The photo is decoded and re-encoded as a standard JPG in your browser, so it opens on Windows, Android and every app.",
      howTo: [
        "Select a HEIC or HEIF photo.",
        "Click Convert to JPG.",
        "Download the JPG file.",
      ],
      faqs: [
        {
          question: "Why can't I open HEIC photos on Windows?",
          answer:
            "HEIC is Apple's default photo format and Windows needs a paid codec extension to open it natively. Converting to JPG removes the problem entirely — JPG works everywhere.",
        },
        {
          question: "Do converted photos keep their quality?",
          answer:
            "Yes. The HEIC image is decoded at full resolution and saved as a high-quality JPG. File size may increase slightly because HEIC compresses more efficiently.",
        },
        {
          question: "Are my photos private?",
          answer:
            "Completely. Decoding happens in your browser via WebAssembly — photos are never sent to a server.",
        },
      ],
      keywords: ["heic to jpg", "iphone photo converter", "heif to jpg", "open heic file"],
    },
    relatedTools: ["image-compressor", "jpg-to-pdf", "image-resizer"],
    status: "live",
  },
];
