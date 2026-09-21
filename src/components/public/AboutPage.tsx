"use client";

import { useI18n, tr } from "@/store/i18n";
import { usePage } from "@/components/public/hooks";
import { BannerSection } from "@/components/public/BannerSection";
import { ContentBlock } from "@/components/public/ContentBlock";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNav } from "@/store/nav";
import { Home, Mail, RotateCw } from "lucide-react";
import { pick } from "@/lib/types";

export function AboutPage() {
  const lang = useI18n((s) => s.lang);
  const go = useNav((s) => s.go);
  const { data: page, isLoading, isError, refetch } = usePage("about");

  if (isLoading) {
    return (
      <div>
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
                ? "无法加载关于页内容，请稍后重试。"
                : "Couldn't load the about page content. Please try again."}
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

  return (
    <>
      <BannerSection page={page} />

      {/* Render all content blocks. Text+image blocks alternate via the block order. */}
      {page.contentBlocks.map((b, idx) => {
        // For text blocks with images, alternate the image side for visual rhythm.
        if (b.type === "text" && b.image) {
          const mirrored = idx % 2 === 1;
          return (
            <MirrorableTextBlock
              key={b.id}
              block={b}
              mirror={mirrored}
            />
          );
        }
        return <ContentBlock key={b.id} block={b} />;
      })}
    </>
  );
}

function MirrorableTextBlock({
  block,
  mirror,
}: {
  block: import("@/lib/types").ContentBlock;
  mirror: boolean;
}) {
  const lang = useI18n((s) => s.lang);
  const title = pick(block.titleEn, block.titleCn, lang);
  const content = pick(block.contentEn, block.contentCn, lang);
  return (
    <section className="py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={
            "grid md:grid-cols-2 gap-8 md:gap-12 items-center " +
            (mirror ? "md:[&>*:first-child]:order-2" : "")
          }
        >
          <div>
            {title ? (
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
                <span className="text-brand">{title}</span>
              </h2>
            ) : null}
            {content ? (
              <div className="text-muted-foreground text-base md:text-lg leading-relaxed whitespace-pre-line">
                {content}
              </div>
            ) : null}
          </div>
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-border bg-card">
            <img
              src={block.image ?? ""}
              alt={title ?? "section"}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
