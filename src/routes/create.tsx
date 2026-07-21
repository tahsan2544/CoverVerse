import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import { coverSchema, type CoverForm } from "@/lib/cover-schema";
import { EMPTY_COVER, DEFAULT_QR, DEFAULT_STYLE, FONT_PAIRS, type QRConfig, type StyleConfig } from "@/lib/cover-types";
import { TEMPLATES } from "@/lib/templates";
import { PALETTES, getPalette } from "@/lib/palettes";
import { CoverPreview, A4_H, A4_W } from "@/components/CoverPreview";
import { TemplateGallery } from "@/components/TemplateGallery";
import { ThemeToggle } from "@/components/ThemeToggle";
import { COMMON_SCHOOLS } from "@/lib/schools";
import { downloadPdf, downloadPng } from "@/lib/download";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";

import {
  ArrowLeft,
  Download,
  FileImage,
  FileText,
  Printer,
  Sparkles,
  Upload,
  X,
  Pencil,
  CalendarIcon,
  Palette as PaletteIcon,
  Check,
  GraduationCap,
  QrCode,
  Type,
  RefreshCw,
} from "lucide-react";
import { format } from "date-fns";

export const Route = createFileRoute("/create")({
  head: () => ({
    meta: [
      { title: "Create Your Cover Page · CoverCraft" },
      { name: "description", content: "Design an assignment cover page from 50+ templates with live preview and download." },
    ],
  }),
  component: CreatePage,
});

const STORAGE_KEY = "covercraft:v1";
const MAX_UPLOAD = 10 * 1024 * 1024; // 10 MB

type Persisted = {
  data: CoverForm;
  templateId: string;
  paletteId: string;
  customColors: { primary?: string; secondary?: string; accent?: string };
};

function loadPersisted(): Persisted | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Persisted;
  } catch { return null; }
}

