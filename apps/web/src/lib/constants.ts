export const APP_NAME = "servercn";

export const STORAGE_THEME_KEY = "servercn-code-theme";
export const COOKIE_THEME_KEY = "servercn-code-theme";
export const DEFAULT_CODE_THEME = "vesper";
export const CODE_THEME_BG_KEY = "servercn-code-theme-bg";

export const DISCORD_URL = "https://discord.gg/2fXqnTXF8d";

export const BASE_GITHUB_URL = "https://github.com/akkaldhami";

export const X_URL = "https://x.com/AavashDhami2127";

export const GITHUB_URL = `${BASE_GITHUB_URL}/servercn`;

export const SERVERCN_URL = "https://servercn.vercel.app";

export const AI_QUERIES = [
  {
    label: "ChatGPT",
    name: "chatgpt",
    url: (prompt: string) =>
      `https://chatgpt.com/?q=${encodeURIComponent(prompt)}`,
    isAvailable: true
  },
  {
    label: "Claude",
    name: "claude",
    url: (prompt: string) =>
      `https://claude.ai/?q=${encodeURIComponent(prompt)}`,
    isAvailable: true
  },
  {
    label: "Google AI Studio",
    name: "google-ai-studio",
    url: (prompt: string) =>
      `https://aistudio.google.com/prompts/new_chat?prompt=${encodeURIComponent(prompt)}`,
    isAvailable: true
  },
  {
    label: "Perplexity",
    name: "perplexity",
    url: (prompt: string) =>
      `https://www.perplexity.ai/search/new?q=${encodeURIComponent(prompt)}`,
    isAvailable: true
  },
  {
    label: "Grok",
    name: "grok",
    url: (prompt: string) =>
      `https://grok.com/?q=${encodeURIComponent(prompt)}`,
    isAvailable: true
  },
  {
    label: "DeepSeek",
    name: "deepseek",
    url: (prompt: string) =>
      `https://chat.deepseek.com/?prompt=${encodeURIComponent(prompt)}`,
    isAvailable: true
  },
  {
    label: "Gemini",
    name: "gemini",
    url: (prompt: string) =>
      `https://gemini.google.com/?prompt=${encodeURIComponent(prompt)}`,
    isAvailable: true
  },
  {
    label: "V0",
    name: "v0",
    url: (prompt: string) => `https://v0.app/?q=${encodeURIComponent(prompt)}`,
    isAvailable: true
  },
  {
    label: "Scira",
    name: "scira",
    url: (prompt: string) =>
      `https://scira.ai/?q=${encodeURIComponent(prompt)}`,
    isAvailable: true
  }
] as const;
