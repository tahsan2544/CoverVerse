import type { TemplateMeta } from "./cover-types";
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

export const TEMPLATES: TemplateMeta[] = LAYOUTS.flatMap((layout) =>
  PALETTES.slice(0, 6).map((palette) => ({
    id: `${layout}-${palette.id}`,
    name: `${LAYOUT_NAMES[layout]} · ${palette.name}`,
    layout,
    palette: palette.id,
    tags: [layout, palette.id],
  })),
);

export function getTemplate(id: string) {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0];
}