// Local-only analytics for CoverCraft. All data stored in localStorage —
// nothing ever leaves the device. Powers the personal insights dashboard.

const KEY = "covercraft:analytics:v1";

export type AnalyticsEvent =
  | { type: "download"; format: "pdf" | "png"; templateId?: string; ts: number }
  | { type: "template_apply"; templateId: string; ts: number }
  | { type: "new_assignment"; ts: number }
  | { type: "ai_suggestion"; ts: number };

export type AnalyticsState = {
  events: AnalyticsEvent[];
  createdAt: number;
};

function safeRead(): AnalyticsState {
  if (typeof window === "undefined") return { events: [], createdAt: Date.now() };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { events: [], createdAt: Date.now() };
    const parsed = JSON.parse(raw) as AnalyticsState;
    if (!Array.isArray(parsed.events)) return { events: [], createdAt: Date.now() };
    return parsed;
  } catch {
    return { events: [], createdAt: Date.now() };
  }
}

function safeWrite(state: AnalyticsState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // storage full / disabled — ignore
  }
}

export function trackEvent(ev: Omit<AnalyticsEvent, "ts"> & { ts?: number }) {
  const state = safeRead();
  const event = { ...ev, ts: ev.ts ?? Date.now() } as AnalyticsEvent;
  state.events.push(event);
  // Cap history to last 5,000 events to keep localStorage healthy.
  if (state.events.length > 5000) state.events = state.events.slice(-5000);
  safeWrite(state);
}

export function getAnalytics(): AnalyticsState {
  return safeRead();
}

export function clearAnalytics() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}

export type DailyBucket = { date: string; label: string; pdf: number; png: number; total: number };

export function bucketByDay(events: AnalyticsEvent[], days = 30): DailyBucket[] {
  const buckets: DailyBucket[] = [];
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const byKey = new Map<string, DailyBucket>();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    const bucket = { date: key, label, pdf: 0, png: 0, total: 0 };
    buckets.push(bucket);
    byKey.set(key, bucket);
  }
  for (const e of events) {
    if (e.type !== "download") continue;
    const key = new Date(e.ts).toISOString().slice(0, 10);
    const b = byKey.get(key);
    if (!b) continue;
    if (e.format === "pdf") b.pdf++;
    else b.png++;
    b.total++;
  }
  return buckets;
}

export function topTemplates(events: AnalyticsEvent[], limit = 5) {
  const counts = new Map<string, number>();
  for (const e of events) {
    if (e.type === "download" && e.templateId) {
      counts.set(e.templateId, (counts.get(e.templateId) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([templateId, count]) => ({ templateId, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export function summary(events: AnalyticsEvent[]) {
  let pdf = 0;
  let png = 0;
  let ai = 0;
  let newAssign = 0;
  let firstTs: number | undefined;
  let lastTs: number | undefined;
  for (const e of events) {
    firstTs = firstTs === undefined ? e.ts : Math.min(firstTs, e.ts);
    lastTs = lastTs === undefined ? e.ts : Math.max(lastTs, e.ts);
    if (e.type === "download") {
      if (e.format === "pdf") pdf++;
      else png++;
    } else if (e.type === "ai_suggestion") ai++;
    else if (e.type === "new_assignment") newAssign++;
  }
  return {
    pdf,
    png,
    downloads: pdf + png,
    ai,
    newAssign,
    firstTs,
    lastTs,
  };
}