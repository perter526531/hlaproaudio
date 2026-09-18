"use client";

import { useQuery } from "@tanstack/react-query";
import type {
  Category,
  Product,
  SitePage,
  SiteSetting,
} from "@/lib/types";

// ---------- Generic fetch helper ----------
async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`Request failed: ${res.status} ${url}`);
  return (await res.json()) as T;
}

// ---------- Pages ----------

/** All site pages with their content blocks. */
export function usePages() {
  return useQuery<SitePage[]>({
    queryKey: ["pages"],
    queryFn: () => fetchJson<SitePage[]>("/api/pages"),
    staleTime: 60_000,
  });
}

/** Find a single page by slug, derived from usePages so we share the cache. */
export function usePage(slug: string) {
  const q = usePages();
  const data = q.data?.find((p) => p.slug === slug) ?? undefined;
  return {
    ...q,
    data,
  };
}

// ---------- Categories ----------

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: () => fetchJson<Category[]>("/api/categories"),
    staleTime: 60_000,
  });
}

// ---------- Products ----------

export interface ProductFilters {
  categoryId?: string;
  featured?: boolean;
  status?: "listed" | "unlisted";
  q?: string;
}

export function useProducts(filters: ProductFilters = {}) {
  const params = new URLSearchParams();
  if (filters.categoryId) params.set("categoryId", filters.categoryId);
  if (filters.featured) params.set("featured", "true");
  if (filters.status) params.set("status", filters.status);
  if (filters.q) params.set("q", filters.q);
  const qs = params.toString();
  const url = qs ? `/api/products?${qs}` : "/api/products";
  return useQuery<Product[]>({
    queryKey: ["products", filters],
    queryFn: () => fetchJson<Product[]>(url),
    staleTime: 30_000,
  });
}

export function useProduct(id: string | undefined | null) {
  return useQuery<Product>({
    queryKey: ["product", id],
    queryFn: () => fetchJson<Product>(`/api/products/${id}`),
    enabled: !!id,
    staleTime: 30_000,
  });
}

// ---------- Settings ----------

export function useSettings() {
  return useQuery<SiteSetting>({
    queryKey: ["settings"],
    queryFn: () => fetchJson<SiteSetting>("/api/settings"),
    staleTime: 5 * 60_000,
  });
}
