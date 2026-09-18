import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string; iid: string }> }) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { iid } = await ctx.params;
  const body = await req.json();
  const img = await db.productImage.update({
    where: { id: iid },
    data: {
      ...(body.url !== undefined && { url: body.url }),
      ...(body.alt !== undefined && { alt: body.alt }),
      ...(body.order !== undefined && { order: body.order }),
    },
  });
  return NextResponse.json(img);
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string; iid: string }> }) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id, iid } = await ctx.params;
  // Look up the image being deleted so we know whether it was the cover.
  const deleting = await db.productImage.findUnique({ where: { id: iid } });
  await db.productImage.delete({ where: { id: iid } });

  // Only re-sync the cover when the deleted image WAS the cover — otherwise
  // preserve any custom cover URL the admin may have set independently.
  if (deleting) {
    const product = await db.product.findUnique({
      where: { id },
      select: { coverImage: true },
    });
    if (product && product.coverImage === deleting.url) {
      const remaining = await db.productImage.findMany({
        where: { productId: id },
        orderBy: { order: "asc" },
      });
      await db.product.update({
        where: { id },
        data: { coverImage: remaining[0]?.url ?? null },
      });
    }
  }
  return NextResponse.json({ ok: true });
}
