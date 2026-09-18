"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";
import type {
  AdminUser,
  Category,
  ContentBlock,
  FormSubmission,
  Product,
  ProductImage,
  ProductSpec,
  SitePage,
  SiteSetting,
} from "./types";

/* ------------------------------ helpers ------------------------------ */

async function jfetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    ...init,
  });
  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      if (data?.error) msg = data.error;
    } catch {
      /* ignore */
    }
    throw new Error(msg);
  }
  // Some DELETE endpoints return {ok:true}; tolerate empty body
  if (res.status === 204) return undefined as unknown as T;
  return (await res.json()) as T;
}

/* ------------------------------ auth ------------------------------ */

export function useMe(): UseQueryResult<{ user: AdminUser | null }> {
  return useQuery({
    queryKey: ["me"],
    queryFn: () => jfetch<{ user: AdminUser | null }>("/api/auth/me"),
    staleTime: 10_000,
  });
}

export function useLogin(): UseMutationResult<
  { ok: true; user: AdminUser },
  Error,
  { username: string; password: string }
> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars) =>
      jfetch<{ ok: true; user: AdminUser }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(vars),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["me"] });
    },
  });
}

export function useLogout(): UseMutationResult<{ ok: true }, Error, void> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () =>
      jfetch<{ ok: true }>("/api/auth/logout", { method: "POST" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["me"] });
      qc.invalidateQueries({ queryKey: ["submissions"] });
    },
  });
}

/* ------------------------------ pages & blocks ------------------------------ */

export function usePagesAdmin(): UseQueryResult<SitePage[]> {
  return useQuery({
    queryKey: ["pages"],
    queryFn: () => jfetch<SitePage[]>("/api/pages"),
  });
}

export function usePageAdmin(id: string | null): UseQueryResult<SitePage> {
  return useQuery({
    queryKey: ["page", id],
    queryFn: () => jfetch<SitePage>(`/api/pages/${id}`),
    enabled: !!id,
  });
}

export function useUpdatePage(): UseMutationResult<
  SitePage,
  Error,
  { id: string; data: Partial<SitePage> }
> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) =>
      jfetch<SitePage>(`/api/pages/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: (page) => {
      qc.invalidateQueries({ queryKey: ["pages"] });
      qc.setQueryData(["page", page.id], page);
    },
  });
}

export function useCreatePage(): UseMutationResult<
  SitePage,
  Error,
  Partial<SitePage>
> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      jfetch<SitePage>("/api/pages", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pages"] });
    },
  });
}

export function useDeletePage(): UseMutationResult<
  { ok: true },
  Error,
  string
> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) =>
      jfetch<{ ok: true }>(`/api/pages/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pages"] });
    },
  });
}

export function useCreateBlock(): UseMutationResult<
  ContentBlock,
  Error,
  {
    pageId: string;
    data: Partial<ContentBlock>;
  }
> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ pageId, data }) =>
      jfetch<ContentBlock>(`/api/pages/${pageId}/blocks`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pages"] });
    },
  });
}

export function useUpdateBlock(): UseMutationResult<
  ContentBlock,
  Error,
  { pageId: string; blockId: string; data: Partial<ContentBlock> }
> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ pageId, blockId, data }) =>
      jfetch<ContentBlock>(`/api/pages/${pageId}/blocks/${blockId}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pages"] });
    },
  });
}

export function useDeleteBlock(): UseMutationResult<
  { ok: true },
  Error,
  { pageId: string; blockId: string }
> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ pageId, blockId }) =>
      jfetch<{ ok: true }>(
        `/api/pages/${pageId}/blocks/${blockId}`,
        { method: "DELETE" }
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pages"] });
    },
  });
}

/* ------------------------------ categories ------------------------------ */

export function useCategoriesAdmin(): UseQueryResult<Category[]> {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => jfetch<Category[]>("/api/categories"),
  });
}

export function useCreateCategory(): UseMutationResult<
  Category,
  Error,
  Partial<Category>
> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      jfetch<Category>("/api/categories", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useUpdateCategory(): UseMutationResult<
  Category,
  Error,
  { id: string; data: Partial<Category> }
> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) =>
      jfetch<Category>(`/api/categories/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useDeleteCategory(): UseMutationResult<
  { ok: true },
  Error,
  string
> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) =>
      jfetch<{ ok: true }>(`/api/categories/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["product"] });
    },
  });
}

/* ------------------------------ products ------------------------------ */

export type ProductFilters = {
  categoryId?: string;
  status?: "listed" | "unlisted" | "";
  q?: string;
};

function buildProductsUrl(f?: ProductFilters) {
  const p = new URLSearchParams();
  if (f?.categoryId) p.set("categoryId", f.categoryId);
  if (f?.status) p.set("status", f.status);
  if (f?.q) p.set("q", f.q);
  const qs = p.toString();
  return `/api/products${qs ? `?${qs}` : ""}`;
}

export function useProductsAdmin(
  filters: ProductFilters
): UseQueryResult<Product[]> {
  return useQuery({
    queryKey: ["products", filters.categoryId, filters.status, filters.q],
    queryFn: () => jfetch<Product[]>(buildProductsUrl(filters)),
  });
}

export function useCreateProduct(): UseMutationResult<
  Product,
  Error,
  {
    categoryId: string;
    nameEn: string;
    nameCn: string;
    shortDescEn?: string | null;
    shortDescCn?: string | null;
    descEn?: string | null;
    descCn?: string | null;
    specs?: ProductSpec[];
    coverImage?: string | null;
    status?: "listed" | "unlisted";
    featured?: boolean;
    order?: number;
    images?: string[];
  }
> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      jfetch<Product>("/api/products", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["product"] });
    },
  });
}

export function useUpdateProduct(): UseMutationResult<
  Product,
  Error,
  { id: string; data: Partial<Product> & { specs?: ProductSpec[] } }
> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => {
      // The API expects `specs` to be an array; it stringifies it server-side.
      const { specs, ...rest } = data;
      const payload: Record<string, unknown> = { ...rest };
      if (specs !== undefined) payload.specs = specs;
      return jfetch<Product>(`/api/products/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
    },
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["product", vars.id] });
      qc.invalidateQueries({ queryKey: ["product"] });
    },
  });
}

