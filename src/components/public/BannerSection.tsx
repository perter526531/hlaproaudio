"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/store/i18n";
import { pick, type SitePage } from "@/lib/types";

/**
 * Full-width hero banner for a page. Renders the page's banner image with a
 * left-side dark gradient overlay, banner title and subtitle.
 */
export function BannerSection({ page }: { page: SitePage }) {
  const lang = useI18n((s) => s.lang);

  const title = pick(page.bannerTitleEn, page.bannerTitleCn, lang);
  const subtitle = pick(page.bannerSubEn, page.bannerSubCn, lang);
  const bg = page.bannerImage;

  return (
    <section
      className="relative w-full h-[40vh] md:h-[55vh] min-h-[280px] overflow-hidden bg-muted"
      aria-label={title ?? undefined}
    >
      {bg ? (
        <img
          src={bg}
          alt={title ?? "banner"}
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
          onError={(e) => {
            e.currentTarget.style.opacity = "0";
          }}
        />
      ) : (
        <div className="absolute inset-0 brand-gradient" />
      )}
      {/* Left-to-right dark gradient overlay */}
      <div className="absolute inset-0 hero-overlay-r" />
      {/* Bottom fade into the page background for a smoother transition */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-background" />

      <div className="relative h-full w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-2xl"
        >
          {title ? (
            <h1 className="text-4xl md:text-6xl font-bold leading-tight text-white tracking-tight">
              {title}
            </h1>
          ) : null}
          {subtitle ? (
            <p className="mt-4 md:mt-6 text-base md:text-lg text-white/80 max-w-xl">
              {subtitle}
            </p>
          ) : null}
        </motion.div>
      </div>
    </section>
  );
}
