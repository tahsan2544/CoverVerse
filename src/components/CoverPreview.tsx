import { forwardRef, useEffect, useState } from "react";
import QRCode from "qrcode";
import type { CoverData, FontPair, Palette, QRConfig, TemplateMeta } from "@/lib/cover-types";
import { FONT_PAIRS } from "@/lib/cover-types";
import { getPalette } from "@/lib/palettes";
import { getTemplate } from "@/lib/templates";
import { GraduationCap, BookOpen, Award, Sparkles } from "lucide-react";

export const A4_W = 794;
export const A4_H = 1123;

type Props = {
  data: CoverData;
  templateId: string;
  paletteOverride?: Partial<Palette>;
  fontId?: string;
  qr?: QRConfig;
};

function useResolved(templateId: string, override?: Partial<Palette>) {
  const template = getTemplate(templateId);
  const base = getPalette(template.palette);
  const palette: Palette = { ...base, ...override };
  return { template, palette };
}

const F = (v?: string | null, fallback = "—") => (v && v.trim().length ? v : fallback);

export const CoverPreview = forwardRef<HTMLDivElement, Props>(function CoverPreview(
  { data, templateId, paletteOverride, fontId, qr },
  ref,
) {
  const { template, palette } = useResolved(templateId, paletteOverride);
  const font: FontPair = FONT_PAIRS.find((f) => f.id === fontId) ?? FONT_PAIRS[0];

  return (
    <div
      ref={ref}
      className="print-area"
      style={{
        width: A4_W,
        height: A4_H,
        background: palette.bg,
        color: palette.ink,
        fontFamily: font.body,
        position: "relative",
        overflow: "hidden",
        // CSS variables consumed by the Serif() helper
        ["--cover-heading" as any]: font.heading,
        ["--cover-body" as any]: font.body,
      }}
    >
      {renderLayout(template.layout, data, palette)}
      {qr?.enabled && <QROverlay qr={qr} data={data} palette={palette} />}
    </div>
  );
});

function QROverlay({ qr, data, palette }: { qr: QRConfig; data: CoverData; palette: Palette }) {
  const [src, setSrc] = useState<string | null>(null);
  const payload =
    qr.mode === "url"
      ? qr.url || "https://"
      : [
          `Student: ${data.studentName}`,
          `ID: ${data.studentId}`,
          `Class: ${data.className} · Section: ${data.section} · Roll: ${data.roll}`,
          `Subject: ${data.subject}`,
          `Assignment: ${data.assignmentTitle}`,
          `Submitted: ${data.submissionDate}`,
          data.teacherName ? `Teacher: ${data.teacherName}` : "",
          data.schoolName ? `School: ${data.schoolName}` : "",
        ]
          .filter(Boolean)
          .join("\n");

  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(payload || " ", {
      margin: 1,
      width: qr.size * 3,
      color: { dark: palette.ink, light: "#ffffff" },
      errorCorrectionLevel: "M",
    })
      .then((d) => { if (!cancelled) setSrc(d); })
      .catch(() => { if (!cancelled) setSrc(null); });
    return () => { cancelled = true; };
  }, [payload, qr.size, palette.ink]);

  if (!src) return null;
  return (
    <div
      style={{
        position: "absolute",
        right: 30,
        bottom: 30,
        padding: 8,
        background: "white",
        borderRadius: 8,
        boxShadow: "0 4px 16px rgba(0,0,0,.15)",
        zIndex: 20,
      }}
    >
      <img src={src} alt="Cover QR code" width={qr.size} height={qr.size} style={{ display: "block" }} />
    </div>
  );
}

function renderLayout(layout: TemplateMeta["layout"], d: CoverData, p: Palette) {
  switch (layout) {
    case "classic-frame": return <ClassicFrame d={d} p={p} />;
    case "modern-gradient": return <ModernGradient d={d} p={p} />;
    case "minimal-centered": return <MinimalCentered d={d} p={p} />;
    case "ribbon-top": return <RibbonTop d={d} p={p} />;
    case "split-side": return <SplitSide d={d} p={p} />;
    case "geometric-corner": return <GeometricCorner d={d} p={p} />;
    case "watermark-large": return <WatermarkLarge d={d} p={p} />;
    case "academic-seal": return <AcademicSeal d={d} p={p} />;
    case "notebook": return <Notebook d={d} p={p} />;
    case "prism": return <Prism d={d} p={p} />;
  }
}

