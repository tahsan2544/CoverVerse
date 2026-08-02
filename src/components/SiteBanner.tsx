import { useSiteSettings } from "@/hooks/use-site-settings";
import { Megaphone } from "lucide-react";

export function SiteBanner() {
  const { settings } = useSiteSettings();
  if (!settings?.announcement_enabled || !settings.announcement.trim()) return null;
  return (
    <div className="bg-gradient-hero px-4 py-2 text-center text-sm text-white">
      <span className="inline-flex items-center gap-2">
        <Megaphone className="h-4 w-4" />
        {settings.announcement}
      </span>
    </div>
  );
}