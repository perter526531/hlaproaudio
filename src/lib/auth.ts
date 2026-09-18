import { createHash, randomBytes } from "crypto";
import { cookies } from "next/headers";
import { db } from "./db";

const COOKIE_NAME = "ac_admin_sess";
const SESSION_TTL = 60 * 60 * 24 * 7; // 7 days

export function hashPassword(p: string): string {
  return createHash("sha256").update(p + "|ac-salt").digest("hex");
}

function hashToken(t: string): string {
  return createHash("sha256").update(t + "|ac-session-salt").digest("hex");
}

export async function createSession(userId: string) {
  // Rotate the token on each login (single-session model).
  const token = randomBytes(32).toString("hex");
  await db.adminUser.update({
    where: { id: userId },
    data: { sessionToken: hashToken(token) },
  });
  const store = await cookies();
  store.set(COOKIE_NAME, `${userId}:${token}`, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL,
    secure: process.env.NODE_ENV === "production",
  });
  return token;
}

export async function clearSession() {
  // Also invalidate the server-side token so a leaked cookie can't be reused.
  const store = await cookies();
  const raw = store.get(COOKIE_NAME)?.value;
  if (raw) {
    const [uid] = raw.split(":");
    if (uid) {
      try {
        await db.adminUser.updateMany({
          where: { id: uid },
          data: { sessionToken: null },
        });
      } catch {
        /* ignore */
      }
    }
  }
  store.delete(COOKIE_NAME);
}

export async function getAdminUser() {
  const store = await cookies();
  const raw = store.get(COOKIE_NAME)?.value;
  if (!raw) return null;
  const sep = raw.indexOf(":");
  if (sep <= 0) return null;
  const userId = raw.slice(0, sep);
  const token = raw.slice(sep + 1);
  if (!userId || !token) return null;
  try {
    const user = await db.adminUser.findUnique({ where: { id: userId } });
    // Validate the token hash against the stored value; reject if missing/mismatched.
    if (!user || !user.sessionToken || user.sessionToken !== hashToken(token)) {
      return null;
    }
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
