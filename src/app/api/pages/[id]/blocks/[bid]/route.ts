import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string; bid: string }> }) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { bid } = await ctx.params;
  const body = await req.json();
  const block = await db.contentBlock.update({
    where: { id: bid },
    data: {
      ...(body.type !== undefined && { type: body.type }),
      ...(body.titleEn !== undefined && { titleEn: body.titleEn }),
      ...(body.titleCn !== undefined && { titleCn: body.titleCn }),
      ...(body.contentEn !== undefined && { contentEn: body.contentEn }),
      ...(body.contentCn !== undefined && { contentCn: body.contentCn }),
      ...(body.image !== undefined && { image: body.image }),
      ...(body.order !== undefined && { order: body.order }),
    },
  });
  return NextResponse.json(block);
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string; bid: string }> }) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { bid } = await ctx.params;
  await db.contentBlock.delete({ where: { id: bid } });
  return NextResponse.json({ ok: true });
}
