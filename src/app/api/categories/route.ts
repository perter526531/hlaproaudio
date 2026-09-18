import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

// Public: get full category tree (3 levels)
export async function GET() {
  const all = await db.category.findMany({
    orderBy: { order: "asc" },
  });
  const tree = buildTree(all, null);
  return NextResponse.json(tree);
}

// Admin: create a category
export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const cat = await db.category.create({
    data: {
      parentId: body.parentId || null,
      nameEn: body.nameEn || "Category",
      nameCn: body.nameCn || "分类",
      descEn: body.descEn || null,
      descCn: body.descCn || null,
      icon: body.icon || null,
      order: body.order ?? 0,
    },
  });
  return NextResponse.json(cat);
}

type CatWithChildren = Awaited<ReturnType<typeof db.category.findMany>>[number] & {
  children: CatWithChildren[];
};

function buildTree(
  list: Awaited<ReturnType<typeof db.category.findMany>>,
  parentId: string | null
): CatWithChildren[] {
  return list
    .filter((c) => (c.parentId ?? null) === parentId)
    .map((c) => ({ ...c, children: buildTree(list, c.id) }));
}
