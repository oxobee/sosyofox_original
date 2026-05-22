import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export function getPrisma() {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : []
    });
  }

  return globalForPrisma.prisma;
}

export function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL?.trim());
}

export type DbClient = ReturnType<typeof getPrisma>;
