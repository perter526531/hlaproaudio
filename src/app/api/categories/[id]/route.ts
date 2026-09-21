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

  // Prevent creating a parent-cycle: reject if the new parentId is the category
  // itself or one of its descendants.
  if (body.parentId !== undefined && body.parentId) {
    if (body.parentId === id) {
      return NextResponse.json(
        { error: "A category cannot be its own parent." },
        { status: 400 }
      );
    }
    const descendants = await collectDescendants(id);
    if (descendants.has(body.parentId)) {
      return NextResponse.json(
        { error: "A category cannot be moved into one of its own descendants." },
        { status: 400 }
      );
    }
  }

  const cat = await db.category.update({
    where: { id },
    data: {
      ...(body.parentId !== undefined && { parentId: body.parentId || null }),
      ...(body.nameEn !== undefined && { nameEn: body.nameEn }),
      ...(body.nameCn !== undefined && { nameCn: body.nameCn }),
      ...(body.descEn !== undefined && { descEn: body.descEn }),
      ...(body.descCn !== undefined && { descCn: body.descCn }),
      ...(body.icon !== undefined && { icon: body.icon }),
      ...(body.image !== undefined && { image: body.image }),
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

// Collect a category id and all of its descendants (used for cycle detection).
async function collectDescendants(rootId: string): Promise<Set<string>> {
  const out = new Set<string>([rootId]);
  const stack = [rootId];
  while (stack.length) {
    const cur = stack.pop()!;
    const children = await db.category.findMany({
      where: { parentId: cur },
      select: { id: true },
    });
    for (const c of children) {
      if (!out.has(c.id)) {
        out.add(c.id);
        stack.push(c.id);
      }
    }
  }
  return out;
}
