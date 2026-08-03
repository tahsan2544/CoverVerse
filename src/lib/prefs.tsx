import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useTheme } from "next-themes";

import { supabase } from "@/integrations/supabase/client";

export type ThemeChoice = "light" | "dark" | "system";
export type FontSize = "small" | "medium" | "large";
export type Density = "compact" | "comfortable";
export type PaperSize = "a4" | "letter" | "legal";
export type ExportFormat = "pdf" | "png";

export type Prefs = {
  theme: ThemeChoice;
  accent: string | null;
  fontSize: FontSize;
  density: Density;
  sidebarCollapsed: boolean;
  defaultFormat: ExportFormat;
  defaultPaper: PaperSize;
  defaultDpi: number;
  watermark: boolean;
  emailNotifications: boolean;
  inappNotifications: boolean;
  language: string;
};

export const DEFAULT_PREFS: Prefs = {
  theme: "system",
  accent: null,
  fontSize: "medium",
  density: "comfortable",
  sidebarCollapsed: false,
  defaultFormat: "pdf",
  defaultPaper: "a4",
  defaultDpi: 2,
  watermark: false,
  emailNotifications: true,
  inappNotifications: true,
  language: "en",
};

const KEY = "covercraft:prefs:v1";

type Ctx = {
  prefs: Prefs;
  ready: boolean;
  setPrefs: (patch: Partial<Prefs>) => void;
  resetPrefs: () => void;
};

const PrefsContext = createContext<Ctx>({
  prefs: DEFAULT_PREFS,
  ready: false,
  setPrefs: () => {},
  resetPrefs: () => {},
});

function readLocal(): Prefs {
  if (typeof window === "undefined") return DEFAULT_PREFS;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_PREFS;
    return { ...DEFAULT_PREFS, ...(JSON.parse(raw) as Partial<Prefs>) };
  } catch {
    return DEFAULT_PREFS;
  }
}

/** DB row (snake_case) -> Prefs */
function fromRow(row: Record<string, unknown>): Partial<Prefs> {
  return {
    theme: (row.theme as ThemeChoice) ?? undefined,
    accent: (row.accent as string | null) ?? null,
    fontSize: (row.font_size as FontSize) ?? undefined,
    density: (row.density as Density) ?? undefined,
    sidebarCollapsed: (row.sidebar_collapsed as boolean) ?? undefined,
    defaultFormat: (row.default_format as ExportFormat) ?? undefined,
    defaultPaper: (row.default_paper as PaperSize) ?? undefined,
    defaultDpi: (row.default_dpi as number) ?? undefined,
    watermark: (row.watermark as boolean) ?? undefined,
    emailNotifications: (row.email_notifications as boolean) ?? undefined,
    inappNotifications: (row.inapp_notifications as boolean) ?? undefined,
    language: (row.language as string) ?? undefined,
  };
}

function toRow(p: Prefs, userId: string) {
  return {
    user_id: userId,
    theme: p.theme,
    accent: p.accent,
    font_size: p.fontSize,
    density: p.density,
    sidebar_collapsed: p.sidebarCollapsed,
    default_format: p.defaultFormat,
    default_paper: p.defaultPaper,
    default_dpi: p.defaultDpi,
    watermark: p.watermark,
    email_notifications: p.emailNotifications,
    inapp_notifications: p.inappNotifications,
    language: p.language,
  };
}

export function PrefsProvider({ children }: { children: ReactNode }) {
  const [prefs, setState] = useState<Prefs>(DEFAULT_PREFS);
  const [ready, setReady] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const { setTheme } = useTheme();
  const hydrated = useRef(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 1. hydrate from localStorage (works for guests too)
  useEffect(() => {
    const local = readLocal();
    setState(local);
    setTheme(local.theme);
    hydrated.current = true;
    setReady(true);
  }, [setTheme]);

  // 2. track the signed-in user
  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active) setUserId(data.session?.user?.id ?? null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUserId(session?.user?.id ?? null);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  // 3. when signed in, the account row wins so preferences follow across devices
  useEffect(() => {
    if (!userId) return;
    let active = true;
    (async () => {
      const { data, error } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();
      if (!active || error) return;
      if (data) {
        const merged = { ...readLocal(), ...fromRow(data as Record<string, unknown>) } as Prefs;
        setState(merged);
        setTheme(merged.theme);
        try {
          localStorage.setItem(KEY, JSON.stringify(merged));
        } catch {
          /* quota */
        }
      } else {
        // First sign-in: seed the account row from this device's preferences.
        await supabase.from("user_preferences").upsert(toRow(readLocal(), userId));
      }
    })();
    return () => {
      active = false;
    };
  }, [userId, setTheme]);

  // 4. persist locally + to the account (debounced)
  useEffect(() => {
    if (!hydrated.current) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(prefs));
    } catch {
      /* quota */
    }
    if (!userId) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      void supabase.from("user_preferences").upsert(toRow(prefs, userId));
    }, 600);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [prefs, userId]);

  // 5. reflect appearance prefs on <html>
  useEffect(() => {
    if (typeof document === "undefined") return;
    const el = document.documentElement;
    el.dataset.fontSize = prefs.fontSize;
    el.dataset.density = prefs.density;
    if (prefs.accent) {
      el.style.setProperty("--primary", prefs.accent);
      el.style.setProperty("--ring", prefs.accent);
      el.style.setProperty("--sidebar-primary", prefs.accent);
    } else {
      el.style.removeProperty("--primary");
      el.style.removeProperty("--ring");
      el.style.removeProperty("--sidebar-primary");
    }
  }, [prefs.fontSize, prefs.density, prefs.accent]);

  const setPrefs = useCallback(
    (patch: Partial<Prefs>) => {
      setState((prev) => {
        const next = { ...prev, ...patch };
        if (patch.theme && patch.theme !== prev.theme) setTheme(patch.theme);
        return next;
      });
    },
    [setTheme],
  );

  const resetPrefs = useCallback(() => {
    setState(DEFAULT_PREFS);
    setTheme(DEFAULT_PREFS.theme);
  }, [setTheme]);

  const value = useMemo(() => ({ prefs, ready, setPrefs, resetPrefs }), [prefs, ready, setPrefs, resetPrefs]);

  return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>;
}

export function usePrefs() {
  return useContext(PrefsContext);
}
