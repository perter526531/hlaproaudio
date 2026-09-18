import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword, createSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  if (!username || !password) {
    return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
  }
  const user = await db.adminUser.findUnique({ where: { username } });
  if (!user || user.passwordHash !== hashPassword(password)) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
  await createSession(user.id);
  return NextResponse.json({ ok: true, user: { id: user.id, username: user.username } });
}
