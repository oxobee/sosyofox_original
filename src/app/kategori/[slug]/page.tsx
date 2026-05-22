import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicShell } from "@/components/layout/public-shell";
import { MdIcon } from "@/components/md3/icon";
import { Reveal } from "@/components/motion/reveal";
import { CategoryBar } from "@/components/public/category-bar";
import { FavoriteButton } from "@/components/public/favorites";
import { getCategoryBySlug, getVisibleCategories } from "@/lib/catalog";
import { formatMoney } from "@/lib/utils";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [category, categories] = await Promise.all([getCategoryBySlug(slug), getVisibleCategories()]);
  if (!category || !category.isVisible) notFound();

  return (
    <PublicShell>
      <main className="sf-container py-6 sm:py-8">
        <CategoryBar categories={categories} activeSlug={category.slug} />

        <section className="mt-6 overflow-hidden rounded-[16px] border border-white/10 bg-[radial-gradient(circle_at_10%_0%,rgba(255,122,26,0.18),transparent_32%),linear-gradient(135deg,rgba(255,122,26,0.08),rgba(15,23,42,0.72))] p-5 sm:p-7">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[color:var(--sf-primary-soft)]">Kategori</p>
          <h1 className="mt-2 text-2xl font-black sm:text-4xl">{category.sosyofoxCategoryName}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[color:var(--sf-muted)]">{category.description}</p>
        </section>

        <section className="mt-6">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[color:var(--sf-primary-soft)]">Hizmetler</p>
              <h2 className="mt-1 text-xl font-black sm:text-2xl">Yayındaki servisler</h2>
            </div>
            <span className="rounded-[10px] border border-white/10 bg-white/6 px-3 py-1.5 text-xs font-black text-white/55">{category.services.length} servis</span>
          </div>
          <div className="grid gap-3">
          {category.services.map((service) => (
            <Reveal key={service.id}>
              <div className="relative">
                <Link
                  href={`/hizmet/${service.slug}`}
                  className="group relative grid min-h-[92px] grid-cols-[58px_1fr_90px] items-center gap-4 overflow-visible rounded-[12px] border border-white/10 bg-[#10151b] p-3 transition duration-200 hover:z-20 hover:-translate-y-0.5 hover:border-orange-300/38 hover:bg-[linear-gradient(135deg,rgba(255,122,26,0.12),rgba(16,21,27,0.96)_44%,rgba(179,38,30,0.08))] hover:shadow-[0_18px_54px_rgba(255,122,26,0.16)] sm:grid-cols-[64px_1fr_auto_98px]"
                >
                  <span className="absolute inset-y-4 left-0 w-[3px] rounded-r-full bg-[linear-gradient(180deg,#ffbd7a,#ff7a1a,#b3261e)] opacity-70" />
                  <span className="grid h-14 w-14 place-items-center rounded-[11px] bg-[linear-gradient(135deg,#ff9a2e,#ff5a1f_55%,#b3261e)] text-white shadow-[0_14px_34px_rgba(255,122,26,0.22)]">
                    <MdIcon name={service.icon} className="text-2xl" />
                  </span>
                  <span className="min-w-0">
                    <span className="block line-clamp-2 text-base font-black leading-snug text-white sm:text-lg">{service.sosyofoxServiceName}</span>
                    <span className="mt-1 block text-sm font-bold text-emerald-300">{formatMoney(service.finalPrice.toString())} başlangıç fiyatı</span>
                    <span className="mt-1 hidden text-xs text-white/45 sm:block">Min {service.min} / Max {service.max}</span>
                  </span>
                  <span className="hidden rounded-[10px] border border-orange-300/18 bg-orange-500/8 px-3 py-2 text-right text-xs font-black text-[color:var(--sf-primary-soft)] sm:block">
                    {formatMoney(service.finalPrice.toString())}
                  </span>
                  <span className="ml-auto grid h-11 w-11 place-items-center rounded-[11px] bg-[linear-gradient(135deg,#ff9a2e,#ff7a1a,#b3261e)] text-white transition group-hover:translate-x-0.5">
                    <MdIcon name="arrow_forward" />
                  </span>
                </Link>
                <FavoriteButton
                  item={{
                    id: `service:${service.id}`,
                    title: service.sosyofoxServiceName,
                    subtitle: category.sosyofoxCategoryName,
                    href: `/hizmet/${service.slug}`,
                    icon: service.icon,
                    type: "service"
                  }}
                  className="absolute right-[62px] top-1/2 z-20 -translate-y-1/2"
                />
              </div>
            </Reveal>
          ))}
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
