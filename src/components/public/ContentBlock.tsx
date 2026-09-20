"use client";

import { motion } from "framer-motion";
import { Award, Cpu, Globe2, Factory, Microscope, Headphones } from "lucide-react";
import { useI18n } from "@/store/i18n";
import { pick, type ContentBlock as ContentBlockType } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Renders a single content block based on its type. Bilingual fields are
 * picked from `lang`. Used by HomePage / AboutPage / SolutionsPage / etc.
 */
export function ContentBlock({ block }: { block: ContentBlockType }) {
  const lang = useI18n((s) => s.lang);
  const title = pick(block.titleEn, block.titleCn, lang);
  const content = pick(block.contentEn, block.contentCn, lang);

  switch (block.type) {
    case "hero":
      return <HeroBlock image={block.image} title={title} content={content} />;
    case "text":
      return <TextBlock title={title} content={content} image={block.image} />;
    case "image":
      return <ImageBlock image={block.image} content={content} title={title} />;
    case "features":
      return <FeaturesBlock title={title} content={content} />;
    case "stats":
      return <StatsBlock title={title} />;
    case "quote":
      return <QuoteBlock content={content} title={title} />;
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
  icon: React.ReactNode;
  titleEn: string;
  titleCn: string;
  descEn: string;
  descCn: string;
}

const DEFAULT_FEATURES: Feature[] = [
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
  content,
}: {
  title: string | null;
  content: string | null;
}) {
  const lang = useI18n((s) => s.lang);
  // Split content by "|" to allow per-feature overrides; fall back to defaults.
  let features = DEFAULT_FEATURES;
  if (content) {
    const parts = content.split("|").map((p) => p.trim()).filter(Boolean);
    if (parts.length >= 3) {
      features = DEFAULT_FEATURES.map((f, i) => ({
        ...f,
        ...(i < parts.length
          ? lang === "en"
            ? { descEn: parts[i], descCn: parts[i] }
            : { descCn: parts[i], descEn: parts[i] }
          : {}),
      }));
    }
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
        {features.slice(0, 3).map((f, i) => {
          const Icon = icons[i] ?? Globe2;
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

const STATS: { value: string; labelEn: string; labelCn: string }[] = [
  { value: "20+", labelEn: "Years of Innovation", labelCn: "年声学创新" },
  { value: "80+", labelEn: "Countries Served", labelCn: "服务国家" },
  { value: "50+", labelEn: "R&D Engineers", labelCn: "研发工程师" },
  { value: "30,000m²", labelEn: "Manufacturing Base", labelCn: "生产基地" },
];

function StatsBlock({ title }: { title: string | null }) {
  const lang = useI18n((s) => s.lang);
  return (
    <section className="relative py-12 md:py-16 brand-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {title ? (
          <h2 className="text-center text-2xl md:text-3xl font-bold text-white mb-8">
            {title}
          </h2>
        ) : null}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s, i) => (
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
                {lang === "en" ? s.labelEn : s.labelCn}
              </div>
            </motion.div>
          ))}
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
