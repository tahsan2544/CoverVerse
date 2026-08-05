import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pencil, Sparkles, Wand2, Download } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "covercraft:onboarded:v1";

type StepKey = "step1" | "step2" | "step3" | "step4";
const ICONS: Record<StepKey, React.ComponentType<{ className?: string }>> = {
  step1: Pencil,
  step2: Sparkles,
  step3: Wand2,
  step4: Download,
};
const STEPS: StepKey[] = ["step1", "step2", "step3", "step4"];

export function OnboardingTour({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { t } = useI18n();
  const [idx, setIdx] = useState(0);

  useEffect(() => { if (open) setIdx(0); }, [open]);

  function finish() {
    try { localStorage.setItem(STORAGE_KEY, "1"); } catch { /* ignore */ }
    onOpenChange(false);
  }

  const key = STEPS[idx];
  const Icon = ICONS[key];
  const isLast = idx === STEPS.length - 1;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">{t("onboarding.title")}</DialogTitle>
          <DialogDescription>{t("onboarding.subtitle")}</DialogDescription>
        </DialogHeader>
        <div className="rounded-xl border border-border bg-gradient-subtle p-5">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-hero text-white shadow-glow">
            <Icon className="h-6 w-6" />
          </div>
          <h3 className="mt-3 font-serif text-lg font-semibold">{t(`onboarding.${key}.title`)}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{t(`onboarding.${key}.body`)}</p>
          <div className="mt-4 flex gap-1.5">
            {STEPS.map((_, i) => (
              <span key={i} className={cn("h-1.5 flex-1 rounded-full transition-all", i === idx ? "bg-gold" : i < idx ? "bg-gold/60" : "bg-border")} />
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between gap-2">
          <Button variant="ghost" size="sm" onClick={finish}>{t("onboarding.skip")}</Button>
          <div className="flex gap-2">
            {idx > 0 && (
              <Button variant="outline" size="sm" onClick={() => setIdx((i) => Math.max(0, i - 1))}>{t("onboarding.back")}</Button>
            )}
            {isLast ? (
              <Button size="sm" onClick={finish} className="bg-gradient-hero text-white shadow-glow">{t("onboarding.done")}</Button>
            ) : (
              <Button size="sm" onClick={() => setIdx((i) => Math.min(STEPS.length - 1, i + 1))} className="bg-gradient-hero text-white shadow-glow">{t("onboarding.next")}</Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function useOnboarding() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        const t = setTimeout(() => setOpen(true), 500);
        return () => clearTimeout(t);
      }
    } catch { /* ignore */ }
  }, []);
  return { open, setOpen, replay: () => setOpen(true) };
}