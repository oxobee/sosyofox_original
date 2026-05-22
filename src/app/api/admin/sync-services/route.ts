import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { getPrisma, hasDatabaseUrl } from "@/lib/db/prisma";
import { getWesosyalAdapter } from "@/lib/providers/wesosyal/service";
import { slugify } from "@/lib/utils";
import { writeAuditLog } from "@/lib/audit/audit";

function renameService(original: string) {
  return original
    .replace(/instagram/gi, "Instagram")
    .replace(/tiktok/gi, "TikTok")
    .replace(/youtube/gi, "YouTube")
    .replace(/takipçi/gi, "Kitle Büyüme")
    .replace(/beğeni/gi, "Etkileşim")
    .trim();
}

export async function POST(request: NextRequest) {
  const actor = await requireAdmin();
  const redirectUrl = new URL("/admin/integrations", request.url);

  if (!hasDatabaseUrl()) {
    redirectUrl.searchParams.set("error", "database");
    return NextResponse.redirect(redirectUrl);
  }

  try {
    const adapter = await getWesosyalAdapter();
    const services = await adapter.syncServices();
    const prisma = getPrisma();

    for (const providerService of services) {
      const categorySlug = slugify(providerService.categoryName);
      const category = await prisma.category.upsert({
        where: { slug: categorySlug },
        update: { providerCategoryName: providerService.categoryName },
        create: {
          providerCategoryName: providerService.categoryName,
          sosyofoxCategoryName: providerService.categoryName,
          slug: categorySlug,
          icon: "category",
          isVisible: false
        }
      });

      const sosyofoxName = renameService(providerService.serviceName);
      const finalPrice = Number(providerService.rate.toFixed(4));
      const serviceSlug = slugify(`${providerService.serviceId}-${sosyofoxName}`);
      const metadata = {
        type: providerService.type ?? "Default",
        dripfeed: providerService.dripfeed ?? false,
        refill: providerService.refill ?? false,
        cancel: providerService.cancel ?? false
      };

      const service = await prisma.service.upsert({
        where: { slug: serviceSlug },
        update: {
          categoryId: category.id,
          providerCategoryName: providerService.categoryName,
          providerServiceName: providerService.serviceName,
          min: providerService.min,
          max: providerService.max,
          originalRate: providerService.rate,
          description: providerService.description,
          apiStatus: providerService.status ?? "active",
          finalPrice,
          profitValue: 0
        },
        create: {
          categoryId: category.id,
          providerServiceId: providerService.serviceId,
          providerCategoryName: providerService.categoryName,
          providerServiceName: providerService.serviceName,
          min: providerService.min,
          max: providerService.max,
          originalRate: providerService.rate,
          description: providerService.description,
          apiStatus: providerService.status ?? "active",
          sosyofoxCategoryName: category.sosyofoxCategoryName,
          sosyofoxServiceName: sosyofoxName,
          slug: serviceSlug,
          customDescription: providerService.description,
          profitValue: 0,
          finalPrice,
          isVisible: false
        }
      });

      const existingMapping = await prisma.serviceMapping.findFirst({
        where: { serviceId: service.id, providerName: "wesosyal" }
      });
      if (existingMapping) {
        await prisma.serviceMapping.update({
          where: { id: existingMapping.id },
          data: { providerRef: providerService.serviceId, originalName: providerService.serviceName, metadata }
        });
      } else {
        await prisma.serviceMapping.create({
          data: {
            serviceId: service.id,
            providerName: "wesosyal",
            providerRef: providerService.serviceId,
            originalName: providerService.serviceName,
            metadata
          }
        });
      }
    }

    await writeAuditLog({
      actorId: actor.id,
      action: "services.synced",
      entity: "Service",
      metadata: { count: services.length }
    });

    redirectUrl.searchParams.set("synced", String(services.length));
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    redirectUrl.searchParams.set("error", error instanceof Error ? error.message : "sync");
    return NextResponse.redirect(redirectUrl);
  }
}
