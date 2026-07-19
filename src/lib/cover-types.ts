export type CoverData = {
  studentName: string;
  roll: string;
  section: string;
  className: string;
  studentId: string;
  photoDataUrl?: string | null;
  schoolName: string;
  teacherName: string;
  subject: string;
  assignmentTitle: string;
  submissionDate: string;
  academicYear: string;
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