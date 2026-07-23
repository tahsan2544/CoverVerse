import type { StyleCategory, TemplateMeta } from "./cover-types";
import { PALETTES } from "./palettes";

const LAYOUTS: TemplateMeta["layout"][] = [
  "classic-frame",
  "modern-gradient",
  "minimal-centered",
  "ribbon-top",
  "split-side",
  "geometric-corner",
  "watermark-large",
  "academic-seal",
  "notebook",
  "prism",
];

const LAYOUT_NAMES: Record<TemplateMeta["layout"], string> = {
  "classic-frame": "Classic Frame",
  "modern-gradient": "Modern Gradient",
  "minimal-centered": "Minimal Centered",
  "ribbon-top": "Ribbon Top",
  "split-side": "Split Side",
  "geometric-corner": "Geometric Corner",
  "watermark-large": "Watermark",
  "academic-seal": "Academic Seal",
  "notebook": "Notebook",
  "prism": "Prism",
};

const LAYOUT_CATEGORIES: Record<TemplateMeta["layout"], StyleCategory[]> = {
  "classic-frame": ["Formal", "Academic", "Elegant", "School", "College", "Project Report"],
  "modern-gradient": ["Modern", "Colorful", "Premium", "College", "University", "Internship Report"],
  "minimal-centered": ["Minimal", "Elegant", "College", "University", "Thesis", "Project Report"],
  "ribbon-top": ["Formal", "Academic", "Modern", "School", "Practical File"],
  "split-side": ["Modern", "Premium", "Colorful", "University", "Internship Report", "Thesis"],
  "geometric-corner": ["Creative", "Colorful", "Modern", "School", "Science Fair", "Project Report"],
  "watermark-large": ["Elegant", "Premium", "Academic", "University", "Thesis"],
  "academic-seal": ["Academic", "Formal", "Elegant", "Premium", "University", "Thesis", "College"],
  "notebook": ["Creative", "Academic", "Minimal", "School", "Practical File", "Lab Report"],
  "prism": ["Creative", "Colorful", "Modern", "Premium", "Science Fair", "Lab Report"],
};

// 10 layouts × 50 palettes = 500 templates
export const TEMPLATES: TemplateMeta[] = LAYOUTS.flatMap((layout) =>
  PALETTES.map((palette) => ({
    id: `${layout}-${palette.id}`,
    name: `${LAYOUT_NAMES[layout]} · ${palette.name}`,
    layout,
    palette: palette.id,
    tags: [layout, palette.id, ...LAYOUT_CATEGORIES[layout].map((c) => c.toLowerCase())],
    categories: LAYOUT_CATEGORIES[layout],
  })),
);

export const ALL_CATEGORIES: StyleCategory[] = [
  "School",
  "College",
  "University",
  "Science Fair",
  "Project Report",
  "Practical File",
  "Lab Report",
  "Internship Report",
  "Thesis",
  "Modern",
  "Minimal",
  "Colorful",
  "Formal",
  "Creative",
  "Elegant",
  "Academic",
  "Premium",
];

/**
 * Curated "trending" template IDs (hand-picked showcase across layouts + palettes).
 * The list is stable so users see the same trending set across sessions.
 */
export const TRENDING_IDS: string[] = [
  "modern-gradient-indigo",
  "academic-seal-navy",
  "minimal-centered-monochrome",
  "prism-electric",
  "watermark-large-champagne",
  "split-side-onyx",
  "geometric-corner-coral",
  "modern-gradient-plum",
  "classic-frame-crimson",
  "ribbon-top-emerald",
  "notebook-sage",
  "academic-seal-burgundy",
  "prism-fuchsia",
  "split-side-cobalt",
  "watermark-large-ivory",
  "modern-gradient-electric",
  "minimal-centered-graphite",
  "geometric-corner-lime",
  "academic-seal-champagne",
  "prism-orchid",
  "modern-gradient-sunset",
  "classic-frame-gold",
  "split-side-amethyst",
  "watermark-large-coalgold",
];

/** How many templates are considered "newest" (the tail of the array). */
export const NEWEST_COUNT = 60;

export function getTemplate(id: string) {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0];
}