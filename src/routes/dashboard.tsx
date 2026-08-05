import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  ArrowLeft,
  Download,
  FileText,
  FileImage,
  Sparkles,
  RefreshCw,
  Trash2,
  BarChart3,
  GraduationCap,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  bucketByDay,
  clearAnalytics,
  getAnalytics,
  summary,
  topTemplates,
  type AnalyticsEvent,
} from "@/lib/analytics";
import { TEMPLATES } from "@/lib/templates";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
  head: () => ({
    meta: [
      { title: "Insights · CoverVerse — Your Cover Page Activity" },
      {
        name: "description",
        content:
          "Personal, private insights for your CoverVerse activity: downloads over time, favorite templates, and AI usage — all stored locally on your device.",
      },
      { property: "og:title", content: "CoverVerse Insights" },
      {
        property: "og:description",
        content: "A private, local dashboard of your CoverVerse downloads and templates.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function DashboardPage() {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [range, setRange] = useState<7 | 30 | 90>(30);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setEvents(getAnalytics().events);
  }, [refreshKey]);

  const stats = useMemo(() => summary(events), [events]);
  const daily = useMemo(() => bucketByDay(events, range), [events, range]);
  const top = useMemo(() => topTemplates(events, 6), [events]);

  const templateNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const t of TEMPLATES) map.set(t.id, t.name);
    return map;
  }, []);

  const pieData = [
    { name: "PDF", value: stats.pdf, color: "var(--primary)" },
    { name: "PNG", value: stats.png, color: "var(--gold)" },
  ].filter((s) => s.value > 0);

  const totalTop = top.reduce((sum, t) => sum + t.count, 0);
  const memberSince = stats.firstTs
    ? new Date(stats.firstTs).toLocaleDateString(undefined, { month: "long", year: "numeric" })
    : "—";
  const lastActive = stats.lastTs
    ? new Date(stats.lastTs).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

  function handleClear() {
    clearAnalytics();
    setRefreshKey((k) => k + 1);
    toast.success("Insights cleared", { description: "Your local activity history was reset." });
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm">
              <Link to="/create">
                <ArrowLeft className="mr-1 h-4 w-4" /> Back
              </Link>
            </Button>
            <div className="hidden items-center gap-2 sm:flex">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-hero text-white shadow-glow">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="font-serif text-lg font-bold tracking-tight">CoverVerse</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setRefreshKey((k) => k + 1)}>
              <RefreshCw className="mr-1.5 h-4 w-4" /> Refresh
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 md:py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-medium text-gold-foreground">
              <BarChart3 className="h-3.5 w-3.5" /> Private · stored on this device
            </div>
            <h1 className="mt-3 font-serif text-3xl font-bold tracking-tight sm:text-4xl">
              Your CoverVerse insights
            </h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              A private view of your activity — downloads, popular templates, and AI usage. Nothing
              ever leaves this device.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            {[7, 30, 90].map((r) => (
              <Button
                key={r}
                size="sm"
                variant={range === r ? "default" : "outline"}
                onClick={() => setRange(r as 7 | 30 | 90)}
              >
                {r}d
              </Button>
            ))}
          </div>
        </div>

        {/* KPI cards */}
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          <KpiCard icon={Download} label="Total downloads" value={stats.downloads} tone="primary" />
          <KpiCard icon={FileText} label="PDF exports" value={stats.pdf} tone="accent" />
          <KpiCard icon={FileImage} label="PNG exports" value={stats.png} tone="accent" />
          <KpiCard icon={Sparkles} label="AI suggestions" value={stats.ai} tone="primary" />
        </div>

        {/* Activity chart */}
        <Card className="mt-8">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-serif text-lg">Downloads over time</CardTitle>
            <span className="text-xs text-muted-foreground">Last {range} days</span>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={daily} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11 }}
                    interval={range === 90 ? 6 : range === 30 ? 3 : 0}
                  />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} width={32} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="pdf" name="PDF" stackId="a" fill="var(--primary)" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="png" name="PNG" stackId="a" fill="var(--gold)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Split: format share + top templates */}
        <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-5">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="font-serif text-lg">Format share</CardTitle>
            </CardHeader>
            <CardContent>
              {pieData.length === 0 ? (
                <EmptyHint text="No downloads yet. Export your first cover to see this chart." />
              ) : (
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={45}
                        outerRadius={80}
                        paddingAngle={4}
                        stroke="var(--background)"
                      >
                        {pieData.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: "var(--popover)",
                          border: "1px solid var(--border)",
                          borderRadius: 8,
                          fontSize: 12,
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="font-serif text-lg">Top templates</CardTitle>
            </CardHeader>
            <CardContent>
              {top.length === 0 ? (
                <EmptyHint text="Download covers to build your top-templates list." />
              ) : (
                <ul className="space-y-3">
                  {top.map(({ templateId, count }, i) => {
                    const name = templateNameById.get(templateId) ?? templateId;
                    const pct = totalTop === 0 ? 0 : Math.round((count / totalTop) * 100);
                    return (
                      <li key={templateId} className="group">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-3">
                            <span className="grid h-6 w-6 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                              {i + 1}
                            </span>
                            <span className="font-medium">{name}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {count} · {pct}%
                          </span>
                        </div>
                        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-gradient-hero transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Footer: meta + reset */}
        <Card className="mt-8">
          <CardContent className="flex flex-wrap items-center justify-between gap-4 py-5">
            <div className="text-sm text-muted-foreground">
              <div>
                First activity: <span className="text-foreground">{memberSince}</span>
              </div>
              <div>
                Last active: <span className="text-foreground">{lastActive}</span>
              </div>
              <div>
                Events recorded: <span className="text-foreground">{events.length}</span>
              </div>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Trash2 className="mr-1.5 h-4 w-4" /> Clear insights
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear your local activity?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This deletes every download and template event stored on this device. Your
                    covers, favorites, and profiles are not affected.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClear}>Clear</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  tone: "primary" | "accent";
}) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="flex items-center gap-3 py-5">
        <div
          className={
            tone === "primary"
              ? "grid h-11 w-11 place-items-center rounded-xl bg-gradient-hero text-white shadow-glow"
              : "grid h-11 w-11 place-items-center rounded-xl bg-gradient-gold text-primary"
          }
        >
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="text-2xl font-bold tabular-nums">{value}</div>
          <div className="text-xs text-muted-foreground">{label}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyHint({ text }: { text: string }) {
  return (
    <div className="grid h-40 place-items-center rounded-lg border border-dashed border-border/70 text-sm text-muted-foreground">
      {text}
    </div>
  );
}