import { NextResponse, type NextRequest } from "next/server";
import { requireUser } from "@/lib/auth/session";
import { getPrisma } from "@/lib/db/prisma";
import { walletTopupSchema } from "@/lib/validation/order";
import { writeAuditLog } from "@/lib/audit/audit";

export async function POST(request: NextRequest) {
  const user = await requireUser();
  const payload = walletTopupSchema.safeParse(await request.json().catch(() => null));
  if (!payload.success) return NextResponse.json({ error: "Geçersiz ödeme bilgileri." }, { status: 400 });

  const payment = await getPrisma().payment.create({
    data: {
      userId: user.id,
      provider: payload.data.provider,
      amount: payload.data.amount,
      status: payload.data.provider === "BANK_TRANSFER" ? "WAITING_APPROVAL" : "PENDING"
    }
  });

  await writeAuditLog({ actorId: user.id, action: "wallet.topup.created", entity: "Payment", entityId: payment.id });
  return NextResponse.json({ ok: true, paymentId: payment.id, status: payment.status });
}