function CreatePage() {
  const [mounted, setMounted] = useState(false);
  const [templateId, setTemplateId] = useState(TEMPLATES[0].id);
  const [paletteId, setPaletteId] = useState(TEMPLATES[0].palette);
  const [customColors, setCustomColors] = useState<{ primary?: string; secondary?: string; accent?: string }>({});
  const [previewLocked, setPreviewLocked] = useState(false);
  const [customSchool, setCustomSchool] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const form = useForm<CoverForm>({
    resolver: zodResolver(coverSchema),
    defaultValues: EMPTY_COVER,
    mode: "onChange",
  });
  const { register, watch, setValue, formState, handleSubmit, trigger, reset } = form;
  const values = watch();

  // hydrate from localStorage after mount (SSR safe)
  useEffect(() => {
    const p = loadPersisted();
    if (p) {
      reset(p.data);
      if (p.templateId) setTemplateId(p.templateId);
      if (p.paletteId) setPaletteId(p.paletteId);
      if (p.customColors) setCustomColors(p.customColors);
      if (p.data.schoolName && !COMMON_SCHOOLS.includes(p.data.schoolName)) {
        setCustomSchool(true);
      }
    }
    setMounted(true);
  }, [reset]);

  // autosave
  useEffect(() => {
    if (!mounted) return;
    const t = setTimeout(() => {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ data: values, templateId, paletteId, customColors } satisfies Persisted),
        );
      } catch { /* quota */ }
    }, 400);
    return () => clearTimeout(t);
  }, [mounted, values, templateId, paletteId, customColors]);

  // keep template's palette in sync unless user overrode
  const activeTemplate = useMemo(() => TEMPLATES.find(t => t.id === templateId) ?? TEMPLATES[0], [templateId]);
  useEffect(() => { setPaletteId(activeTemplate.palette); }, [activeTemplate.palette]);

  const paletteBase = getPalette(paletteId);
  const paletteOverride = { ...paletteBase, ...customColors };

  const requiredReady =
    values.studentName?.trim().length >= 2 &&
    values.roll?.trim() &&
    values.section?.trim() &&
    values.className?.trim() &&
    values.studentId?.trim() &&
    values.schoolName?.trim().length >= 2 &&
    values.subject?.trim() &&
    values.assignmentTitle?.trim().length >= 2 &&
    values.submissionDate?.trim();

  async function handleFile(kind: "photo" | "logo", file?: File) {
    if (!file) return;
    if (file.size > MAX_UPLOAD) {
      toast.error("File too large", { description: "Maximum size is 10 MB." });
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      setValue(kind === "photo" ? "photoDataUrl" : "logoDataUrl", url, { shouldDirty: true });
    };
    reader.readAsDataURL(file);
  }

  async function onDownload(kind: "pdf" | "png") {
    const ok = await trigger();
    if (!ok) { toast.error("Please complete required fields"); return; }
    if (!previewRef.current) return;
    toast.promise(
      (kind === "pdf" ? downloadPdf : downloadPng)(previewRef.current, values),
      {
        loading: `Generating ${kind.toUpperCase()}…`,
        success: `${kind.toUpperCase()} downloaded`,
        error: "Something went wrong",
      },
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-hero text-white shadow-glow">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="hidden font-serif text-lg font-bold sm:inline">CoverCraft</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild><Link to="/"><ArrowLeft className="mr-1 h-4 w-4" /> Home</Link></Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 lg:py-10">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)]">
          {/* LEFT: form + templates */}
          <div>
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details"><Pencil className="mr-1.5 h-4 w-4" /> Details</TabsTrigger>
                <TabsTrigger value="templates"><Sparkles className="mr-1.5 h-4 w-4" /> Templates</TabsTrigger>
                <TabsTrigger value="style"><PaletteIcon className="mr-1.5 h-4 w-4" /> Style</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="mt-4">
                <form onSubmit={handleSubmit(() => onDownload("pdf"))} className="space-y-6">
                  <Section title="Institution">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Field label="School / Institution" error={formState.errors.schoolName?.message}>
                        {!customSchool ? (
                          <Select
                            value={COMMON_SCHOOLS.includes(values.schoolName ?? "") ? values.schoolName : ""}
                            onValueChange={(v) => {
                              if (v === "__custom__") { setCustomSchool(true); setValue("schoolName", "", { shouldDirty: true }); return; }
                              setValue("schoolName", v, { shouldValidate: true, shouldDirty: true });
                            }}
                          >
                            <SelectTrigger><SelectValue placeholder="Select your school" /></SelectTrigger>
                            <SelectContent>
                              {COMMON_SCHOOLS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                              <SelectItem value="__custom__">+ Add custom school</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <div className="flex gap-2">
                            <Input {...register("schoolName")} placeholder="Type your school name" />
                            <Button type="button" variant="ghost" size="icon" onClick={() => { setCustomSchool(false); setValue("schoolName", "", { shouldDirty: true }); }}><X className="h-4 w-4" /></Button>
                          </div>
                        )}
                      </Field>
                      <Field label="Academic Year" hint="e.g. 2025 – 2026">
                        <Input {...register("academicYear")} placeholder="2025 – 2026" />
                      </Field>
                    </div>
                    <div className="mt-4">
                      <Label className="text-xs uppercase tracking-wider text-muted-foreground">Institution Logo (optional, ≤10 MB)</Label>
                      <UploadRow value={values.logoDataUrl} onFile={(f) => handleFile("logo", f)} onClear={() => setValue("logoDataUrl", null, { shouldDirty: true })} label="Upload logo" />
                    </div>
                  </Section>

                  <Section title="Student">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Field label="Full Name *" error={formState.errors.studentName?.message}>
                        <Input {...register("studentName")} placeholder="Ayesha Rahman" />
                      </Field>
                      <Field label="Student ID *" error={formState.errors.studentId?.message}>
                        <Input {...register("studentId")} placeholder="STU-2026-0417" />
                      </Field>
                      <Field label="Class *" error={formState.errors.className?.message}>
                        <Input {...register("className")} placeholder="10" />
                      </Field>
                      <Field label="Section *" error={formState.errors.section?.message}>
                        <Input {...register("section")} placeholder="A" />
                      </Field>
                      <Field label="Roll No. *" error={formState.errors.roll?.message}>
                        <Input {...register("roll")} placeholder="17" />
                      </Field>
                      <Field label="Student Photo (optional, ≤10 MB)">
                        <UploadRow value={values.photoDataUrl} onFile={(f) => handleFile("photo", f)} onClear={() => setValue("photoDataUrl", null, { shouldDirty: true })} label="Upload photo" circular />
                      </Field>
                    </div>
                  </Section>

                  <Section title="Assignment">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Field label="Assignment Title *" error={formState.errors.assignmentTitle?.message}>
                        <Input {...register("assignmentTitle")} placeholder="Waves, Light & the Nature of Reality" />
                      </Field>
                      <Field label="Subject *" error={formState.errors.subject?.message}>
                        <Input {...register("subject")} placeholder="Physics" />
                      </Field>
                      <Field label="Teacher Name">
                        <Input {...register("teacherName")} placeholder="Dr. Karim Hasan" />
                      </Field>
                      <Field label="Submission Date *" error={formState.errors.submissionDate?.message}>
                        <DatePickerField value={values.submissionDate} onChange={(v) => setValue("submissionDate", v, { shouldValidate: true, shouldDirty: true })} />
                      </Field>
                    </div>
                  </Section>
                </form>
              </TabsContent>

              <TabsContent value="templates" className="mt-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="font-serif text-lg">Pick a template ({TEMPLATES.length} available)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TemplateGallery data={values} selectedId={templateId} onSelect={setTemplateId} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="style" className="mt-4">
                <Card>
                  <CardHeader className="pb-3"><CardTitle className="font-serif text-lg">Color palette</CardTitle></CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label className="text-xs uppercase tracking-wider text-muted-foreground">Preset palettes</Label>
                      <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-5">
                        {PALETTES.map(p => {
                          const active = paletteId === p.id && !customColors.primary;
                          return (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => { setPaletteId(p.id); setCustomColors({}); }}
                              className={cn("group relative rounded-lg border-2 p-3 text-left transition-all hover:-translate-y-0.5", active ? "border-accent" : "border-border")}
                            >
                              <div className="flex gap-1">
                                <span className="h-6 w-6 rounded" style={{ background: p.primary }} />
                                <span className="h-6 w-6 rounded" style={{ background: p.secondary }} />
                                <span className="h-6 w-6 rounded" style={{ background: p.accent }} />
                              </div>
                              <div className="mt-2 truncate text-xs font-medium">{p.name}</div>
                              {active && <Check className="absolute right-1.5 top-1.5 h-4 w-4 text-accent" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <Label className="text-xs uppercase tracking-wider text-muted-foreground">Custom colors</Label>
                      <div className="mt-2 grid grid-cols-3 gap-3">
                        {(["primary", "secondary", "accent"] as const).map(k => (
                          <div key={k}>
                            <div className="text-xs capitalize text-muted-foreground">{k}</div>
                            <div className="mt-1 flex items-center gap-2">
                              <input
                                type="color"
                                value={(customColors as any)[k] ?? (paletteBase as any)[k]}
                                onChange={(e) => setCustomColors(c => ({ ...c, [k]: e.target.value }))}
                                className="h-9 w-12 cursor-pointer rounded border border-border bg-transparent"
                              />
                              <span className="font-mono text-xs">{(customColors as any)[k] ?? (paletteBase as any)[k]}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      {(customColors.primary || customColors.secondary || customColors.accent) && (
                        <Button type="button" variant="ghost" size="sm" className="mt-3" onClick={() => setCustomColors({})}>Reset custom colors</Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* RIGHT: live preview */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <Card className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between gap-2 border-b bg-gradient-subtle pb-3">
                <CardTitle className="font-serif text-base">Live preview</CardTitle>
                <div className="flex items-center gap-1.5">
                  {previewLocked ? (
                    <Button size="sm" variant="ghost" onClick={() => setPreviewLocked(false)}><Pencil className="mr-1 h-4 w-4" /> Edit</Button>
                  ) : (
                    <span className="text-xs text-muted-foreground">{requiredReady ? "Ready" : "Fill required fields"}</span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="mx-auto w-full max-w-[460px]">
                  <div className="relative aspect-[794/1123] w-full overflow-hidden rounded-md bg-white shadow-paper ring-1 ring-black/5">
                    {!requiredReady && (
                      <div className="absolute inset-0 z-10 grid place-items-center bg-white/70 p-6 text-center backdrop-blur-sm dark:bg-black/40">
                        <div>
                          <Sparkles className="mx-auto h-6 w-6 text-accent" />
                          <p className="mt-2 max-w-xs text-sm text-muted-foreground">Complete the required fields to unlock the live preview and download.</p>
                        </div>
                      </div>
                    )}
                    <div ref={previewRef} className="origin-top-left" style={{ transform: `scale(${scaleFor(460)})`, width: A4_W, height: A4_H }}>
                      <CoverPreview data={values} templateId={templateId} paletteOverride={paletteOverride as any} />
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Button disabled={!requiredReady} onClick={() => onDownload("pdf")} className="bg-gradient-hero text-white shadow-glow">
                      <FileText className="mr-1.5 h-4 w-4" /> PDF
                    </Button>
                    <Button disabled={!requiredReady} onClick={() => onDownload("png")} variant="secondary">
                      <FileImage className="mr-1.5 h-4 w-4" /> PNG
                    </Button>
                    <Button disabled={!requiredReady} onClick={() => window.print()} variant="outline" className="col-span-2">
                      <Printer className="mr-1.5 h-4 w-4" /> Print
                    </Button>
                  </div>
                  <p className="mt-3 text-center text-[11px] text-muted-foreground">Your data autosaves to this browser only.</p>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
}

function scaleFor(maxWidth: number) {
  return Math.min(1, maxWidth / A4_W);
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="pb-3"><CardTitle className="font-serif text-lg">{title}</CardTitle></CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</Label>
      <div className="mt-1">{children}</div>
      {error ? (
        <p className="mt-1 text-xs text-destructive">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

function UploadRow({ value, onFile, onClear, label, circular }: { value?: string | null; onFile: (f?: File) => void; onClear: () => void; label: string; circular?: boolean }) {
  const id = `upload-${label.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <div className="flex items-center gap-3">
      {value ? (
        <img src={value} alt="" className={cn("h-14 w-14 border border-border bg-white object-cover", circular ? "rounded-full" : "rounded-md")} />
      ) : (
        <div className={cn("grid h-14 w-14 place-items-center border border-dashed border-border bg-muted text-muted-foreground", circular ? "rounded-full" : "rounded-md")}>
          <Upload className="h-5 w-5" />
        </div>
      )}
      <input id={id} type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
      <Button type="button" variant="outline" size="sm" asChild>
        <label htmlFor={id} className="cursor-pointer"><Upload className="mr-1.5 h-3.5 w-3.5" /> {value ? "Replace" : label}</label>
      </Button>
      {value && (
        <Button type="button" variant="ghost" size="sm" onClick={onClear}><X className="mr-1 h-3.5 w-3.5" /> Remove</Button>
      )}
    </div>
  );
}

function DatePickerField({ value, onChange }: { value?: string; onChange: (v: string) => void }) {
  const date = value ? new Date(value) : undefined;
  const isValid = date && !isNaN(date.getTime());
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" className={cn("w-full justify-start text-left font-normal", !isValid && "text-muted-foreground")}>
          <CalendarIcon className="mr-2 h-4 w-4" />
          {isValid ? format(date!, "PPP") : "Pick a date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={isValid ? date : undefined} onSelect={(d) => onChange(d ? format(d, "d MMMM yyyy") : "")} initialFocus className={cn("p-3 pointer-events-auto")} />
      </PopoverContent>
    </Popover>
  );
}

// Suppress unused import warning
void Download;