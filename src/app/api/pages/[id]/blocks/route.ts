import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

// Admin: add a content block to a page
export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const body = await req.json();
  const block = await db.contentBlock.create({
    data: {
      pageId: id,
      type: body.type || "text",
      titleEn: body.titleEn || null,
      titleCn: body.titleCn || null,
      contentEn: body.contentEn || null,
      contentCn: body.contentCn || null,
      image: body.image || null,
      order: body.order ?? 0,
    },
  });
  return NextResponse.json(block);
}