export function useDeleteProduct(): UseMutationResult<
  { ok: true },
  Error,
  string
> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) =>
      jfetch<{ ok: true }>(`/api/products/${id}`, { method: "DELETE" }),
    onSuccess: (_d, id) => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["product", id] });
      qc.invalidateQueries({ queryKey: ["product"] });
    },
  });
}

export function useAddProductImage(): UseMutationResult<
  ProductImage,
  Error,
  { productId: string; url: string; alt?: string; order?: number }
> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, ...data }) =>
      jfetch<ProductImage>(`/api/products/${productId}/images`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["product", vars.productId] });
      qc.invalidateQueries({ queryKey: ["product"] });
    },
  });
}

export function useUpdateProductImage(): UseMutationResult<
  ProductImage,
  Error,
  {
    productId: string;
    imageId: string;
    data: Partial<ProductImage>;
  }
> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, imageId, data }) =>
      jfetch<ProductImage>(
        `/api/products/${productId}/images/${imageId}`,
        { method: "PUT", body: JSON.stringify(data) }
      ),
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["product", vars.productId] });
      qc.invalidateQueries({ queryKey: ["product"] });
    },
  });
}

export function useDeleteProductImage(): UseMutationResult<
  { ok: true },
  Error,
  { productId: string; imageId: string }
> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, imageId }) =>
      jfetch<{ ok: true }>(
        `/api/products/${productId}/images/${imageId}`,
        { method: "DELETE" }
      ),
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["product", vars.productId] });
      qc.invalidateQueries({ queryKey: ["product"] });
    },
  });
}

/* ------------------------------ submissions ------------------------------ */

export function useSubmissions(
  status: "new" | "read" | "replied" | ""
): UseQueryResult<FormSubmission[]> {
  return useQuery({
    queryKey: ["submissions", status],
    queryFn: () => {
      const url = status ? `/api/submissions?status=${status}` : "/api/submissions";
      return jfetch<FormSubmission[]>(url);
    },
  });
}

export function useSubmission(
  id: string | null
): UseQueryResult<FormSubmission> {
  return useQuery({
    queryKey: ["submission", id],
    queryFn: () => jfetch<FormSubmission>(`/api/submissions/${id}`),
    enabled: !!id,
  });
}

export function useUpdateSubmission(): UseMutationResult<
  FormSubmission,
  Error,
  { id: string; data: Partial<FormSubmission> }
> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) =>
      jfetch<FormSubmission>(`/api/submissions/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["submissions"] });
    },
  });
}

export function useDeleteSubmission(): UseMutationResult<
  { ok: true },
  Error,
  string
> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) =>
      jfetch<{ ok: true }>(`/api/submissions/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["submissions"] });
    },
  });
}

/* ------------------------------ settings ------------------------------ */

export function useSettingsAdmin(): UseQueryResult<SiteSetting> {
  return useQuery({
    queryKey: ["settings"],
    queryFn: () => jfetch<SiteSetting>("/api/settings"),
  });
}

export function useUpdateSettings(): UseMutationResult<
  SiteSetting,
  Error,
  Partial<SiteSetting>
> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      jfetch<SiteSetting>("/api/settings", {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["settings"] });
    },
  });
}
