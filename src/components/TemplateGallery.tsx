import { TEMPLATES } from "@/lib/templates";
import { CoverPreview } from "./CoverPreview";
import type { CoverData } from "@/lib/cover-types";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

type Props = {
  data: CoverData;
  selectedId: string;
  onSelect: (id: string) => void;
};

export function TemplateGallery({ data, selectedId, onSelect }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {TEMPLATES.map((t) => {
        const active = t.id === selectedId;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onSelect(t.id)}
            className={cn(
              "group relative overflow-hidden rounded-lg border-2 bg-white transition-all hover:-translate-y-0.5 hover:shadow-elegant",
              active ? "border-accent ring-2 ring-accent/40" : "border-border",
            )}
            aria-pressed={active}
          >
            <div className="relative aspect-[794/1123] w-full overflow-hidden bg-white">
              <div className="absolute left-0 top-0 origin-top-left" style={{ transform: "scale(0.19)" }}>
                <CoverPreview data={data} templateId={t.id} />
              </div>
            </div>
            <div className="flex items-center justify-between gap-2 border-t bg-card px-2 py-1.5 text-left">
              <span className="truncate text-[11px] font-medium text-card-foreground">{t.name}</span>
              {active && <Check className="h-3.5 w-3.5 shrink-0 text-accent" />}
            </div>
          </button>
        );
      })}
    </div>
  );
}