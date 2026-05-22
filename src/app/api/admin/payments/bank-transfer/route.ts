import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { getPrisma } from "@/lib/db/prisma";
import { writeAuditLog } from "@/lib/audit/audit";

export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  const { paymentId, action } = await request.json().catch(() => ({}));
  if (!paymentId || !["approve", "reject"].includes(action)) {
    return NextResponse.json({ error: "Geçersiz talep." }, { status: 400 });
  }

  const prisma = getPrisma();
  await prisma.$transaction(async (tx) => {
    const payment = await tx.payment.findUnique({ where: { id: paymentId } });
    if (!payment || !payment.userId) throw new Error("Ödeme bulunamadı.");

    if (action === "approve") {
      await tx.payment.update({ where: { id: payment.id }, data: { status: "SUCCESS", paidAt: new Date() } });
      await tx.wallet.update({ where: { userId: payment.userId }, data: { balance: { increment: payment.amount } } });
      await tx.walletTransaction.create({
        data: {
          userId: payment.userId,
          paymentId: payment.id,
          type: "CREDIT",
          amount: payment.amount,
          description: "Havale/EFT bakiye onayı"
        }
      });
    } else {
      await tx.payment.update({ where: { id: payment.id }, data: { status: "FAILED" } });
    }
  });

  await writeAuditLog({ actorId: admin.id, action: `bank_transfer.${action}`, entity: "Payment", entityId: paymentId });
  return NextResponse.json({ ok: true });
}
