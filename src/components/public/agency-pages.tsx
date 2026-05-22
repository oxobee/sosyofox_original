"use client";

import Link from "next/link";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/md3/button";
import { MdIcon } from "@/components/md3/icon";
import { agencyMenuGroups, socialContentPackages, type AgencyPage } from "@/lib/public-content";
import { formatMoney } from "@/lib/utils";

const EXTRA_DAY_RATE = 0.9;
const packageDays = [1, 2, 3, 4, 5, 6, 7] as const;

function calculatePackagePrice(basePrice: number, selectedDays: number) {
  const extraDays = selectedDays - 1;
  return basePrice + extraDays * basePrice * EXTRA_DAY_RATE;
}

export function AgencyLanding() {
  const items = agencyMenuGroups.flatMap((group) => group.items.map((item) => ({ ...item, group: group.title })));

  return (
    <main className="sf-container py-10">
      <section className="mb-8 rounded-[24px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,122,26,0.14),rgba(15,23,42,0.72))] p-6 md:p-10">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-[color:var(--sf-primary-soft)]">Sosyofox Ajans</p>
        <h1 className="mt-3 text-4xl font-black md:text-6xl">Marka, yazılım ve reklam çözümleri</h1>
        <p className="mt-5 max-w-2xl leading-8 text-[color:var(--sf-muted)]">Yazılım, tasarım, kurumsal kimlik, içerik üretimi ve performans reklamı hizmetlerini tek bir premium arayüzde inceleyin.</p>
      </section>
      <div className="grid gap-5 md:grid-cols-2">
        {items.map((item, index) => (
          <motion.div
            key={item.href}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 250, damping: 24, delay: index * 0.035 }}
          >
            <Link href={item.href} className="group relative grid min-h-[136px] grid-cols-[72px_1fr] items-center gap-5 overflow-hidden rounded-[14px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,122,26,0.08),rgba(255,255,255,0.035)_42%,rgba(15,23,42,0.74))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_18px_55px_rgba(0,0,0,0.24)] transition before:absolute before:-right-10 before:-top-10 before:h-28 before:w-28 before:rounded-full before:bg-orange-400/16 before:blur-2xl hover:-translate-y-1 hover:border-orange-300/34 hover:bg-white/[0.07]">
              <span className="relative z-10 grid h-16 w-16 place-items-center rounded-[12px] border border-orange-300/16 bg-orange-500/10 text-[color:var(--sf-primary-soft)] shadow-[0_0_28px_rgba(255,122,26,0.12)] transition group-hover:bg-[color:var(--sf-primary)] group-hover:text-white">
                <MdIcon name={item.icon} className="text-3xl" />
              </span>
              <span className="relative z-10">
                <span className="text-xs font-black uppercase tracking-[0.18em] text-white/45">{item.group}</span>
                <span className="mt-2 block text-2xl font-black">{item.title}</span>
                <span className="mt-1 block text-base text-[color:var(--sf-muted)]">{item.description}</span>
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </main>
  );
}

export function AgencyServiceDetail({ page }: { page: AgencyPage }) {
  return (
    <main>
      <section className="agency-hero">
        <div className="sf-container text-center">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 240, damping: 24 }}>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-white/55">Sosyofox / Hizmetler / {page.eyebrow}</p>
            <h1 className="mt-4 text-4xl font-black md:text-6xl">{page.title}</h1>
          </motion.div>
        </div>
      </section>

      {page.kind === "packages" ? <PackageSection /> : null}

      <section className="sf-container grid gap-6 py-10 lg:grid-cols-[1fr_0.95fr]">
        <motion.article
          initial={{ opacity: 0, x: -18 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 220, damping: 25 }}
          className="sf-card p-6 md:p-8"
        >
          <div className="mb-7 flex items-center gap-4">
            <span className="grid h-14 w-14 place-items-center rounded-[16px] bg-white/8 text-[color:var(--sf-primary-soft)]">
              <MdIcon name={page.heroIcon} className="text-3xl" />
            </span>
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[color:var(--sf-primary-soft)]">{page.eyebrow}</p>
              <h2 className="text-2xl font-black">{page.summary}</h2>
            </div>
          </div>
          <div className="grid gap-8">
            {page.content.map((block) => (
              <div key={block.heading}>
                <h3 className="text-2xl font-black">{block.heading}</h3>
                <p className="mt-4 leading-8 text-white/78">{block.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 grid gap-4">
            {page.bullets.map((bullet) => (
              <div key={bullet} className="flex gap-3 text-[color:var(--sf-muted)]">
                <span className="mt-2 h-3 w-3 shrink-0 rounded-full bg-[color:var(--sf-success)] shadow-[0_0_18px_rgba(36,214,165,0.45)]" />
                <p className="leading-7"><strong className="text-white">{bullet}:</strong> Proje kapsamına göre uzman ekip tarafından planlanır ve raporlanır.</p>
              </div>
            ))}
          </div>
        </motion.article>
        <AgencyContactPanel page={page} />
      </section>
    </main>
  );
}

function PackageSection() {
  return (
    <section className="sf-container -mt-24 pb-8">
      <div className="grid gap-5 lg:grid-cols-3">
        {socialContentPackages.map((pack, index) => (
          <motion.div
            key={pack.title}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 220, damping: 24, delay: index * 0.04 }}
          >
            <PackageCard pack={pack} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function PackageCard({ pack }: { pack: (typeof socialContentPackages)[number] }) {
  const [selectedDays, setSelectedDays] = useState(1);
  const price = calculatePackagePrice(pack.basePrice, selectedDays);
  const oldPrice = calculatePackagePrice(pack.oldBasePrice, selectedDays);
  const progress = ((selectedDays - 1) / (packageDays.length - 1)) * 100;

  return (
    <div className="overflow-hidden rounded-[18px] border border-white/10 bg-[#0c1114]/95 shadow-[0_24px_70px_rgba(0,0,0,0.36)]">
      <div className="flex items-center gap-4 border-b border-white/10 p-6">
        <span className="grid h-14 w-14 place-items-center rounded-[14px] bg-[linear-gradient(135deg,#ff9a2e,#f35f1e_58%,#b3261e)] text-white shadow-[0_0_34px_rgba(255,122,26,0.38),inset_0_1px_0_rgba(255,255,255,0.24)]">
          <MdIcon name={pack.icon} />
        </span>
        <div>
          <h3 className="text-xl font-black text-[color:var(--sf-primary-soft)]">{pack.title}</h3>
          <p className="text-sm text-[color:var(--sf-muted)]">{pack.subtitle}</p>
        </div>
      </div>
      <div className="border-b border-white/10 p-6">
        <p className="text-center text-sm font-black text-[color:var(--sf-muted)]">Haftada Kaç Gün Paylaşım Yapılsın?</p>
        <div className="mt-4 px-1">
          <input
            aria-label={`${pack.title} gün seçimi`}
            type="range"
            min={1}
            max={7}
            step={1}
            value={selectedDays}
            onChange={(event) => setSelectedDays(Number(event.currentTarget.value))}
            className="sf-package-range"
            style={{ "--range-progress": `${progress}%` } as CSSProperties & Record<string, string>}
          />
          <div className="mt-2 grid grid-cols-7 text-center text-[11px] font-bold text-white/44">
            {packageDays.map((day) => (
              <span key={day} className={day === selectedDays ? "text-[color:var(--sf-primary-soft)]" : undefined}>{day} Gün</span>
            ))}
          </div>
        </div>
        <p className="mt-5 text-center text-sm font-black text-[color:var(--sf-muted)]">Tahmini Etkileşim Artışı: {pack.engagement}</p>
      </div>
      <div className="grid gap-4 p-6">
        {pack.features.map((feature) => (
          <div key={feature} className="flex items-center justify-between gap-3 text-sm font-bold text-[color:var(--sf-muted)]">
            <span className="inline-flex items-center gap-3"><MdIcon name="check_circle" className="text-base text-white/38" />{feature}</span>
            <span className="grid h-7 w-7 place-items-center rounded-full bg-orange-500/12 text-[color:var(--sf-primary)]"><MdIcon name="help" className="text-sm" /></span>
          </div>
        ))}
      </div>
      <div className="grid gap-4 border-t border-white/10 p-6 sm:grid-cols-[1fr_auto] sm:items-center">
        <div>
          <AnimatedMoney value={oldPrice} className="text-sm text-white/38 line-through" />
          <AnimatedMoney value={price} className="text-2xl font-black text-[color:var(--sf-success)]" />
        </div>
        <Button type="button" icon="shopping_bag" className="bg-[color:var(--sf-success)] shadow-[0_18px_42px_rgba(36,214,165,0.24)]">Hemen Satın Al</Button>
      </div>
    </div>
  );
}

function AnimatedMoney({ value, className }: { value: number; className?: string }) {
  const motionValue = useMotionValue(value);
  const formatted = useTransform(() => formatMoney(motionValue.get()));

  useEffect(() => {
    const controls = animate(motionValue, value, { duration: 0.42, ease: [0.22, 1, 0.36, 1] });
    return () => controls.stop();
  }, [motionValue, value]);

  return <motion.p className={className}>{formatted}</motion.p>;
}

function AgencyContactPanel({ page }: { page: AgencyPage }) {
  return (
    <motion.aside
      initial={{ opacity: 0, x: 18 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 220, damping: 25 }}
      className="sf-card h-fit overflow-hidden"
    >
      <div className="border-b border-white/10 p-6 md:p-8">
        <h2 className="text-2xl font-black">İletişime Geçin</h2>
      </div>
      <form className="grid gap-5 p-6 md:p-8">
        <Field label="Adınız, Soyadınız" icon="badge" placeholder="Sosyofox Digital" />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Telefon Numaranız" icon="call" placeholder="+90 850 308 4726" />
          <Field label="Mail Adresiniz" icon="mail" placeholder="info@sosyofox.com" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Site Adı" icon="language" placeholder="sosyofox.com" />
          <Field label="Sektörünüz" icon="chat_bubble" placeholder="Lütfen giriniz" />
        </div>
        <div>
          <p className="mb-3 font-black">Hangi hizmetleri istiyorsunuz?</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {page.form.services.map((service) => (
              <label key={service} className="flex min-h-14 items-center justify-between rounded-[14px] border border-white/10 bg-black/12 px-4 text-sm font-bold text-[color:var(--sf-muted)]">
                {service}
                <input type="checkbox" defaultChecked className="h-4 w-4 accent-[color:var(--sf-primary)]" />
              </label>
            ))}
          </div>
        </div>
        <label className="grid gap-2">
          <span className="font-black">Proje detaylarınızı yazın</span>
          <textarea className="min-h-36 rounded-[14px] border border-white/10 bg-black/18 p-4 outline-none transition focus:border-[color:var(--sf-primary)]" placeholder="Detaylı bilgi verin" />
        </label>
        <div>
          <p className="mb-3 font-black">Ayırdığınız Bütçe</p>
          <div className="grid grid-cols-[52px_1fr_52px] items-center rounded-[14px] border border-white/10 bg-black/18 p-2">
            <button type="button" className="grid h-11 place-items-center rounded-[12px] bg-blue-500/12 text-blue-300">-</button>
            <span className="text-center font-black text-[color:var(--sf-muted)]">0 TL</span>
            <button type="button" className="grid h-11 place-items-center rounded-[12px] bg-blue-500/12 text-blue-300">+</button>
          </div>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <label className="inline-flex items-center gap-3 text-sm text-[color:var(--sf-muted)]">
            <input type="checkbox" defaultChecked className="h-5 w-5 accent-[color:var(--sf-success)]" />
            Benimle iletişime geçileceğini onaylıyorum.
          </label>
          <Button type="button" icon="send" className="bg-[color:var(--sf-success)] shadow-[0_18px_42px_rgba(36,214,165,0.24)]">Gönder</Button>
        </div>
      </form>
    </motion.aside>
  );
}

function Field({ label, icon, placeholder }: { label: string; icon: string; placeholder: string }) {
  return (
    <label className="grid gap-2">
      <span className="font-black">{label}</span>
      <span className="grid min-h-14 grid-cols-[48px_1fr] items-center rounded-[14px] border border-white/10 bg-black/18">
        <span className="m-2 grid h-10 place-items-center rounded-[10px] bg-blue-500/12 text-blue-300"><MdIcon name={icon} className="text-lg" /></span>
        <input className="min-w-0 bg-transparent pr-4 text-white outline-none placeholder:text-white/32" placeholder={placeholder} />
      </span>
    </label>
  );
}
