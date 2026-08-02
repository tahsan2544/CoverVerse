import { useState } from "react";
import { toast } from "sonner";
import { ImagePlus, Loader2, Trash2, Wand2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import type { CoverForm } from "@/lib/cover-schema";
import { supabase } from "@/integrations/supabase/client";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "@tanstack/react-router";

type Props = {
  data: CoverForm;
  bgImage: string | null;
  bgOpacity: number;
  onBgImage: (dataUrl: string | null) => void;
  onBgOpacity: (v: number) => void;
};

type ApiResult = {
  imagePrompt: string;
  imageDataUrl: string;
  provider: string;
  mood?: string;
  remaining?: number;
};

const CLIENT_KEY_STORAGE = "covercraft:client:v1";

function clientKey(): string {
  if (typeof window === "undefined") return "";
  try {
    let key = localStorage.getItem(CLIENT_KEY_STORAGE);
    if (!key) {
      key = crypto.randomUUID();
      localStorage.setItem(CLIENT_KEY_STORAGE, key);
    }
    return key;
  } catch {
    return "";
  }
}

export function AiCoverArtwork({ data, bgImage, bgOpacity, onBgImage, onBgOpacity }: Props) {
  const [prompt, setPrompt] = useState("");
  const [busy, setBusy] = useState(false);
  const [used, setUsed] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);
  const { settings } = useSiteSettings();
  const { user } = useAuth();
  const aiOff = settings ? !settings.ai_enabled : false;
  const dailyLimit = settings ? (user ? settings.ai_daily_limit_user : settings.ai_daily_limit_guest) : null;

  async function generate() {
    if (!data.assignmentTitle?.trim() || !data.subject?.trim()) {
      toast.error("Add an assignment title and subject first");
      return;
    }
    setBusy(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      const res = await fetch("/api/ai-cover-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          assignmentTitle: data.assignmentTitle,
          subject: data.subject,
          className: data.className ?? "",
          schoolName: data.schoolName ?? "",
          stylePreference: prompt,
          clientKey: clientKey(),
        }),
      });

      const payload = (await res.json().catch(() => null)) as (ApiResult & { error?: string }) | null;
      if (!res.ok || !payload?.imageDataUrl) {
        throw new Error(payload?.error || `Generation failed (${res.status})`);
      }

      onBgImage(payload.imageDataUrl);
      setUsed(payload.imagePrompt);
      if (typeof payload.remaining === "number") setRemaining(payload.remaining);
      toast.success("AI artwork applied to your cover");
    } catch (error) {
      toast.error("Couldn't generate artwork", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 font-serif text-lg">
          <ImagePlus className="h-5 w-5 text-accent" /> AI cover artwork
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">
            Your prompt (optional)
          </Label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder='e.g. "soft watercolour molecules in teal and cream, lots of empty space"'
            rows={3}
            maxLength={400}
            className="mt-1"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Your assignment details are refined into a detailed art prompt, then rendered as a
            text-free background image.
          </p>
        </div>

        {aiOff && (
          <p className="rounded-md border border-amber-500/40 bg-amber-500/5 p-2.5 text-xs text-amber-700 dark:text-amber-300">
            AI cover generation is paused right now. Please check back a little later.
          </p>
        )}

        <Button
          type="button"
          onClick={generate}
          disabled={busy || aiOff}
          className="w-full bg-gradient-hero text-white shadow-glow"
        >
          {busy ? (
            <><Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Generating artwork…</>
          ) : (
            <><Wand2 className="mr-1.5 h-4 w-4" /> Generate cover with AI</>
          )}
        </Button>

        <p className="text-center text-[11px] text-muted-foreground">
          {remaining !== null
            ? `${remaining} more AI cover${remaining === 1 ? "" : "s"} available today.`
            : dailyLimit !== null
              ? `Up to ${dailyLimit} AI covers per day${user ? "" : " for guests"}.`
              : null}
          {!user && (
            <>
              {" "}
              <Link to="/auth" className="underline underline-offset-2">
                Sign in
              </Link>{" "}
              for a higher daily allowance.
            </>
          )}
        </p>

        {busy && (
          <div className="space-y-2">
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full w-1/3 animate-pulse rounded-full bg-gradient-hero" />
            </div>
            <p className="text-xs text-muted-foreground">
              Writing the art prompt, then rendering the image. This usually takes 10–30 seconds.
            </p>
          </div>
        )}

        {bgImage && (
          <div className="space-y-3 rounded-lg border p-3">
            <img
              src={bgImage}
              alt="AI generated cover artwork preview"
              loading="lazy"
              className="mx-auto h-40 w-auto rounded-md border object-cover"
            />
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                Artwork strength · {Math.round(bgOpacity * 100)}%
              </Label>
              <Slider
                value={[Math.round(bgOpacity * 100)]}
                min={10}
                max={100}
                step={5}
                onValueChange={([v]) => onBgOpacity((v ?? 60) / 100)}
                className="mt-2"
              />
            </div>
            <Button type="button" variant="ghost" className="w-full" onClick={() => { onBgImage(null); setUsed(null); }}>
              <Trash2 className="mr-1.5 h-4 w-4" /> Remove artwork
            </Button>
          </div>
        )}

        {used && (
          <div className="rounded-lg border border-accent/40 bg-accent/5 p-3 text-xs text-foreground">
            <span className="font-medium">Prompt used: </span>
            {used}
          </div>
        )}
      </CardContent>
    </Card>
  );
}