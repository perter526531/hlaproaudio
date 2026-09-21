"use client";

import { motion } from "framer-motion";
import {
  Award,
  Cpu,
  Globe2,
  Factory,
  Microscope,
  Headphones,
  ChevronRight,
  Mail,
  ShoppingBag,
  CalendarDays,
} from "lucide-react";
import { useI18n, tr } from "@/store/i18n";
import { useNav } from "@/store/nav";
import { useProducts, useCategories } from "@/components/public/hooks";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/public/ProductCard";
import { pick, type ContentBlock as ContentBlockType } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Safely parse a JSON string into an array. Returns null if parsing fails or
 * the result is not an array. Used by stats / features blocks to read their
 * structured bilingual payload from `contentEn`.
 */
function parseJsonArray<T>(raw: string | null | undefined): T[] | null {
  try {
    const a = JSON.parse(raw ?? "");
    return Array.isArray(a) ? a : null;
  } catch {
    return null;
  }
}

/**
 * Renders a single content block based on its type. Bilingual fields are
 * picked from `lang`. Used by HomePage / AboutPage / SolutionsPage / etc.
 */
export function ContentBlock({ block }: { block: ContentBlockType }) {
  const lang = useI18n((s) => s.lang);
  const title = pick(block.titleEn, block.titleCn, lang);
  const content = pick(block.contentEn, block.contentCn, lang);

  // The DB stores block.type as a plain string; the admin can save blocks of
  // types beyond the public BlockType union (featured / solution-cards / cta /
  // news-list). Widen here so the switch can match those cases without TS
  // narrowing errors.
  const t = block.type as
    | ContentBlockType["type"]
    | "featured"
    | "solution-cards"
    | "cta"
    | "news-list";

  switch (t) {
    case "hero":
      return <HeroBlock image={block.image} title={title} content={content} />;
    case "text":
      return <TextBlock title={title} content={content} image={block.image} />;
    case "image":
      return <ImageBlock image={block.image} content={content} title={title} />;
    case "features":
      return <FeaturesBlock title={title} contentEn={block.contentEn} />;
    case "stats":
      return <StatsBlock title={title} contentEn={block.contentEn} />;
    case "quote":
      return <QuoteBlock content={content} title={title} />;
    case "featured":
      return <FeaturedBlock title={title} content={content} />;
    case "solution-cards":
      return <SolutionCardsBlock title={title} content={content} />;
    case "cta":
      return <CtaBlock title={title} content={content} />;
    case "news-list":
      return <NewsListBlock contentEn={block.contentEn} />;
    default:
      return null;
  }
}

function BlockWrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn("py-12 md:py-20", className)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
    </motion.section>
  );
}

function HeroBlock({
  image,
  title,
  content,
}: {
  image: string | null;
  title: string | null;
  content: string | null;
}) {
  return (
    <section className="relative w-full h-[60vh] min-h-[360px] overflow-hidden bg-muted">
      {image ? (
        <img
          src={image}
          alt={title ?? "hero"}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.opacity = "0";
          }}
        />
      ) : null}
      <div className="absolute inset-0 hero-overlay" />
      <div className="relative h-full w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-3xl"
        >
          {title ? (
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
              {title}
            </h2>
          ) : null}
          {content ? (
            <p className="mt-4 md:mt-6 text-base md:text-lg text-white/80">
              {content}
            </p>
          ) : null}
        </motion.div>
      </div>
    </section>
  );
}

function TextBlock({
  title,
  content,
  image,
}: {
  title: string | null;
  content: string | null;
  image: string | null;
}) {
  if (image) {
    // Two-column text + image layout, alternating helps callers stack nicely.
    return (
      <BlockWrapper>
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
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
              src={image}
              alt={title ?? "section"}
              className="h-full w-full object-cover"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.opacity = "0";
              }}
            />
          </div>
        </div>
      </BlockWrapper>
    );
  }
  return (
    <BlockWrapper>
      <div className="max-w-3xl mx-auto text-center">
        {title ? (
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
            <span className="text-brand">{title}</span>
          </h2>
        ) : null}
        {content ? (
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed whitespace-pre-line">
            {content}
          </p>
        ) : null}
      </div>
    </BlockWrapper>
  );
}

