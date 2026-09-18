import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { Prisma } from "@prisma/client";

// Public: list products, optional filters: categoryId, featured, status, q
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const categoryId = searchParams.get("categoryId");
  const featured = searchParams.get("featured");
  const status = searchParams.get("status");
  const q = searchParams.get("q");

  const where: Prisma.ProductWhereInput = {};
  if (status) where.status = status;
  if (featured === "true") where.featured = true;

  if (categoryId) {
    // gather this category + all descendants for 3-level hierarchy
    const ids = await collectDescendants(categoryId);
    where.categoryId = { in: ids };
  }
  if (q) {
    where.OR = [
      { nameEn: { contains: q } },
      { nameCn: { contains: q } },
      { shortDescEn: { contains: q } },
      { shortDescCn: { contains: q } },
    ];
  }

  const products = await db.product.findMany({
    where,
    include: { images: { orderBy: { order: "asc" } }, category: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(products);
}

// Admin: create a product
export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const product = await db.product.create({
    data: {
      categoryId: body.categoryId,
      nameEn: body.nameEn || "Product",
      nameCn: body.nameCn || "产品",
      shortDescEn: body.shortDescEn || null,
      shortDescCn: body.shortDescCn || null,
      descEn: body.descEn || null,
      descCn: body.descCn || null,
      specs: body.specs ? JSON.stringify(body.specs) : null,
      coverImage: body.coverImage || null,
      status: body.status || "listed",
      featured: !!body.featured,
      order: body.order ?? 0,
    },
  });
  // attach images if provided
  if (Array.isArray(body.images)) {
    for (let i = 0; i < body.images.length; i++) {
      await db.productImage.create({
        data: { productId: product.id, url: String(body.images[i]), order: i },
      });
    }
  }
  const full = await db.product.findUnique({
    where: { id: product.id },
    include: { images: { orderBy: { order: "asc" } }, category: true },
  });
  return NextResponse.json(full);
}

// Recursively collect a category id and all descendant ids (3 levels deep)
async function collectDescendants(rootId: string): Promise<string[]> {
  const out = [rootId];
  const stack = [rootId];
  while (stack.length) {
    const cur = stack.pop()!;
    const children = await db.category.findMany({ where: { parentId: cur }, select: { id: true } });
    for (const c of children) {
      out.push(c.id);
      stack.push(c.id);
    }
  }
  return out;
}
