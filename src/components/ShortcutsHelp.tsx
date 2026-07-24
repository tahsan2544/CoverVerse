import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useI18n } from "@/lib/i18n";

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex min-w-[1.75rem] items-center justify-center rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[11px] font-semibold text-foreground shadow-sm">
      {children}
    </kbd>
  );
}

function isMac() {
  if (typeof navigator === "undefined") return false;
  return /mac/i.test(navigator.platform);
}

export function ShortcutsHelp({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { t } = useI18n();
  const mod = isMac() ? "⌘" : "Ctrl";
  const rows: { keys: React.ReactNode; label: string }[] = [
    { keys: <><Kbd>{mod}</Kbd> + <Kbd>N</Kbd></>, label: t("shortcuts.newAssignment") },
    { keys: <><Kbd>{mod}</Kbd> + <Kbd>S</Kbd></>, label: t("shortcuts.downloadPdf") },
    { keys: <><Kbd>{mod}</Kbd> + <Kbd>⇧</Kbd> + <Kbd>S</Kbd></>, label: t("shortcuts.downloadPng") },
    { keys: <><Kbd>{mod}</Kbd> + <Kbd>P</Kbd></>, label: t("shortcuts.print") },
    { keys: <><Kbd>{mod}</Kbd> + <Kbd>D</Kbd></>, label: t("shortcuts.toggleTheme") },
    { keys: <Kbd>?</Kbd>, label: t("shortcuts.showHelp") },
    { keys: <><Kbd>{mod}</Kbd> + <Kbd>/</Kbd></>, label: t("shortcuts.tour") },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">{t("shortcuts.title")}</DialogTitle>
          <DialogDescription>{t("shortcuts.subtitle")}</DialogDescription>
        </DialogHeader>
        <ul className="divide-y divide-border rounded-lg border border-border">
          {rows.map((r, i) => (
            <li key={i} className="flex items-center justify-between gap-4 px-3 py-2.5 text-sm">
              <span className="text-muted-foreground">{r.label}</span>
              <span className="flex items-center gap-1 whitespace-nowrap">{r.keys}</span>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}