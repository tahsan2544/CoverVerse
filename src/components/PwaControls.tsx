import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Download as DownloadIcon,
  HardDrive,
  Trash2,
  Upload,
  RotateCcw,
  Smartphone,
  Wifi,
  WifiOff,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  useInstallPrompt,
  useOnlineStatus,
  useServiceWorkerReady,
  getStorageEstimate,
  clearAllCaches,
  resetApp,
} from "@/hooks/use-pwa";
import { exportBackup, importBackup } from "@/lib/backup";
import { cn } from "@/lib/utils";

function formatBytes(n: number) {
  if (!n) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  let i = 0;
  let v = n;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  return `${v.toFixed(v >= 10 || i === 0 ? 0 : 1)} ${units[i]}`;
}

export function OfflineBadge() {
  const online = useOnlineStatus();
  const swReady = useServiceWorkerReady();
  if (!swReady && online) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium",
        online
          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
          : "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300",
      )}
      title={online ? "Cached for offline use" : "You're offline — the app still works"}
    >
      {online ? <CheckCircle2 className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
      {online ? "Offline ready" : "Offline"}
    </span>
  );
}

export function PwaControls() {
  const { canInstall, installed, promptInstall } = useInstallPrompt();
  const online = useOnlineStatus();
  const [storage, setStorage] = useState<{ usage: number; quota: number } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const refreshStorage = () => {
    getStorageEstimate().then(setStorage);
  };
  useEffect(() => {
    refreshStorage();
    const t = setInterval(refreshStorage, 5000);
    return () => clearInterval(t);
  }, []);

  const pct = storage && storage.quota ? Math.min(100, (storage.usage / storage.quota) * 100) : 0;

  async function handleInstall() {
    const outcome = await promptInstall();
    if (outcome === "accepted") toast.success("Installing CoverCraft…");
    else if (outcome === "unavailable")
      toast.info("Install unavailable", {
        description:
          "On iOS: Share → Add to Home Screen. On desktop Chrome/Edge: use the install icon in the address bar.",
      });
  }

  async function handleClearCache() {
    await clearAllCaches();
    toast.success("Cache cleared — assets will re-download on next visit");
    refreshStorage();
  }

  async function handleReset() {
    if (!confirm("Reset the app? This deletes all saved data and cached files on this device.")) return;
    await resetApp();
    toast.success("App reset — reloading…");
    setTimeout(() => window.location.reload(), 500);
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between font-serif text-lg">
          <span>Offline & install</span>
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px]",
              online ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600",
            )}
          >
            {online ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
            {online ? "Online" : "Offline"}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 font-medium">
              <Smartphone className="h-4 w-4" />
              {installed ? "Installed on this device" : "Install as an app"}
            </div>
            <p className="text-xs text-muted-foreground">
              Works on Android, Windows, macOS, Linux & Chromebook. Launches full-screen, works offline.
            </p>
          </div>
          {!installed && (
            <Button onClick={handleInstall} disabled={!canInstall} className="bg-gradient-hero text-white shadow-glow">
              <DownloadIcon className="mr-1.5 h-4 w-4" /> Install app
            </Button>
          )}
        </div>

        <Separator />

        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="flex items-center gap-1.5 font-medium"><HardDrive className="h-4 w-4" /> Storage on this device</span>
            <span className="text-xs text-muted-foreground">
              {storage ? `${formatBytes(storage.usage)} of ${formatBytes(storage.quota)}` : "—"}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-gradient-hero transition-all" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            All data — templates, favorites, student info, uploaded photos & logo — stays on your device. No server, no login, no tracking.
          </p>
        </div>

        <Separator />

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Button variant="outline" onClick={exportBackup}>
            <DownloadIcon className="mr-1.5 h-4 w-4" /> Export backup (.json)
          </Button>
          <Button variant="outline" onClick={() => fileRef.current?.click()}>
            <Upload className="mr-1.5 h-4 w-4" /> Import backup
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) importBackup(f);
              e.target.value = "";
            }}
          />
          <Button variant="ghost" onClick={handleClearCache}>
            <Trash2 className="mr-1.5 h-4 w-4" /> Clear cache
          </Button>
          <Button variant="ghost" onClick={handleReset} className="text-destructive hover:text-destructive">
            <RotateCcw className="mr-1.5 h-4 w-4" /> Reset app
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}