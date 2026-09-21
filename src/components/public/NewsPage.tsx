"use client";

import { ArrowRight, Home, RotateCw } from "lucide-react";
import { useI18n, tr } from "@/store/i18n";
import { useNav } from "@/store/nav";
import { usePage } from "@/components/public/hooks";
import { BannerSection } from "@/components/public/BannerSection";
import { ContentBlock } from "@/components/public/ContentBlock";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function NewsPage() {
  const lang = useI18n((s) => s.lang);
  const go = useNav((s) => s.go);
  const { data: page, isLoading, isError, refetch } = usePage("news");

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
                ? "无法加载新闻页内容，请稍后重试。"
                : "Couldn't load the news page content. Please try again."}
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

  const blocks = page.contentBlocks ?? [];

  return (
    <>
      <BannerSection page={page} />
      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {blocks.length ? (
            <div className="space-y-12 md:space-y-16">
              {blocks.map((b) => (
                <ContentBlock key={b.id} block={b} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-muted-foreground">
              <p className="text-sm">
                {lang === "cn" ? "暂无新闻" : "No news yet"}
              </p>
            </div>
          )}

          <div className="mt-12 text-center">
            <Button
              variant="outline"
              size="lg"
              onClick={() => go({ name: "contact" })}
            >
              {tr("nav_contact", lang)}
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
