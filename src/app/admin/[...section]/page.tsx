import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/md3/card";
import { MdIcon } from "@/components/md3/icon";
import { TextField } from "@/components/md3/text-field";
import { UserDirectory } from "@/components/admin/user-directory";
import { ServiceManager } from "@/components/admin/service-manager";
import { requireAdmin } from "@/lib/auth/session";
import { getAdminServicesSnapshot, getAdminUsersSnapshot, getIntegrationSnapshot } from "@/lib/catalog";

const titles: Record<string, [string, string, string]> = {
  users: ["Kullanıcı Yönetimi", "Kayıtlı kullanıcılar, bakiye, sipariş, ödeme ve destek kayıtları.", "group"],
  settings: ["Ayarlar", "Kullanıcı kartları, sistem görünümü ve yönetim aksiyonları.", "settings"],
  orders: ["Sipariş Yönetimi", "Sipariş durumu, maliyet, net kâr, yeniden dene, iptal ve iade akışları.", "shopping_bag"],
  services: ["Hizmet ve Kategori Yönetimi", "Toplu göster/gizle, fiyat, kategori taşıma, SEO ve AI öneri kontrolleri.", "deployed_code"],
  integrations: ["Entegrasyonlar", "WeSosyal API, ödeme entegrasyonları, Google OAuth ve sistem anahtarları.", "hub"],
  pricing: ["Kâr ve Fiyatlandırma", "Global, kategori ve hizmet bazlı kâr kuralları ile fiyat geçmişi.", "sell"],
  "ai-rename": ["Yapay Zeka Yeniden İsimlendirme", "Sosyofox marka diline uygun kategori, hizmet, açıklama ve SEO önerileri.", "auto_awesome"],
  payments: ["Ödeme ve Bakiye Yönetimi", "iyzico, havale/EFT, transaction kayıtları ve admin onayları.", "payments"],
  content: ["İçerik ve Yasal Sayfalar", "KVKK, sözleşme, politika, SSS ve landing page içerikleri.", "edit_document"],
  reports: ["Raporlar", "Ciro, kâr, ödeme dağılımı, API hata oranı ve CSV export.", "monitoring"],
  audit: ["Loglar ve Audit Kayıtları", "Kritik işlemlerin güvenli kayıtları ve filtrelenebilir olay geçmişi.", "shield_lock"]
};