type L = { d: CoverData; p: Palette };

/* ---------- shared bits ---------- */
function Logo({ src, size = 90, ring }: { src?: string | null; size?: number; ring?: string }) {
  if (!src) return null;
  return (
    <img
      src={src}
      alt="Institution logo"
      style={{
        width: size,
        height: size,
        objectFit: "contain",
        borderRadius: 12,
        background: "white",
        padding: 6,
        boxShadow: ring ? `0 0 0 3px ${ring}` : undefined,
      }}
    />
  );
}

function Photo({ src, size = 140, ring }: { src?: string | null; size?: number; ring?: string }) {
  if (!src) return null;
  return (
    <img
      src={src}
      alt="Student"
      style={{
        width: size,
        height: size,
        objectFit: "cover",
        borderRadius: "50%",
        boxShadow: ring ? `0 0 0 5px ${ring}, 0 8px 24px rgba(0,0,0,.15)` : "0 8px 24px rgba(0,0,0,.15)",
      }}
    />
  );
}

function InfoRow({ label, value, p, small }: { label: string; value?: string; p: Palette; small?: boolean }) {
  return (
    <div style={{ display: "flex", padding: small ? "8px 0" : "12px 0", borderBottom: `1px dashed ${p.muted}44` }}>
      <div style={{ width: 180, color: p.muted, fontSize: 14, fontWeight: 500, textTransform: "uppercase", letterSpacing: 1.2 }}>{label}</div>
      <div style={{ flex: 1, fontSize: small ? 16 : 18, fontWeight: 600, color: p.ink }}>{F(value)}</div>
    </div>
  );
}

function Serif({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ fontFamily: 'var(--cover-heading, "Playfair Display", Georgia, serif)', ...style }}>{children}</div>;
}

