import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";

export type SiteSettings = {
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

export function useSiteSettings() {
  const query = useQuery({
    queryKey: ["site-settings"],
    staleTime: 60_000,
    queryFn: async (): Promise<SiteSettings | null> => {
      const { data } = await supabase
        .from("site_settings")
        .select(
          "site_name, tagline, announcement, announcement_enabled, maintenance_mode, signups_enabled, ai_enabled, ai_daily_limit_user, ai_daily_limit_guest",
        )
        .eq("id", true)
        .maybeSingle();
      return (data as SiteSettings) ?? null;
    },
  });

  return { settings: query.data ?? null, loading: query.isLoading };
}