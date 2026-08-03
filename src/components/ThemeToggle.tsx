import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePrefs, type ThemeChoice } from "@/lib/prefs";
import { cn } from "@/lib/utils";

const OPTIONS: { value: ThemeChoice; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

export function ThemeToggle() {
  const { prefs, setPrefs } = usePrefs();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = mounted ? resolvedTheme === "dark" : false;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="min-h-11 min-w-11" aria-label="Change theme">
          <Sun className={cn("h-5 w-5 transition-all", isDark && "-rotate-90 scale-0")} />
          <Moon className={cn("absolute h-5 w-5 rotate-90 scale-0 transition-all", isDark && "rotate-0 scale-100")} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {OPTIONS.map((o) => (
          <DropdownMenuItem
            key={o.value}
            onClick={() => setPrefs({ theme: o.value })}
            className={cn(mounted && prefs.theme === o.value && "font-semibold text-primary")}
          >
            <o.icon className="mr-2 h-4 w-4" /> {o.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
