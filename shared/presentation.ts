export type SlideLayout = "cover" | "section" | "bullets" | "split" | "closing";

export interface PresentationSlide {
  id: string;
  title: string;
  body: string[];
  notes?: string;
  layout: SlideLayout;
  accent?: string;
}

export interface PresentationDeck {
  title: string;
  subtitle: string;
  prompt: string;
  audience: string;
  tone: string;
  theme: string;
  accent: string;
  slides: PresentationSlide[];
  integrations: string[];
  createdAt: string;
}

export const deckTemplates = [
  "Investor pitch",
  "Sales deck",
  "Product launch",
  "Workshop",
  "Internal report",
  "Teaching deck",
] as const;

function titleCase(value: string) {
  return value
    .trim()
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function promptTheme(prompt: string) {
  const lower = prompt.toLowerCase();

  if (lower.includes("startup") || lower.includes("invest")) {
    return {
      theme: "Investor Aurora",
      accent: "#22c55e",
      tone: "confident",
    };
  }

  if (lower.includes("sales") || lower.includes("pitch")) {
    return {
      theme: "Impact Slate",
      accent: "#38bdf8",
      tone: "persuasive",
    };
  }

  if (lower.includes("product") || lower.includes("launch")) {
    return {
      theme: "Launch Neon",
      accent: "#fb7185",
      tone: "energized",
    };
  }

  return {
    theme: "Midnight Prism",
    accent: "#8b5cf6",
    tone: "polished",
  };
}

function keywordAudience(prompt: string) {
  const lower = prompt.toLowerCase();

  if (lower.includes("team")) return "internal team";
  if (lower.includes("invest")) return "investors";
  if (lower.includes("sales")) return "buyers";
  if (lower.includes("student")) return "students";
  if (lower.includes("client")) return "clients";

  return "general audience";
}

function safeTitle(prompt: string) {
  const cleaned = prompt.replace(/[^\w\s-]/g, " ").trim();
  const words = cleaned.split(/\s+/).filter(Boolean);

  return titleCase(words.slice(0, 7).join(" ")) || "Untitled Presentation";
}

export function createPresentationDeck(prompt: string): PresentationDeck {
  const normalizedPrompt = prompt.trim();
  const { theme, accent, tone } = promptTheme(normalizedPrompt);
  const audience = keywordAudience(normalizedPrompt);
  const title = safeTitle(normalizedPrompt);

  const slides: PresentationSlide[] = [
    {
      id: "cover",
      title,
      body: [
        `Designed for ${audience}`,
        `Crafted in a ${tone} voice with an AI-native structure`,
      ],
      notes: "Open with a strong promise and a visual hook.",
      layout: "cover",
      accent,
    },
    {
      id: "problem",
      title: "The moment that matters",
      body: [
        `What is broken, slow, or expensive today?`,
        `Why now is the right time to act`,
      ],
      notes: "Frame the tension in one crisp narrative arc.",
      layout: "bullets",
      accent,
    },
    {
      id: "solution",
      title: "Our approach",
      body: [
        `A concise explanation of the idea behind ${title}`,
        `The outcome people can feel immediately`,
      ],
      notes: "Show the mechanism, not just the promise.",
      layout: "split",
      accent,
    },
    {
      id: "proof",
      title: "Why this wins",
      body: [
        "Differentiators, speed, and clarity",
        "Metrics, social proof, or pilot results",
        "What makes the product feel inevitable",
      ],
      notes: "Use numbers, logos, and one memorable claim.",
      layout: "bullets",
      accent,
    },
    {
      id: "close",
      title: "Next step",
      body: [
        "Invite the audience into a meeting, signup, or pilot",
        "Make the call to action unmissable",
      ],
      notes: "End with a direct ask and a clean closing line.",
      layout: "closing",
      accent,
    },
  ];

  return {
    title,
    subtitle: `${title} made for ${audience}`,
    prompt: normalizedPrompt,
    audience,
    tone,
    theme,
    accent,
    slides,
    integrations: [
      "Google Drive",
      "Google Slides",
      "Notion",
      "Figma",
      "Slack",
      "OneDrive",
    ],
    createdAt: new Date().toISOString(),
  };
}

export function normalizeDeck(value: unknown, prompt = ""): PresentationDeck {
  if (
    value &&
    typeof value === "object" &&
    "slides" in value &&
    Array.isArray((value as { slides?: unknown }).slides)
  ) {
    const deck = value as Partial<PresentationDeck>;

    return {
      title: deck.title || safeTitle(prompt),
      subtitle: deck.subtitle || `${safeTitle(prompt)} presentation`,
      prompt: deck.prompt || prompt,
      audience: deck.audience || keywordAudience(prompt),
      tone: deck.tone || "polished",
      theme: deck.theme || "Midnight Prism",
      accent: deck.accent || "#8b5cf6",
      slides: (deck.slides as PresentationSlide[]).map((slide, index) => ({
        id: slide.id || `slide-${index + 1}`,
        title: slide.title || `Slide ${index + 1}`,
        body: Array.isArray(slide.body) ? slide.body : [],
        notes: slide.notes || "",
        layout: slide.layout || "bullets",
        accent: slide.accent || deck.accent || "#8b5cf6",
      })),
      integrations: Array.isArray(deck.integrations)
        ? deck.integrations
        : ["Google Drive", "Slack", "Notion"],
      createdAt: deck.createdAt || new Date().toISOString(),
    };
  }

  return createPresentationDeck(prompt);
}
