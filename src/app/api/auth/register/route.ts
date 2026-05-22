import { NextResponse, type NextRequest } from "next/server";
import { getPrisma, hasDatabaseUrl } from "@/lib/db/prisma";
import { hashPassword } from "@/lib/auth/password";
import { createSession, createTemporaryUserSession } from "@/lib/auth/session";
import { registerSchema } from "@/lib/validation/auth";
import { checkRateLimit } from "@/lib/security/rate-limit";

export async function POST(request: NextRequest) {
  const rate = checkRateLimit(`register:${request.headers.get("x-forwarded-for") ?? "local"}`, 10);
  if (!rate.ok) return NextResponse.json({ error: "Çok fazla deneme." }, { status: 429 });

  const payload = registerSchema.safeParse(await request.json().catch(() => null));
  if (!payload.success) return NextResponse.json({ error: "Geçersiz kayıt bilgileri." }, { status: 400 });

  if (!hasDatabaseUrl()) {
    await createTemporaryUserSession({
      email: payload.data.email.toLowerCase(),
      fullName: payload.data.fullName,
      phone: payload.data.phone
    });
    return NextResponse.json({ ok: true, role: "USER" });
  }

  try {
    const prisma = getPrisma();
    const existing = await prisma.user.findUnique({ where: { email: payload.data.email.toLowerCase() } });
    if (existing) return NextResponse.json({ error: "Bu e-posta zaten kayıtlı." }, { status: 409 });

    const user = await prisma.user.create({
      data: {
        email: payload.data.email.toLowerCase(),
        passwordHash: await hashPassword(payload.data.password),
        profile: { create: { fullName: payload.data.fullName, phone: payload.data.phone } },
        wallet: { create: { balance: 0 } }
      }
    });

    await createSession(user.id);
    return NextResponse.json({ ok: true, role: user.role });
  } catch {
    await createTemporaryUserSession({
      email: payload.data.email.toLowerCase(),
      fullName: payload.data.fullName,
      phone: payload.data.phone
    });
    return NextResponse.json({ ok: true, role: "USER" });
  }
}
