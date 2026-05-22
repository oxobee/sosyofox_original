import Link from "next/link";
import { PublicShell } from "@/components/layout/public-shell";
import { Card } from "@/components/md3/card";
import { MdIcon } from "@/components/md3/icon";
import { Reveal } from "@/components/motion/reveal";
import { CategoryBar } from "@/components/public/category-bar";
import { getVisibleCatalog } from "@/lib/catalog";
import { formatMoney } from "@/lib/utils";

export async function SocialServicesPage() {
  const { categories, services } = await getVisibleCatalog();

  return (
    <PublicShell>
      <main>
        <section className="sf-container py-10">
          <Reveal>
            <div className="grid gap-5 rounded-[24px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,122,26,0.16),rgba(15,23,42,0.72))] p-6 md:p-10">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[color:var(--sf-primary-soft)]">Sosyal medya kataloğu</p>
              <h1 className="max-w-3xl text-4xl font-black leading-tight md:text-6xl">Sosyofox sosyal medya hizmetleri</h1>
              <p className="max-w-2xl leading-8 text-[color:var(--sf-muted)]">
                Yayındaki kategori ve hizmetler admin panelindeki sağlayıcı senkronizasyonu üzerinden gelir. Kullanıcı tarafında yalnızca Sosyofox isimleri ve görünür hizmetler listelenir.
              </p>
            </div>
          </Reveal>
        </section>

        <section className="sf-container pb-8">
          <CategoryBar categories={categories} />
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[color:var(--sf-primary-soft)]">Kategoriler</p>
              <h2 className="mt-2 text-3xl font-black">Platform ve hizmet grupları</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {["Platform", "Fiyat", "Popüler", "Min/Max", "Teslimat"].map((filter) => (
                <span key={filter} className="rounded-full border border-white/10 bg-white/6 px-3 py-2 text-sm font-bold text-[color:var(--sf-muted)]">{filter}</span>
              ))}
            </div>
          </div>
          {categories.length ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {categories.map((category) => (
                <Link key={category.id} href={`/kategori/${category.slug}`} className="group relative transition hover:z-20">
                  <Card className="h-full min-h-[190px] overflow-visible bg-[linear-gradient(145deg,rgba(255,122,26,0.1),rgba(255,255,255,0.04)_45%,rgba(15,23,42,0.8))] transition group-hover:-translate-y-1 group-hover:border-orange-300/35 group-hover:shadow-[0_24px_70px_rgba(255,122,26,0.12)]">
                    <span className="grid h-14 w-14 place-items-center rounded-[14px] bg-orange-500/12 text-[color:var(--sf-primary-soft)]">
                      <MdIcon name={category.icon} className="text-3xl" />
                    </span>
                    <h3 className="mt-5 line-clamp-2 min-h-[56px] text-xl font-black">{category.sosyofoxCategoryName}</h3>
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-[color:var(--sf-muted)]">{category.description ?? "Yönetilebilir sosyal medya hizmetleri."}</p>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyCatalog />
          )}
        </section>

        <section id="populer" className="sf-container py-8">
          <div className="mb-5">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[color:var(--sf-primary-soft)]">Hizmetler</p>
            <h2 className="mt-2 text-3xl font-black">Yayınlanan sosyal medya hizmetleri</h2>
          </div>
          {services.length ? (
            <div className="grid gap-3 md:grid-cols-2">
              {services.map((service) => (
                <Reveal key={service.id}>
                  <Link
                    href={`/hizmet/${service.slug}`}
                    className="group relative grid min-h-[88px] grid-cols-[56px_1fr_46px] items-center gap-3 rounded-[12px] border border-white/10 bg-[#10151b] p-3 transition hover:z-20 hover:-translate-y-0.5 hover:border-orange-300/35 hover:bg-[linear-gradient(135deg,rgba(255,122,26,0.12),rgba(16,21,27,0.96)_48%,rgba(179,38,30,0.08))] hover:shadow-[0_18px_54px_rgba(255,122,26,0.14)]"
                  >
                    <span className="grid h-12 w-12 place-items-center rounded-[11px] bg-[linear-gradient(135deg,#ff9a2e,#ff5a1f_55%,#b3261e)] text-white shadow-[0_14px_34px_rgba(255,122,26,0.2)]">
                      <MdIcon name={service.icon} className="text-2xl" />
                    </span>
                    <span className="min-w-0">
                      <span className="block line-clamp-2 text-base font-black leading-snug text-white">{service.sosyofoxServiceName}</span>
                      <span className="mt-1 block text-sm font-bold text-emerald-300">{formatMoney(service.finalPrice.toString())} başlangıç fiyatı</span>
                    </span>
                    <span className="grid h-11 w-11 place-items-center rounded-[11px] bg-[linear-gradient(135deg,#ff9a2e,#ff7a1a,#b3261e)] text-white transition group-hover:translate-x-0.5">
                      <MdIcon name="arrow_forward" />
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          ) : (
            <EmptyCatalog compact />
          )}
        </section>
      </main>
    </PublicShell>
  );
}

function EmptyCatalog({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`sf-card grid ${compact ? "min-h-52" : "min-h-72"} place-items-center p-8 text-center`}>
      <div>
        <MdIcon name="cloud_sync" className="text-5xl text-[color:var(--sf-primary-soft)]" />
        <h2 className="mt-4 text-2xl font-black">API bağlantısı bekleniyor</h2>
        <p className="mt-2 max-w-xl text-[color:var(--sf-muted)]">Admin panelinden sağlayıcı anahtarı girilip senkronizasyon tamamlandığında sosyal medya hizmetleri burada görünür.</p>
      </div>
    </div>
  );
}
