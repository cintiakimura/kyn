/**
 * Detect if a user message is asking for UI/mockup/wireframe generation and extract a prompt.
 * Used to trigger /api/grok/ui-generate from the Builder chat.
 */
const UI_INTENT_PATTERNS = [
  /generate\s+(?:a\s+)?(?:ui|ux|mockup|wireframe|visual)/i,
  /(?:ui|ux|mockup|dashboard|login\s+page|wireframe)\s+(?:design|for|of)/i,
  /show\s+me\s+(?:the\s+)?(?:login\s+page|dashboard|ui|mockup|wireframe)/i,
  /(?:visualize|draw|sketch)\s+(?:the\s+)?(?:app|ui|dashboard)/i,
  /(?:what would|how would)\s+(?:the\s+)?(?:login|dashboard|settings)\s+(?:page\s+)?look\s+like/i,
  /wireframe\s+for/i,
  /mockup\s+(?:of|for)/i,
  /design\s+(?:a\s+)?(?:login|dashboard|settings|ui)/i,
];

export function extractUiGeneratePrompt(userMessage: string): string | null {
  const trimmed = userMessage.trim();
  if (trimmed.length < 10) return null;
  const hasIntent = UI_INTENT_PATTERNS.some((re) => re.test(trimmed));
  if (!hasIntent) return null;
  return trimmed;
}

export function hasUiGenerateIntent(userMessage: string): boolean {
  return extractUiGeneratePrompt(userMessage) !== null;
}
