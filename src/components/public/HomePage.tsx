"use client";

import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, Home, Mail, RotateCw, ShoppingBag } from "lucide-react";
import { useI18n, tr } from "@/store/i18n";
import { useNav } from "@/store/nav";
import {
  usePage,
  useProducts,
  useCategories,
} from "@/components/public/hooks";
import { BannerSection } from "@/components/public/BannerSection";
import { ContentBlock } from "@/components/public/ContentBlock";
import { ProductCard } from "@/components/public/ProductCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { pick } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

export function HomePage() {
  const lang = useI18n((s) => s.lang);
  const go = useNav((s) => s.go);
  const { data: page, isLoading, isError, refetch } = usePage("home");
  const { data: featured, isLoading: featuredLoading } = useProducts({
    featured: true,
    status: "listed",
  });
  const { data: categories } = useCategories();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[55vh] w-full rounded-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-4">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-24 px-4">
        <Card className="max-w-md w-full text-center border-border/60">
          <CardHeader>
            <CardTitle className="text-xl">
              {lang === "cn" ? "加载失败" : "Load failed"}
            </CardTitle>
            <CardDescription>
              {lang === "cn"
                ? "无法加载首页内容，请稍后重试。"
                : "Couldn't load the home page content. Please try again."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => refetch()}>
              <RotateCw className="size-4" />
              {lang === "cn" ? "重试" : "Retry"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="flex items-center justify-center py-24 px-4">
        <Card className="max-w-md w-full text-center border-border/60">
          <CardHeader>
            <CardTitle className="text-xl">
              {lang === "cn" ? "页面不存在" : "Page not found"}
            </CardTitle>
            <CardDescription>
              {lang === "cn"
                ? "您访问的页面不存在或已被移除。"
                : "The page you are looking for does not exist."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="brand-gradient text-primary-foreground" onClick={() => go({ name: "home" })}>
              <Home className="size-4" />
              {lang === "cn" ? "返回首页" : "Go Home"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // The home page banner doubles as a hero with CTAs.
  const heroTitle = pick(page.bannerTitleEn, page.bannerTitleCn, lang);
  const heroSub = pick(page.bannerSubEn, page.bannerSubCn, lang);

  const featuredList = (featured ?? []).slice(0, 4);
  const topCategories = (categories ?? []).slice(0, 4);

  return (
    <>
      {/* Hero with CTA buttons */}
      <section className="relative w-full h-[60vh] min-h-[420px] overflow-hidden bg-muted">
        {page.bannerImage ? (
          <img
            src={page.bannerImage}
            alt={heroTitle ?? "home"}
            className="absolute inset-0 h-full w-full object-cover"
            loading="eager"
          />
        ) : null}
        <div className="absolute inset-0 hero-overlay-r" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-background" />
        <div className="relative h-full w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-3xl"
          >
            {heroTitle ? (
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight text-white tracking-tight">
                {heroTitle}
              </h1>
            ) : null}
            {heroSub ? (
              <p className="mt-5 md:mt-7 text-base md:text-lg text-white/80 max-w-xl">
                {heroSub}
              </p>
            ) : null}
            <div className="mt-7 md:mt-9 flex flex-wrap gap-3">
              <Button
                size="lg"
                className="brand-gradient text-primary-foreground"
                onClick={() => go({ name: "products" })}
              >
                <ShoppingBag className="size-4" />
                {lang === "en" ? "View Products" : "查看产品"}
                <ArrowRight className="size-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 text-white border-white/50 hover:bg-white/20 hover:text-white"
                onClick={() => go({ name: "contact" })}
              >
                <Mail className="size-4" />
                {lang === "en" ? "Contact Us" : "联系我们"}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Page content blocks (all types render; the home hero above is the
          page banner, "hero" blocks here are full-width image sections the
          admin can add mid-page) */}
      {page.contentBlocks.map((b) => (
        <ContentBlock key={b.id} block={b} />
      ))}

      {/* Featured Products */}
      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-brand text-sm font-semibold tracking-wider uppercase mb-1">
                {tr("featured_products", lang)}
              </p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                {lang === "en" ? "Star Products" : "明星产品"}
              </h2>
            </div>
            <button
              onClick={() => go({ name: "products" })}
              className="hidden sm:inline-flex items-center text-sm text-muted-foreground hover:text-brand transition-colors"
            >
              {tr("all_products", lang)}
              <ChevronRight className="size-4" />
            </button>
          </div>

          {featuredLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[4/3] rounded-xl" />
              ))}
            </div>
          ) : featuredList.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {featuredList.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              {lang === "en" ? "No products yet." : "暂无产品。"}
            </p>
          )}
        </div>
      </section>

      {/* Solutions teaser strip */}
      <section className="py-12 md:py-20 bg-card/40 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-brand text-sm font-semibold tracking-wider uppercase mb-1">
              {tr("nav_solutions", lang)}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              {lang === "en" ? "Where We Help" : "应用领域"}
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {topCategories.map((c, i) => (
              <motion.button
                key={c.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                onClick={() => go({ name: "solutions" })}
                className="group relative aspect-[4/5] sm:aspect-[3/4] rounded-xl overflow-hidden border border-border hover:border-brand transition-colors"
              >
                <div className="absolute inset-0 brand-gradient opacity-90" />
                <div className="relative h-full p-4 sm:p-5 flex flex-col justify-end text-left">
                  <h3 className="text-base sm:text-lg font-semibold text-white">
                    {pick(c.nameEn, c.nameCn, lang)}
                  </h3>
                  <span className="mt-1 inline-flex items-center text-xs text-white/80 group-hover:text-white">
                    {tr("learn_more", lang)}
                    <ChevronRight className="size-3" />
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              {lang === "en" ? (
                <>Let&apos;s build your next sound system.</>
              ) : (
                <>让我们一起打造下一套声音系统。</>
              )}
            </h2>
            <p className="mt-4 text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
              {lang === "en"
                ? "Tell us about your venue, audience and budget — we'll propose the right system."
                : "告诉我们您的场馆、听众和预算，我们会为您推荐最合适的方案。"}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button
                size="lg"
                className="brand-gradient text-primary-foreground"
                onClick={() => go({ name: "contact" })}
              >
                <Mail className="size-4" />
                {tr("nav_contact", lang)}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => go({ name: "products" })}
              >
                <ShoppingBag className="size-4" />
                {tr("all_products", lang)}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
