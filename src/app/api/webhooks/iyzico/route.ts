import { NextResponse, type NextRequest } from "next/server";
import { getPrisma } from "@/lib/db/prisma";
import { verifyIyzicoCallback } from "@/lib/payments/iyzico";
import { writeAuditLog } from "@/lib/audit/audit";

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => ({}));
  if (!verifyIyzicoCallback(payload)) {
    return NextResponse.json({ error: "Geçersiz webhook." }, { status: 400 });
  }

  const prisma = getPrisma();
  const payment = await prisma.payment.findFirst({ where: { externalId: payload.paymentId } });
  if (!payment || !payment.userId) return NextResponse.json({ ok: true });

  if (payload.status === "success") {
    await prisma.$transaction(async (tx) => {
      await tx.payment.update({ where: { id: payment.id }, data: { status: "SUCCESS", paidAt: new Date(), metadata: payload } });
      await tx.wallet.update({ where: { userId: payment.userId! }, data: { balance: { increment: payment.amount } } });
      await tx.walletTransaction.create({
        data: {
          userId: payment.userId!,
          paymentId: payment.id,
          type: "CREDIT",
          amount: payment.amount,
          description: "Kart ödemesi bakiye yükleme"
        }
      });
    });
  } else {
    await prisma.payment.update({ where: { id: payment.id }, data: { status: "FAILED", metadata: payload } });
  }

  await writeAuditLog({ action: "iyzico.webhook", entity: "Payment", entityId: payment.id, metadata: payload });
  return NextResponse.json({ ok: true });
}
