import type { ToolDefinition } from "./types";

export const textTools: ToolDefinition[] = [
  {
    id: "word-counter",
    slug: "word-counter",
    name: "Word Counter",
    category: "text",
    kind: "interactive",
    description: "Count words, characters, sentences and paragraphs, with reading and speaking time.",
    primaryIntent: "count words in text",
    processingMode: "browser",
    seo: {
      title: "Word Counter — Count Words, Characters & Sentences Online",
      description:
        "Free word counter. Paste text to count words, characters, sentences and paragraphs instantly, plus estimated reading and speaking time.",
      h1: "Word Counter",
      directAnswer:
        "Paste or type your text and Pixora counts words, characters (with and without spaces), sentences and paragraphs in real time, along with estimated reading time (at 225 words per minute) and speaking time (at 140 wpm).",
      howTo: [
        "Paste or type your text into the box.",
        "Counts update live as you type.",
        "Check reading time, speaking time and keyword density.",
      ],
      faqs: [
        {
          question: "How does the word count work?",
          answer:
            "Words are counted as sequences of characters separated by spaces or line breaks, the same method used by Microsoft Word and Google Docs, so counts match what teachers and editors expect.",
        },
        {
          question: "How long does it take to read 1000 words?",
          answer:
            "At an average adult silent-reading speed of 225 words per minute, 1000 words takes about 4.5 minutes to read, and about 7 minutes to speak aloud at presentation pace.",
        },
        {
          question: "Is my text stored anywhere?",
          answer:
            "No. Counting happens in your browser as you type — nothing is sent to a server, saved or logged.",
        },
      ],
      keywords: ["word counter", "word count tool", "count words online", "essay word count"],
    },
    relatedTools: ["character-counter", "case-converter", "lorem-ipsum-generator"],
    status: "live",
  },
  {
    id: "character-counter",
    slug: "character-counter",
    name: "Character Counter",
    category: "text",
    kind: "interactive",
    description: "Count characters with live limits for X/Twitter, Instagram, SMS and meta tags.",
    primaryIntent: "count characters in text",
    processingMode: "browser",
    seo: {
      title: "Character Counter — Count Characters Online with Platform Limits",
      description:
        "Free character counter. Count characters with and without spaces, with live limit checks for X/Twitter, Instagram captions, SMS and SEO meta descriptions.",
      h1: "Character Counter",
      directAnswer:
        "Paste your text to count characters instantly, with and without spaces. Pixora also shows how your text fits common limits: 280 characters for X posts, 2,200 for Instagram captions, 160 for SMS and about 160 for SEO meta descriptions.",
      howTo: [
        "Paste or type your text.",
        "See character counts (with and without spaces) update live.",
        "Check remaining characters against platform limits.",
      ],
      faqs: [
        {
          question: "What are the character limits on social platforms?",
          answer:
            "X (Twitter) allows 280 characters per post, Instagram captions 2,200, TikTok captions 2,200, LinkedIn posts 3,000, SMS 160 per message segment, and Google typically displays about 155-160 characters of a meta description.",
        },
        {
          question: "Do spaces and emojis count as characters?",
          answer:
            "Spaces count as one character. Most emojis count as two or more characters on platforms like X because they are encoded as multiple Unicode units — the counter shows both interpretations.",
        },
      ],
      keywords: ["character counter", "character count", "twitter character limit", "letter counter"],
    },
    relatedTools: ["word-counter", "case-converter", "lorem-ipsum-generator"],
    status: "live",
  },
  {
    id: "case-converter",
    slug: "case-converter",
    name: "Case Converter",
    category: "text",
    kind: "interactive",
    description: "Convert text between UPPERCASE, lowercase, Title Case, Sentence case and more.",
    primaryIntent: "convert text case",
    processingMode: "browser",
    seo: {
      title: "Case Converter — UPPERCASE, lowercase, Title Case Online",
      description:
        "Free case converter. Change text to UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case or kebab-case in one click.",
      h1: "Case Converter",
      directAnswer:
        "Paste your text and click a case style: UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case or kebab-case. The converted text is ready to copy instantly — no retyping needed.",
      howTo: [
        "Paste or type your text.",
        "Click the case style you need.",
        "Copy the converted text with one click.",
      ],
      faqs: [
        {
          question: "How do I fix text accidentally typed in caps lock?",
          answer:
            "Paste it in and click Sentence case — the text is lowercased and the first letter of each sentence is re-capitalized automatically, saving you retyping the whole thing.",
        },
        {
          question: "What is title case?",
          answer:
            "Title case capitalizes the first letter of each major word, as used in headlines and book titles: 'The Quick Brown Fox Jumps Over the Lazy Dog'. Small words like 'the' and 'of' are kept lowercase unless they start the title.",
        },
        {
          question: "What are camelCase, snake_case and kebab-case?",
          answer:
            "They are programming naming styles: camelCase joins words with capitals (myVariableName), snake_case with underscores (my_variable_name), and kebab-case with hyphens (my-variable-name).",
        },
      ],
      keywords: ["case converter", "uppercase to lowercase", "title case converter", "capitalize text"],
    },
    relatedTools: ["word-counter", "character-counter", "lorem-ipsum-generator"],
    status: "live",
  },
  {
    id: "lorem-ipsum-generator",
    slug: "lorem-ipsum-generator",
    name: "Lorem Ipsum Generator",
    category: "text",
    kind: "interactive",
    description: "Generate placeholder text by paragraphs, sentences or words for designs and mockups.",
    primaryIntent: "generate lorem ipsum text",
    processingMode: "browser",
    seo: {
      title: "Lorem Ipsum Generator — Placeholder Text Online",
      description:
        "Free lorem ipsum generator. Create placeholder text by paragraphs, sentences or words for mockups, designs and layouts. Copy with one click.",
      h1: "Lorem Ipsum Generator",
      directAnswer:
        "Choose how much placeholder text you need — paragraphs, sentences or words — and click Generate. The classic 'Lorem ipsum dolor sit amet…' filler text is created instantly and ready to copy into your design or layout.",
      howTo: [
        "Choose paragraphs, sentences or words.",
        "Set the amount you need.",
        "Click Generate, then Copy.",
      ],
      faqs: [
        {
          question: "What is lorem ipsum?",
          answer:
            "Lorem ipsum is scrambled Latin derived from a passage of Cicero written in 45 BC. Designers have used it as placeholder text since the 1500s because it has a natural-looking distribution of word lengths without being readable, keeping attention on the layout.",
        },
        {
          question: "Why use placeholder text instead of real content?",
          answer:
            "During design reviews, readable text distracts stakeholders into editing copy instead of evaluating layout, hierarchy and spacing. Lorem ipsum keeps feedback focused on the design itself.",
        },
      ],
      keywords: ["lorem ipsum generator", "placeholder text", "dummy text", "filler text"],
    },
    relatedTools: ["word-counter", "case-converter", "password-generator"],
    status: "live",
  },
];
