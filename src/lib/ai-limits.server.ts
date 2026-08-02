// Server-only: site settings lookup + daily AI quota accounting.
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export type AiGate =
  | { allowed: true; userId: string | null; clientKey: string; remaining: number }
  | { allowed: false; status: number; message: string };

function startOfDayIso(): string {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString();
}

async function resolveUser(request: Request): Promise<{ userId: string | null; blocked: boolean }> {
  const auth = request.headers.get("authorization");
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token || token.split(".").length !== 3) return { userId: null, blocked: false };
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user) return { userId: null, blocked: false };
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("blocked")
    .eq("id", data.user.id)
    .maybeSingle();
  return { userId: data.user.id, blocked: Boolean(profile?.blocked) };
}

export async function checkAiQuota(request: Request, clientKeyRaw: string): Promise<AiGate> {
  const clientKey =
    (clientKeyRaw || "").slice(0, 80) ||
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";

  const { data: settings } = await supabaseAdmin
    .from("site_settings")
    .select("ai_enabled, ai_daily_limit_user, ai_daily_limit_guest, maintenance_mode")
    .eq("id", true)
    .maybeSingle();

  if (settings?.maintenance_mode) {
    return { allowed: false, status: 503, message: "The site is in maintenance mode. Please try again shortly." };
  }
  if (settings && !settings.ai_enabled) {
    return { allowed: false, status: 503, message: "AI cover generation is currently turned off." };
  }

  const { userId, blocked } = await resolveUser(request);
  if (blocked) {
    return { allowed: false, status: 403, message: "This account cannot use AI generation." };
  }

  const limit = userId ? (settings?.ai_daily_limit_user ?? 20) : (settings?.ai_daily_limit_guest ?? 3);
  if (limit <= 0) {
    return { allowed: false, status: 429, message: "AI generation is not available for this account right now." };
  }

  let query = supabaseAdmin
    .from("ai_generations")
    .select("id", { count: "exact", head: true })
    .gte("created_at", startOfDayIso());
  query = userId ? query.eq("user_id", userId) : query.eq("client_key", clientKey).is("user_id", null);

  const { count } = await query;
  const used = count ?? 0;
  if (used >= limit) {
    return {
      allowed: false,
      status: 429,
      message: userId
        ? `You've reached today's limit of ${limit} AI covers. It resets tomorrow.`
        : `Guests can generate ${limit} AI covers per day. Sign in for a higher daily limit.`,
    };
  }

  return { allowed: true, userId, clientKey, remaining: limit - used - 1 };
}

export async function logAiGeneration(entry: {
  userId: string | null;
  clientKey: string;
  prompt?: string;
  provider?: string;
  success: boolean;
  error?: string;
}): Promise<void> {
  try {
    await supabaseAdmin.from("ai_generations").insert({
      user_id: entry.userId,
      client_key: entry.clientKey,
      prompt: entry.prompt?.slice(0, 600) ?? null,
      provider: entry.provider ?? null,
      success: entry.success,
      error: entry.error?.slice(0, 300) ?? null,
    });
  } catch (error) {
    console.error("[ai-limits] failed to log generation", error);
  }
}