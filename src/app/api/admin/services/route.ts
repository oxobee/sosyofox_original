import { NextResponse, type NextRequest } from "next/server";
import { getPrisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/session";
import { aiDescriptionSchema, bulkPricingSchema, bulkVisibilitySchema, categoryUpdateSchema, serviceUpdateSchema } from "@/lib/validation/admin";
import { calculateAdjustedPrice } from "@/lib/pricing/pricing";
import { decryptSecret } from "@/lib/security/encryption";

function actorId(id: string) {
  return id === "bootstrap-admin" ? null : id;
}

export async function PATCH(request: NextRequest) {
  const user = await requireAdmin();
  const body = await request.json().catch(() => null);
  const kind = typeof body?.kind === "string" ? body.kind : "service";

  if (kind === "category") {
    const payload = categoryUpdateSchema.safeParse(body);
    if (!payload.success) return NextResponse.json({ error: "Geçersiz kategori verisi." }, { status: 400 });

    const category = await getPrisma().category.update({
      where: { id: payload.data.id },
      data: {
        sosyofoxCategoryName: payload.data.sosyofoxCategoryName,
        description: payload.data.description || null,
        icon: payload.data.icon,
        isVisible: payload.data.isVisible,
        isFeatured: payload.data.isFeatured
      }
    });

    await getPrisma().auditLog.create({
      data: {
        actorId: actorId(user.id),
        action: "category.updated",
        entity: "Category",
        entityId: category.id,
        metadata: { name: category.sosyofoxCategoryName, isVisible: category.isVisible }
      }
    });

    return NextResponse.json({ ok: true, category });
  }

  const payload = serviceUpdateSchema.safeParse(body);
  if (!payload.success) return NextResponse.json({ error: "Geçersiz servis verisi." }, { status: 400 });

  const service = await getPrisma().service.update({
    where: { id: payload.data.id },
    data: {
      sosyofoxServiceName: payload.data.sosyofoxServiceName,
      sosyofoxCategoryName: payload.data.sosyofoxCategoryName || null,
      customDescription: payload.data.customDescription || null,
      icon: payload.data.icon,
      finalPrice: payload.data.finalPrice,
      profitValue: payload.data.profitValue,
      isVisible: payload.data.isVisible,
      isFeatured: payload.data.isFeatured
    }
  });

  await getPrisma().auditLog.create({
    data: {
      actorId: actorId(user.id),
      action: "service.updated",
      entity: "Service",
      entityId: service.id,
      metadata: { name: service.sosyofoxServiceName, isVisible: service.isVisible, finalPrice: service.finalPrice.toString() }
    }
  });

  return NextResponse.json({ ok: true, service });
}

export async function POST(request: NextRequest) {
  const user = await requireAdmin();
  const body = await request.json().catch(() => null);
  if (body?.action === "pricing") {
    const payload = bulkPricingSchema.safeParse(body);
    if (!payload.success) return NextResponse.json({ error: "Geçersiz toplu fiyat verisi." }, { status: 400 });

    const prisma = getPrisma();
    const services = await prisma.service.findMany({
      where: { id: { in: payload.data.ids } },
      select: { id: true, originalRate: true, finalPrice: true }
    });
    const percent = payload.data.percent ?? 0;

    await prisma.$transaction(services.map((service) => {
      const signedPercent = payload.data.operation === "increase_percent"
        ? percent
        : payload.data.operation === "decrease_percent"
          ? -percent
          : 0;
      const newPrice = payload.data.operation === "match_original"
        ? Number(service.originalRate)
        : calculateAdjustedPrice(service.originalRate, signedPercent);

      return prisma.service.update({
        where: { id: service.id },
        data: {
          finalPrice: newPrice,
          profitValue: signedPercent
        }
      });
    }));

    await prisma.auditLog.create({
      data: {
        actorId: actorId(user.id),
        action: "service.bulk_pricing",
        entity: "Service",
        metadata: { ids: payload.data.ids, operation: payload.data.operation, percent }
      }
    });

    return NextResponse.json({ ok: true, count: services.length });
  }

  const payload = bulkVisibilitySchema.safeParse(body);
  if (!payload.success) return NextResponse.json({ error: "Geçersiz toplu işlem verisi." }, { status: 400 });

  const prisma = getPrisma();
  if (payload.data.entity === "category") {
    await prisma.category.updateMany({
      where: { id: { in: payload.data.ids } },
      data: { isVisible: payload.data.isVisible }
    });
  } else {
    await prisma.service.updateMany({
      where: { id: { in: payload.data.ids } },
      data: { isVisible: payload.data.isVisible }
    });
  }

  await prisma.auditLog.create({
    data: {
      actorId: actorId(user.id),
      action: `${payload.data.entity}.bulk_visibility`,
      entity: payload.data.entity === "category" ? "Category" : "Service",
      metadata: { ids: payload.data.ids, isVisible: payload.data.isVisible }
    }
  });

  return NextResponse.json({ ok: true, count: payload.data.ids.length });
}

export async function PUT(request: NextRequest) {
  const user = await requireAdmin();
  const payload = aiDescriptionSchema.safeParse(await request.json().catch(() => null));
  if (!payload.success) return NextResponse.json({ error: "Geçersiz servis verisi." }, { status: 400 });

  const prisma = getPrisma();
  const service = await prisma.service.findUnique({ where: { id: payload.data.id } });
  if (!service) return NextResponse.json({ error: "Servis bulunamadı." }, { status: 404 });

  const source = service.description || service.customDescription || service.providerServiceName || service.sosyofoxServiceName;
  let rewritten = [
    `${service.sosyofoxServiceName} hizmeti, Sosyofox üzerinden kontrollü ve güvenli sipariş akışıyla sunulur.`,
    source
      .replace(/\s+/g, " ")
      .replace(/wesosyal/gi, "Sosyofox")
      .trim(),
    `Sipariş vermeden önce minimum ${service.min} ve maksimum ${service.max} adet aralığını kontrol edin.`
  ].filter(Boolean).join("\n\n");

  const openaiProvider = await prisma.apiProvider.findUnique({
    where: { name: "openai" },
    include: { credentials: { where: { isActive: true }, take: 1 } }
  });
  const openaiKey = openaiProvider?.credentials[0]?.encryptedValue
    ? decryptSecret(openaiProvider.credentials[0].encryptedValue)
    : process.env.OPENAI_API_KEY;

  if (openaiKey) {
    try {
      const response = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
          input: [
            {
              role: "system",
              content: "Sosyofox markası için Türkçe, özgün, satış odaklı ama abartısız hizmet açıklaması yaz. Sağlayıcı/WeSosyal adını asla kullanma. Çıktı sadece açıklama metni olsun."
            },
            {
              role: "user",
              content: `Hizmet adı: ${service.sosyofoxServiceName}\nOrijinal hizmet adı: ${service.providerServiceName ?? ""}\nMin: ${service.min}\nMax: ${service.max}\nAçıklama: ${source}`
            }
          ],
          max_output_tokens: 450
        })
      });
      const data = await response.json() as { output_text?: string };
      if (response.ok && data.output_text?.trim()) {
        rewritten = data.output_text.trim();
      }
    } catch {
      // Fallback text above keeps the admin action functional when the AI provider is unreachable.
    }
  }

  const updated = await prisma.service.update({
    where: { id: service.id },
    data: { customDescription: rewritten.slice(0, 6000) }
  });

  await prisma.auditLog.create({
    data: {
      actorId: actorId(user.id),
      action: "service.description_rewritten",
      entity: "Service",
      entityId: service.id,
      metadata: { providerServiceId: service.providerServiceId }
    }
  });

  return NextResponse.json({ ok: true, description: updated.customDescription });
}
