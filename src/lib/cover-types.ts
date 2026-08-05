export type StyleCategory =
  | "Modern"
  | "Minimal"
  | "Colorful"
  | "Formal"
  | "Creative"
  | "Elegant"
  | "Academic"
  | "Premium"
  | "School"
  | "College"
  | "University"
  | "Science Fair"
  | "Project Report"
  | "Practical File"
  | "Lab Report"
  | "Internship Report"
  | "Thesis";

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
  { id: "merriweather-lato", name: "Merriweather + Lato", heading: '"Merriweather", serif', body: '"Lato", ui-sans-serif, system-ui, sans-serif' },
  { id: "lora-open-sans", name: "Lora + Open Sans", heading: '"Lora", serif', body: '"Open Sans", ui-sans-serif, system-ui, sans-serif' },
  { id: "libre-baskerville-source-sans-3", name: "Libre Baskerville + Source Sans 3", heading: '"Libre Baskerville", serif', body: '"Source Sans 3", ui-sans-serif, system-ui, sans-serif' },
  { id: "eb-garamond-work-sans", name: "EB Garamond + Work Sans", heading: '"EB Garamond", serif', body: '"Work Sans", ui-sans-serif, system-ui, sans-serif' },
  { id: "crimson-text-karla", name: "Crimson Text + Karla", heading: '"Crimson Text", serif', body: '"Karla", ui-sans-serif, system-ui, sans-serif' },
  { id: "bitter-nunito-sans", name: "Bitter + Nunito Sans", heading: '"Bitter", serif', body: '"Nunito Sans", ui-sans-serif, system-ui, sans-serif' },
  { id: "spectral-mulish", name: "Spectral + Mulish", heading: '"Spectral", serif', body: '"Mulish", ui-sans-serif, system-ui, sans-serif' },
  { id: "source-serif-4-roboto", name: "Source Serif 4 + Roboto", heading: '"Source Serif 4", serif', body: '"Roboto", ui-sans-serif, system-ui, sans-serif' },
  { id: "abril-fatface-barlow", name: "Abril Fatface + Barlow", heading: '"Abril Fatface", serif', body: '"Barlow", ui-sans-serif, system-ui, sans-serif' },
  { id: "bodoni-moda-ibm-plex-sans", name: "Bodoni Moda + IBM Plex Sans", heading: '"Bodoni Moda", serif', body: '"IBM Plex Sans", ui-sans-serif, system-ui, sans-serif' },
  { id: "dm-serif-display-lato", name: "DM Serif Display + Lato", heading: '"DM Serif Display", serif', body: '"Lato", ui-sans-serif, system-ui, sans-serif' },
  { id: "prata-open-sans", name: "Prata + Open Sans", heading: '"Prata", serif', body: '"Open Sans", ui-sans-serif, system-ui, sans-serif' },
  { id: "marcellus-source-sans-3", name: "Marcellus + Source Sans 3", heading: '"Marcellus", serif', body: '"Source Sans 3", ui-sans-serif, system-ui, sans-serif' },
  { id: "cardo-work-sans", name: "Cardo + Work Sans", heading: '"Cardo", serif', body: '"Work Sans", ui-sans-serif, system-ui, sans-serif' },
  { id: "vollkorn-karla", name: "Vollkorn + Karla", heading: '"Vollkorn", serif', body: '"Karla", ui-sans-serif, system-ui, sans-serif' },
  { id: "frank-ruhl-libre-nunito-sans", name: "Frank Ruhl Libre + Nunito Sans", heading: '"Frank Ruhl Libre", serif', body: '"Nunito Sans", ui-sans-serif, system-ui, sans-serif' },
  { id: "alegreya-mulish", name: "Alegreya + Mulish", heading: '"Alegreya", serif', body: '"Mulish", ui-sans-serif, system-ui, sans-serif' },
  { id: "domine-roboto", name: "Domine + Roboto", heading: '"Domine", serif', body: '"Roboto", ui-sans-serif, system-ui, sans-serif' },
  { id: "arvo-barlow", name: "Arvo + Barlow", heading: '"Arvo", serif', body: '"Barlow", ui-sans-serif, system-ui, sans-serif' },
  { id: "zilla-slab-ibm-plex-sans", name: "Zilla Slab + IBM Plex Sans", heading: '"Zilla Slab", serif', body: '"IBM Plex Sans", ui-sans-serif, system-ui, sans-serif' },
  { id: "roboto-slab-lato", name: "Roboto Slab + Lato", heading: '"Roboto Slab", serif', body: '"Lato", ui-sans-serif, system-ui, sans-serif' },
  { id: "pt-serif-open-sans", name: "PT Serif + Open Sans", heading: '"PT Serif", serif', body: '"Open Sans", ui-sans-serif, system-ui, sans-serif' },
  { id: "ibm-plex-serif-source-sans-3", name: "IBM Plex Serif + Source Sans 3", heading: '"IBM Plex Serif", serif', body: '"Source Sans 3", ui-sans-serif, system-ui, sans-serif' },
  { id: "noto-serif-work-sans", name: "Noto Serif + Work Sans", heading: '"Noto Serif", serif', body: '"Work Sans", ui-sans-serif, system-ui, sans-serif' },
  { id: "old-standard-tt-karla", name: "Old Standard TT + Karla", heading: '"Old Standard TT", serif', body: '"Karla", ui-sans-serif, system-ui, sans-serif' },
  { id: "gilda-display-nunito-sans", name: "Gilda Display + Nunito Sans", heading: '"Gilda Display", serif', body: '"Nunito Sans", ui-sans-serif, system-ui, sans-serif' },
  { id: "yeseva-one-mulish", name: "Yeseva One + Mulish", heading: '"Yeseva One", serif', body: '"Mulish", ui-sans-serif, system-ui, sans-serif' },
  { id: "italiana-roboto", name: "Italiana + Roboto", heading: '"Italiana", serif', body: '"Roboto", ui-sans-serif, system-ui, sans-serif' },
  { id: "tenor-sans-barlow", name: "Tenor Sans + Barlow", heading: '"Tenor Sans", serif', body: '"Barlow", ui-sans-serif, system-ui, sans-serif' },
  { id: "forum-ibm-plex-sans", name: "Forum + IBM Plex Sans", heading: '"Forum", serif', body: '"IBM Plex Sans", ui-sans-serif, system-ui, sans-serif' },
  { id: "cormorant-infant-lato", name: "Cormorant Infant + Lato", heading: '"Cormorant Infant", serif', body: '"Lato", ui-sans-serif, system-ui, sans-serif' },
  { id: "antic-didone-open-sans", name: "Antic Didone + Open Sans", heading: '"Antic Didone", serif', body: '"Open Sans", ui-sans-serif, system-ui, sans-serif' },
  { id: "rozha-one-source-sans-3", name: "Rozha One + Source Sans 3", heading: '"Rozha One", serif', body: '"Source Sans 3", ui-sans-serif, system-ui, sans-serif' },
  { id: "bree-serif-work-sans", name: "Bree Serif + Work Sans", heading: '"Bree Serif", serif', body: '"Work Sans", ui-sans-serif, system-ui, sans-serif' },
  { id: "amiri-karla", name: "Amiri + Karla", heading: '"Amiri", serif', body: '"Karla", ui-sans-serif, system-ui, sans-serif' },
  { id: "philosopher-nunito-sans", name: "Philosopher + Nunito Sans", heading: '"Philosopher", serif', body: '"Nunito Sans", ui-sans-serif, system-ui, sans-serif' },
  { id: "josefin-sans-mulish", name: "Josefin Sans + Mulish", heading: '"Josefin Sans", sans-serif', body: '"Mulish", ui-sans-serif, system-ui, sans-serif' },
  { id: "poppins-roboto", name: "Poppins + Roboto", heading: '"Poppins", sans-serif', body: '"Roboto", ui-sans-serif, system-ui, sans-serif' },
  { id: "montserrat-barlow", name: "Montserrat + Barlow", heading: '"Montserrat", sans-serif', body: '"Barlow", ui-sans-serif, system-ui, sans-serif' },
  { id: "raleway-ibm-plex-sans", name: "Raleway + IBM Plex Sans", heading: '"Raleway", sans-serif', body: '"IBM Plex Sans", ui-sans-serif, system-ui, sans-serif' },
  { id: "oswald-lato", name: "Oswald + Lato", heading: '"Oswald", sans-serif', body: '"Lato", ui-sans-serif, system-ui, sans-serif' },
  { id: "bebas-neue-open-sans", name: "Bebas Neue + Open Sans", heading: '"Bebas Neue", sans-serif', body: '"Open Sans", ui-sans-serif, system-ui, sans-serif' },
  { id: "anton-source-sans-3", name: "Anton + Source Sans 3", heading: '"Anton", sans-serif', body: '"Source Sans 3", ui-sans-serif, system-ui, sans-serif' },
  { id: "archivo-black-work-sans", name: "Archivo Black + Work Sans", heading: '"Archivo Black", sans-serif', body: '"Work Sans", ui-sans-serif, system-ui, sans-serif' },
  { id: "space-grotesk-karla", name: "Space Grotesk + Karla", heading: '"Space Grotesk", sans-serif', body: '"Karla", ui-sans-serif, system-ui, sans-serif' },
  { id: "sora-nunito-sans", name: "Sora + Nunito Sans", heading: '"Sora", sans-serif', body: '"Nunito Sans", ui-sans-serif, system-ui, sans-serif' },
  { id: "outfit-mulish", name: "Outfit + Mulish", heading: '"Outfit", sans-serif', body: '"Mulish", ui-sans-serif, system-ui, sans-serif' },
  { id: "syne-roboto", name: "Syne + Roboto", heading: '"Syne", sans-serif', body: '"Roboto", ui-sans-serif, system-ui, sans-serif' },
  { id: "fraunces-barlow", name: "Fraunces + Barlow", heading: '"Fraunces", serif', body: '"Barlow", ui-sans-serif, system-ui, sans-serif' },
  { id: "rubik-ibm-plex-sans", name: "Rubik + IBM Plex Sans", heading: '"Rubik", sans-serif', body: '"IBM Plex Sans", ui-sans-serif, system-ui, sans-serif' },
  { id: "manrope-lato", name: "Manrope + Lato", heading: '"Manrope", sans-serif', body: '"Lato", ui-sans-serif, system-ui, sans-serif' },
  { id: "urbanist-open-sans", name: "Urbanist + Open Sans", heading: '"Urbanist", sans-serif', body: '"Open Sans", ui-sans-serif, system-ui, sans-serif' },
  { id: "quicksand-source-sans-3", name: "Quicksand + Source Sans 3", heading: '"Quicksand", sans-serif', body: '"Source Sans 3", ui-sans-serif, system-ui, sans-serif' },
  { id: "comfortaa-work-sans", name: "Comfortaa + Work Sans", heading: '"Comfortaa", sans-serif', body: '"Work Sans", ui-sans-serif, system-ui, sans-serif' },
  { id: "righteous-karla", name: "Righteous + Karla", heading: '"Righteous", sans-serif', body: '"Karla", ui-sans-serif, system-ui, sans-serif' },
  { id: "orbitron-nunito-sans", name: "Orbitron + Nunito Sans", heading: '"Orbitron", sans-serif', body: '"Nunito Sans", ui-sans-serif, system-ui, sans-serif' },
  { id: "exo-2-mulish", name: "Exo 2 + Mulish", heading: '"Exo 2", sans-serif', body: '"Mulish", ui-sans-serif, system-ui, sans-serif' },
  { id: "teko-roboto", name: "Teko + Roboto", heading: '"Teko", sans-serif', body: '"Roboto", ui-sans-serif, system-ui, sans-serif' },
  { id: "unica-one-barlow", name: "Unica One + Barlow", heading: '"Unica One", sans-serif', body: '"Barlow", ui-sans-serif, system-ui, sans-serif' },
  { id: "michroma-ibm-plex-sans", name: "Michroma + IBM Plex Sans", heading: '"Michroma", sans-serif', body: '"IBM Plex Sans", ui-sans-serif, system-ui, sans-serif' },
  { id: "audiowide-lato", name: "Audiowide + Lato", heading: '"Audiowide", sans-serif', body: '"Lato", ui-sans-serif, system-ui, sans-serif' },
  { id: "julius-sans-one-open-sans", name: "Julius Sans One + Open Sans", heading: '"Julius Sans One", sans-serif', body: '"Open Sans", ui-sans-serif, system-ui, sans-serif' },
  { id: "titillium-web-source-sans-3", name: "Titillium Web + Source Sans 3", heading: '"Titillium Web", sans-serif', body: '"Source Sans 3", ui-sans-serif, system-ui, sans-serif' },
  { id: "chivo-work-sans", name: "Chivo + Work Sans", heading: '"Chivo", sans-serif', body: '"Work Sans", ui-sans-serif, system-ui, sans-serif' },
  { id: "overpass-karla", name: "Overpass + Karla", heading: '"Overpass", sans-serif', body: '"Karla", ui-sans-serif, system-ui, sans-serif' },
  { id: "cabin-nunito-sans", name: "Cabin + Nunito Sans", heading: '"Cabin", sans-serif', body: '"Nunito Sans", ui-sans-serif, system-ui, sans-serif' },
  { id: "bai-jamjuree-mulish", name: "Bai Jamjuree + Mulish", heading: '"Bai Jamjuree", sans-serif', body: '"Mulish", ui-sans-serif, system-ui, sans-serif' },
  { id: "saira-roboto", name: "Saira + Roboto", heading: '"Saira", sans-serif', body: '"Roboto", ui-sans-serif, system-ui, sans-serif' },
  { id: "lexend-barlow", name: "Lexend + Barlow", heading: '"Lexend", sans-serif', body: '"Barlow", ui-sans-serif, system-ui, sans-serif' },
  { id: "epilogue-ibm-plex-sans", name: "Epilogue + IBM Plex Sans", heading: '"Epilogue", sans-serif', body: '"IBM Plex Sans", ui-sans-serif, system-ui, sans-serif' },
  { id: "figtree-lato", name: "Figtree + Lato", heading: '"Figtree", sans-serif', body: '"Lato", ui-sans-serif, system-ui, sans-serif' },
  { id: "plus-jakarta-sans-open-sans", name: "Plus Jakarta Sans + Open Sans", heading: '"Plus Jakarta Sans", sans-serif', body: '"Open Sans", ui-sans-serif, system-ui, sans-serif' },
  { id: "red-hat-display-source-sans-3", name: "Red Hat Display + Source Sans 3", heading: '"Red Hat Display", sans-serif', body: '"Source Sans 3", ui-sans-serif, system-ui, sans-serif' },
  { id: "archivo-work-sans", name: "Archivo + Work Sans", heading: '"Archivo", sans-serif', body: '"Work Sans", ui-sans-serif, system-ui, sans-serif' },
  { id: "kanit-karla", name: "Kanit + Karla", heading: '"Kanit", sans-serif', body: '"Karla", ui-sans-serif, system-ui, sans-serif' },
  { id: "signika-nunito-sans", name: "Signika + Nunito Sans", heading: '"Signika", sans-serif', body: '"Nunito Sans", ui-sans-serif, system-ui, sans-serif' },
  { id: "dancing-script-mulish", name: "Dancing Script + Mulish", heading: '"Dancing Script", cursive', body: '"Mulish", ui-sans-serif, system-ui, sans-serif' },
  { id: "pacifico-roboto", name: "Pacifico + Roboto", heading: '"Pacifico", cursive', body: '"Roboto", ui-sans-serif, system-ui, sans-serif' },
  { id: "satisfy-barlow", name: "Satisfy + Barlow", heading: '"Satisfy", cursive', body: '"Barlow", ui-sans-serif, system-ui, sans-serif' },
  { id: "sacramento-ibm-plex-sans", name: "Sacramento + IBM Plex Sans", heading: '"Sacramento", cursive', body: '"IBM Plex Sans", ui-sans-serif, system-ui, sans-serif' },
  { id: "parisienne-lato", name: "Parisienne + Lato", heading: '"Parisienne", cursive', body: '"Lato", ui-sans-serif, system-ui, sans-serif' },
  { id: "cookie-open-sans", name: "Cookie + Open Sans", heading: '"Cookie", cursive', body: '"Open Sans", ui-sans-serif, system-ui, sans-serif' },
  { id: "lobster-source-sans-3", name: "Lobster + Source Sans 3", heading: '"Lobster", cursive', body: '"Source Sans 3", ui-sans-serif, system-ui, sans-serif' },
  { id: "caveat-work-sans", name: "Caveat + Work Sans", heading: '"Caveat", cursive', body: '"Work Sans", ui-sans-serif, system-ui, sans-serif' },
  { id: "kalam-karla", name: "Kalam + Karla", heading: '"Kalam", cursive', body: '"Karla", ui-sans-serif, system-ui, sans-serif' },
  { id: "playball-nunito-sans", name: "Playball + Nunito Sans", heading: '"Playball", cursive', body: '"Nunito Sans", ui-sans-serif, system-ui, sans-serif' },
  { id: "yellowtail-mulish", name: "Yellowtail + Mulish", heading: '"Yellowtail", cursive', body: '"Mulish", ui-sans-serif, system-ui, sans-serif' },
  { id: "allura-roboto", name: "Allura + Roboto", heading: '"Allura", cursive', body: '"Roboto", ui-sans-serif, system-ui, sans-serif' },
  { id: "tangerine-barlow", name: "Tangerine + Barlow", heading: '"Tangerine", cursive', body: '"Barlow", ui-sans-serif, system-ui, sans-serif' },
  { id: "marck-script-ibm-plex-sans", name: "Marck Script + IBM Plex Sans", heading: '"Marck Script", cursive', body: '"IBM Plex Sans", ui-sans-serif, system-ui, sans-serif' },
  { id: "courgette-lato", name: "Courgette + Lato", heading: '"Courgette", cursive', body: '"Lato", ui-sans-serif, system-ui, sans-serif' },
  { id: "charmonman-open-sans", name: "Charmonman + Open Sans", heading: '"Charmonman", cursive', body: '"Open Sans", ui-sans-serif, system-ui, sans-serif' },
  { id: "space-mono-source-sans-3", name: "Space Mono + Source Sans 3", heading: '"Space Mono", monospace', body: '"Source Sans 3", ui-sans-serif, system-ui, sans-serif' },
  { id: "inconsolata-work-sans", name: "Inconsolata + Work Sans", heading: '"Inconsolata", monospace', body: '"Work Sans", ui-sans-serif, system-ui, sans-serif' },
  { id: "courier-prime-karla", name: "Courier Prime + Karla", heading: '"Courier Prime", monospace', body: '"Karla", ui-sans-serif, system-ui, sans-serif' },
  { id: "fira-code-nunito-sans", name: "Fira Code + Nunito Sans", heading: '"Fira Code", monospace', body: '"Nunito Sans", ui-sans-serif, system-ui, sans-serif' },
  { id: "cutive-mono-mulish", name: "Cutive Mono + Mulish", heading: '"Cutive Mono", monospace', body: '"Mulish", ui-sans-serif, system-ui, sans-serif' },
  { id: "share-tech-mono-roboto", name: "Share Tech Mono + Roboto", heading: '"Share Tech Mono", monospace', body: '"Roboto", ui-sans-serif, system-ui, sans-serif' },
  { id: "anonymous-pro-barlow", name: "Anonymous Pro + Barlow", heading: '"Anonymous Pro", monospace', body: '"Barlow", ui-sans-serif, system-ui, sans-serif' },
  { id: "ibm-plex-mono-ibm-plex-sans", name: "IBM Plex Mono + IBM Plex Sans", heading: '"IBM Plex Mono", monospace', body: '"IBM Plex Sans", ui-sans-serif, system-ui, sans-serif' },
];