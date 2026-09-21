// Admin-only shared types (mirrors the API data shapes from worklog.md).
// The public-frontend agent (Task 4) may have created src/lib/types.ts.
// We try to import from there first; otherwise use these local types.
// Keep this file dependency-free and small so it can be imported from any
// admin client component without circular issues.

export type ContentBlockType =
  | "text"
  | "image"
  | "hero"
  | "features"
  | "quote"
  | "stats";

export interface ContentBlock {
  id: string;
  pageId: string;
  type: ContentBlockType;
  titleEn: string | null;
  titleCn: string | null;
  contentEn: string | null;
  contentCn: string | null;
  image: string | null;
  order: number;
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
}

export interface Category {
  id: string;
  parentId: string | null;
  nameEn: string;
  nameCn: string;
  descEn: string | null;
  descCn: string | null;
  icon: string | null;
  image: string | null;
  order: number;
  children?: Category[];
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

export interface Product {
  id: string;
  categoryId: string;
  nameEn: string;
  nameCn: string;
  shortDescEn: string | null;
  shortDescCn: string | null;
  descEn: string | null;
  descCn: string | null;
  specs: string | null; // JSON string of ProductSpec[]
  coverImage: string | null;
  status: "listed" | "unlisted";
  featured: boolean;
  order: number;
  images: ProductImage[];
  category?: Category | null;
}

export interface FormSubmission {
  id: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  email: string | null;
  requirements: string;
  sourcePage: string | null;
  status: "new" | "read" | "replied";
  createdAt: string;
}

export interface SiteSetting {
  id: string;
  siteNameEn: string | null;
  siteNameCn: string | null;
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

export interface AdminUser {
  id: string;
  username: string;
}
