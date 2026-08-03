import { Link, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  GraduationCap,
  LayoutTemplate,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  PencilRuler,
  Settings as SettingsIcon,
  Shield,
  Sparkles,
  User as UserIcon,
} from "lucide-react";
import { useState, type ReactNode } from "react";

import { AccountMenu } from "@/components/AccountMenu";
import { LanguageSelector } from "@/components/LanguageSelector";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import { usePrefs } from "@/lib/prefs";
import { cn } from "@/lib/utils";

type NavItem = {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean;
};

const NAV: NavItem[] = [
  { to: "/create", label: "Create", icon: PencilRuler },
  { to: "/templates", label: "Templates", icon: LayoutTemplate },
  { to: "/dashboard", label: "Insights", icon: BarChart3 },
  { to: "/profile", label: "Profile", icon: UserIcon },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
  { to: "/admin", label: "Admin", icon: Shield, adminOnly: true },
];

/** Bottom tab bar shows the 4 most-used destinations on small screens. */
const MOBILE_TABS = ["/create", "/templates", "/dashboard", "/settings"];

function useNav() {
  const { isAdmin } = useAuth();
  return NAV.filter((item) => !item.adminOnly || isAdmin);
}

function Brand({ collapsed }: { collapsed?: boolean }) {
  return (
    <Link to="/" className="flex min-w-0 items-center gap-2" aria-label="CoverCraft home">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-hero text-white shadow-glow">
        <GraduationCap className="h-5 w-5" />
      </span>
      {!collapsed && (
        <span className="truncate font-serif text-lg font-bold tracking-tight">CoverCraft</span>
      )}
    </Link>
  );
}

function NavLinks({
  collapsed,
  onNavigate,
  pathname,
}: {
  collapsed: boolean;
  onNavigate?: () => void;
  pathname: string;
}) {
  const items = useNav();
  return (
    <nav className="flex flex-col gap-1" aria-label="Main">
      {items.map((item) => {
        const active = pathname === item.to || pathname.startsWith(`${item.to}/`);
        const link = (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors",
              collapsed && "justify-center px-0",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
            )}
          >
            <item.icon className={cn("h-[18px] w-[18px] shrink-0", active && "text-primary")} />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </Link>
        );
        if (!collapsed) return link;
        return (
          <Tooltip key={item.to}>
            <TooltipTrigger asChild>{link}</TooltipTrigger>
            <TooltipContent side="right">{item.label}</TooltipContent>
          </Tooltip>
        );
      })}
    </nav>
  );
}

export function AppShell({
  title,
  description,
  actions,
  children,
  contentClassName,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  contentClassName?: string;
}) {
  const { prefs, setPrefs } = usePrefs();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const collapsed = prefs.sidebarCollapsed;
  const items = useNav();

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex min-h-dvh w-full bg-background text-foreground">
        {/* Desktop sidebar */}
        <aside
          className={cn(
            "sticky top-0 hidden h-dvh shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-200 lg:flex",
            collapsed ? "w-[72px]" : "w-[248px]",
          )}
        >
          <div
            className={cn(
              "flex h-16 items-center border-b border-sidebar-border px-3",
              collapsed ? "justify-center" : "justify-between",
            )}
          >
            <Brand collapsed={collapsed} />
          </div>
          <div className="flex-1 overflow-y-auto p-3">
            <NavLinks collapsed={collapsed} pathname={pathname} />
          </div>
          <div className="border-t border-sidebar-border p-3">
            <Button
              variant="ghost"
              size="sm"
              className={cn("w-full justify-start gap-2 text-muted-foreground", collapsed && "justify-center")}
              onClick={() => setPrefs({ sidebarCollapsed: !collapsed })}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
              {!collapsed && <span>Collapse</span>}
            </Button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          {/* Top bar */}
          <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-3 py-2.5 sm:px-5">
              <div className="flex min-w-0 items-center gap-2">
                {/* Mobile menu */}
                <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="min-h-11 min-w-11 lg:hidden"
                      aria-label="Open navigation"
                    >
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[264px] bg-sidebar p-0">
                    <div className="flex h-16 items-center border-b border-sidebar-border px-4">
                      <SheetTitle className="sr-only">Navigation</SheetTitle>
                      <Brand />
                    </div>
                    <div className="p-3">
                      <NavLinks collapsed={false} pathname={pathname} onNavigate={() => setMobileOpen(false)} />
                    </div>
                  </SheetContent>
                </Sheet>
                <div className="min-w-0">
                  <h1 className="truncate font-serif text-base font-bold tracking-tight sm:text-lg">
                    {title}
                  </h1>
                  {description && (
                    <p className="hidden truncate text-xs text-muted-foreground sm:block">{description}</p>
                  )}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                {actions}
                <LanguageSelector />
                <ThemeToggle />
                <AccountMenu />
              </div>
            </div>
          </header>

          <main className={cn("min-w-0 flex-1 px-3 pb-24 pt-4 sm:px-5 lg:pb-10", contentClassName)}>
            {children}
          </main>
        </div>

        {/* Mobile bottom tabs */}
        <nav
          className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
          aria-label="Quick navigation"
        >
          <ul className="grid grid-cols-4">
            {MOBILE_TABS.map((to) => {
              const item = items.find((n) => n.to === to);
              if (!item) return null;
              const active = pathname === item.to;
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex min-h-[56px] flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors",
                      active ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </TooltipProvider>
  );
}

/** Small helper for consistent page section headers inside the shell. */
export function PageSection({
  title,
  description,
  children,
  actions,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <section className="space-y-4">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <div className="min-w-0">
          <h2 className="flex items-center gap-2 truncate font-serif text-xl font-bold">
            <Sparkles className="h-4 w-4 shrink-0 text-accent" />
            {title}
          </h2>
          {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
        </div>
        {actions}
      </header>
      {children}
    </section>
  );
}
