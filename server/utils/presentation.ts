import { createPresentationDeck, normalizeDeck, type PresentationDeck } from "../../shared/presentation";

export function buildPresentationDeck(prompt: string): PresentationDeck {
  return createPresentationDeck(prompt);
}

export function ensureDeckShape(content: unknown, prompt = ""): PresentationDeck {
  return normalizeDeck(content, prompt);
}
