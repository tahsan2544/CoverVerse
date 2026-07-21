import { useMemo, useState } from "react";
import { TEMPLATES, ALL_CATEGORIES } from "@/lib/templates";
import { CoverPreview } from "./CoverPreview";
import type { CoverData, QRConfig, StyleCategory } from "@/lib/cover-types";
import { cn } from "@/lib/utils";
import { Check, Heart, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Props = {
  data: CoverData;
  selectedId: string;
  onSelect: (id: string) => void;
  fontId?: string;
  qr?: QRConfig;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
};

type SortMode = "default" | "name" | "layout" | "favorites";

export function TemplateGallery({ data, selectedId, onSelect, fontId, qr, favorites, onToggleFavorite }: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<StyleCategory | "All" | "Favorites">("All");
  const [sort, setSort] = useState<SortMode>("default");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = TEMPLATES.filter((t) => {
      if (category === "Favorites") return favorites.includes(t.id);
      if (category !== "All" && !t.categories.includes(category)) return false;
      if (!q) return true;
      return (
        t.name.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q)) ||
        t.categories.some((c) => c.toLowerCase().includes(q))
      );
    });
    if (sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "layout") list = [...list].sort((a, b) => a.layout.localeCompare(b.layout));
    else if (sort === "favorites") list = [...list].sort((a, b) => Number(favorites.includes(b.id)) - Number(favorites.includes(a.id)));
    return list;
  }, [query, category, sort, favorites]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search templates by name, style, or color…"
            className="pl-8 pr-8"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Select value={sort} onValueChange={(v) => setSort(v as SortMode)}>
          <SelectTrigger className="sm:w-40"><SelectValue placeholder="Sort" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Recommended</SelectItem>
            <SelectItem value="favorites">Favorites first</SelectItem>
            <SelectItem value="name">Name A→Z</SelectItem>
            <SelectItem value="layout">Layout</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {(["All", "Favorites", ...ALL_CATEGORIES] as const).map((c) => {
          const active = category === c;
          const count =
            c === "All"
              ? TEMPLATES.length
              : c === "Favorites"
                ? favorites.length
                : TEMPLATES.filter((t) => t.categories.includes(c as StyleCategory)).length;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={cn(
                "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition-all hover:-translate-y-0.5",
                active ? "border-accent bg-accent text-accent-foreground shadow-glow" : "border-border bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {c === "Favorites" && <Heart className="h-3 w-3" />}
              {c}
              <span className="opacity-70">· {count}</span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No templates match. Try a different search or category.
          {category === "Favorites" && (
            <div className="mt-2">Tip: tap the heart on any template to save it here.</div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((t, i) => {
            const active = t.id === selectedId;
            const fav = favorites.includes(t.id);
            return (
              <div
                key={t.id}
                className="animate-in fade-in zoom-in-95"
                style={{ animationDelay: `${Math.min(i, 12) * 25}ms`, animationFillMode: "backwards" }}
              >
                <button
                  type="button"
                  onClick={() => onSelect(t.id)}
                  className={cn(
                    "group relative w-full overflow-hidden rounded-lg border-2 bg-white transition-all hover:-translate-y-0.5 hover:shadow-elegant",
                    active ? "border-accent ring-2 ring-accent/40" : "border-border",
                  )}
                  aria-pressed={active}
                >
                  <div className="relative aspect-[794/1123] w-full overflow-hidden bg-white">
                    <div className="absolute left-0 top-0 origin-top-left" style={{ transform: "scale(0.19)" }}>
                      <CoverPreview data={data} templateId={t.id} fontId={fontId} qr={qr} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2 border-t bg-card px-2 py-1.5 text-left">
                    <span className="truncate text-[11px] font-medium text-card-foreground">{t.name}</span>
                    {active && <Check className="h-3.5 w-3.5 shrink-0 text-accent" />}
                  </div>
                </button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1 h-7 w-7 rounded-full bg-white/85 backdrop-blur hover:bg-white"
                  onClick={(e) => { e.stopPropagation(); onToggleFavorite(t.id); }}
                  aria-label={fav ? "Remove favorite" : "Add favorite"}
                >
                  <Heart className={cn("h-3.5 w-3.5", fav ? "fill-red-500 text-red-500" : "text-muted-foreground")} />
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}