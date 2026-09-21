import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

type CategoryRow = {
  id: string;
  parentId: string | null;
  nameEn: string;
  nameCn: string;
  descEn: string | null;
  descCn: string | null;
  icon: string | null;
  order: number;
};

type CatWithChildren = CategoryRow & { children: CatWithChildren[] };

// Public: get full category tree (3 levels)
export async function GET() {
  const all = await db.category.findMany({
    orderBy: { order: "asc" },
  });
  const tree = buildTree(all as CategoryRow[], null);
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
      image: body.image || null,
      order: body.order ?? 0,
    },
  });
  return NextResponse.json(cat);
}

// Recursively build a tree from a flat list, rooted at parentId.
// A visited set guards against cycles (which would otherwise infinite-loop),
// and a depth cap enforces the 3-level invariant.
function buildTree(list: CategoryRow[], parentId: string | null): CatWithChildren[] {
  return list
    .filter((c) => (c.parentId ?? null) === parentId)
    .map((c) => ({ ...c, children: buildChildren(list, c.id, new Set([c.id]), 1) }));
}

function buildChildren(
  list: CategoryRow[],
  parentId: string,
  visited: Set<string>,
  depth: number
): CatWithChildren[] {
  if (depth > 3) return []; // cap at 3 levels
  return list
    .filter((c) => (c.parentId ?? null) === parentId && !visited.has(c.id))
    .map((c) => {
      const nextVisited = new Set(visited);
      nextVisited.add(c.id);
      return { ...c, children: buildChildren(list, c.id, nextVisited, depth + 1) };
    });
}
