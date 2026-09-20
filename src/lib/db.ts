import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    // Only surface warnings + errors; the per-query log was extremely verbose
    // and made real errors hard to spot in dev.log.
    log: ["warn", "error"],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db