"use client";

import { useEffect } from "react";
import { Shield } from "lucide-react";
import { useNav, type Route } from "@/store/nav";
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

  // Scroll to top whenever the route changes.
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [navToken]);

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
