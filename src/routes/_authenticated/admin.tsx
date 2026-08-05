import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  ArrowLeft,
  Ban,
  BarChart3,
  Loader2,
  RefreshCw,
  Save,
  Shield,
  ShieldOff,
  Sparkles,
  Trash2,
  Users as UsersIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  deleteUser,
  getAdminOverview,
  setUserAdmin,
  setUserBlocked,
  updateSiteSettings,
} from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin console · CoverVerse" },
      { name: "description", content: "Manage CoverVerse site settings, AI limits and user accounts." },
      { property: "og:title", content: "Admin console · CoverVerse" },
      { property: "og:description", content: "Site settings, AI limits and account management for CoverVerse." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdminPage,
});

type Settings = {
  site_name: string;
  tagline: string;
  announcement: string;
  announcement_enabled: boolean;
  maintenance_mode: boolean;
  signups_enabled: boolean;
  ai_enabled: boolean;
  ai_daily_limit_user: number;
  ai_daily_limit_guest: number;
};

function AdminPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fetchOverview = useServerFn(getAdminOverview);
  const saveSettings = useServerFn(updateSiteSettings);
  const blockFn = useServerFn(setUserBlocked);
  const adminFn = useServerFn(setUserAdmin);
  const removeFn = useServerFn(deleteUser);

  const overview = useQuery({
    queryKey: ["admin-overview"],
    queryFn: () => fetchOverview(),
    retry: false,
  });

  const [form, setForm] = useState<Settings | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const s = overview.data?.settings;
    if (s && !form) {
      setForm({
        site_name: s.site_name,
        tagline: s.tagline,
        announcement: s.announcement,
        announcement_enabled: s.announcement_enabled,
        maintenance_mode: s.maintenance_mode,
        signups_enabled: s.signups_enabled,
        ai_enabled: s.ai_enabled,
        ai_daily_limit_user: s.ai_daily_limit_user,
        ai_daily_limit_guest: s.ai_daily_limit_guest,
      });
    }
  }, [overview.data, form]);

  const save = useMutation({
    mutationFn: (data: Settings) => saveSettings({ data }),
    onSuccess: () => {
      toast.success("Settings saved");
      queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
      queryClient.invalidateQueries({ queryKey: ["site-settings"] });
    },
    onError: (e: Error) => toast.error("Couldn't save", { description: e.message }),
  });

  const userAction = useMutation({
    mutationFn: async (action:
      | { kind: "block"; userId: string; blocked: boolean }
      | { kind: "admin"; userId: string; admin: boolean }
      | { kind: "delete"; userId: string }) => {
      if (action.kind === "block") return blockFn({ data: { userId: action.userId, blocked: action.blocked } });
      if (action.kind === "admin") return adminFn({ data: { userId: action.userId, admin: action.admin } });
      return removeFn({ data: { userId: action.userId } });
    },
    onSuccess: () => {
      toast.success("Account updated");
      queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
    },
    onError: (e: Error) => toast.error("Action failed", { description: e.message }),
  });

  const users = useMemo(() => {
    const list = overview.data?.users ?? [];
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (u) => (u.email ?? "").toLowerCase().includes(q) || (u.display_name ?? "").toLowerCase().includes(q),
    );
  }, [overview.data, search]);

  const maxDay = Math.max(1, ...(overview.data?.days ?? []).map((d) => d.count));

  if (overview.isError) {
    return (
      <div className="grid min-h-screen place-items-center px-4 text-center">
        <div>
          <Shield className="mx-auto h-8 w-8 text-muted-foreground" />
          <h1 className="mt-3 font-serif text-2xl font-bold">Admin access required</h1>
          <p className="mt-2 text-sm text-muted-foreground">This account isn't an administrator.</p>
          <Button className="mt-5" onClick={() => navigate({ to: "/" })}>Back to site</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-hero text-white shadow-glow">
              <Shield className="h-5 w-5" />
            </div>
            <span className="font-serif text-lg font-bold">Admin console</span>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={() => overview.refetch()}>
              <RefreshCw className="mr-1.5 h-4 w-4" /> Refresh
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard"><BarChart3 className="mr-1.5 h-4 w-4" /> Insights</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/"><ArrowLeft className="mr-1.5 h-4 w-4" /> Site</Link>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {overview.isLoading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading console…
          </div>
        )}

        {overview.data && (
          <>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <Kpi icon={UsersIcon} label="Accounts" value={overview.data.stats.totalUsers} />
              <Kpi icon={Sparkles} label="AI runs (30d)" value={overview.data.stats.aiTotal} />
              <Kpi icon={Sparkles} label="AI runs today" value={overview.data.stats.aiToday} />
              <Kpi icon={Ban} label="Failed AI runs" value={overview.data.stats.aiFailed} />
            </div>

            <Tabs defaultValue="settings" className="mt-8">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="settings">Site settings</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="ai">AI activity</TabsTrigger>
              </TabsList>

              <TabsContent value="settings" className="mt-4">
                {form && (
                  <Card>
                    <CardHeader className="pb-3"><CardTitle className="font-serif text-lg">General</CardTitle></CardHeader>
                    <CardContent className="space-y-5">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Site name</Label>
                          <Input value={form.site_name} onChange={(e) => setForm({ ...form, site_name: e.target.value })} className="mt-1" />
                        </div>
                        <div>
                          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Tagline</Label>
                          <Input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} className="mt-1" />
                        </div>
                      </div>

                      <div>
                        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Announcement banner</Label>
                        <Textarea
                          value={form.announcement}
                          onChange={(e) => setForm({ ...form, announcement: e.target.value })}
                          rows={2}
                          className="mt-1"
                          placeholder="Shown at the top of every page when enabled."
                        />
                      </div>

                      <Separator />

                      <ToggleRow
                        label="Show announcement"
                        hint="Display the banner above to every visitor."
                        checked={form.announcement_enabled}
                        onChange={(v) => setForm({ ...form, announcement_enabled: v })}
                      />
                      <ToggleRow
                        label="Maintenance mode"
                        hint="Visitors see a maintenance notice; admins keep full access."
                        checked={form.maintenance_mode}
                        onChange={(v) => setForm({ ...form, maintenance_mode: v })}
                      />
                      <ToggleRow
                        label="Allow new accounts"
                        hint="Turn off to hide the sign-up form."
                        checked={form.signups_enabled}
                        onChange={(v) => setForm({ ...form, signups_enabled: v })}
                      />

                      <Separator />

                      <ToggleRow
                        label="AI cover artwork"
                        hint="Master switch for AI generation across the site."
                        checked={form.ai_enabled}
                        onChange={(v) => setForm({ ...form, ai_enabled: v })}
                      />
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Daily AI limit · signed in</Label>
                          <Input
                            type="number"
                            min={0}
                            value={form.ai_daily_limit_user}
                            onChange={(e) => setForm({ ...form, ai_daily_limit_user: Number(e.target.value) })}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Daily AI limit · guests</Label>
                          <Input
                            type="number"
                            min={0}
                            value={form.ai_daily_limit_guest}
                            onChange={(e) => setForm({ ...form, ai_daily_limit_guest: Number(e.target.value) })}
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <Button
                        onClick={() => save.mutate(form)}
                        disabled={save.isPending}
                        className="bg-gradient-hero text-white shadow-glow"
                      >
                        {save.isPending ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Save className="mr-1.5 h-4 w-4" />}
                        Save settings
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="users" className="mt-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="font-serif text-lg">Accounts ({overview.data.users.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search by email or name…"
                      className="mb-4"
                    />
                    <div className="space-y-2">
                      {users.map((u) => (
                        <div key={u.id} className="flex flex-col gap-3 rounded-lg border border-border p-3 sm:flex-row sm:items-center sm:justify-between">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="truncate font-medium">{u.display_name || u.email}</span>
                              {u.isAdmin && <Badge variant="secondary">Admin</Badge>}
                              {u.blocked && <Badge variant="destructive">Blocked</Badge>}
                            </div>
                            <p className="truncate text-xs text-muted-foreground">
                              {u.email} · joined {new Date(u.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={userAction.isPending}
                              onClick={() => userAction.mutate({ kind: "admin", userId: u.id, admin: !u.isAdmin })}
                            >
                              {u.isAdmin ? <ShieldOff className="mr-1.5 h-3.5 w-3.5" /> : <Shield className="mr-1.5 h-3.5 w-3.5" />}
                              {u.isAdmin ? "Remove admin" : "Make admin"}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              disabled={userAction.isPending}
                              onClick={() => userAction.mutate({ kind: "block", userId: u.id, blocked: !u.blocked })}
                            >
                              <Ban className="mr-1.5 h-3.5 w-3.5" /> {u.blocked ? "Unblock" : "Block"}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-destructive hover:text-destructive"
                              disabled={userAction.isPending}
                              onClick={() => {
                                if (confirm(`Permanently delete ${u.email}?`)) userAction.mutate({ kind: "delete", userId: u.id });
                              }}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      {users.length === 0 && <p className="text-sm text-muted-foreground">No accounts match that search.</p>}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="ai" className="mt-4 space-y-4">
                <Card>
                  <CardHeader className="pb-3"><CardTitle className="font-serif text-lg">AI runs · last 30 days</CardTitle></CardHeader>
                  <CardContent>
                    <div className="flex h-32 items-end gap-1">
                      {overview.data.days.map((d) => (
                        <div
                          key={d.day}
                          title={`${d.day}: ${d.count}`}
                          className="flex-1 rounded-t bg-gradient-hero"
                          style={{ height: `${Math.max(2, (d.count / maxDay) * 100)}%` }}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3"><CardTitle className="font-serif text-lg">Latest requests</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                    {overview.data.recent.map((r) => (
                      <div key={r.id} className="rounded-lg border border-border p-3 text-xs">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium">{r.provider ?? "—"}</span>
                          <span className="text-muted-foreground">{new Date(r.created_at).toLocaleString()}</span>
                        </div>
                        <p className="mt-1 line-clamp-2 text-muted-foreground">{r.error ?? r.prompt ?? ""}</p>
                      </div>
                    ))}
                    {overview.data.recent.length === 0 && <p className="text-sm text-muted-foreground">No AI requests yet.</p>}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </main>
    </div>
  );
}

function Kpi({ icon: Icon, label, value }: { icon: typeof UsersIcon; label: string; value: number }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
          <Icon className="h-3.5 w-3.5" /> {label}
        </div>
        <div className="mt-1.5 font-serif text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

function ToggleRow({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-border p-3">
      <div>
        <div className="font-medium">{label}</div>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}