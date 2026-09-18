import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { Prisma } from "@prisma/client";

// Admin: list submissions (optional status filter)
export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const where: Prisma.FormSubmissionWhereInput = {};
  if (status) where.status = status;
  const list = await db.formSubmission.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(list);
}

// Public: anyone can submit the inquiry form
export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.companyName || !body.contactPerson || !body.phone || !body.requirements) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }
  const sub = await db.formSubmission.create({
    data: {
      companyName: String(body.companyName).slice(0, 200),
      contactPerson: String(body.contactPerson).slice(0, 100),
      phone: String(body.phone).slice(0, 50),
      email: body.email ? String(body.email).slice(0, 100) : null,
      requirements: String(body.requirements).slice(0, 2000),
      sourcePage: body.sourcePage || null,
    },
  });
  return NextResponse.json(sub);
}
