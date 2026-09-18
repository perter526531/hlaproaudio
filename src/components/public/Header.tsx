"use client";

import { useState } from "react";
import { Menu, Shield, Volume2 } from "lucide-react";
import { useI18n, tr, type TKey } from "@/store/i18n";
import { useNav, type Route } from "@/store/nav";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface NavItem {
  key: TKey;
  route: Route;
}

const NAV_ITEMS: NavItem[] = [
  { key: "nav_home", route: { name: "home" } },
  { key: "nav_about", route: { name: "about" } },
  { key: "nav_products", route: { name: "products" } },
  { key: "nav_solutions", route: { name: "solutions" } },
  { key: "nav_news", route: { name: "news" } },
  { key: "nav_contact", route: { name: "contact" } },
];

/** Top navigation header. Sticky with backdrop blur. Mobile collapses to Sheet. */
export function Header() {
  const lang = useI18n((s) => s.lang);
  const toggle = useI18n((s) => s.toggle);
  const route = useNav((s) => s.route);
  const go = useNav((s) => s.go);
  const setAdminMode = useNav((s) => s.setAdminMode);
  const [open, setOpen] = useState(false);

  const isActive = (item: NavItem) =>
    route.name === item.route.name &&
    // products page also matches "product" detail view (highlight the parent)
    (item.route.name !== "products" || route.name !== "product");

  // For "product" detail view, highlight "Products".
  const isProductsActive =
    route.name === "products" || route.name === "product";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <button
            onClick={() => go({ name: "home" })}
            className="flex items-center gap-2 shrink-0 group"
            aria-label="AudioCenter home"
          >
            <span className="inline-flex items-center justify-center size-9 rounded-md brand-gradient text-primary-foreground">
              <Volume2 className="size-5" />
            </span>
            <span className="font-bold tracking-widest text-base sm:text-lg">
              AUDIO<span className="text-brand">CENTER</span>
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Primary">
            {NAV_ITEMS.map((item) => {
              const active =
                item.route.name === "products"
                  ? isProductsActive
                  : isActive(item);
              return (
                <button
                  key={item.key}
                  onClick={() => go(item.route)}
                  className={cn(
                    "relative px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    "hover:text-foreground hover:bg-accent/60 min-h-11",
                    active ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {tr(item.key, lang)}
                  {active ? (
                    <span className="absolute left-3 right-3 -bottom-px h-0.5 bg-brand rounded-full" />
                  ) : null}
                </button>
              );
            })}
          </nav>

          {/* Right: language toggle + admin */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={toggle}
              className="inline-flex items-center h-9 px-3 rounded-full border border-border text-xs font-semibold hover:border-brand hover:text-brand transition-colors"
              aria-label="Toggle language"
            >
              {lang === "en" ? "EN" : "中"}
              <span className="mx-1 text-muted-foreground/60">/</span>
              <span className="text-muted-foreground/70">
                {lang === "en" ? "中" : "EN"}
              </span>
            </button>
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:inline-flex h-9"
              onClick={() => setAdminMode(true)}
            >
              <Shield className="size-4" />
              {tr("nav_admin", lang)}
            </Button>

            {/* Mobile hamburger */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden size-10"
                  aria-label="Open menu"
                >
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:max-w-sm">
                <SheetHeader className="pr-8">
                  <SheetTitle className="flex items-center gap-2">
                    <Volume2 className="size-5 text-brand" />
                    AUDIO<span className="text-brand">CENTER</span>
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-1 px-2" aria-label="Mobile">
                  {NAV_ITEMS.map((item) => {
                    const active =
                      item.route.name === "products"
                        ? isProductsActive
                        : isActive(item);
                    return (
                      <button
                        key={item.key}
                        onClick={() => {
                          go(item.route);
                          setOpen(false);
                        }}
                        className={cn(
                          "text-left px-3 py-3 rounded-md text-sm font-medium min-h-11",
                          active
                            ? "bg-accent text-foreground border-l-2 border-brand"
                            : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                        )}
                      >
                        {tr(item.key, lang)}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => {
                      setAdminMode(true);
                      setOpen(false);
                    }}
                    className="text-left px-3 py-3 rounded-md text-sm font-medium min-h-11 text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Shield className="size-4" />
                      {tr("nav_admin", lang)}
                    </span>
                  </button>
                </nav>
                <div className="mt-auto p-4 border-t border-border">
                  <button
                    onClick={toggle}
                    className="w-full inline-flex items-center justify-center h-10 rounded-full border border-border text-sm font-semibold hover:border-brand hover:text-brand transition-colors"
                  >
                    {lang === "en" ? "Switch to 中文" : "Switch to English"}
                  </button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
