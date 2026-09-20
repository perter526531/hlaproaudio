"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useI18n } from "@/store/i18n";
import { useNav } from "@/store/nav";
import { pick, type Product } from "@/lib/types";
import { cn } from "@/lib/utils";

/** A product card for the grid views. Clicking navigates to product detail. */
export function ProductCard({ product }: { product: Product }) {
  const lang = useI18n((s) => s.lang);
  const go = useNav((s) => s.go);

  const name = pick(product.nameEn, product.nameCn, lang) ?? "";
  const desc = pick(product.shortDescEn, product.shortDescCn, lang) ?? "";
  const cover = product.coverImage ?? product.images[0]?.url;
  const featured = product.featured;

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      onClick={() => go({ name: "product", id: product.id })}
      className={cn(
        "group relative cursor-pointer overflow-hidden rounded-xl border border-border bg-card",
        "hover:border-brand transition-colors"
      )}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          go({ name: "product", id: product.id });
        }
      }}
      aria-label={name}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-black/40">
        {cover ? (
          <img
            src={cover}
            alt={name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              e.currentTarget.style.opacity = "0";
            }}
          />
        ) : (
          <div className="h-full w-full brand-gradient" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
        {featured ? (
          <span className="absolute top-3 left-3 inline-flex items-center rounded-full bg-brand text-primary-foreground text-xs font-semibold px-2.5 py-1">
            ★ {lang === "en" ? "Featured" : "推荐"}
          </span>
        ) : null}
        <span className="absolute top-3 right-3 inline-flex size-8 items-center justify-center rounded-full bg-background/80 text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
          <ArrowUpRight className="size-4" />
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-base truncate">{name}</h3>
        {desc ? (
          <p className="mt-1 text-sm text-muted-foreground line-clamp-1">{desc}</p>
        ) : null}
      </div>
    </motion.article>
  );
}
