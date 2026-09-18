import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const product = await db.product.findUnique({
    where: { id },
    include: {
      images: { orderBy: { order: "asc" } },
      category: true,
    },
  });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const body = await req.json();
  const product = await db.product.update({
    where: { id },
    data: {
      ...(body.categoryId !== undefined && { categoryId: body.categoryId }),
      ...(body.nameEn !== undefined && { nameEn: body.nameEn }),
      ...(body.nameCn !== undefined && { nameCn: body.nameCn }),
      ...(body.shortDescEn !== undefined && { shortDescEn: body.shortDescEn }),
      ...(body.shortDescCn !== undefined && { shortDescCn: body.shortDescCn }),
      ...(body.descEn !== undefined && { descEn: body.descEn }),
      ...(body.descCn !== undefined && { descCn: body.descCn }),
      ...(body.specs !== undefined && { specs: body.specs ? JSON.stringify(body.specs) : null }),
      ...(body.coverImage !== undefined && { coverImage: body.coverImage }),
      ...(body.status !== undefined && { status: body.status }),
      ...(body.featured !== undefined && { featured: !!body.featured }),
      ...(body.order !== undefined && { order: body.order }),
    },
  });
  return NextResponse.json(product);
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  await db.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
