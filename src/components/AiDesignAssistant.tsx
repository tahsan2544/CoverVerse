import { useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Sparkles, Wand2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import { recommendCoverDesign } from "@/lib/ai-design.functions";
import { TEMPLATES } from "@/lib/templates";
import { PALETTES } from "@/lib/palettes";
import { FONT_PAIRS, type StyleCategory } from "@/lib/cover-types";
import type { CoverForm } from "@/lib/cover-schema";

type Props = {
  data: CoverForm;
  selectedTemplateId: string;
  onApply: (change: { templateId: string; fontId: string; paletteId: string }) => void;
};

const TRANSFORMS: Array<{ id: string; label: string; category: StyleCategory; fontId: string }> = [
  { id: "elegant", label: "Make it Elegant", category: "Elegant", fontId: "cormorant-inter" },
  { id: "modern", label: "Make it Modern", category: "Modern", fontId: "inter-inter" },
  { id: "minimal", label: "Make it Minimal", category: "Minimal", fontId: "inter-inter" },
  { id: "creative", label: "Make it Creative", category: "Creative", fontId: "greatvibes" },
];

export function AiDesignAssistant({ data, selectedTemplateId, onApply }: Props) {
  const [style, setStyle] = useState("");
  const [busy, setBusy] = useState(false);
  const [rationale, setRationale] = useState<string | null>(null);
  const call = useServerFn(recommendCoverDesign);

  const layoutIds = useMemo(() => Array.from(new Set(TEMPLATES.map((t) => t.layout))), []);
  const paletteIds = useMemo(() => PALETTES.map((p) => p.id), []);
  const fontIds = useMemo(() => FONT_PAIRS.map((f) => f.id), []);
  const categories = useMemo(
    () => Array.from(new Set(TEMPLATES.flatMap((t) => t.categories))),
    [],
  );

  async function askAi() {
    if (!data.assignmentTitle?.trim() || !data.subject?.trim()) {
      toast.error("Add an assignment title and subject first");
      return;
    }
    setBusy(true);
    setRationale(null);
    try {
      const rec = await call({
        data: {
          assignmentTitle: data.assignmentTitle,
          subject: data.subject,
          className: data.className ?? "",
          schoolName: data.schoolName ?? "",
          stylePreference: style,
          layoutIds,
          paletteIds,
          fontIds,
          categories,
        },
      });
      const templateId = `${rec.layoutId}-${rec.paletteId}`;
      const exists = TEMPLATES.some((t) => t.id === templateId);
      const finalTemplate = exists ? templateId : TEMPLATES[0].id;
      onApply({ templateId: finalTemplate, fontId: rec.fontId, paletteId: rec.paletteId });
      setRationale(rec.rationale);
      toast.success("AI applied a recommended design");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong";
      toast.error("AI recommendation failed", { description: msg });
    } finally {
      setBusy(false);
    }
  }

  function applyTransform(t: (typeof TRANSFORMS)[number]) {
    const current = TEMPLATES.find((tt) => tt.id === selectedTemplateId);
    const matching = TEMPLATES.filter((tt) => tt.categories.includes(t.category));
    if (matching.length === 0) {
      toast.error("No matching templates");
      return;
    }
    // prefer keeping the current palette family if available, else pick a fresh one
    const preferred =
      matching.find((m) => m.palette === current?.palette) ??
      matching[Math.floor(Math.random() * matching.length)];
    onApply({ templateId: preferred.id, fontId: t.fontId, paletteId: preferred.palette });
    toast.success(`Applied "${t.label}"`);
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 font-serif text-lg">
          <Sparkles className="h-5 w-5 text-accent" /> AI design assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">
            Describe the vibe (optional)
          </Label>
          <Textarea
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            placeholder='e.g. "clean and scientific with a hint of navy" or "playful for primary school"'
            rows={2}
            className="mt-1"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Uses your assignment title, subject and class to pick a layout, palette, and font pair.
          </p>
        </div>
        <Button
          type="button"
          onClick={askAi}
          disabled={busy}
          className="w-full bg-gradient-hero text-white shadow-glow"
        >
          {busy ? (
            <><Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Thinking…</>
          ) : (
            <><Sparkles className="mr-1.5 h-4 w-4" /> Recommend a design</>
          )}
        </Button>
        {rationale && (
          <div className="rounded-lg border border-accent/40 bg-accent/5 p-3 text-sm text-foreground">
            <span className="font-medium">Why: </span>
            {rationale}
          </div>
        )}
        <div>
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">
            One-click transforms
          </Label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {TRANSFORMS.map((t) => (
              <Button
                key={t.id}
                type="button"
                variant="outline"
                onClick={() => applyTransform(t)}
                className={cn("justify-start")}
              >
                <Wand2 className="mr-1.5 h-4 w-4" /> {t.label}
              </Button>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Instant, offline. Filters templates by category and swaps font pairing.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}