function ImageBlock({
  image,
  content,
  title,
}: {
  image: string | null;
  content: string | null;
  title: string | null;
}) {
  return (
    <BlockWrapper>
      <figure className="relative w-full rounded-xl overflow-hidden border border-border bg-card">
        {image ? (
          <img
            src={image}
            alt={title ?? "image"}
            className="w-full h-auto object-cover max-h-[70vh]"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.opacity = "0";
            }}
          />
        ) : null}
        {content ? (
          <figcaption className="px-4 py-3 text-sm text-muted-foreground text-center">
            {content}
          </figcaption>
        ) : null}
      </figure>
    </BlockWrapper>
  );
}

interface Feature {
  // icon is unused at render time (the icons array maps by index); kept for
  // backward-compat with DEFAULT_FEATURES.
  icon?: React.ReactNode;
  titleEn: string;
  titleCn: string;
  descEn: string;
  descCn: string;
}

export const DEFAULT_FEATURES: Feature[] = [
  {
    icon: <Microscope className="size-7" />,
    titleEn: "R&D Innovation",
    titleCn: "研发创新",
    descEn: "An in-house R&D team driving continuous acoustic and electronic innovation.",
    descCn: "内部研发团队，持续推动声学与电子技术创新。",
  },
  {
    icon: <Factory className="size-7" />,
    titleEn: "Precision Manufacturing",
    titleCn: "精密制造",
    descEn: "30,000m² facility with 100% product aging and Klippel measurement.",
    descCn: "30,000平方米生产基地，100%出厂老化测试与Klippel测量。",
  },
  {
    icon: <Globe2 className="size-7" />,
    titleEn: "Global Support",
    titleCn: "全球服务",
    descEn: "Service network across 80+ countries with rapid response.",
    descCn: "服务网络覆盖80+国家，快速响应。",
  },
];

function FeaturesBlock({
  title,
  contentEn,
}: {
  title: string | null;
  contentEn: string | null;
}) {
  const lang = useI18n((s) => s.lang);
  // Parse contentEn as a JSON array of bilingual feature objects. If parsing
  // fails OR the array is empty (e.g. old `|`-split text or plain text), fall
  // back to DEFAULT_FEATURES so the public site never breaks.
  const parsed = parseJsonArray<{
    titleEn?: string;
    titleCn?: string;
    descEn?: string;
    descCn?: string;
  }>(contentEn);
  let features: Feature[] = DEFAULT_FEATURES;
  if (parsed && parsed.length > 0) {
    features = parsed.slice(0, 4).map((f) => ({
      titleEn: typeof f.titleEn === "string" ? f.titleEn : "",
      titleCn: typeof f.titleCn === "string" ? f.titleCn : "",
      descEn: typeof f.descEn === "string" ? f.descEn : "",
      descCn: typeof f.descCn === "string" ? f.descCn : "",
    }));
  }
  const icons = [Cpu, Award, Globe2, Headphones];
  return (
    <BlockWrapper className="bg-card/40">
      {title ? (
        <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-center mb-10">
          <span className="text-brand">{title}</span>
        </h2>
      ) : null}
      <div className="grid sm:grid-cols-3 gap-6">
        {features.slice(0, 4).map((f, i) => {
          const Icon = icons[i % icons.length];
          const t = pick(f.titleEn, f.titleCn, lang) ?? "";
          const d = pick(f.descEn, f.descCn, lang) ?? "";
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="group relative rounded-xl border border-border bg-card p-6 hover:border-brand transition-colors"
            >
              <div className="mb-4 inline-flex items-center justify-center size-12 rounded-lg brand-gradient text-white">
                <Icon className="size-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{d}</p>
            </motion.div>
          );
        })}
      </div>
    </BlockWrapper>
  );
}

export const STATS: { value: string; labelEn: string; labelCn: string }[] = [
  { value: "20+", labelEn: "Years of Innovation", labelCn: "年声学创新" },
  { value: "80+", labelEn: "Countries Served", labelCn: "服务国家" },
  { value: "50+", labelEn: "R&D Engineers", labelCn: "研发工程师" },
  { value: "30,000m²", labelEn: "Manufacturing Base", labelCn: "生产基地" },
];

