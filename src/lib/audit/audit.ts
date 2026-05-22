import type { Prisma } from "@prisma/client";
import { getPrisma, hasDatabaseUrl } from "@/lib/db/prisma";

export async function writeAuditLog(input: {
  actorId?: string | null;
  action: string;
  entity: string;
  entityId?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  metadata?: Prisma.InputJsonValue;
}) {
  if (!hasDatabaseUrl()) return null;

  try {
    return await getPrisma().auditLog.create({
      data: {
        actorId: input.actorId?.startsWith("bootstrap-") || input.actorId?.startsWith("temp-") ? null : input.actorId ?? null,
        action: input.action,
        entity: input.entity,
        entityId: input.entityId ?? null,
        ipAddress: input.ipAddress ?? null,
        userAgent: input.userAgent ?? null,
        metadata: input.metadata ?? {}
      }
    });
  } catch {
    return null;
  }
}
