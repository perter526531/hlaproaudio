"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, Filter, Home, Layers } from "lucide-react";
import { useI18n, tr } from "@/store/i18n";
import { useNav } from "@/store/nav";
import {
  useCategories,
  usePage,
  useProducts,
} from "@/components/public/hooks";
import { BannerSection } from "@/components/public/BannerSection";
import { ProductCard } from "@/components/public/ProductCard";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { pick, type Category } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ProductsPageProps {
  categoryId?: string;
}

export function ProductsPage({ categoryId }: ProductsPageProps) {
  const lang = useI18n((s) => s.lang);
  const go = useNav((s) => s.go);
  const { data: page, isLoading: pageLoading } = usePage("products");
  const { data: categories, isLoading: catsLoading } = useCategories();
  const { data: products, isLoading: productsLoading } = useProducts({
    categoryId,
    status: "listed",
  });

  const [mobileOpen, setMobileOpen] = useState(false);

  // Build the breadcrumb trail for the active category.
  const trail = useMemo(
    () => (categories && categoryId ? findTrail(categories, categoryId) : []),
    [categories, categoryId]
  );

  const activeCat = trail.length ? trail[trail.length - 1] : null;
  const activeName = activeCat ? pick(activeCat.nameEn, activeCat.nameCn, lang) : null;

  return (
    <>
      {page ? <BannerSection page={page} /> : null}
      {pageLoading && !page ? <Skeleton className="h-[40vh] w-full" /> : null}

      <section className="py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              {trail.map((c, i) => {
                const last = i === trail.length - 1;
                return (
                  <span key={c.id} className="contents">
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      {last ? (
                        <BreadcrumbPage>
                          {pick(c.nameEn, c.nameCn, lang)}
                        </BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <button onClick={() => go({ name: "products", categoryId: c.id })}>
                            {pick(c.nameEn, c.nameCn, lang)}
                          </button>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </span>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>

          <div className="grid md:grid-cols-[260px_1fr] gap-6 lg:gap-10">
            {/* Sidebar (desktop) */}
            <aside className="hidden md:block">
              <CategoryTree
                categories={categories ?? []}
                activeId={categoryId}
                onSelect={(id) => go({ name: "products", categoryId: id })}
                onAll={() => go({ name: "products" })}
                lang={lang}
                loading={catsLoading}
              />
            </aside>

            {/* Mobile category drawer */}
            <div className="md:hidden mb-2">
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <Filter className="size-4" />
                    {activeName ?? tr("all_categories", lang)}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[280px]">
                  <SheetHeader>
                    <SheetTitle>{tr("all_categories", lang)}</SheetTitle>
                  </SheetHeader>
                  <div className="overflow-y-auto max-h-[75vh] px-2">
                    <CategoryTree
                      categories={categories ?? []}
                      activeId={categoryId}
                      onSelect={(id) => {
                        go({ name: "products", categoryId: id });
                        setMobileOpen(false);
                      }}
                      onAll={() => {
                        go({ name: "products" });
                        setMobileOpen(false);
                      }}
                      lang={lang}
                      loading={catsLoading}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Product grid */}
            <div>
              <div className="flex items-end justify-between mb-5">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                  {activeName ?? tr("product_center", lang)}
                </h1>
                <span className="text-sm text-muted-foreground">
                  {productsLoading
                    ? "…"
                    : `${(products ?? []).length} ${tr("nav_products", lang).toLowerCase()}`}
                </span>
              </div>

              {productsLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="aspect-[4/3] rounded-xl" />
                  ))}
                </div>
              ) : (products ?? []).length ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {(products ?? []).map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-border bg-card p-12 text-center">
                  <Layers className="size-10 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">
                    {lang === "en"
                      ? "No products in this category yet."
                      : "该分类下暂无产品。"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/** Recursive 3-level collapsible category tree. */
function CategoryTree({
  categories,
  activeId,
  onSelect,
  onAll,
  lang,
  loading,
}: {
  categories: Category[];
  activeId?: string;
  onSelect: (id: string) => void;
  onAll: () => void;
  lang: "en" | "cn";
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <button
        onClick={onAll}
        className={cn(
          "w-full text-left px-4 py-3 text-sm font-medium border-b border-border transition-colors",
          !activeId
            ? "bg-brand text-primary-foreground"
            : "hover:bg-accent/60"
        )}
      >
        {tr("all_products", lang)}
      </button>
      <ul className="max-h-[70vh] overflow-y-auto">
        {categories.map((c) => (
          <CategoryNode
            key={c.id}
            cat={c}
            activeId={activeId}
            onSelect={onSelect}
            lang={lang}
            level={0}
          />
        ))}
      </ul>
    </div>
  );
}

function CategoryNode({
  cat,
  activeId,
  onSelect,
  lang,
  level,
}: {
  cat: Category;
  activeId?: string;
  onSelect: (id: string) => void;
  lang: "en" | "cn";
  level: number;
}) {
  const hasChildren = (cat.children ?? []).length > 0;
  const isActive = activeId === cat.id;
  // Auto-expand if a descendant is active.
  const [open, setOpen] = useState<boolean>(
    () => hasChildren && !!activeId && isDescendantOrSelf(cat, activeId)
  );

  const name = pick(cat.nameEn, cat.nameCn, lang) ?? "";

  return (
    <li>
      <div
        className={cn(
          "flex items-center border-b border-border",
          "hover:bg-accent/40 transition-colors"
        )}
      >
        <button
          onClick={() => onSelect(cat.id)}
          style={{ paddingLeft: 16 + level * 14 }}
          className={cn(
            "flex-1 text-left py-2.5 pr-3 text-sm min-h-11 inline-flex items-center",
            isActive ? "text-brand font-semibold" : "text-foreground/90"
          )}
        >
          {!hasChildren ? (
            <span className="size-4 inline-block" />
          ) : null}
          <span className="truncate">{name}</span>
        </button>
        {hasChildren ? (
          <button
            onClick={() => setOpen((v) => !v)}
            className="px-3 size-11 inline-flex items-center justify-center text-muted-foreground hover:text-brand"
            aria-label={open ? "Collapse" : "Expand"}
          >
            {open ? (
              <ChevronDown className="size-4" />
            ) : (
              <ChevronRight className="size-4" />
            )}
          </button>
        ) : null}
      </div>
      {hasChildren && open ? (
        <ul>
          {cat.children.map((c) => (
            <CategoryNode
              key={c.id}
              cat={c}
              activeId={activeId}
              onSelect={onSelect}
              lang={lang}
              level={level + 1}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

function isDescendantOrSelf(cat: Category, id: string): boolean {
  if (cat.id === id) return true;
  for (const c of cat.children ?? []) {
    if (isDescendantOrSelf(c, id)) return true;
  }
  return false;
}

/** Find the trail of categories from root to the given id. */
function findTrail(cats: Category[], id: string): Category[] {
  for (const c of cats) {
    if (c.id === id) return [c];
    if (c.children?.length) {
      const sub = findTrail(c.children, id);
      if (sub.length) return [c, ...sub];
    }
  }
  return [];
}