function StatsBlock({
  title,
  contentEn,
}: {
  title: string | null;
  contentEn: string | null;
}) {
  const lang = useI18n((s) => s.lang);
  // Parse contentEn as a JSON array of { value, labelEn, labelCn } items.
  // If parsing fails OR the array is empty, fall back to the STATS constant.
  const parsed = parseJsonArray<{
    value?: string;
    labelEn?: string;
    labelCn?: string;
  }>(contentEn);
  const stats =
    parsed && parsed.length > 0
      ? parsed.slice(0, 6).map((s) => ({
          value: typeof s.value === "string" ? s.value : "",
          labelEn: typeof s.labelEn === "string" ? s.labelEn : "",
          labelCn: typeof s.labelCn === "string" ? s.labelCn : "",
        }))
      : STATS;
  return (
    <section className="relative py-12 md:py-16 brand-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {title ? (
          <h2 className="text-center text-2xl md:text-3xl font-bold text-white mb-8">
            {title}
          </h2>
        ) : null}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => {
            const label = pick(s.labelEn, s.labelCn, lang) ?? "";
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                  {s.value}
                </div>
                <div className="mt-2 text-sm md:text-base text-white/80">
                  {label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function QuoteBlock({
  content,
  title,
}: {
  content: string | null;
  title: string | null;
}) {
  return (
    <BlockWrapper>
      <div className="max-w-3xl mx-auto text-center">
        <div className="text-6xl text-brand leading-none mb-4">&ldquo;</div>
        {content ? (
          <p className="text-xl md:text-2xl italic text-foreground/90 leading-relaxed">
            {content}
          </p>
        ) : null}
        {title ? (
          <p className="mt-6 text-sm text-muted-foreground">— {title}</p>
        ) : null}
      </div>
    </BlockWrapper>
  );
}

/* ----------------------- Home-only dynamic blocks -----------------------
 * These three blocks (featured / solution-cards / cta) used to be hardcoded
 * directly in HomePage. They are now editable content blocks: the admin can
 * edit their eyebrow / heading / paragraph via PageManager, while the dynamic
 * data (featured products / L1 categories) stays automatic.
 */

function FeaturedBlock({
  title,
  content,
}: {
  title: string | null;
  content: string | null;
}) {
  const lang = useI18n((s) => s.lang);
  const go = useNav((s) => s.go);
  const { data: featured, isLoading } = useProducts({
    featured: true,
    status: "listed",
  });
  const list = (featured ?? []).slice(0, 4);
  return (
    <BlockWrapper>
      <div className="flex items-end justify-between mb-8">
        <div>
          {content ? (
            <p className="text-brand text-sm font-semibold tracking-wider uppercase mb-1">
              {content}
            </p>
          ) : null}
          {title ? (
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              {title}
            </h2>
          ) : null}
        </div>
        <button
          onClick={() => go({ name: "products" })}
          className="hidden sm:inline-flex items-center text-sm text-muted-foreground hover:text-brand transition-colors"
        >
          {tr("all_products", lang)}
          <ChevronRight className="size-4" />
        </button>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[4/3] rounded-xl" />
          ))}
        </div>
      ) : list.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-sm">
          {lang === "en" ? "No products yet." : "暂无产品。"}
        </p>
      )}
    </BlockWrapper>
  );
}