export default async function AdminSectionPage({
  params,
  searchParams
}: {
  params: Promise<{ section: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireAdmin();
  const { section } = await params;
  const query = await searchParams;
  const key = section[0] ?? "dashboard";
  const [title, description, icon] = titles[key] ?? ["Sistem Modülü", "Bu modül için UI kabuğu ve yetki kontrolü hazır.", "widgets"];

  if (key === "integrations") {
    const snapshot = await getIntegrationSnapshot();
    return (
      <AppShell admin>
        <div className="grid gap-6">
          <Header title={title} description={description} icon={icon} />
          <StatusMessage query={query} dbReady={snapshot.dbReady} />
          <section className="grid gap-6 xl:grid-cols-2">
            <form action="/api/admin/credentials" method="post" className="sf-card p-5">
              <h2 className="text-xl font-black">WeSosyal API Ayarları</h2>
              <p className="mt-1 text-sm text-[color:var(--sf-muted)]">Standart SMM API v2 protokolü: `key`, `action=services/add/status/balance`.</p>
              <div className="mt-5 grid gap-4">
                <input type="hidden" name="providerName" value="wesosyal" />
                <TextField name="apiKey" label="API key" type="password" required />
                <TextField name="baseUrl" label="API Base URL" defaultValue="https://wesosyal.com/api/v2" />
                <SubmitButton icon="lock">API anahtarını kaydet</SubmitButton>
              </div>
            </form>
            <form action="/api/admin/sync-services" method="post" className="sf-card p-5">
              <h2 className="text-xl font-black">Sosyal Medya Servis Senkronizasyonu</h2>
              <p className="mt-1 text-sm text-[color:var(--sf-muted)]">Tüm sağlayıcı kategorileri, servis ID’leri, min/max, fiyat ve servis tipi mapping olarak içeri alınır.</p>
              <button className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-[14px] border border-white/12 bg-white/8 px-4 font-bold text-white">
                <MdIcon name="sync" /> Servisleri çek
              </button>
            </form>
            <form action="/api/admin/credentials" method="post" className="sf-card p-5">
              <h2 className="text-xl font-black">iyzico Ödeme Entegrasyonu</h2>
              <p className="mt-1 text-sm text-[color:var(--sf-muted)]">API key ve secret encrypted saklanır. Sandbox veya production base URL girilebilir.</p>
              <div className="mt-5 grid gap-4">
                <input type="hidden" name="providerName" value="iyzico" />
                <TextField name="apiKey" label="iyzico API key" type="password" required />
                <TextField name="secretKey" label="iyzico Secret key" type="password" required />
                <TextField name="baseUrl" label="Base URL" defaultValue="https://sandbox-api.iyzipay.com" />
                <SubmitButton icon="payments">iyzico ayarlarını kaydet</SubmitButton>
              </div>
            </form>
            <section className="sf-card p-5">
              <h2 className="text-xl font-black">Google ile Giriş</h2>
              <p className="mt-1 text-sm leading-6 text-[color:var(--sf-muted)]">Aktif etmek için Vercel env olarak `GOOGLE_CLIENT_ID` ve `GOOGLE_CLIENT_SECRET` girin. Authorized redirect URI: `https://sosyofoxoriginal.vercel.app/api/auth/google/callback`</p>
              <div className="mt-5 grid gap-3">
                {["Google Cloud Console > APIs & Services > Credentials", "OAuth Client ID tipi: Web application", "Authorized JavaScript origin: https://sosyofoxoriginal.vercel.app", "Authorized redirect URI: https://sosyofoxoriginal.vercel.app/api/auth/google/callback"].map((item) => (
                  <p key={item} className="rounded-[14px] bg-white/5 p-3 text-sm text-[color:var(--sf-muted)]">{item}</p>
                ))}
              </div>
            </section>
          </section>
          <section className="sf-card p-5">
            <h2 className="text-xl font-black">Kayıtlı Entegrasyonlar</h2>
            <div className="mt-4 grid gap-3">
              {snapshot.providers.length ? snapshot.providers.map((provider) => (
                <div key={provider.id} className="rounded-[14px] border border-white/10 bg-white/[0.04] p-4">
                  <p className="font-black">{provider.displayName}</p>
                  <p className="mt-1 text-sm text-[color:var(--sf-muted)]">{provider.baseUrl ?? "Base URL yok"} · {provider.credentials.length ? `Key: ${provider.credentials[0].keyHint}` : "Key yok"}</p>
                </div>
              )) : <p className="text-sm text-[color:var(--sf-muted)]">Henüz kalıcı entegrasyon kaydı yok.</p>}
            </div>
          </section>
        </div>
      </AppShell>
    );
  }

  if (key === "users" || key === "settings") {
    const snapshot = await getAdminUsersSnapshot();
    return (
      <AppShell admin>
        <div className="grid gap-6">
          <Header title={title} description={description} icon={icon} />
          {!snapshot.dbReady ? <StatusMessage query={{ error: "database" }} dbReady={false} /> : null}
          <section className="sf-card p-5">
            <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <h2 className="text-xl font-black">Kayıtlı kullanıcılar</h2>
                <p className="mt-1 text-sm text-[color:var(--sf-muted)]">Kullanıcıya tıklayın; popup kartında profil, bakiye, sipariş ve ödeme kayıtları açılır.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {["Arama", "Rol", "Durum", "Bakiye"].map((chip) => <span key={chip} className="rounded-full bg-white/7 px-3 py-2 text-sm font-bold text-[color:var(--sf-muted)]">{chip}</span>)}
              </div>
            </div>
            {snapshot.users.length ? (
              <UserDirectory
                users={snapshot.users.map((user) => ({
                  ...user,
                  createdAt: user.createdAt.toISOString(),
                  updatedAt: user.updatedAt.toISOString(),
                  wallet: user.wallet ? { ...user.wallet, balance: user.wallet.balance.toString() } : null,
                  orders: user.orders.map((order) => ({
                    ...order,
                    createdAt: order.createdAt.toISOString(),
                    updatedAt: order.updatedAt.toISOString(),
                    totalPrice: order.totalPrice.toString(),
                    unitPrice: order.unitPrice.toString(),
                    providerCost: order.providerCost.toString(),
                    netProfit: order.netProfit.toString()
                  })),
                  payments: user.payments.map((payment) => ({
                    ...payment,
                    amount: payment.amount.toString(),
                    feeAmount: payment.feeAmount.toString(),
                    createdAt: payment.createdAt.toISOString(),
                    updatedAt: payment.updatedAt.toISOString(),
                    paidAt: payment.paidAt?.toISOString() ?? null
                  })),
                  tickets: user.tickets.map((ticket) => ({
                    ...ticket,
                    createdAt: ticket.createdAt.toISOString(),
                    updatedAt: ticket.updatedAt.toISOString()
                  }))
                }))}
              />
            ) : <EmptyState text="Veritabanı bağlandığında kayıtlı kullanıcılar burada listelenecek." />}
          </section>
        </div>
      </AppShell>
    );
  }

  if (key === "services") {
    const snapshot = await getAdminServicesSnapshot();
    return (
      <AppShell admin>
        <div className="grid gap-6">
          <Header title={title} description={description} icon={icon} />
          {!snapshot.dbReady ? <StatusMessage query={{ error: "database" }} dbReady={false} /> : null}
          {snapshot.dbReady ? (
            <ServiceManager
              categories={snapshot.categories.map((category) => ({
                id: category.id,
                providerCategoryName: category.providerCategoryName,
                sosyofoxCategoryName: category.sosyofoxCategoryName,
                description: category.description,
                icon: category.icon,
                isVisible: category.isVisible,
                isFeatured: category.isFeatured,
                serviceCount: category._count.services
              }))}
              services={snapshot.services.map((service) => ({
                id: service.id,
                providerServiceId: service.providerServiceId,
                providerCategoryName: service.providerCategoryName,
                providerServiceName: service.providerServiceName,
                sosyofoxCategoryName: service.sosyofoxCategoryName,
                sosyofoxServiceName: service.sosyofoxServiceName,
                description: service.description,
                customDescription: service.customDescription,
                icon: service.icon,
                min: service.min,
                max: service.max,
                originalRate: service.originalRate.toString(),
                finalPrice: service.finalPrice.toString(),
                profitValue: service.profitValue.toString(),
                isVisible: service.isVisible,
                isFeatured: service.isFeatured
              }))}
            />
          ) : <EmptyState text="Veritabanı bağlandığında senkronize servis ve kategoriler burada düzenlenebilir." />}
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell admin>
      <div className="grid gap-6">
        <Header title={title} description={description} icon={icon} />
        <div className="grid gap-4 md:grid-cols-3">
          {["Arama ve filtre", "Toplu işlem", "CSV export"].map((item, index) => (
            <Card key={item}>
              <MdIcon name={index === 0 ? "filter_alt" : index === 1 ? "select_check_box" : "download"} className="text-[color:var(--sf-primary-soft)]" />
              <h2 className="mt-4 font-black">{item}</h2>
              <p className="mt-2 text-sm leading-6 text-[color:var(--sf-muted)]">Bu modül için production ekran davranışı ve responsive kart düzeni hazırlandı.</p>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

function Header({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <section className="sf-card p-6">
      <MdIcon name={icon} className="text-4xl text-[color:var(--sf-primary-soft)]" />
      <h1 className="mt-4 text-3xl font-black">{title}</h1>
      <p className="mt-2 max-w-2xl leading-7 text-[color:var(--sf-muted)]">{description}</p>
    </section>
  );
}

function SubmitButton({ children, icon }: { children: React.ReactNode; icon: string }) {
  return (
    <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[14px] bg-[color:var(--sf-primary)] px-4 font-bold text-white">
      <MdIcon name={icon} /> {children}
    </button>
  );
}

function StatusMessage({ query, dbReady }: { query: Record<string, string | string[] | undefined>; dbReady: boolean }) {
  const error = typeof query.error === "string" ? query.error : "";
  const saved = typeof query.saved === "string" ? query.saved : "";
  const synced = typeof query.synced === "string" ? query.synced : "";
  if (!error && !saved && !synced && dbReady) return null;

  const text = error === "database"
    ? "Kalıcı kayıt için production PostgreSQL DATABASE_URL bağlanmalı. DB olmadan API key, iyzico ve kullanıcı kayıtları saklanamaz."
    : error
      ? `İşlem tamamlanamadı: ${error}`
      : saved
        ? `${saved} ayarları kaydedildi.`
        : `${synced} servis içeri aktarıldı.`;

  return (
    <div className={`rounded-[16px] border p-4 text-sm font-bold ${error || !dbReady ? "border-orange-300/20 bg-orange-400/10 text-orange-100" : "border-emerald-300/20 bg-emerald-400/10 text-emerald-100"}`}>
      {text}
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="grid min-h-52 place-items-center text-center">
      <div>
        <MdIcon name="database" className="text-5xl text-[color:var(--sf-primary-soft)]" />
        <p className="mt-3 max-w-xl text-sm text-[color:var(--sf-muted)]">{text}</p>
      </div>
    </div>
  );
}
