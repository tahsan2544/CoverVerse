import { useCallback, useEffect, useState } from "react";

const KEY = "covercraft:recent-templates:v1";
const MAX = 24;

type RecentEntry = { id: string; ts: number };

function safeRead(): RecentEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (e): e is RecentEntry =>
        e != null && typeof e === "object" && typeof (e as RecentEntry).id === "string" && typeof (e as RecentEntry).ts === "number",
    );
  } catch {
    return [];
  }
}

export function useRecentTemplates() {
  const [recent, setRecent] = useState<RecentEntry[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setRecent(safeRead());
    setMounted(true);
  }, []);

  const push = useCallback((id: string) => {
    setRecent((prev) => {
      const next = [{ id, ts: Date.now() }, ...prev.filter((e) => e.id !== id)].slice(0, MAX);
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* quota */
      }
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setRecent([]);
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
  }, []);

  return { recent, recentIds: recent.map((r) => r.id), push, clear, mounted };
}