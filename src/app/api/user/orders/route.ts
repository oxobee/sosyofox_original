import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth/session";
import { getPrisma } from "@/lib/db/prisma";
import { orderSchema } from "@/lib/validation/order";
import { calculateTotalsFromUnitPrice } from "@/lib/pricing/pricing";
import { writeAuditLog } from "@/lib/audit/audit";
import { getWesosyalAdapter } from "@/lib/providers/wesosyal/service";

function buildLocalOptions(payload: z.infer<typeof orderSchema>) {
  return {
    gender: payload.gender ?? "all",
    notificationEnabled: Boolean(payload.notificationEnabled),
    moderatorNote: payload.moderatorNote ?? null,
    cities: payload.cities ?? [],
    include: payload.include ?? null,
    exclude: payload.exclude ?? null,
    comments: payload.comments ?? null,
    commentsSentToProvider: Boolean(payload.comments),
    perDay: payload.perDay ?? null,
    perDaySentToProvider: Boolean(payload.perDay)
  };
}

export async function POST(request: NextRequest) {
  const user = await requireUser();
  const payload = orderSchema.safeParse(await request.json().catch(() => null));
  if (!payload.success) return NextResponse.json({ error: "Geçersiz sipariş bilgileri." }, { status: 400 });

  const prisma = getPrisma();
  const requestedOptions = buildLocalOptions(payload.data);
  const result = await prisma.$transaction(async (tx) => {
    const service = await tx.service.findFirst({
      where: { id: payload.data.serviceId, isVisible: true }
    });
    if (!service) throw new Error("Hizmet bulunamadı.");
    if (payload.data.quantity < service.min || payload.data.quantity > service.max) {
      throw new Error("Adet aralığı geçersiz.");
    }

    const wallet = await tx.wallet.findUnique({ where: { userId: user.id } });
    const totals = calculateTotalsFromUnitPrice({
      unitPrice: service.finalPrice,
      originalRate: service.originalRate,
      quantity: payload.data.quantity
    });

    if (!wallet || Number(wallet.balance) < totals.totalPrice) {
      throw new Error("Yetersiz bakiye.");
    }

    const order = await tx.order.create({
      data: {
        userId: user.id,
        serviceId: service.id,
        targetUrl: payload.data.targetUrl,
        quantity: payload.data.quantity,
        unitPrice: totals.unitPrice,
        totalPrice: totals.totalPrice,
        providerCost: totals.providerCost,
        netProfit: totals.netProfit,
        providerResponse: { localOptions: requestedOptions },
        status: "QUEUED",
        statusHistory: { create: { status: "QUEUED", note: "Sipariş alındı.", metadata: { localOptions: requestedOptions } } }
      }
    });

    await tx.wallet.update({
      where: { userId: user.id },
      data: { balance: { decrement: totals.totalPrice } }
    });

    await tx.walletTransaction.create({
      data: {
        userId: user.id,
        orderId: order.id,
        type: "DEBIT",
        amount: totals.totalPrice,
        description: "Sipariş ödemesi"
      }
    });

    return order;
  });

  try {
    const service = await prisma.service.findUnique({ where: { id: payload.data.serviceId } });
    if (service?.providerServiceId && !service.manualProcessing) {
      const localOptions = buildLocalOptions(payload.data);
      const adapter = await getWesosyalAdapter();
      const providerOrder = await adapter.createOrder({
        serviceId: service.providerServiceId,
        link: payload.data.targetUrl,
        quantity: payload.data.quantity,
        extraParams: {
          comments: payload.data.comments,
          usernames: payload.data.usernames,
          hashtags: payload.data.hashtags,
          runs: payload.data.runs,
          interval: payload.data.interval,
          gender: payload.data.gender === "all" ? undefined : payload.data.gender,
          per_day: payload.data.perDay,
          include: payload.data.include,
          exclude: payload.data.exclude,
          username: payload.data.username,
          answer_number: payload.data.answerNumber,
          media_url: payload.data.mediaUrl || undefined
        }
      });

      await prisma.order.update({
        where: { id: result.id },
        data: {
          providerOrderId: providerOrder.orderId,
          providerResponse: { provider: providerOrder.raw, localOptions },
          status: "PROCESSING",
          statusHistory: { create: { status: "PROCESSING", note: "Sağlayıcı API siparişi oluşturdu.", metadata: { localOptions } } }
        }
      });
    }
  } catch (error) {
    await prisma.order.update({
      where: { id: result.id },
      data: {
        status: "RETRY_PENDING",
        providerResponse: { error: error instanceof Error ? error.message : "Sağlayıcı siparişi oluşturulamadı.", localOptions: requestedOptions },
        statusHistory: { create: { status: "RETRY_PENDING", note: "Sağlayıcı API hatası; sipariş tekrar denenecek.", metadata: { localOptions: requestedOptions } } }
      }
    });
  }

  await writeAuditLog({ actorId: user.id, action: "order.created", entity: "Order", entityId: result.id });
  return NextResponse.json({ ok: true, orderId: result.id });
}
