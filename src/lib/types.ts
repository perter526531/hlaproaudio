// Shared TypeScript interfaces for the public site + admin.
// These match the Prisma schema in prisma/schema.prisma and the API JSON shapes
// documented in worklog.md ("Data Shapes").

export type Lang = "en" | "cn";

export type BlockType =
  | "text"
  | "image"
  | "hero"
  | "features"
  | "quote"
  | "stats";

export interface ContentBlock {
  id: string;
  pageId: string;
  type: BlockType;
  titleEn: string | null;
  titleCn: string | null;
  contentEn: string | null;
  contentCn: string | null;
  image: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface SitePage {
  id: string;
  slug: string;
  titleEn: string;
  titleCn: string;
  bannerImage: string | null;
  bannerTitleEn: string | null;
  bannerTitleCn: string | null;
  bannerSubEn: string | null;
  bannerSubCn: string | null;
  metaEn: string | null;
  metaCn: string | null;
  contentBlocks: ContentBlock[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  parentId: string | null;
  nameEn: string;
  nameCn: string;
  descEn: string | null;
  descCn: string | null;
  icon: string | null;
  order: number;
  children: Category[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  alt: string | null;
  order: number;
}

export interface ProductSpec {
  labelEn: string;
  labelCn: string;
  valueEn: string;
  valueCn: string;
}

export type ProductStatus = "listed" | "unlisted";

export interface Product {
  id: string;
  categoryId: string;
  category: Category | null;
  nameEn: string;
  nameCn: string;
  shortDescEn: string | null;
  shortDescCn: string | null;
  descEn: string | null;
  descCn: string | null;
  specs: string | null; // JSON string of ProductSpec[]
  coverImage: string | null;
  status: ProductStatus;
  featured: boolean;
  order: number;
  images: ProductImage[];
  createdAt: string;
  updatedAt: string;
}

export type SubmissionStatus = "new" | "read" | "replied";

export interface FormSubmission {
  id: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  email: string | null;
  requirements: string;
  sourcePage: string | null;
  status: SubmissionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface SiteSetting {
  id: string;
  logo: string | null;
  phoneEn: string | null;
  phoneCn: string | null;
  emailEn: string | null;
  emailCn: string | null;
  addressEn: string | null;
  addressCn: string | null;
  whatsapp: string | null;
  wechat: string | null;
  facebook: string | null;
  youtube: string | null;
  instagram: string | null;
  linkedin: string | null;
  copyrightEn: string | null;
  copyrightCn: string | null;
}

// ---------- Helpers ----------

/** Parse the JSON specs string on a Product into a typed array. */
export function parseSpecs(specs: string | null | undefined): ProductSpec[] {
  if (!specs) return [];
  try {
    const parsed = JSON.parse(specs);
    if (!Array.isArray(parsed)) return [];
    return parsed as ProductSpec[];
  } catch {
    return [];
  }
}

/** Pick a localized field by language safely. */
export function pick<T>(en: T | null | undefined, cn: T | null | undefined, lang: Lang): T | null {
  if (lang === "en") return en ?? cn;
  return cn ?? en;
}
