import type { ToolDefinition } from "./types";

export const pdfTools: ToolDefinition[] = [
  {
    id: "merge-pdf",
    slug: "merge-pdf",
    name: "Merge PDF",
    category: "pdf",
    kind: "file",
    multiFile: true,
    description: "Combine multiple PDF files into a single document, in the order you choose.",
    primaryIntent: "merge PDF files online",
    processingMode: "browser",
    inputFormats: ["application/pdf"],
    outputFormats: ["application/pdf"],
    seo: {
      title: "Merge PDF — Combine PDF Files Online Free",
      description:
        "Merge PDF files online for free. Combine two or more PDFs into one document in seconds. Files never leave your browser — private and secure.",
      h1: "Merge PDF Files Online",
      directAnswer:
        "To merge PDF files, select two or more PDFs, arrange them in the order you want, and click Merge. Pixora combines them into a single PDF entirely in your browser, so your documents are never uploaded to a server.",
      howTo: [
        "Click Select files and choose two or more PDF documents.",
        "Reorder the files so they appear in the sequence you want.",
        "Click Merge PDF to combine them into one document.",
        "Download your merged PDF.",
      ],
      faqs: [
        {
          question: "How do I combine multiple PDF files into one?",
          answer:
            "Select all the PDFs you want to combine, put them in order, and click Merge PDF. The pages of each file are appended in sequence and saved as one new PDF that you can download immediately.",
        },
        {
          question: "Is it safe to merge PDFs online?",
          answer:
            "With Pixora, yes. Merging happens entirely inside your browser using JavaScript — your files are never uploaded, stored or transmitted to any server, which also makes it suitable for confidential documents.",
        },
        {
          question: "Is there a limit on how many PDFs I can merge?",
          answer:
            "You can merge up to 20 PDF files at once, with a combined size of up to 100 MB. Because processing happens on your own device, very large files depend on your browser's available memory.",
        },
        {
          question: "Will merging change the quality of my PDFs?",
          answer:
            "No. Merging copies the original pages into a new document without re-compressing them, so text, images and formatting stay exactly as they were.",
        },
      ],
      keywords: ["combine pdf", "pdf merger", "join pdf files", "merge pdf free"],
    },
    relatedTools: ["split-pdf", "compress-pdf", "jpg-to-pdf"],
    status: "live",
  },
  {
    id: "split-pdf",
    slug: "split-pdf",
    name: "Split PDF",
    category: "pdf",
    kind: "file",
    description: "Extract a page range from a PDF or split every page into its own file.",
    primaryIntent: "split a PDF online",
    processingMode: "browser",
    inputFormats: ["application/pdf"],
    outputFormats: ["application/pdf", "application/zip"],
    seo: {
      title: "Split PDF — Extract Pages from PDF Online Free",
      description:
        "Split a PDF online for free. Extract a page range or save every page as a separate PDF. Browser-based and private — files are never uploaded.",
      h1: "Split a PDF Online",
      directAnswer:
        "To split a PDF, upload the file, choose a page range like 1-3 (or split every page into its own file), and click Split. Pixora extracts the pages in your browser and gives you the new PDF instantly.",
      howTo: [
        "Select the PDF you want to split.",
        "Enter a page range (for example 2-5), or choose to split every page.",
        "Click Split PDF.",
        "Download the extracted PDF, or a ZIP of individual pages.",
      ],
      faqs: [
        {
          question: "How do I extract specific pages from a PDF?",
          answer:
            "Enter the pages you need as a range, such as 4-9, or a single page like 3. Pixora copies only those pages into a new PDF and leaves your original file untouched.",
        },
        {
          question: "Can I split every page into a separate file?",
          answer:
            "Yes. Choose the split-all option and each page becomes its own PDF. When there are multiple output files they are packaged into a single ZIP download for convenience.",
        },
        {
          question: "Does splitting a PDF reduce its quality?",
          answer:
            "No. Pages are copied directly from the source document without re-rendering, so text stays sharp and searchable and images keep their original resolution.",
        },
      ],
      keywords: ["extract pdf pages", "pdf splitter", "separate pdf pages", "split pdf free"],
    },
    relatedTools: ["merge-pdf", "compress-pdf", "pdf-to-jpg"],
    status: "live",
  },
  {
    id: "compress-pdf",
    slug: "compress-pdf",
    name: "Compress PDF",
    category: "pdf",
    kind: "file",
    description: "Reduce PDF file size in the browser using structural and raster compression.",
    primaryIntent: "compress a PDF online",
    processingMode: "browser",
    inputFormats: ["application/pdf"],
    outputFormats: ["application/pdf"],
    seo: {
      title: "Compress PDF — Reduce PDF File Size Online Free",
      description:
        "Compress a PDF online for free. Shrink PDF file size for email and uploads while keeping readable quality. Private, browser-based — no uploads.",
      h1: "Compress a PDF Online",
      directAnswer:
        "To compress a PDF, upload the file and click Compress. Pixora first optimizes the internal structure of the PDF, then — if needed — re-encodes page images at a lower quality, typically shrinking files enough for email limits and web uploads.",
      howTo: [
        "Select the PDF file you want to shrink.",
        "Click Compress PDF and wait a few seconds.",
        "Compare the new size with the original.",
        "Download the compressed PDF.",
      ],
      faqs: [
        {
          question: "How can I make a PDF smaller for email?",
          answer:
            "Run the PDF through the compressor before attaching it. Most email providers limit attachments to 20-25 MB; compression usually reduces scanned or image-heavy PDFs well below that limit.",
        },
        {
          question: "Will compressing a PDF make it blurry?",
          answer:
            "Pixora tries a lossless structural optimization first. If stronger compression is needed, page images are re-encoded at a quality tuned to stay clearly readable on screen, though very fine print in scans may soften slightly.",
        },
        {
          question: "Is there a file size limit?",
          answer:
            "PDFs up to 20 MB and 100 pages are supported in the browser workflow. Because processing happens on your device, nothing is ever uploaded.",
        },
      ],
      keywords: ["reduce pdf size", "pdf compressor", "shrink pdf", "compress pdf free"],
    },
    relatedTools: ["merge-pdf", "split-pdf", "image-compressor"],
    status: "live",
  },
  {
    id: "jpg-to-pdf",
    slug: "jpg-to-pdf",
    name: "JPG to PDF",
    category: "pdf",
    kind: "file",
    multiFile: true,
    description: "Convert one or more JPG, PNG or WebP images into a single PDF document.",
    primaryIntent: "convert JPG to PDF",
    processingMode: "browser",
    inputFormats: ["image/jpeg", "image/png", "image/webp"],
    outputFormats: ["application/pdf"],
    seo: {
      title: "JPG to PDF — Convert Images to PDF Online Free",
      description:
        "Convert JPG to PDF online for free. Turn one or many images into a single PDF document. Browser-based and private — images are never uploaded.",
      h1: "Convert JPG to PDF",
      directAnswer:
        "To convert JPG to PDF, select one or more images and click Convert. Each image becomes a full page in a new PDF, in the order you selected, generated entirely in your browser.",
      howTo: [
        "Select one or more JPG, PNG or WebP images.",
        "Arrange the images in the page order you want.",
        "Click Convert to PDF.",
        "Download your PDF document.",
      ],
      faqs: [
        {
          question: "How do I turn multiple photos into one PDF?",
          answer:
            "Select all the photos at once, put them in order, and convert. Each photo becomes one page of a single PDF — useful for submitting scanned documents, receipts or assignments.",
        },
        {
          question: "Does converting JPG to PDF lose quality?",
          answer:
            "Images are embedded at high quality (95%), which is visually identical to the original for photos. The PDF page size matches each image's dimensions so nothing is cropped.",
        },
        {
          question: "Can I convert PNG or WebP images too?",
          answer:
            "Yes. The tool accepts JPG, PNG and WebP files and can mix formats in one conversion.",
        },
      ],
      keywords: ["image to pdf", "photo to pdf", "picture to pdf", "convert jpg to pdf free"],
    },
    relatedTools: ["pdf-to-jpg", "merge-pdf", "compress-pdf"],
    status: "live",
  },
  {
    id: "pdf-to-jpg",
    slug: "pdf-to-jpg",
    name: "PDF to JPG",
    category: "pdf",
    kind: "file",
    description: "Convert PDF pages into high-quality JPG images you can share anywhere.",
    primaryIntent: "convert PDF to JPG",
    processingMode: "browser",
    inputFormats: ["application/pdf"],
    outputFormats: ["image/jpeg", "application/zip"],
    seo: {
      title: "PDF to JPG — Convert PDF Pages to Images Online Free",
      description:
        "Convert PDF to JPG online for free. Every page becomes a high-quality JPG image. Private browser-based conversion — no uploads, no sign-up.",
      h1: "Convert PDF to JPG",
      directAnswer:
        "To convert a PDF to JPG, upload the PDF and click Convert. Each page is rendered as a high-resolution JPG image in your browser; multi-page PDFs are delivered as a ZIP of images.",
      howTo: [
        "Select the PDF you want to convert.",
        "Click Convert to JPG.",
        "Wait while each page is rendered as an image.",
        "Download a single JPG, or a ZIP for multi-page PDFs.",
      ],
      faqs: [
        {
          question: "How do I save a PDF page as an image?",
          answer:
            "Upload the PDF and convert it — every page is rendered as a separate JPG at high resolution, ready to insert into slides, documents or social posts.",
        },
        {
          question: "What resolution are the JPG images?",
          answer:
            "Pages are rendered at roughly 150 DPI equivalent, which balances sharpness and file size. Text remains crisp for on-screen use and standard printing.",
        },
        {
          question: "Is my PDF uploaded anywhere?",
          answer:
            "No. Rendering uses your browser's own PDF engine, so the document never leaves your device.",
        },
      ],
      keywords: ["pdf to image", "pdf to png", "save pdf as jpg", "pdf to jpg free"],
    },
    relatedTools: ["jpg-to-pdf", "compress-pdf", "image-compressor"],
    status: "live",
  },
];
