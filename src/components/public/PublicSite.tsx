"use client";

import { useEffect } from "react";
import { Shield } from "lucide-react";
import { useNav, type Route } from "@/store/nav";
import { useI18n } from "@/store/i18n";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { HomePage } from "@/components/public/HomePage";
import { AboutPage } from "@/components/public/AboutPage";
import { ProductsPage } from "@/components/public/ProductsPage";
import { ProductDetailPage } from "@/components/public/ProductDetailPage";
import { SolutionsPage } from "@/components/public/SolutionsPage";
import { NewsPage } from "@/components/public/NewsPage";
import { ContactPage } from "@/components/public/ContactPage";
import { Button } from "@/components/ui/button";
import { usePages } from "@/components/public/hooks";
import { useSettings } from "@/components/public/hooks";
import { pick } from "@/lib/types";

/**
 * Public site SPA shell. Renders Header + the active view (by route.name) +
 * a sticky Footer. Includes a floating Admin button (bottom-right).
 *
 * The whole component is dynamically imported in src/app/page.tsx with
 * ssr:false so that all client-only Zustand/Query logic stays client-side.
 */
export function PublicSite() {
  const route = useNav((s) => s.route);
  const navToken = useNav((s) => s.navToken);
  const setAdminMode = useNav((s) => s.setAdminMode);
  const lang = useI18n((s) => s.lang);
  const { data: pages } = usePages();
  const { data: settings } = useSettings();

  // Scroll to top whenever the route changes.
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [navToken]);

  // Keep the document's lang attribute in sync with the UI language so screen
  // readers use the right voice profile (the SSR layout hardcodes "zh").
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang === "en" ? "en" : "zh-CN";
    }
  }, [lang]);

  // Dynamic browser tab title + favicon, both driven by admin-editable
  // SiteSetting (siteName + logo) and the current page's bilingual title.
  useEffect(() => {
    if (typeof document === "undefined") return;
    const slug = routeToSlug(route);
    const page = slug ? pages?.find((p) => p.slug === slug) : undefined;
    const pageTitle = page ? pick(page.titleEn, page.titleCn, lang) : null;
    const siteName =
      pick(settings?.siteNameEn, settings?.siteNameCn, lang) ?? "AudioCenter";
    document.title = pageTitle ? `${pageTitle} | ${siteName}` : siteName;

    // Favicon: prefer the admin-set logo, fall back to the default svg.
    const href = settings?.logo || "/logo.svg";
    let link = document.querySelector<HTMLLinkElement>("link[rel='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = href;
  }, [route, lang, pages, settings]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">{renderRoute(route)}</main>
      <Footer />

      {/* Floating Admin access button (subtle) */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setAdminMode(true)}
        className="fixed bottom-5 right-5 z-40 size-11 rounded-full border-border bg-background/80 backdrop-blur shadow-md hover:border-brand hover:text-brand"
        aria-label="Admin access"
        title="Admin"
      >
        <Shield className="size-4" />
      </Button>
    </div>
  );
}

function renderRoute(route: Route) {
  switch (route.name) {
    case "home":
      return <HomePage />;
    case "about":
      return <AboutPage />;
    case "products":
      return <ProductsPage categoryId={route.categoryId} />;
    case "product":
      return <ProductDetailPage id={route.id} />;
    case "solutions":
      return <SolutionsPage />;
    case "news":
      return <NewsPage />;
    case "contact":
      return <ContactPage />;
    default:
      return <HomePage />;
  }
}

/** Map the current SPA route to the site-page slug whose title drives <title>. */
function routeToSlug(route: Route): string | null {
  switch (route.name) {
    case "home":
      return "home";
    case "about":
      return "about";
    case "products":
    case "product":
      return "products";
    case "solutions":
      return "solutions";
    case "news":
      return "news";
    case "contact":
      return "contact";
    default:
      return null;
  }
}
