import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const sub = await db.formSubmission.findUnique({ where: { id } });
  if (!sub) return NextResponse.json({ error: "Not found" }, { status: 404 });
  // mark read on view
  if (sub.status === "new") {
    await db.formSubmission.update({ where: { id }, data: { status: "read" } });
  }
  return NextResponse.json(sub);
}

export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const body = await req.json();
  const sub = await db.formSubmission.update({
    where: { id },
    data: {
      ...(body.status !== undefined && { status: body.status }),
      ...(body.companyName !== undefined && { companyName: body.companyName }),
      ...(body.contactPerson !== undefined && { contactPerson: body.contactPerson }),
      ...(body.phone !== undefined && { phone: body.phone }),
      ...(body.email !== undefined && { email: body.email }),
      ...(body.requirements !== undefined && { requirements: body.requirements }),
    },
  });
  return NextResponse.json(sub);
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  await db.formSubmission.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
