import { notFound } from "next/navigation";
import { PublicShell } from "@/components/layout/public-shell";
import { ServiceOrderForm } from "@/components/public/service-order-form";
import { getServiceBySlug } from "@/lib/catalog";

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  const metadata = service.mappings[0]?.metadata;
  const providerType = String(metadata && typeof metadata === "object" && "type" in metadata ? metadata.type : "Default");
  const dripfeed = Boolean(metadata && typeof metadata === "object" && "dripfeed" in metadata ? metadata.dripfeed : false);
  const refill = Boolean(metadata && typeof metadata === "object" && "refill" in metadata ? metadata.refill : false);
  const cancel = Boolean(metadata && typeof metadata === "object" && "cancel" in metadata ? metadata.cancel : false);

  return (
    <PublicShell>
      <main className="sf-container py-8 sm:py-10">
        <ServiceOrderForm
          serviceId={service.id}
          serviceName={service.sosyofoxServiceName}
          categoryName={service.category?.sosyofoxCategoryName ?? service.sosyofoxCategoryName ?? "Sosyal medya hizmeti"}
          icon={service.icon}
          providerType={providerType}
          min={service.min}
          max={service.max}
          unitPrice={service.finalPrice.toString()}
          originalRate={service.originalRate.toString()}
          description={service.description || service.customDescription || "Bu hizmet için sipariş formu, ödeme ve takip akışı panel üzerinden yönetilir."}
          warningText={service.warningText}
          dripfeed={dripfeed}
          refill={refill}
          cancel={cancel}
        />
      </main>
    </PublicShell>
  );
}
