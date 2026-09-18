"use client";

import { useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { Home, Mail, Check } from "lucide-react";
import { useI18n, tr } from "@/store/i18n";
import { useNav } from "@/store/nav";
import { useProduct, useProducts } from "@/components/public/hooks";
import { ProductCard } from "@/components/public/ProductCard";
import { parseSpecs, pick } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ProductDetailPage({ id }: { id: string }) {
  const lang = useI18n((s) => s.lang);
  const go = useNav((s) => s.go);
  const { data: product, isLoading } = useProduct(id);

  // Related products: same category, exclude current, max 4.
  const { data: related } = useProducts({
    categoryId: product?.categoryId,
    status: "listed",
  });
  const relatedFiltered = (related ?? [])
    .filter((p) => p.id !== id)
    .slice(0, 4);

  if (isLoading || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-10">
          <Skeleton className="aspect-[4/3] rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </div>
    );
  }

  const name = pick(product.nameEn, product.nameCn, lang) ?? "";
  const shortDesc = pick(product.shortDescEn, product.shortDescCn, lang) ?? "";
  const desc = pick(product.descEn, product.descCn, lang) ?? "";
  const specs = parseSpecs(product.specs);

  const images =
    product.images.length > 0
      ? product.images
      : product.coverImage
        ? [{ id: "cover", url: product.coverImage, alt: name, order: 0, productId: product.id }]
        : [];

  const catName = product.category ? pick(product.category.nameEn, product.category.nameCn, lang) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <button onClick={() => go({ name: "home" })}>
                <Home className="size-3.5 inline" /> {tr("nav_home", lang)}
              </button>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <button onClick={() => go({ name: "products" })}>
                {tr("nav_products", lang)}
              </button>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {product.category ? (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <button onClick={() => go({ name: "products", categoryId: product.categoryId })}>
                    {catName}
                  </button>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </>
          ) : null}
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Top section: image carousel + info */}
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div>
          <ProductImageCarousel images={images.map((i) => ({ url: i.url, alt: i.alt ?? name }))} />
        </div>
        <div>
          {product.featured ? (
            <span className="inline-flex items-center rounded-full bg-brand text-primary-foreground text-xs font-semibold px-2.5 py-1 mb-3">
              ★ {tr("featured", lang)}
            </span>
          ) : null}
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{name}</h1>
          {shortDesc ? (
            <p className="mt-3 text-base md:text-lg text-muted-foreground">
              {shortDesc}
            </p>
          ) : null}

          {/* Specs */}
          {specs.length ? (
            <div className="mt-7">
              <h2 className="text-sm font-semibold tracking-wider uppercase mb-3">
                {tr("specifications", lang)}
              </h2>
              <dl className="rounded-xl border border-border bg-card overflow-hidden">
                {specs.map((s, i) => (
                  <div
                    key={i}
                    className={cn(
                      "grid grid-cols-[140px_1fr] gap-2 px-4 py-2.5 text-sm",
                      i % 2 === 1 && "bg-background/40"
                    )}
                  >
                    <dt className="text-muted-foreground">
                      {lang === "en" ? s.labelEn : s.labelCn}
                    </dt>
                    <dd className="font-medium">
                      {lang === "en" ? s.valueEn : s.valueCn}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}

          {/* CTA */}
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              size="lg"
              className="brand-gradient text-primary-foreground"
              onClick={() => go({ name: "contact" })}
            >
              <Mail className="size-4" />
              {lang === "en" ? "Inquire Now" : "立即咨询"}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => go({ name: "products", categoryId: product.categoryId })}
            >
              {tr("all_products", lang)}
            </Button>
          </div>

          <p className="mt-4 text-xs text-muted-foreground inline-flex items-center gap-1.5">
            <Check className="size-3.5 text-brand" />
            {lang === "en"
              ? "We reply to inquiries within 24 hours."
              : "我们将在24小时内回复咨询。"}
          </p>
        </div>
      </div>

      {/* Description */}
      {desc ? (
        <section className="mt-12 md:mt-16">
          <h2 className="text-2xl font-bold tracking-tight mb-4">
            <span className="text-brand">{tr("description", lang)}</span>
          </h2>
          <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-line text-base md:text-lg">
            {desc}
          </div>
        </section>
      ) : null}

      {/* Related */}
      {relatedFiltered.length ? (
        <section className="mt-14 md:mt-20">
          <div className="flex items-end justify-between mb-5">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              <span className="text-brand">{tr("related_products", lang)}</span>
            </h2>
            <button
              onClick={() => go({ name: "products", categoryId: product.categoryId })}
              className="text-sm text-muted-foreground hover:text-brand transition-colors"
            >
              {tr("all_products", lang)} →
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {relatedFiltered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      ) : null}

      {/* Floating phone shortcut removed to avoid overlapping with the
          floating Admin button on PublicSite. The "Inquire Now" button
          above covers contact intent. */}

    </div>
  );
}

interface CarouselImg {
  url: string;
  alt: string;
}

function ProductImageCarousel({ images }: { images: CarouselImg[] }) {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState<number>(0);

  // Subscribe to api changes to update the active thumbnail.
  useApiSubscribe(api, setCurrent);

  if (images.length === 0) {
    return (
      <div className="aspect-[4/3] rounded-xl brand-gradient" />
    );
  }

  return (
    <div>
      <div className="relative">
        <Carousel
          opts={{ loop: true, align: "start" }}
          setApi={setApi}
          className="w-full"
        >
          <CarouselContent>
            {images.map((img, i) => (
              <CarouselItem key={i}>
                <div className="aspect-[4/3] rounded-xl overflow-hidden border border-border bg-black/40">
                  <img
                    src={img.url}
                    alt={img.alt}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {images.length > 1 ? (
            <>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </>
          ) : null}
        </Carousel>
      </div>

      {images.length > 1 ? (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => api?.scrollTo(i)}
              className={cn(
                "shrink-0 size-16 rounded-md overflow-hidden border transition-all",
                current === i
                  ? "border-brand ring-2 ring-brand/40"
                  : "border-border hover:border-brand/60"
              )}
              aria-label={`Go to image ${i + 1}`}
            >
              <img
                src={img.url}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

// Small wrapper around CarouselApi.on('select') to update an index state.
function useApiSubscribe(api: CarouselApi | null, onChange: (i: number) => void) {
  useEffect(() => {
    if (!api) return;
    const onSelect = () => onChange(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api, onChange]);
}