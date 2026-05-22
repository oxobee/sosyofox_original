import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/db/prisma";
import { getWesosyalAdapter } from "@/lib/providers/wesosyal/service";

export async function POST() {
  const prisma = getPrisma();
  const orders = await prisma.order.findMany({
    where: { status: { in: ["QUEUED", "PROCESSING", "RETRY_PENDING"] }, providerOrderId: { not: null } },
    take: 50
  });

  if (!orders.length) return NextResponse.json({ ok: true, checked: 0 });

  const adapter = await getWesosyalAdapter();
  const statuses = await adapter.syncOrderStatuses(orders.map((order) => order.providerOrderId!).filter(Boolean));

  for (const status of statuses) {
    const mapped =
      status.status === "completed" ? "COMPLETED" :
      status.status === "failed" ? "FAILED" :
      status.status === "cancelled" ? "CANCELLED" :
      status.status === "processing" ? "PROCESSING" : "QUEUED";

    await prisma.order.updateMany({
      where: { providerOrderId: status.orderId },
      data: { status: mapped, providerResponse: status.raw as object }
    });
  }

  return NextResponse.json({ ok: true, checked: orders.length });
}
