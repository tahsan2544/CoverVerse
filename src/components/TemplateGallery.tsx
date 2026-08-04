import { useEffect, useMemo, useRef, useState } from "react";
import { TEMPLATES, ALL_CATEGORIES, TRENDING_IDS, NEWEST_COUNT } from "@/lib/templates";
import { CoverPreview } from "./CoverPreview";
import type { CoverData, QRConfig, StyleCategory } from "@/lib/cover-types";
import { cn } from "@/lib/utils";
import { Check, Eye, Flame, Heart, History, Search, Sparkles, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type Props = {
  data: CoverData;
  selectedId: string;
  onSelect: (id: string) => void;
  fontId?: string;
  qr?: QRConfig;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  recentIds: string[];
};

type SortMode = "default" | "name" | "layout" | "favorites";
type Section = "all" | "trending" | "newest" | "recent" | "favorites";

const SECTION_META: Array<{ id: Section; label: string; icon: React.ReactNode }> = [
  { id: "all", label: "All", icon: <Sparkles className="h-3.5 w-3.5" /> },
  { id: "trending", label: "Trending", icon: <Flame className="h-3.5 w-3.5" /> },
  { id: "newest", label: "Newest", icon: <Sparkles className="h-3.5 w-3.5" /> },
  { id: "recent", label: "Recently used", icon: <History className="h-3.5 w-3.5" /> },
  { id: "favorites", label: "Favorites", icon: <Heart className="h-3.5 w-3.5" /> },
];

const PAGE_SIZE = 40;

/** Renders the (expensive) A4 preview only once the card scrolls near the viewport. */
function LazyThumb({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || show) return;
    if (typeof IntersectionObserver === "undefined") {
      setShow(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [show]);

  return (
    <div ref={ref} className="relative aspect-[794/1123] w-full overflow-hidden bg-white">
      {show ? children : <div className="h-full w-full animate-pulse bg-muted" />}
    </div>
  );
}

export function TemplateGallery({
  data,
  selectedId,
  onSelect,
  fontId,
  qr,
  favorites,
  onToggleFavorite,
  recentIds,
}: Props) {
  const [query, setQuery] = useState("");
  const [section, setSection] = useState<Section>("all");
  const [category, setCategory] = useState<StyleCategory | "All">("All");
  const [sort, setSort] = useState<SortMode>("default");
  const [previewId, setPreviewId] = useState<string | null>(null);

  const sectionSource = useMemo(() => {
    switch (section) {
      case "trending": {
        const set = new Set(TRENDING_IDS);
        return TRENDING_IDS
          .map((id) => TEMPLATES.find((t) => t.id === id))
          .filter((t): t is (typeof TEMPLATES)[number] => !!t && set.has(t.id));
      }
      case "newest":
        return TEMPLATES.slice(-NEWEST_COUNT).reverse();
      case "recent": {
        const idx = new Map(TEMPLATES.map((t) => [t.id, t]));
        return recentIds
          .map((id) => idx.get(id))
          .filter((t): t is (typeof TEMPLATES)[number] => !!t);
      }
      case "favorites":
        return TEMPLATES.filter((t) => favorites.includes(t.id));
      case "all":
      default:
        return TEMPLATES;
    }
  }, [section, favorites, recentIds]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = sectionSource.filter((t) => {
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
  }, [sectionSource, query, category, sort, favorites]);

  const emptyMessage: Record<Section, string> = {
    all: "No templates match. Try a different search or category.",
    trending: "No trending templates match this filter.",
    newest: "No newest templates match this filter.",
    recent: "No recently used templates yet — pick one and it will appear here.",
    favorites: "No favorites yet — tap the heart on any template to save it.",
  };

  return (
    <div className="space-y-4">
      {/* Sections */}
      <div className="flex flex-wrap gap-1.5">
        {SECTION_META.map((s) => {
          const active = section === s.id;
          const count =
            s.id === "all"
              ? TEMPLATES.length
              : s.id === "trending"
                ? TRENDING_IDS.length
                : s.id === "newest"
                  ? Math.min(NEWEST_COUNT, TEMPLATES.length)
                  : s.id === "recent"
                    ? recentIds.length
                    : favorites.length;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setSection(s.id)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all hover:-translate-y-0.5",
                active
                  ? "border-primary bg-primary text-primary-foreground shadow-glow"
                  : "border-border bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {s.icon}
              {s.label}
              <span className="opacity-70">· {count}</span>
            </button>
          );
        })}
      </div>

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
        {(["All", ...ALL_CATEGORIES] as const).map((c) => {
          const active = category === c;
          const count =
            c === "All"
              ? sectionSource.length
              : sectionSource.filter((t) => t.categories.includes(c as StyleCategory)).length;
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
              {c}
              <span className="opacity-70">· {count}</span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          {emptyMessage[section]}
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
                <div className="pointer-events-none absolute right-1 top-1 flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="pointer-events-auto h-7 w-7 rounded-full bg-white/85 backdrop-blur hover:bg-white"
                    onClick={(e) => { e.stopPropagation(); setPreviewId(t.id); }}
                    aria-label="Preview template"
                  >
                    <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="pointer-events-auto h-7 w-7 rounded-full bg-white/85 backdrop-blur hover:bg-white"
                    onClick={(e) => { e.stopPropagation(); onToggleFavorite(t.id); }}
                    aria-label={fav ? "Remove favorite" : "Add favorite"}
                  >
                    <Heart className={cn("h-3.5 w-3.5", fav ? "fill-red-500 text-red-500" : "text-muted-foreground")} />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={!!previewId} onOpenChange={(open) => !open && setPreviewId(null)}>
        <DialogContent className="max-h-[92vh] max-w-3xl overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg">
              {previewId ? TEMPLATES.find((t) => t.id === previewId)?.name : "Template preview"}
            </DialogTitle>
          </DialogHeader>
          {previewId && (
            <div className="space-y-4">
              <div className="mx-auto w-full max-w-[520px] overflow-hidden rounded-lg border bg-white shadow-elegant">
                <div className="relative aspect-[794/1123] w-full">
                  <div
                    className="absolute left-0 top-0 origin-top-left"
                    style={{ transform: "scale(0.65)", width: 794, height: 1123 }}
                  >
                    <CoverPreview data={data} templateId={previewId} fontId={fontId} qr={qr} />
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onToggleFavorite(previewId)}
                >
                  <Heart
                    className={cn(
                      "mr-1.5 h-4 w-4",
                      favorites.includes(previewId) ? "fill-red-500 text-red-500" : "",
                    )}
                  />
                  {favorites.includes(previewId) ? "Remove favorite" : "Add favorite"}
                </Button>
                <Button
                  type="button"
                  onClick={() => { onSelect(previewId); setPreviewId(null); }}
                >
                  <Check className="mr-1.5 h-4 w-4" /> Use this template
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}