export type StyleCategory =
  | "Modern"
  | "Minimal"
  | "Colorful"
  | "Formal"
  | "Creative"
  | "Elegant"
  | "Academic"
  | "Premium";

export type FontPair = {
  id: string;
  name: string;
  heading: string;
  body: string;
};

export type QRConfig = {
  enabled: boolean;
  mode: "url" | "info";
  url: string;
  size: number;
};

export type StyleConfig = {
  fontId: string;
};

export type CoverData = {
  studentName: string;
  roll: string;
  section: string;
  className: string;
  studentId: string;
  photoDataUrl?: string | null;
  schoolName: string;
  teacherName?: string;
  subject: string;
  assignmentTitle: string;
  submissionDate: string;
  academicYear?: string;
  logoDataUrl?: string | null;
};

export type Palette = {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  bg: string;
  ink: string;
  muted: string;
};

export type TemplateMeta = {
  id: string;
  name: string;
  layout:
    | "classic-frame"
    | "modern-gradient"
    | "minimal-centered"
    | "ribbon-top"
    | "split-side"
    | "geometric-corner"
    | "watermark-large"
    | "academic-seal"
    | "notebook"
    | "prism";
  palette: string;
  tags: string[];
  categories: StyleCategory[];
};

export const EMPTY_COVER: CoverData = {
  studentName: "",
  roll: "",
  section: "",
  className: "",
  studentId: "",
  photoDataUrl: null,
  schoolName: "",
  teacherName: "",
  subject: "",
  assignmentTitle: "",
  submissionDate: "",
  academicYear: "",
  logoDataUrl: null,
};

export const DEFAULT_QR: QRConfig = {
  enabled: false,
  mode: "info",
  url: "",
  size: 96,
};

export const DEFAULT_STYLE: StyleConfig = {
  fontId: "playfair-inter",
};

export const FONT_PAIRS: FontPair[] = [
  { id: "playfair-inter", name: "Playfair + Inter", heading: '"Playfair Display", Georgia, serif', body: '"Inter", ui-sans-serif, system-ui, sans-serif' },
  { id: "cormorant-inter", name: "Cormorant + Inter", heading: '"Cormorant Garamond", Georgia, serif', body: '"Inter", ui-sans-serif, system-ui, sans-serif' },
  { id: "cinzel-inter", name: "Cinzel + Inter", heading: '"Cinzel", "Playfair Display", serif', body: '"Inter", ui-sans-serif, system-ui, sans-serif' },
  { id: "inter-inter", name: "Inter Sans", heading: '"Inter", ui-sans-serif, system-ui, sans-serif', body: '"Inter", ui-sans-serif, system-ui, sans-serif' },
  { id: "jetbrains", name: "JetBrains Mono", heading: '"JetBrains Mono", ui-monospace, monospace', body: '"Inter", ui-sans-serif, system-ui, sans-serif' },
  { id: "greatvibes", name: "Great Vibes + Inter", heading: '"Great Vibes", cursive', body: '"Inter", ui-sans-serif, system-ui, sans-serif' },
];