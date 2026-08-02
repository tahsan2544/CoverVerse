import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const SettingsSchema = z.object({
  site_name: z.string().trim().min(1).max(60),
  tagline: z.string().trim().max(200),
  announcement: z.string().trim().max(400),
  announcement_enabled: z.boolean(),
  maintenance_mode: z.boolean(),
  signups_enabled: z.boolean(),
  ai_enabled: z.boolean(),
  ai_daily_limit_user: z.number().int().min(0).max(1000),
  ai_daily_limit_guest: z.number().int().min(0).max(1000),
});

async function assertAdmin(context: { supabase: any; userId: string }) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error || !data) throw new Error("Forbidden");
}

export const getAdminOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const since = new Date(Date.now() - 29 * 86_400_000).toISOString();
    const [settings, users, gens, recent] = await Promise.all([
      supabaseAdmin.from("site_settings").select("*").eq("id", true).maybeSingle(),
      supabaseAdmin
        .from("profiles")
        .select("id, email, display_name, blocked, created_at, last_seen_at")
        .order("created_at", { ascending: false })
        .limit(200),
      supabaseAdmin.from("ai_generations").select("id, success, created_at").gte("created_at", since),
      supabaseAdmin
        .from("ai_generations")
        .select("id, user_id, provider, success, error, prompt, created_at")
        .order("created_at", { ascending: false })
        .limit(25),
    ]);

    const { data: adminRoles } = await supabaseAdmin.from("user_roles").select("user_id").eq("role", "admin");
    const adminIds = new Set((adminRoles ?? []).map((r) => r.user_id));

    const events = gens.data ?? [];
    const byDay = new Map<string, number>();
    for (const e of events) {
      const day = e.created_at.slice(0, 10);
      byDay.set(day, (byDay.get(day) ?? 0) + 1);
    }
    const days = Array.from({ length: 30 }, (_, i) => {
      const d = new Date(Date.now() - (29 - i) * 86_400_000).toISOString().slice(0, 10);
      return { day: d, count: byDay.get(d) ?? 0 };
    });

    const today = new Date().toISOString().slice(0, 10);

    return {
      settings: settings.data,
      users: (users.data ?? []).map((u) => ({ ...u, isAdmin: adminIds.has(u.id) })),
      stats: {
        totalUsers: users.data?.length ?? 0,
        aiTotal: events.length,
        aiFailed: events.filter((e) => !e.success).length,
        aiToday: events.filter((e) => e.created_at.slice(0, 10) === today).length,
      },
      days,
      recent: recent.data ?? [],
    };
  });

export const updateSiteSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => SettingsSchema.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("site_settings").update(data).eq("id", true);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const setUserBlocked = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ userId: z.string().uuid(), blocked: z.boolean() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context as any);
    if (data.userId === context.userId) throw new Error("You cannot block your own account");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("profiles").update({ blocked: data.blocked }).eq("id", data.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const setUserAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ userId: z.string().uuid(), admin: z.boolean() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context as any);
    if (data.userId === context.userId) throw new Error("You cannot change your own admin access");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    if (data.admin) {
      const { error } = await supabaseAdmin
        .from("user_roles")
        .upsert({ user_id: data.userId, role: "admin" }, { onConflict: "user_id,role" });
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabaseAdmin
        .from("user_roles")
        .delete()
        .eq("user_id", data.userId)
        .eq("role", "admin");
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

export const deleteUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ userId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as any);
    if (data.userId === context.userId) throw new Error("You cannot delete your own account");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.auth.admin.deleteUser(data.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });