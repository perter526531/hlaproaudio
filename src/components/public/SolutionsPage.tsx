"use client";

import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import { useI18n, tr } from "@/store/i18n";
import { useNav } from "@/store/nav";
import { usePage } from "@/components/public/hooks";
import { BannerSection } from "@/components/public/BannerSection";
import { Button } from "@/components/ui/button";
import { pick } from "@/lib/types";

export function SolutionsPage() {
  const lang = useI18n((s) => s.lang);
  const go = useNav((s) => s.go);
  const { data: page, isLoading } = usePage("solutions");

  if (isLoading || !page) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <p className="text-muted-foreground">Loading…</p>
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

      {/* CTA */}
      <section className="py-16 md:py-24 border-t border-border bg-card/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            {lang === "en" ? "Have a specific venue in mind?" : "有具体的场馆场景？"}
          </h2>
          <p className="mt-3 text-muted-foreground text-base md:text-lg">
            {lang === "en"
              ? "Our application engineers can help design the right system."
              : "我们的应用工程师可协助设计最合适的系统。"}
          </p>
          <div className="mt-7">
            <Button
              size="lg"
              className="brand-gradient text-primary-foreground"
              onClick={() => go({ name: "contact" })}
            >
              <Mail className="size-4" />
              {tr("nav_contact", lang)}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
