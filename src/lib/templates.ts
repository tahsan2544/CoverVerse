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
  "classic-frame": ["Formal", "Academic", "Elegant"],
  "modern-gradient": ["Modern", "Colorful", "Premium"],
  "minimal-centered": ["Minimal", "Elegant"],
  "ribbon-top": ["Formal", "Academic", "Modern"],
  "split-side": ["Modern", "Premium", "Colorful"],
  "geometric-corner": ["Creative", "Colorful", "Modern"],
  "watermark-large": ["Elegant", "Premium", "Academic"],
  "academic-seal": ["Academic", "Formal", "Elegant", "Premium"],
  "notebook": ["Creative", "Academic", "Minimal"],
  "prism": ["Creative", "Colorful", "Modern", "Premium"],
};

// 10 layouts × all palettes = 140+ templates
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
  "Modern",
  "Minimal",
  "Colorful",
  "Formal",
  "Creative",
  "Elegant",
  "Academic",
  "Premium",
];

export function getTemplate(id: string) {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0];
}