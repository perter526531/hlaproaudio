import { createHash, randomBytes } from "crypto";
import { cookies } from "next/headers";
import { db } from "./db";

const COOKIE_NAME = "ac_admin_sess";
const SESSION_TTL = 60 * 60 * 24 * 7; // 7 days

export function hashPassword(p: string): string {
  return createHash("sha256").update(p + "|ac-salt").digest("hex");
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("hex");
  const store = await cookies();
  store.set(COOKIE_NAME, `${userId}:${token}`, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL,
  });
  return token;
}

export async function clearSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getAdminUser() {
  const store = await cookies();
  const raw = store.get(COOKIE_NAME)?.value;
  if (!raw) return null;
  const [userId] = raw.split(":");
  if (!userId) return null;
  try {
    const user = await db.adminUser.findUnique({ where: { id: userId } });
    return user;
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const user = await getAdminUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}