/* ---------- 1 Classic Frame ---------- */
function ClassicFrame({ d, p }: L) {
  return (
    <div style={{ padding: 40, height: "100%", boxSizing: "border-box" }}>
      <div style={{ border: `3px double ${p.primary}`, padding: 20, height: "100%", boxSizing: "border-box", position: "relative" }}>
        <div style={{ border: `1px solid ${p.primary}55`, padding: 40, height: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          {d.logoDataUrl ? <Logo src={d.logoDataUrl} size={80} /> : <GraduationCap size={64} color={p.primary} />}
          <Serif style={{ fontSize: 34, fontWeight: 700, color: p.primary, marginTop: 20, lineHeight: 1.2 }}>{F(d.schoolName, "Your Institution")}</Serif>
          <div style={{ width: 100, height: 3, background: p.accent, margin: "16px auto" }} />
          <div style={{ fontSize: 13, letterSpacing: 6, color: p.muted, textTransform: "uppercase" }}>Assignment Cover Page</div>

          <Serif style={{ fontSize: 44, fontWeight: 700, marginTop: 60, color: p.ink }}>{F(d.assignmentTitle, "Assignment Title")}</Serif>
          <div style={{ fontSize: 20, marginTop: 12, fontStyle: "italic", color: p.secondary }}>{F(d.subject, "Subject")}</div>

          {d.photoDataUrl && <div style={{ marginTop: 30 }}><Photo src={d.photoDataUrl} ring={p.accent} /></div>}

          <div style={{ marginTop: "auto", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30, textAlign: "left" }}>
            <div>
              <SubmitBlock title="Submitted By" p={p} rows={[["Name", d.studentName], ["Class", d.className], ["Section", d.section], ["Roll No.", d.roll], ["Student ID", d.studentId]]} />
            </div>
            <div>
              <SubmitBlock title="Submitted To" p={p} rows={[["Teacher", d.teacherName], ["Subject", d.subject], ["Date", d.submissionDate], ["Academic Year", d.academicYear]]} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SubmitBlock({ title, rows, p }: { title: string; rows: [string, string | undefined][]; p: Palette }) {
  return (
    <div>
      <div style={{ fontSize: 12, letterSpacing: 3, color: p.accent, textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>{title}</div>
      {rows.map(([k, v]) => (
        <div key={k} style={{ display: "flex", padding: "4px 0", fontSize: 14 }}>
          <div style={{ width: 110, color: p.muted }}>{k}</div>
          <div style={{ fontWeight: 600, color: p.ink }}>: {F(v)}</div>
        </div>
      ))}
    </div>
  );
}

/* ---------- 2 Modern Gradient ---------- */
function ModernGradient({ d, p }: L) {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ height: 380, background: `linear-gradient(135deg, ${p.primary} 0%, ${p.secondary} 100%)`, padding: 50, color: "white", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: -80, top: -80, width: 300, height: 300, borderRadius: "50%", background: `${p.accent}33` }} />
        <div style={{ position: "absolute", right: 40, bottom: -60, width: 180, height: 180, borderRadius: "50%", background: `${p.accent}22` }} />
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {d.logoDataUrl ? <Logo src={d.logoDataUrl} size={70} /> : <div style={{ width: 56, height: 56, borderRadius: 14, background: "rgba(255,255,255,.2)", display: "grid", placeItems: "center" }}><GraduationCap size={32} color="white" /></div>}
          <div>
            <div style={{ fontSize: 12, letterSpacing: 4, opacity: 0.85, textTransform: "uppercase" }}>{F(d.academicYear, "Academic Year")}</div>
            <Serif style={{ fontSize: 26, fontWeight: 700, marginTop: 4 }}>{F(d.schoolName, "Your Institution")}</Serif>
          </div>
        </div>
        <div style={{ position: "absolute", left: 50, bottom: 60, right: 50 }}>
          <div style={{ fontSize: 13, letterSpacing: 6, opacity: 0.9, textTransform: "uppercase", marginBottom: 12 }}>Assignment</div>
          <Serif style={{ fontSize: 52, fontWeight: 700, lineHeight: 1.1 }}>{F(d.assignmentTitle, "Assignment Title")}</Serif>
          <div style={{ fontSize: 22, marginTop: 12, opacity: 0.9, fontStyle: "italic" }}>{F(d.subject, "Subject")}</div>
        </div>
      </div>
      <div style={{ flex: 1, padding: 50, display: "flex", gap: 40 }}>
        {d.photoDataUrl && <Photo src={d.photoDataUrl} size={160} ring={p.accent} />}
        <div style={{ flex: 1 }}>
          <InfoRow label="Student" value={d.studentName} p={p} />
          <InfoRow label="Class / Section" value={`${F(d.className)} · ${F(d.section)}`} p={p} />
          <InfoRow label="Roll · ID" value={`${F(d.roll)} · ${F(d.studentId)}`} p={p} />
          <InfoRow label="Teacher" value={d.teacherName} p={p} />
          <InfoRow label="Submitted On" value={d.submissionDate} p={p} />
        </div>
      </div>
      <div style={{ height: 8, background: `linear-gradient(90deg, ${p.primary}, ${p.secondary}, ${p.accent})` }} />
    </div>
  );
}

/* ---------- 3 Minimal Centered ---------- */
function MinimalCentered({ d, p }: L) {
  return (
    <div style={{ padding: 80, height: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
      {d.logoDataUrl ? <Logo src={d.logoDataUrl} size={70} /> : <Sparkles size={40} color={p.accent} />}
      <div style={{ marginTop: 20, fontSize: 12, letterSpacing: 8, color: p.muted, textTransform: "uppercase" }}>{F(d.schoolName, "Your Institution")}</div>
      <div style={{ width: 40, height: 1, background: p.ink, margin: "40px 0" }} />
      <Serif style={{ fontSize: 22, fontStyle: "italic", color: p.muted }}>{F(d.subject, "Subject")}</Serif>
      <Serif style={{ fontSize: 60, fontWeight: 700, lineHeight: 1.05, marginTop: 20, color: p.primary, maxWidth: 620 }}>{F(d.assignmentTitle, "Assignment Title")}</Serif>
      <div style={{ width: 40, height: 1, background: p.ink, margin: "40px 0" }} />

      {d.photoDataUrl && <Photo src={d.photoDataUrl} size={130} ring={p.accent} />}

      <div style={{ marginTop: 60, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24, width: "100%" }}>
        {[["Student", d.studentName], ["Class", `${F(d.className)}·${F(d.section)}`], ["Roll", d.roll], ["ID", d.studentId], ["Teacher", d.teacherName], ["Date", d.submissionDate]].map(([k, v]) => (
          <div key={k}>
            <div style={{ fontSize: 10, letterSpacing: 3, color: p.muted, textTransform: "uppercase" }}>{k}</div>
            <div style={{ fontSize: 15, fontWeight: 600, marginTop: 4 }}>{F(v)}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "auto", fontSize: 11, letterSpacing: 4, color: p.muted, textTransform: "uppercase" }}>{F(d.academicYear, "Academic Year")}</div>
    </div>
  );
}

/* ---------- 4 Ribbon Top ---------- */
function RibbonTop({ d, p }: L) {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ background: p.primary, color: "white", padding: "30px 50px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {d.logoDataUrl ? <Logo src={d.logoDataUrl} size={54} /> : <BookOpen size={36} color="white" />}
          <Serif style={{ fontSize: 24, fontWeight: 700 }}>{F(d.schoolName, "Your Institution")}</Serif>
        </div>
        <div style={{ fontSize: 12, letterSpacing: 4, opacity: 0.85, textTransform: "uppercase" }}>{F(d.academicYear, "Year")}</div>
      </div>
      <div style={{ height: 6, background: p.accent }} />

      <div style={{ padding: 60, flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", gap: 40, alignItems: "center" }}>
          {d.photoDataUrl && <Photo src={d.photoDataUrl} size={150} ring={p.primary} />}
          <div>
            <div style={{ fontSize: 12, letterSpacing: 4, color: p.accent, textTransform: "uppercase", fontWeight: 700 }}>{F(d.subject, "Subject")}</div>
            <Serif style={{ fontSize: 48, fontWeight: 700, marginTop: 8, color: p.primary, lineHeight: 1.1 }}>{F(d.assignmentTitle, "Assignment Title")}</Serif>
          </div>
        </div>

        <div style={{ marginTop: 60, background: `${p.primary}0a`, border: `1px solid ${p.primary}22`, borderRadius: 16, padding: 30 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 40px" }}>
            <InfoRow label="Name" value={d.studentName} p={p} small />
            <InfoRow label="Teacher" value={d.teacherName} p={p} small />
            <InfoRow label="Class" value={d.className} p={p} small />
            <InfoRow label="Section" value={d.section} p={p} small />
            <InfoRow label="Roll" value={d.roll} p={p} small />
            <InfoRow label="Student ID" value={d.studentId} p={p} small />
            <InfoRow label="Submitted On" value={d.submissionDate} p={p} small />
            <InfoRow label="Academic Year" value={d.academicYear} p={p} small />
          </div>
        </div>

        <div style={{ marginTop: "auto", textAlign: "center", color: p.muted, fontSize: 12, letterSpacing: 4, textTransform: "uppercase" }}>· Cover Page ·</div>
      </div>
    </div>
  );
}

/* ---------- 5 Split Side ---------- */
function SplitSide({ d, p }: L) {
  return (
    <div style={{ height: "100%", display: "grid", gridTemplateColumns: "300px 1fr" }}>
      <div style={{ background: `linear-gradient(180deg, ${p.primary} 0%, ${p.secondary} 100%)`, color: "white", padding: 40, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
        {d.logoDataUrl ? <Logo src={d.logoDataUrl} size={80} /> : <GraduationCap size={64} color="white" />}
        <Serif style={{ fontSize: 22, fontWeight: 700, marginTop: 20, lineHeight: 1.2 }}>{F(d.schoolName, "Your Institution")}</Serif>
        <div style={{ width: 60, height: 2, background: p.accent, margin: "24px 0" }} />
        {d.photoDataUrl && <Photo src={d.photoDataUrl} size={140} ring={p.accent} />}
        <div style={{ marginTop: 30, fontSize: 12, letterSpacing: 3, textTransform: "uppercase", opacity: 0.9 }}>Submitted by</div>
        <div style={{ fontWeight: 700, fontSize: 18, marginTop: 6 }}>{F(d.studentName)}</div>
        <div style={{ fontSize: 13, opacity: 0.9, marginTop: 4 }}>Class {F(d.className)} · {F(d.section)}</div>

        <div style={{ marginTop: "auto", fontSize: 11, letterSpacing: 4, opacity: 0.8, textTransform: "uppercase" }}>{F(d.academicYear, "Academic Year")}</div>
      </div>
      <div style={{ padding: 60, display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 12, letterSpacing: 6, color: p.accent, textTransform: "uppercase", fontWeight: 700 }}>Assignment</div>
        <Serif style={{ fontSize: 46, fontWeight: 700, marginTop: 10, color: p.primary, lineHeight: 1.1 }}>{F(d.assignmentTitle, "Assignment Title")}</Serif>
        <div style={{ fontSize: 20, marginTop: 12, fontStyle: "italic", color: p.muted }}>{F(d.subject, "Subject")}</div>

        <div style={{ marginTop: 50 }}>
          <InfoRow label="Roll No." value={d.roll} p={p} />
          <InfoRow label="Student ID" value={d.studentId} p={p} />
          <InfoRow label="Teacher" value={d.teacherName} p={p} />
          <InfoRow label="Submitted On" value={d.submissionDate} p={p} />
        </div>

        <div style={{ marginTop: "auto", borderTop: `2px solid ${p.primary}`, paddingTop: 16, fontSize: 12, color: p.muted, letterSpacing: 2, textTransform: "uppercase" }}>Signature ___________________</div>
      </div>
    </div>
  );
}

/* ---------- 6 Geometric Corner ---------- */
function GeometricCorner({ d, p }: L) {
  return (
    <div style={{ height: "100%", position: "relative", padding: 60, boxSizing: "border-box" }}>
      <svg style={{ position: "absolute", top: 0, left: 0 }} width="360" height="360" viewBox="0 0 360 360">
        <polygon points="0,0 360,0 0,360" fill={p.primary} />
        <polygon points="0,0 240,0 0,240" fill={p.secondary} opacity="0.85" />
        <polygon points="0,0 120,0 0,120" fill={p.accent} />
      </svg>
      <svg style={{ position: "absolute", bottom: 0, right: 0 }} width="280" height="280" viewBox="0 0 280 280">
        <polygon points="280,280 0,280 280,0" fill={p.primary} opacity="0.9" />
        <polygon points="280,280 100,280 280,100" fill={p.accent} />
      </svg>

      <div style={{ position: "relative", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", zIndex: 2 }}>
        <div style={{ height: 80 }} />
        {d.logoDataUrl && <Logo src={d.logoDataUrl} size={70} />}
        <Serif style={{ fontSize: 26, fontWeight: 700, marginTop: 12, color: p.primary }}>{F(d.schoolName, "Your Institution")}</Serif>

        <div style={{ marginTop: 100 }}>
          <div style={{ fontSize: 12, letterSpacing: 6, color: p.accent, textTransform: "uppercase", fontWeight: 700 }}>{F(d.subject, "Subject")}</div>
          <Serif style={{ fontSize: 56, fontWeight: 800, marginTop: 16, color: p.ink, lineHeight: 1.05, maxWidth: 600 }}>{F(d.assignmentTitle, "Assignment Title")}</Serif>
        </div>

        {d.photoDataUrl && <div style={{ marginTop: 50 }}><Photo src={d.photoDataUrl} size={130} ring={p.accent} /></div>}

        <div style={{ marginTop: "auto", background: "white", border: `1px solid ${p.muted}33`, borderRadius: 12, padding: 24, width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, textAlign: "left" }}>
          {[["Student", d.studentName], ["Class·Sec", `${F(d.className)} · ${F(d.section)}`], ["Roll", d.roll], ["ID", d.studentId], ["Teacher", d.teacherName], ["Date", d.submissionDate]].map(([k, v]) => (
            <div key={k}>
              <div style={{ fontSize: 10, letterSpacing: 2, color: p.muted, textTransform: "uppercase" }}>{k}</div>
              <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>{F(v)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- 7 Watermark Large ---------- */
function WatermarkLarge({ d, p }: L) {
  return (
    <div style={{ height: "100%", padding: 60, boxSizing: "border-box", position: "relative", overflow: "hidden" }}>
      <Serif style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", fontSize: 320, fontWeight: 900, color: `${p.primary}0f`, transform: "rotate(-15deg)", pointerEvents: "none" }}>
        {F(d.subject, "STUDY").slice(0, 6).toUpperCase()}
      </Serif>

      <div style={{ position: "relative", zIndex: 2, height: "100%", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `2px solid ${p.primary}`, paddingBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {d.logoDataUrl ? <Logo src={d.logoDataUrl} size={54} /> : <Award size={44} color={p.primary} />}
            <Serif style={{ fontSize: 22, fontWeight: 700, color: p.primary }}>{F(d.schoolName, "Your Institution")}</Serif>
          </div>
          <div style={{ fontSize: 12, color: p.muted, letterSpacing: 3, textTransform: "uppercase" }}>{F(d.academicYear, "Year")}</div>
        </div>

        <div style={{ marginTop: 90, textAlign: "center" }}>
          <div style={{ fontSize: 14, letterSpacing: 8, color: p.accent, textTransform: "uppercase", fontWeight: 700 }}>{F(d.subject, "Subject")}</div>
          <Serif style={{ fontSize: 64, fontWeight: 800, marginTop: 20, color: p.primary, lineHeight: 1.05 }}>{F(d.assignmentTitle, "Assignment Title")}</Serif>
          <div style={{ width: 120, height: 4, background: p.accent, margin: "30px auto" }} />
          <div style={{ fontSize: 18, fontStyle: "italic", color: p.muted }}>A scholarly submission</div>
        </div>

        {d.photoDataUrl && <div style={{ marginTop: 50, textAlign: "center" }}><Photo src={d.photoDataUrl} size={140} ring={p.primary} /></div>}

        <div style={{ marginTop: "auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, background: "white", padding: 30, border: `1px solid ${p.muted}33`, borderRadius: 12 }}>
          <SubmitBlock title="Submitted By" p={p} rows={[["Name", d.studentName], ["Class·Sec", `${F(d.className)}·${F(d.section)}`], ["Roll", d.roll], ["ID", d.studentId]]} />
          <SubmitBlock title="Submitted To" p={p} rows={[["Teacher", d.teacherName], ["Subject", d.subject], ["Date", d.submissionDate], ["Year", d.academicYear]]} />
        </div>
      </div>
    </div>
  );
}

/* ---------- 8 Academic Seal ---------- */
function AcademicSeal({ d, p }: L) {
  return (
    <div style={{ height: "100%", padding: 50, boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", background: `radial-gradient(circle at top, ${p.primary}12 0%, transparent 60%)` }}>
      <div style={{ position: "relative", width: 160, height: 160, marginTop: 10 }}>
        <svg viewBox="0 0 160 160" width="160" height="160">
          <circle cx="80" cy="80" r="76" fill="none" stroke={p.primary} strokeWidth="2" />
          <circle cx="80" cy="80" r="68" fill="none" stroke={p.accent} strokeWidth="1" />
          <circle cx="80" cy="80" r="56" fill={p.primary} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
          {d.logoDataUrl ? <img src={d.logoDataUrl} alt="" style={{ width: 80, height: 80, objectFit: "contain", borderRadius: "50%", background: "white", padding: 8 }} /> : <GraduationCap size={56} color="white" />}
        </div>
      </div>

      <Serif style={{ fontSize: 30, fontWeight: 700, color: p.primary, marginTop: 24, fontFamily: '"Cinzel", serif', letterSpacing: 2 }}>{F(d.schoolName, "Your Institution")}</Serif>
      <div style={{ fontSize: 11, letterSpacing: 6, color: p.muted, textTransform: "uppercase", marginTop: 8 }}>Estd. {F(d.academicYear, "—")}</div>

      <div style={{ margin: "40px 0", width: 400, height: 1, background: `linear-gradient(90deg, transparent, ${p.primary}, transparent)` }} />

      <div style={{ fontSize: 13, letterSpacing: 8, color: p.accent, textTransform: "uppercase", fontWeight: 700 }}>{F(d.subject, "Subject")}</div>
      <Serif style={{ fontSize: 48, fontWeight: 700, marginTop: 14, color: p.ink, lineHeight: 1.1, fontFamily: '"Cormorant Garamond", serif' }}>{F(d.assignmentTitle, "Assignment Title")}</Serif>

      {d.photoDataUrl && <div style={{ marginTop: 40 }}><Photo src={d.photoDataUrl} size={120} ring={p.primary} /></div>}

      <div style={{ marginTop: "auto", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30, textAlign: "left" }}>
        <SubmitBlock title="Candidate" p={p} rows={[["Name", d.studentName], ["Roll", d.roll], ["Class·Sec", `${F(d.className)}·${F(d.section)}`], ["ID", d.studentId]]} />
        <SubmitBlock title="Faculty" p={p} rows={[["Teacher", d.teacherName], ["Date", d.submissionDate], ["Year", d.academicYear]]} />
      </div>
    </div>
  );
}

/* ---------- 9 Notebook ---------- */
function Notebook({ d, p }: L) {
  const lines = Array.from({ length: 32 });
  return (
    <div style={{ height: "100%", background: p.bg, position: "relative" }}>
      {/* red margin line */}
      <div style={{ position: "absolute", left: 90, top: 0, bottom: 0, width: 1, background: `${p.accent}` }} />
      <div style={{ position: "absolute", left: 84, top: 0, bottom: 0, width: 1, background: `${p.accent}66` }} />
      {/* rule lines */}
      <div style={{ position: "absolute", top: 60, left: 0, right: 0 }}>
        {lines.map((_, i) => (
          <div key={i} style={{ height: 32, borderBottom: `1px solid ${p.muted}22` }} />
        ))}
      </div>
      {/* holes */}
      {[120, 400, 680, 960].map((y) => (
        <div key={y} style={{ position: "absolute", left: 30, top: y, width: 18, height: 18, borderRadius: "50%", background: p.bg, boxShadow: `inset 0 0 0 2px ${p.muted}55` }} />
      ))}

      <div style={{ position: "relative", padding: "60px 60px 60px 130px", height: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {d.logoDataUrl ? <Logo src={d.logoDataUrl} size={54} /> : <BookOpen size={36} color={p.primary} />}
          <Serif style={{ fontSize: 22, fontWeight: 700, color: p.primary }}>{F(d.schoolName, "Your Institution")}</Serif>
        </div>

        <div style={{ marginTop: 60 }}>
          <div style={{ fontFamily: '"Great Vibes", cursive', fontSize: 40, color: p.secondary }}>{F(d.subject, "Subject")}</div>
          <Serif style={{ fontSize: 46, fontWeight: 700, marginTop: 10, color: p.primary, lineHeight: 1.1 }}>{F(d.assignmentTitle, "Assignment Title")}</Serif>
        </div>

        <div style={{ marginTop: 50, display: "flex", gap: 30, alignItems: "flex-start" }}>
          {d.photoDataUrl && <Photo src={d.photoDataUrl} size={130} ring={p.accent} />}
          <div style={{ flex: 1 }}>
            <InfoRow label="Name" value={d.studentName} p={p} small />
            <InfoRow label="Class·Sec·Roll" value={`${F(d.className)} · ${F(d.section)} · ${F(d.roll)}`} p={p} small />
            <InfoRow label="Student ID" value={d.studentId} p={p} small />
            <InfoRow label="Teacher" value={d.teacherName} p={p} small />
            <InfoRow label="Submitted On" value={d.submissionDate} p={p} small />
            <InfoRow label="Academic Year" value={d.academicYear} p={p} small />
          </div>
        </div>

        <div style={{ marginTop: "auto", fontFamily: '"Great Vibes", cursive', fontSize: 32, color: p.primary, textAlign: "right" }}>{F(d.studentName, "Your signature")}</div>
      </div>
    </div>
  );
}

/* ---------- 10 Prism ---------- */
function Prism({ d, p }: L) {
  return (
    <div style={{ height: "100%", position: "relative", overflow: "hidden" }}>
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} viewBox="0 0 794 1123" preserveAspectRatio="none">
        <defs>
          <linearGradient id="pg1" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor={p.primary} />
            <stop offset="1" stopColor={p.secondary} />
          </linearGradient>
          <linearGradient id="pg2" x1="0" x2="1" y1="1" y2="0">
            <stop offset="0" stopColor={p.accent} />
            <stop offset="1" stopColor={p.secondary} />
          </linearGradient>
        </defs>
        <polygon points="0,0 794,0 794,180 0,320" fill="url(#pg1)" />
        <polygon points="794,180 0,320 0,420 794,280" fill={`${p.accent}`} opacity="0.9" />
        <polygon points="0,1123 794,1123 794,900 0,1000" fill="url(#pg2)" />
        <polygon points="0,1000 794,900 794,830 0,930" fill={p.primary} opacity="0.8" />
      </svg>

      <div style={{ position: "relative", zIndex: 2, height: "100%", padding: 60, boxSizing: "border-box", display: "flex", flexDirection: "column" }}>
        <div style={{ color: "white", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {d.logoDataUrl ? <Logo src={d.logoDataUrl} size={60} /> : <Sparkles size={36} color="white" />}
            <div>
              <Serif style={{ fontSize: 22, fontWeight: 700 }}>{F(d.schoolName, "Your Institution")}</Serif>
              <div style={{ fontSize: 11, letterSpacing: 4, opacity: 0.85, textTransform: "uppercase", marginTop: 2 }}>{F(d.academicYear, "Academic Year")}</div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 260, background: "white", borderRadius: 20, padding: 40, boxShadow: "0 20px 60px rgba(0,0,0,.15)" }}>
          <div style={{ fontSize: 12, letterSpacing: 6, color: p.accent, textTransform: "uppercase", fontWeight: 700 }}>{F(d.subject, "Subject")}</div>
          <Serif style={{ fontSize: 44, fontWeight: 700, color: p.primary, marginTop: 10, lineHeight: 1.1 }}>{F(d.assignmentTitle, "Assignment Title")}</Serif>

          <div style={{ marginTop: 28, display: "flex", gap: 30, alignItems: "center" }}>
            {d.photoDataUrl && <Photo src={d.photoDataUrl} size={110} ring={p.accent} />}
            <div style={{ flex: 1 }}>
              <InfoRow label="Student" value={d.studentName} p={p} small />
              <InfoRow label="Class·Sec·Roll" value={`${F(d.className)}·${F(d.section)}·${F(d.roll)}`} p={p} small />
              <InfoRow label="Student ID" value={d.studentId} p={p} small />
            </div>
          </div>
        </div>

        <div style={{ marginTop: "auto", color: "white", display: "flex", justifyContent: "space-between", fontSize: 13 }}>
          <div><b>Teacher:</b> {F(d.teacherName)}</div>
          <div><b>Date:</b> {F(d.submissionDate)}</div>
        </div>
      </div>
    </div>
  );
}