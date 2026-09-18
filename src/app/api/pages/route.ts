import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

// Public: list all pages with content blocks
export async function GET() {
  const pages = await db.sitePage.findMany({
    include: { contentBlocks: { orderBy: { order: "asc" } } },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(pages);
}

// Admin: create a page
export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const page = await db.sitePage.create({
    data: {
      slug: body.slug,
      titleEn: body.titleEn || "Untitled",
      titleCn: body.titleCn || "未命名",
      bannerImage: body.bannerImage || null,
      bannerTitleEn: body.bannerTitleEn || null,
      bannerTitleCn: body.bannerTitleCn || null,
      bannerSubEn: body.bannerSubEn || null,
      bannerSubCn: body.bannerSubCn || null,
      metaEn: body.metaEn || null,
      metaCn: body.metaCn || null,
    },
  });
  return NextResponse.json(page);
}
