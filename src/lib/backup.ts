import { toast } from "sonner";

const STORAGE_KEY = "covercraft:v1";
const FAV_KEY = "covercraft:favs:v1";

type Backup = {
  app: "covercraft";
  version: 1;
  exportedAt: string;
  data: Record<string, unknown>;
  favorites: unknown;
};

function safeParse(raw: string | null) {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function exportBackup() {
  const backup: Backup = {
    app: "covercraft",
    version: 1,
    exportedAt: new Date().toISOString(),
    data: safeParse(localStorage.getItem(STORAGE_KEY)) ?? {},
    favorites: safeParse(localStorage.getItem(FAV_KEY)) ?? [],
  };
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `covercraft-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function importBackup(file: File): Promise<boolean> {
  try {
    const text = await file.text();
    const parsed = JSON.parse(text) as Partial<Backup>;
    if (parsed?.app !== "covercraft") {
      toast.error("Not a CoverCraft backup file");
      return false;
    }
    if (parsed.data) localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed.data));
    if (parsed.favorites) localStorage.setItem(FAV_KEY, JSON.stringify(parsed.favorites));
    toast.success("Backup imported — reloading…");
    setTimeout(() => window.location.reload(), 600);
    return true;
  } catch {
    toast.error("Couldn't read that backup file");
    return false;
  }
}