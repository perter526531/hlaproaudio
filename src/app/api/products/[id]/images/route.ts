import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

// Admin: add an image to a product
export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const body = await req.json();
  const count = await db.productImage.count({ where: { productId: id } });
  const img = await db.productImage.create({
    data: {
      productId: id,
      url: body.url,
      alt: body.alt || null,
      order: body.order ?? count,
    },
  });
  // ensure coverImage set if first image
  if (count === 0) {
    await db.product.update({ where: { id }, data: { coverImage: body.url } });
  }
  return NextResponse.json(img);
}
