import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

import { AppShell, PageSection } from "@/components/AppShell";
import { RouteError, RouteNotFound } from "@/components/RouteError";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { usePrefs, type Density, type ExportFormat, type FontSize, type PaperSize, type ThemeChoice } from "@/lib/prefs";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — CoverVerse" },
      { name: "description", content: "Choose your theme, text size, layout density and default export options for CoverVerse." },
      { property: "og:title", content: "Settings — CoverVerse" },
      { property: "og:description", content: "Personalise appearance and export defaults for your cover pages." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://coververse.lovable.app/settings" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "https://coververse.lovable.app/settings" }],
  }),
  component: SettingsPage,
  errorComponent: RouteError,
  notFoundComponent: () => <RouteNotFound />,
});

const ACCENTS: { label: string; value: string | null }[] = [
  { label: "Gold (default)", value: null },
  { label: "Indigo", value: "oklch(0.45 0.16 265)" },
  { label: "Emerald", value: "oklch(0.5 0.13 155)" },
  { label: "Rose", value: "oklch(0.55 0.19 15)" },
  { label: "Teal", value: "oklch(0.55 0.11 195)" },
];

function SettingsPage() {
  const { prefs, setPrefs, resetPrefs } = usePrefs();

  return (
    <AppShell title="Settings" description="Appearance, exports and notifications">
      <div className="mx-auto max-w-3xl space-y-6">
        <PageSection title="Appearance" description="These preferences follow your account when you're signed in.">
          <Card>
            <CardContent className="grid gap-5 pt-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Theme</Label>
                <Select value={prefs.theme} onValueChange={(v) => setPrefs({ theme: v as ThemeChoice })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">Match my device</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Accent colour</Label>
                <Select
                  value={prefs.accent ?? "default"}
                  onValueChange={(v) => setPrefs({ accent: v === "default" ? null : v })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ACCENTS.map((a) => (
                      <SelectItem key={a.label} value={a.value ?? "default"}>{a.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Text size</Label>
                <Select value={prefs.fontSize} onValueChange={(v) => setPrefs({ fontSize: v as FontSize })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Layout density</Label>
                <Select value={prefs.density} onValueChange={(v) => setPrefs({ density: v as Density })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="comfortable">Comfortable</SelectItem>
                    <SelectItem value="compact">Compact</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </PageSection>

        <PageSection title="Export defaults" description="Used the next time you download a cover page.">
          <Card>
            <CardContent className="grid gap-5 pt-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Format</Label>
                <Select value={prefs.defaultFormat} onValueChange={(v) => setPrefs({ defaultFormat: v as ExportFormat })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="png">PNG</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Paper size</Label>
                <Select value={prefs.defaultPaper} onValueChange={(v) => setPrefs({ defaultPaper: v as PaperSize })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a4">A4</SelectItem>
                    <SelectItem value="letter">Letter</SelectItem>
                    <SelectItem value="legal">Legal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Resolution</Label>
                <Select value={String(prefs.defaultDpi)} onValueChange={(v) => setPrefs({ defaultDpi: Number(v) })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">Standard (2x)</SelectItem>
                    <SelectItem value="3">High (3x)</SelectItem>
                    <SelectItem value="4">Maximum (4x)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </PageSection>

        <PageSection title="Notifications">
          <Card>
            <CardContent className="space-y-4 pt-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <Label htmlFor="inapp">In-app messages</Label>
                  <p className="text-xs text-muted-foreground">Announcements and tips inside CoverVerse.</p>
                </div>
                <Switch
                  id="inapp"
                  checked={prefs.inappNotifications}
                  onCheckedChange={(v) => setPrefs({ inappNotifications: v })}
                />
              </div>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <Label htmlFor="email">Email updates</Label>
                  <p className="text-xs text-muted-foreground">Occasional product news for your account email.</p>
                </div>
                <Switch
                  id="email"
                  checked={prefs.emailNotifications}
                  onCheckedChange={(v) => setPrefs({ emailNotifications: v })}
                />
              </div>
            </CardContent>
          </Card>
        </PageSection>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Reset preferences</CardTitle>
            <CardDescription>Puts appearance, export and notification settings back to their defaults.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              onClick={() => {
                resetPrefs();
                toast.success("Preferences reset");
              }}
            >
              Reset to defaults
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}