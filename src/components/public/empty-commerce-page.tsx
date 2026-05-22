import { PublicShell } from "@/components/layout/public-shell";
import { Card } from "@/components/md3/card";
import { MdIcon } from "@/components/md3/icon";
import { ButtonLink } from "@/components/md3/button";

export function EmptyCommercePage({
  title,
  description,
  icon
}: {
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <PublicShell>
      <main className="sf-container py-10">
        <section className="grid min-h-[62svh] items-center gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[color:var(--sf-primary-soft)]">Yakında</p>
            <h1 className="mt-3 text-4xl font-black leading-tight md:text-6xl">{title}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[color:var(--sf-muted)]">{description}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/sosyal-medya-hizmetleri" icon="favorite">Sosyal medya hizmetleri</ButtonLink>
              <ButtonLink href="/ajans-hizmetleri" icon="auto_awesome" variant="secondary">Ajans hizmetleri</ButtonLink>
            </div>
          </div>
          <Card className="grid min-h-[360px] place-items-center text-center">
            <div>
              <span className="mx-auto grid h-28 w-28 place-items-center rounded-[28px] bg-white/8 text-[color:var(--sf-primary-soft)] shadow-[0_0_60px_rgba(255,122,26,0.18)]">
                <MdIcon name={icon} className="text-6xl" />
              </span>
              <h2 className="mt-8 text-2xl font-black">Arayüz hazır, ürünler bekleniyor</h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[color:var(--sf-muted)]">Bu bölüm şu an boş bırakıldı. Admin panelinden ürün eklendiğinde aynı tema içinde listelenebilir.</p>
            </div>
          </Card>
        </section>
      </main>
    </PublicShell>
  );
}
