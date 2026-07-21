import type { Palette } from "./cover-types";

export const PALETTES: Palette[] = [
  { id: "navy", name: "Royal Navy", primary: "#1e3a8a", secondary: "#3b82f6", accent: "#f59e0b", bg: "#f8fafc", ink: "#0f172a", muted: "#64748b" },
  { id: "emerald", name: "Emerald Forest", primary: "#065f46", secondary: "#10b981", accent: "#fbbf24", bg: "#f0fdf4", ink: "#052e2b", muted: "#4b5563" },
  { id: "crimson", name: "Crimson Scholar", primary: "#7f1d1d", secondary: "#dc2626", accent: "#f59e0b", bg: "#fef2f2", ink: "#1c1917", muted: "#57534e" },
  { id: "plum", name: "Plum Velvet", primary: "#581c87", secondary: "#a855f7", accent: "#f472b6", bg: "#faf5ff", ink: "#1e1b4b", muted: "#6b7280" },
  { id: "teal", name: "Ocean Teal", primary: "#134e4a", secondary: "#0d9488", accent: "#facc15", bg: "#f0fdfa", ink: "#0f172a", muted: "#475569" },
  { id: "gold", name: "Classic Gold", primary: "#78350f", secondary: "#b45309", accent: "#fbbf24", bg: "#fefce8", ink: "#292524", muted: "#78716c" },
  { id: "graphite", name: "Graphite Minimal", primary: "#111827", secondary: "#374151", accent: "#f43f5e", bg: "#ffffff", ink: "#111827", muted: "#6b7280" },
  { id: "rose", name: "Rose Quartz", primary: "#9f1239", secondary: "#e11d48", accent: "#fda4af", bg: "#fff1f2", ink: "#1f2937", muted: "#6b7280" },
  { id: "indigo", name: "Indigo Ink", primary: "#312e81", secondary: "#6366f1", accent: "#fbbf24", bg: "#eef2ff", ink: "#0f172a", muted: "#4b5563" },
  { id: "forest", name: "Deep Forest", primary: "#14532d", secondary: "#16a34a", accent: "#f97316", bg: "#f7fee7", ink: "#1c1917", muted: "#57534e" },
  { id: "midnight", name: "Midnight Slate", primary: "#0f172a", secondary: "#334155", accent: "#22d3ee", bg: "#f8fafc", ink: "#020617", muted: "#64748b" },
  { id: "coral", name: "Coral Sunset", primary: "#9a3412", secondary: "#f97316", accent: "#fde047", bg: "#fff7ed", ink: "#1c1917", muted: "#78716c" },
  { id: "sage", name: "Sage Botanical", primary: "#3f6212", secondary: "#84cc16", accent: "#fbbf24", bg: "#f7fee7", ink: "#1a2e05", muted: "#65a30d" },
  { id: "monochrome", name: "Monochrome", primary: "#0a0a0a", secondary: "#404040", accent: "#a3a3a3", bg: "#fafafa", ink: "#0a0a0a", muted: "#737373" },
];

export function getPalette(id: string) {
  return PALETTES.find((p) => p.id === id) ?? PALETTES[0];
}