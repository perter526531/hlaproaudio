import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const body = await req.json();
  const cat = await db.category.update({
    where: { id },
    data: {
      ...(body.parentId !== undefined && { parentId: body.parentId || null }),
      ...(body.nameEn !== undefined && { nameEn: body.nameEn }),
      ...(body.nameCn !== undefined && { nameCn: body.nameCn }),
      ...(body.descEn !== undefined && { descEn: body.descEn }),
      ...(body.descCn !== undefined && { descCn: body.descCn }),
      ...(body.icon !== undefined && { icon: body.icon }),
      ...(body.order !== undefined && { order: body.order }),
    },
  });
  return NextResponse.json(cat);
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  // cascade deletes children + products
  await db.category.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
