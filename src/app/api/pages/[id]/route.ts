import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const page = await db.sitePage.findUnique({
    where: { id },
    include: { contentBlocks: { orderBy: { order: "asc" } } },
  });
  if (!page) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(page);
}

export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const body = await req.json();
  const page = await db.sitePage.update({
    where: { id },
    data: {
      ...(body.slug !== undefined && { slug: body.slug }),
      ...(body.titleEn !== undefined && { titleEn: body.titleEn }),
      ...(body.titleCn !== undefined && { titleCn: body.titleCn }),
      ...(body.bannerImage !== undefined && { bannerImage: body.bannerImage }),
      ...(body.bannerTitleEn !== undefined && { bannerTitleEn: body.bannerTitleEn }),
      ...(body.bannerTitleCn !== undefined && { bannerTitleCn: body.bannerTitleCn }),
      ...(body.bannerSubEn !== undefined && { bannerSubEn: body.bannerSubEn }),
      ...(body.bannerSubCn !== undefined && { bannerSubCn: body.bannerSubCn }),
      ...(body.metaEn !== undefined && { metaEn: body.metaEn }),
      ...(body.metaCn !== undefined && { metaCn: body.metaCn }),
    },
  });
  return NextResponse.json(page);
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  await db.sitePage.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
