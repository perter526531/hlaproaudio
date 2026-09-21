"use client";

import { motion } from "framer-motion";
import { ArrowRight, Home, Mail, RotateCw } from "lucide-react";
import { useI18n, tr } from "@/store/i18n";
import { useNav } from "@/store/nav";
import { usePage } from "@/components/public/hooks";
import { BannerSection } from "@/components/public/BannerSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { pick } from "@/lib/types";

export function SolutionsPage() {
  const lang = useI18n((s) => s.lang);
  const go = useNav((s) => s.go);
  const { data: page, isLoading, isError, refetch } = usePage("solutions");

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <p className="text-muted-foreground">
          {lang === "cn" ? "加载中…" : "Loading…"}
        </p>
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
                ? "无法加载解决方案页内容，请稍后重试。"
                : "Couldn't load the solutions page content. Please try again."}
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

  const blocks = page.contentBlocks;

  return (
    <>
      <BannerSection page={page} />

      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 md:space-y-20">
          {blocks.map((b, i) => {
            const title = pick(b.titleEn, b.titleCn, lang);
            const content = pick(b.contentEn, b.contentCn, lang);
            const mirror = i % 2 === 1;
            return (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={
                  "grid md:grid-cols-2 gap-8 md:gap-12 items-center " +
                  (mirror ? "md:[&>*:first-child]:order-2" : "")
                }
              >
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-border bg-card">
                  {b.image ? (
                    <img
                      src={b.image}
                      alt={title ?? "solution"}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-full w-full brand-gradient" />
                  )}
                  <div className="absolute top-4 left-4 inline-flex items-center justify-center size-9 rounded-full bg-background/80 text-brand">
                    <span className="text-sm font-bold">{i + 1}</span>
                  </div>
                </div>
                <div>
                  {title ? (
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
                      <span className="text-brand">{title}</span>
                    </h2>
                  ) : null}
                  {content ? (
                    <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                      {content}
                    </p>
                  ) : null}
                  <div className="mt-6">
                    <Button
                      variant="outline"
                      onClick={() => go({ name: "contact" })}
                    >
                      <Mail className="size-4" />
                      {tr("learn_more", lang)}
                      <ArrowRight className="size-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </>
  );
}
