import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/md3/card";
import { MdIcon } from "@/components/md3/icon";
import { ButtonLink } from "@/components/md3/button";
import { requireAdmin } from "@/lib/auth/session";
import { getAdminSnapshot } from "@/lib/catalog";
import { formatMoney } from "@/lib/utils";

export default async function AdminPage() {
  await requireAdmin();
  const snapshot = await getAdminSnapshot();
  const revenue = snapshot.payments
    .filter((payment) => payment.status === "SUCCESS")
    .reduce((sum, payment) => sum + Number(payment.amount), 0);
  const pendingOrders = snapshot.orders.filter((order) => ["QUEUED", "PROCESSING", "RETRY_PENDING"].includes(order.status)).length;

  return (
    <AppShell admin>
      <div className="grid gap-6">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            ["Toplam kullanıcı", snapshot.users, "group"],
            ["Ciro", formatMoney(revenue), "payments"],
            ["Bekleyen sipariş", pendingOrders, "pending_actions"],
            ["Kategori", snapshot.categories, "category"]
          ].map(([label, value, icon]) => (
            <Card key={label}>
              <MdIcon name={String(icon)} className="text-[color:var(--sf-primary-soft)]" />
              <p className="mt-4 text-sm text-[color:var(--sf-muted)]">{label}</p>
              <p className="mt-1 text-3xl font-black">{value}</p>
            </Card>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="sf-card overflow-hidden p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-black">Hizmet yönetimi</h1>
                <p className="mt-1 text-sm text-[color:var(--sf-muted)]">Orijinal sağlayıcı mapping bilgileri yalnızca admin ekranlarında görünür.</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-sm font-bold ${snapshot.providerConnected ? "bg-emerald-400/12 text-emerald-200" : "bg-orange-400/12 text-orange-100"}`}>
                {snapshot.providerConnected ? "API aktif" : "API bağlantısı bekleniyor"}
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="sf-table min-w-[920px]">
                <thead>
                  <tr>
                    <th>Sosyofox hizmeti</th>
                    <th>WeSosyal service_id</th>
                    <th>Orijinal ad</th>
                    <th>Satış</th>
                    <th>Durum</th>
                  </tr>
                </thead>
                <tbody>
                  {snapshot.services.map((service) => (
                    <tr key={service.id}>
                      <td className="font-bold text-white">{service.sosyofoxServiceName}</td>
                      <td>{service.providerServiceId ?? "-"}</td>
                      <td>{service.providerServiceName ?? "-"}</td>
                      <td>{formatMoney(service.finalPrice.toString())}</td>
                      <td>{service.isVisible ? "Yayında" : "Gizli"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!snapshot.services.length ? (
                <div className="grid min-h-48 place-items-center text-center">
                  <div>
                    <MdIcon name="cloud_sync" className="text-5xl text-[color:var(--sf-primary-soft)]" />
                    <p className="mt-3 font-black">API bağlantısı bekleniyor</p>
                    <p className="mt-1 text-sm text-[color:var(--sf-muted)]">Anahtar kaydedildikten sonra senkronizasyon başlatılabilir.</p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="grid gap-6">
            <div className="sf-card p-5">
              <h2 className="text-xl font-black">Entegrasyonlar</h2>
              <p className="mt-1 text-sm text-[color:var(--sf-muted)]">WeSosyal API, servis senkronizasyonu, iyzico ve Google giriş ayarları entegrasyonlar altında toplandı.</p>
              <div className="mt-5">
                <ButtonLink href="/admin/integrations" icon="hub">Entegrasyonları aç</ButtonLink>
              </div>
            </div>
            <div className="sf-card p-5">
              <h2 className="text-xl font-black">Kullanıcı kartları</h2>
              <p className="mt-1 text-sm text-[color:var(--sf-muted)]">Kayıtlı kullanıcılar ve popup detay kartları ayarlar/kullanıcı yönetimi ekranında.</p>
              <div className="mt-5">
                <ButtonLink href="/admin/settings" icon="group" variant="secondary">Kullanıcıları aç</ButtonLink>
              </div>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
