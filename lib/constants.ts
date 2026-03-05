export const SITE_NAME = "IlVantaggioAI";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://ilvantaggioai.it";

export const CATEGORIES = {
  casi_duso: { label: "Casi d'Uso", color: "green", accent: "#22c55e", icon: "💡" },
  ai_news: { label: "AI News", color: "blue", accent: "#3b82f6", icon: "🤖" },
  web_dev: { label: "Web Dev", color: "orange", accent: "#f97316", icon: "💻" },
  tools: { label: "Tools", color: "purple", accent: "#a855f7", icon: "🛠️" },
  tutorial: { label: "Tutorial", color: "cyan", accent: "#06b6d4", icon: "📚" },
  opinioni: { label: "Opinioni", color: "rose", accent: "#f43f5e", icon: "💬" },
} as const;

export type CategoryKey = keyof typeof CATEGORIES;

export const WORKFLOW_STATES = [
  "idea",
  "researching",
  "drafting",
  "humanizing",
  "reviewing",
  "ready",
  "published",
] as const;

export type WorkflowState = (typeof WORKFLOW_STATES)[number];

export const WORKFLOW_LABELS: Record<WorkflowState, string> = {
  idea: "Idea",
  researching: "In Ricerca",
  drafting: "Bozza AI",
  humanizing: "Umanizzazione",
  reviewing: "In Revisione",
  ready: "Pronto",
  published: "Pubblicato",
};

export const WORKFLOW_COLORS: Record<WorkflowState, string> = {
  idea: "bg-gray-500",
  researching: "bg-blue-500",
  drafting: "bg-yellow-500",
  humanizing: "bg-orange-500",
  reviewing: "bg-purple-500",
  ready: "bg-green-500",
  published: "bg-emerald-600",
};
