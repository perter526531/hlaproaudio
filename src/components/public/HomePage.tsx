"use client";

import { motion } from "framer-motion";
import { ArrowRight, Home, Mail, RotateCw, ShoppingBag } from "lucide-react";
import { useI18n } from "@/store/i18n";
import { useNav } from "@/store/nav";
import { usePage } from "@/components/public/hooks";
import { ContentBlock } from "@/components/public/ContentBlock";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { pick } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

export function HomePage() {
  const lang = useI18n((s) => s.lang);
  const go = useNav((s) => s.go);
  const { data: page, isLoading, isError, refetch } = usePage("home");

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

      {/* Page content blocks — the admin can edit every section below
          (features / stats / text / featured products / solution cards /
          CTA band) via PageManager. The home banner above is the page hero;
          "hero" blocks added by the admin render as full-width image
          sections mid-page. */}
      {page.contentBlocks.map((b) => (
        <ContentBlock key={b.id} block={b} />
      ))}
    </>
  );
}