function SolutionCardsBlock({
  title,
  content,
}: {
  title: string | null;
  content: string | null;
}) {
  const lang = useI18n((s) => s.lang);
  const go = useNav((s) => s.go);
  const { data: categories } = useCategories();
  // The categories API returns a tree whose root array IS the L1 categories.
  const top = (categories ?? []).slice(0, 4);
  return (
    <BlockWrapper className="bg-card/40 border-y border-border">
      <div className="text-center mb-10">
        {content ? (
          <p className="text-brand text-sm font-semibold tracking-wider uppercase mb-1">
            {content}
          </p>
        ) : null}
        {title ? (
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            {title}
          </h2>
        ) : null}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {top.map((c, i) => {
          const name = pick(c.nameEn, c.nameCn, lang) ?? "";
          const desc = pick(c.descEn, c.descCn, lang) ?? "";
          const img = c.image;
          return (
            <motion.button
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              onClick={() => go({ name: "products", categoryId: c.id })}
              className="group relative aspect-[4/5] sm:aspect-[3/4] rounded-xl overflow-hidden border border-border hover:border-brand transition-colors"
            >
              {img ? (
                <>
                  <img
                    src={img}
                    alt={name}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.style.opacity = "0";
                    }}
                  />
                  {/* dark scrim so white text stays legible over the photo */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
                </>
              ) : (
                /* no image: keep the brand red card */
                <div className="absolute inset-0 brand-gradient opacity-90" />
              )}
              <div className="relative h-full p-4 sm:p-5 flex flex-col justify-end text-left">
                <h3 className="text-base sm:text-lg font-semibold text-white">
                  {name}
                </h3>
                {desc ? (
                  <p className="mt-1 text-xs text-white/80 line-clamp-2">
                    {desc}
                  </p>
                ) : null}
                <span className="mt-2 inline-flex items-center text-xs text-white/90 group-hover:text-white">
                  {tr("learn_more", lang)}
                  <ChevronRight className="size-3" />
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </BlockWrapper>
  );
}

function CtaBlock({
  title,
  content,
}: {
  title: string | null;
  content: string | null;
}) {
  const lang = useI18n((s) => s.lang);
  const go = useNav((s) => s.go);
  return (
    <BlockWrapper className="py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto text-center"
      >
        {title ? (
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            {title}
          </h2>
        ) : null}
        {content ? (
          <p className="mt-4 text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            {content}
          </p>
        ) : null}
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
    </BlockWrapper>
  );
}

/* ----------------------- News list block -----------------------
 * News cards rendered from a structured bilingual JSON payload in
 * `contentEn` (each row: titleEn/titleCn, excerptEn/excerptCn, dateEn/dateCn,
 * tagEn/tagCn, image). Used by the News page so its cards become admin
 * editable. Falls back to DEFAULT_NEWS (the original sample cards) when
 * `contentEn` is missing / unparseable / empty so a fresh install isn't empty.
 */

export interface NewsItem {
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

export const DEFAULT_NEWS: NewsItem[] = [
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

function NewsListBlock({ contentEn }: { contentEn: string | null }) {
  const lang = useI18n((s) => s.lang);
  // Parse contentEn as a JSON array of NewsItem. If parsing fails OR the array
  // is empty, fall back to DEFAULT_NEWS so the public site never breaks.
  const parsed = parseJsonArray<{
    titleEn?: string;
    titleCn?: string;
    excerptEn?: string;
    excerptCn?: string;
    dateEn?: string;
    dateCn?: string;
    tagEn?: string;
    tagCn?: string;
    image?: string;
  }>(contentEn);
  let news: NewsItem[] = DEFAULT_NEWS;
  if (parsed && parsed.length > 0) {
    news = parsed.map((n) => ({
      titleEn: typeof n.titleEn === "string" ? n.titleEn : "",
      titleCn: typeof n.titleCn === "string" ? n.titleCn : "",
      excerptEn: typeof n.excerptEn === "string" ? n.excerptEn : "",
      excerptCn: typeof n.excerptCn === "string" ? n.excerptCn : "",
      dateEn: typeof n.dateEn === "string" ? n.dateEn : "",
      dateCn: typeof n.dateCn === "string" ? n.dateCn : "",
      tagEn: typeof n.tagEn === "string" ? n.tagEn : "",
      tagCn: typeof n.tagCn === "string" ? n.tagCn : "",
      image: typeof n.image === "string" ? n.image : "",
    }));
  }
  return (
    <section className="py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {news.map((n, i) => {
            const title = pick(n.titleEn, n.titleCn, lang) ?? "";
            const excerpt = pick(n.excerptEn, n.excerptCn, lang) ?? "";
            const date = pick(n.dateEn, n.dateCn, lang) ?? "";
            const tag = pick(n.tagEn, n.tagCn, lang) ?? "";
            return (
              <motion.article
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="group rounded-xl border border-border bg-card overflow-hidden hover:border-brand transition-colors"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                  {n.image ? (
                    <img
                      src={n.image}
                      alt={title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.style.opacity = "0";
                      }}
                    />
                  ) : null}
                  {tag ? (
                    <span className="absolute top-3 left-3 inline-flex items-center rounded-full bg-brand text-primary-foreground text-xs font-semibold px-2.5 py-1">
                      {tag}
                    </span>
                  ) : null}
                </div>
                <div className="p-5">
                  {date ? (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CalendarDays className="size-3.5" />
                      {date}
                    </div>
                  ) : null}
                  {title ? (
                    <h3 className="mt-3 text-lg font-semibold leading-snug line-clamp-2">
                      {title}
                    </h3>
                  ) : null}
                  {excerpt ? (
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                      {excerpt}
                    </p>
                  ) : null}
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
