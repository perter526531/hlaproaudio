"use client";

import { CalendarDays, ArrowRight, Home, RotateCw } from "lucide-react";
import { useI18n, tr } from "@/store/i18n";
import { useNav } from "@/store/nav";
import { usePage } from "@/components/public/hooks";
import { BannerSection } from "@/components/public/BannerSection";
import { ContentBlock } from "@/components/public/ContentBlock";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface NewsItem {
  titleEn: string;
  titleCn: string;
  excerptEn: string;
  excerptCn: string;
  dateEn: string;
  dateCn: string;
  tagEn: string;
  tagCn: string;
  image: string;
}

const NEWS: NewsItem[] = [
  {
    titleEn: "AudioCenter Showcases New Line Array at Prolight+Sound 2024",
    titleCn: "AudioCenter 在 2024 法兰克福展发布全新线阵列",
    excerptEn:
      "The VA-12 line array drew crowds with its punchy, musical sound and fast rigging hardware.",
    excerptCn:
      "全新 VA-12 线阵列凭借饱满悦耳的声音与便捷挂件硬件吸引大量观众。",
    dateEn: "Apr 15, 2024",
    dateCn: "2024年4月15日",
    tagEn: "Event",
    tagCn: "活动",
    image:
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/5614de08b729.jpg",
  },
  {
    titleEn: "VA-12 Line Array Now Shipping Worldwide",
    titleCn: "VA-12 线阵列全球同步发售",
    excerptEn:
      "Touring-grade output, 24-cabinet array capability and refined voicing are now available globally.",
    excerptCn:
      "巡演级输出、24只阵列规模与精细调校，全球同步发售。",
    dateEn: "Feb 28, 2024",
    dateCn: "2024年2月28日",
    tagEn: "Product",
    tagCn: "新品",
    image:
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/ab67df55ab17.jpg",
  },
  {
    titleEn: "Stadium Project in Southeast Asia Completed",
    titleCn: "东南亚某体育馆扩声项目顺利完成",
    excerptEn:
      "A multi-zone line array + column speaker solution delivered even coverage across the bowl.",
    excerptCn:
      "线阵列+柱式扬声器多分区方案，为整个场馆提供均匀覆盖。",
    dateEn: "Jan 10, 2024",
    dateCn: "2024年1月10日",
    tagEn: "Case Study",
    tagCn: "案例",
    image:
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/2e4e4b2e0ba0.jpg",
  },
];

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

  return (
    <>
      <BannerSection page={page} />
      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Admin-edited content blocks take precedence; fall back to the
              built-in sample news cards so a fresh install isn't empty. */}
          {page.contentBlocks?.length ? (
            <div className="space-y-12 md:space-y-16">
              {page.contentBlocks.map((b) => (
                <ContentBlock key={b.id} block={b} />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              {NEWS.map((n, i) => {
                const title = lang === "en" ? n.titleEn : n.titleCn;
                const excerpt = lang === "en" ? n.excerptEn : n.excerptCn;
                const date = lang === "en" ? n.dateEn : n.dateCn;
                const tag = lang === "en" ? n.tagEn : n.tagCn;
                return (
                  <article
                    key={i}
                    className="group rounded-xl border border-border bg-card overflow-hidden hover:border-brand transition-colors"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                      <img
                        src={n.image}
                        alt={title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.style.opacity = "0";
                        }}
                      />
                      <span className="absolute top-3 left-3 inline-flex items-center rounded-full bg-brand text-primary-foreground text-xs font-semibold px-2.5 py-1">
                        {tag}
                      </span>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CalendarDays className="size-3.5" />
                        {date}
                      </div>
                      <h3 className="mt-3 text-lg font-semibold leading-snug line-clamp-2">
                        {title}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                        {excerpt}
                      </p>
                    </div>
                  </article>
                );
              })}
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
