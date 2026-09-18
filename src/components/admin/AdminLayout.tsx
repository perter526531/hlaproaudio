"use client";

import * as React from "react";
import {
  ExternalLink,
  FileText,
  FolderTree,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Settings as SettingsIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useI18n, tr, type TKey } from "@/store/i18n";
import type { AdminUser } from "./types";

export type AdminSection =
  | "dashboard"
  | "pages"
  | "categories"
  | "products"
  | "submissions"
  | "settings";

export interface AdminLayoutProps {
  active: AdminSection;
  onNavigate: (s: AdminSection) => void;
  user: AdminUser | null;
  onLogout: () => void;
  onViewSite: () => void;
  children: React.ReactNode;
}

interface NavItem {
  key: AdminSection;
  icon: React.ComponentType<{ className?: string }>;
  labelKey: TKey;
}

const NAV_ITEMS: NavItem[] = [
  { key: "dashboard", icon: LayoutDashboard, labelKey: "admin_dashboard" },
  { key: "pages", icon: FileText, labelKey: "admin_pages" },
  { key: "categories", icon: FolderTree, labelKey: "admin_categories" },
  { key: "products", icon: Package, labelKey: "admin_products" },
  { key: "submissions", icon: Inbox, labelKey: "admin_submissions" },
  { key: "settings", icon: SettingsIcon, labelKey: "admin_settings" },
];

export function AdminLayout({
  active,
  onNavigate,
  user,
  onLogout,
  onViewSite,
  children,
}: AdminLayoutProps) {
  const lang = useI18n((s) => s.lang);
  const toggle = useI18n((s) => s.toggle);
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);

  const currentTitle =
    NAV_ITEMS.find((n) => n.key === active)?.labelKey ?? "admin_dashboard";

  function go(s: AdminSection) {
    onNavigate(s);
    setMobileNavOpen(false);
  }

  const navList = (
    <nav className="flex flex-col gap-1 p-3">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = active === item.key;
        return (
          <button
            key={item.key}
            onClick={() => go(item.key)}
            className={cn(
              "group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all",
              isActive
                ? "bg-brand text-primary-foreground shadow-sm shadow-brand/30"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            <Icon
              className={cn(
                "size-4 shrink-0",
                !isActive && "text-muted-foreground group-hover:text-brand"
              )}
            />
            <span>{tr(item.labelKey, lang)}</span>
          </button>
        );
      })}
    </nav>
  );

  const brandHeader = (
    <div className="flex h-16 items-center gap-2 border-b border-border/60 px-5">
      <div className="flex size-8 items-center justify-center rounded-md bg-brand text-primary-foreground shadow-md shadow-brand/30">
        <span className="text-sm font-bold">A</span>
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-sm font-semibold tracking-tight">
          AUDIO<span className="text-brand">CENTER</span>
        </span>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
          {lang === "cn" ? "管理后台" : "Admin CMS"}
        </span>
      </div>
    </div>
  );

  const userBlock = (
    <div className="mt-auto border-t border-border/60 p-3">
      <div className="flex items-center gap-3 rounded-md bg-muted/40 px-3 py-2.5">
        <div className="flex size-8 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-foreground">
          {(user?.username ?? "A").slice(0, 1).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium">
            {user?.username ?? "admin"}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            {lang === "cn" ? "已登录" : "Signed in"}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border/60 bg-sidebar lg:flex">
        {brandHeader}
        {navList}
        {userBlock}
      </aside>

      {/* Mobile sidebar (Sheet) */}
      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-3 top-3 z-30 lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <SheetTitle className="sr-only">{tr("admin_dashboard", lang)}</SheetTitle>
          <div className="flex h-full flex-col">
            {brandHeader}
            <div className="flex-1 overflow-y-auto">
              <nav className="flex flex-col gap-1 p-3">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = active === item.key;
                  return (
                    <button
                      key={item.key}
                      onClick={() => go(item.key)}
                      className={cn(
                        "group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all",
                        isActive
                          ? "bg-brand text-primary-foreground shadow-sm shadow-brand/30"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      )}
                    >
                      <Icon
                        className={cn(
                          "size-4 shrink-0",
                          !isActive &&
                            "text-muted-foreground group-hover:text-brand"
                        )}
                      />
                      <span>{tr(item.labelKey, lang)}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
            {userBlock}
          </div>
        </SheetContent>
      </Sheet>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border/60 bg-background/85 px-4 backdrop-blur-md lg:px-6 pl-16 lg:pl-6">
          <h1 className="truncate text-lg font-semibold tracking-tight">
            {tr(currentTitle, lang)}
          </h1>

          <div className="ml-auto flex items-center gap-1.5">
            {/* Lang toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggle}
              className="gap-1 px-2 py-1 text-xs font-semibold"
              aria-label="Toggle language"
            >
              <span className={cn(lang === "en" && "text-brand")}>EN</span>
              <span className="text-muted-foreground/50">|</span>
              <span className={cn(lang === "cn" && "text-brand")}>中文</span>
            </Button>

            {/* View site */}
            <Button
              variant="outline"
              size="sm"
              onClick={onViewSite}
              className="gap-2"
            >
              <ExternalLink className="size-4" />
              <span className="hidden sm:inline">{tr("admin_back_site", lang)}</span>
            </Button>

            {/* Logout */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <LogOut className="size-4" />
              <span className="hidden sm:inline">{tr("admin_logout", lang)}</span>
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden px-4 py-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
