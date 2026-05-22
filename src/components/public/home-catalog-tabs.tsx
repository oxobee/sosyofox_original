"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { MdIcon } from "@/components/md3/icon";
import { FavoriteButton } from "@/components/public/favorites";

type HomeTabKey = "social" | "agency" | "licenses" | "epin";

type HomeCatalogItem = {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  icon: string;
  visualKey?: string;
};

type HomeTab = {
  key: HomeTabKey;
  label: string;
  title: string;
  description: string;
  icons: string[];
  items: HomeCatalogItem[];
  href?: string;
  emptyTitle?: string;
  emptyText?: string;
};

const visualMap = [
  { match: ["instagram"], icon: "photo_camera" },
  { match: ["tiktok"], icon: "music_note" },
  { match: ["youtube"], icon: "smart_display" },
  { match: ["twitter", "x ", "x twitter"], icon: "close" },
  { match: ["facebook"], icon: "thumb_up" },
  { match: ["spotify"], icon: "radio_button_checked" },
  { match: ["telegram"], icon: "send" },
  { match: ["linkedin"], icon: "business_center" },
  { match: ["whatsapp"], icon: "call" },
  { match: ["twitch"], icon: "videogame_asset" },
  { match: ["kick"], icon: "flag" },
  { match: ["soundcloud"], icon: "graphic_eq" },
  { match: ["google maps"], icon: "location_on" },
  { match: ["google play"], icon: "play_arrow" },
  { match: ["app store"], icon: "apps" },
  { match: ["discord"], icon: "forum" },
  { match: ["anket"], icon: "fact_check" },
  { match: ["web", "yazılım", "tasarım"], icon: "design_services" },
  { match: ["reklam", "meta", "google ads"], icon: "campaign" },
  { match: ["mobil"], icon: "phone_iphone" },
  { match: ["kimlik", "kurumsal"], icon: "workspace_premium" }
];

const brandGradients = [
  "from-[#ff9a2e] via-[#f46b1f] to-[#9f241e]",
  "from-[#171d29] via-[#27314a] to-[#ff7a1a]",
  "from-[#111722] via-[#1f2b47] to-[#b3261e]",
  "from-[#24202a] via-[#71301d] to-[#ff7a1a]",
  "from-[#10151f] via-[#19325a] to-[#ff8a1f]",
  "from-[#341b14] via-[#b33a1e] to-[#ff9a2e]"
];

function brandGradient(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash + value.charCodeAt(index) * (index + 7)) % brandGradients.length;
  }
  return brandGradients[hash] ?? brandGradients[0];
}

function normalized(value: string) {
  return value.toLocaleLowerCase("tr");
}

function itemVisual(item: HomeCatalogItem) {
  const title = normalized(`${item.visualKey ?? ""} ${item.title}`);
  const visual = visualMap.find((entry) => entry.match.some((key) => title.includes(key)));
  return {
    icon: visual?.icon ?? item.icon ?? "category",
    gradient: brandGradient(title),
    text: "text-white"
  };
}

export function HomeCatalogTabs({ tabs }: { tabs: HomeTab[] }) {
  const [activeKey, setActiveKey] = useState<HomeTabKey>("social");
  const activeTab = useMemo(() => tabs.find((tab) => tab.key === activeKey) ?? tabs[0], [activeKey, tabs]);

  return (
    <section className="mx-auto w-full">
      <section className="home-hero mb-8 grid items-center gap-6 overflow-visible rounded-[18px] border border-white/10 bg-[linear-gradient(135deg,rgba(18,23,34,0.84),rgba(9,12,18,0.76))] p-4 shadow-[0_30px_90px_rgba(0,0,0,0.34)] sm:p-6 lg:grid-cols-[0.92fr_1.08fr] lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 230, damping: 24 }}
          className="order-2 text-center lg:order-1 lg:text-left"
        >
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[color:var(--sf-primary-soft)]">
            Dijital dünyada gücünüzü artırın
          </p>
          <h1 className="mt-3 text-4xl font-black leading-[1.02] tracking-normal text-white sm:text-5xl lg:text-6xl">
            Dijital çözümler, <span className="text-[color:var(--sf-primary)]">sınırsız</span> fırsatlar.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[color:var(--sf-muted)] sm:text-base lg:mx-0">
            Sosyal medya büyüme hizmetlerinden ajans çözümlerine kadar tüm dijital ihtiyaçlarınızı Sosyofox panelinden yönetin.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <Link href="#home-catalog" className="cta inline-flex min-h-11 items-center gap-2 rounded-[12px] px-5 text-sm font-black">
              Hizmetleri Keşfet <MdIcon name="arrow_forward" className="text-lg" />
            </Link>
            <Link href="/panel" className="inline-flex min-h-11 items-center gap-2 rounded-[12px] border border-white/12 bg-white/7 px-5 text-sm font-black text-white transition hover:bg-white/10">
              Panelim <MdIcon name="dashboard" className="text-lg" />
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 190, damping: 22, delay: 0.08 }}
          className="hero-art home-hero-art order-1 lg:order-2"
        >
          <span className="hero-orbit hero-orbit-one" />
          <span className="hero-orbit hero-orbit-two" />
          <span className="hero-fox">
            <Image src="/brand/icon.png" alt="Sosyofox" width={330} height={330} priority className="h-[210px] w-[210px] object-contain sm:h-[290px] sm:w-[290px] lg:h-[350px] lg:w-[350px]" />
          </span>
        </motion.div>
      </section>

      <div id="home-catalog" className="scroll-mt-32">
        <h2 className="mb-5 text-center text-2xl font-semibold tracking-normal sm:text-4xl">
          Sosyofox size eşsiz çözümler sunar.
        </h2>
      </div>

      <div className="home-tabs-sticky">
        <div className="category-home-tabs mx-auto grid max-w-7xl grid-cols-4 gap-3 sm:gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveKey(tab.key)}
              className={`category-home-tab ${activeTab.key === tab.key ? "is-active" : ""}`}
            >
              <span className="category-tab-icons">
                {tab.icons.map((icon, index) => (
                  <span key={icon} className={`category-tab-icon category-tab-icon-${index}`}>
                    <MdIcon name={icon} className="text-sm sm:text-base" />
                  </span>
                ))}
              </span>
              <span className="category-home-tab-label relative z-10 block min-w-0 text-[10px] font-black leading-tight text-white/84 sm:text-sm">{tab.label}</span>
              <MdIcon name="keyboard_arrow_down" className="relative z-10 hidden text-base text-white/56 sm:inline-flex" />
            </button>
          ))}
        </div>
      </div>

      <section className="home-service-panel relative mt-2 overflow-visible rounded-[18px] border border-white/10 bg-[#202327] px-4 py-6 shadow-[0_30px_90px_rgba(0,0,0,0.34)] sm:px-8 sm:py-9 lg:px-12 lg:py-11">
        <div className="pointer-events-none absolute left-1/2 top-0 h-60 w-[min(980px,100%)] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,122,26,0.13),transparent_70%)] blur-3xl" />
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab.key}
            initial={{ opacity: 0, y: 18, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.99 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="relative z-10 grid items-center gap-8 lg:grid-cols-[0.9fr_1.25fr]"
          >
            <div className="home-catalog-info text-center lg:text-left">
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-[14px] bg-[linear-gradient(135deg,#5367ff,#2939a8)] text-white shadow-[0_22px_48px_rgba(61,84,255,0.25)] lg:mx-0">
                <MdIcon name={activeTab.icons[0] ?? "category"} className="text-4xl" />
              </span>
              <h2 className="mt-4 text-2xl font-semibold tracking-normal sm:mt-8 sm:text-4xl md:text-5xl">{activeTab.title}</h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[color:var(--sf-muted)] sm:mt-5 sm:text-lg lg:mx-0">
                {activeTab.description}
              </p>
              <div className="mt-5 grid grid-cols-2 gap-3 text-left sm:mt-8 sm:gap-4">
                {[
                  ["14 Yıllık", "Deneyim", "cake"],
                  ["82.611.333+", "Başarılı İşlem", "bolt"],
                  ["4.9", "Memnuniyet", "sentiment_satisfied"],
                  [`${Math.max(activeTab.items.length, 45)}+`, activeTab.key === "social" ? "Sosyal Medya" : "Çözüm", "verified"]
                ].map(([value, label, icon]) => (
                  <span key={label} className="grid grid-cols-[48px_1fr] items-center gap-3 rounded-[12px] bg-black/10 p-2">
                    <span className="grid h-12 w-12 place-items-center rounded-[11px] bg-[#18202c] text-[#2585ff]">
                      <MdIcon name={icon} className="text-2xl" />
                    </span>
                    <span>
                      <span className="block text-base font-black text-white/84">{value}</span>
                      <span className="block text-sm text-white/46">{label}</span>
                    </span>
                  </span>
                ))}
              </div>
              <p className="mt-4 inline-flex items-start gap-3 text-left text-sm leading-6 text-[color:var(--sf-muted)] sm:mt-7">
                <MdIcon name="verified_user" className="mt-0.5 text-lg text-emerald-400" />
                <span>{activeTab.title} ürünlerimiz <b className="font-semibold text-emerald-300">güvenli ve organik</b> hizmet akışıyla hazırlanır.</span>
              </p>
            </div>

            {activeTab.items.length ? (
              <div>
                <div className="home-catalog-grid grid auto-rows-fr grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
                  {activeTab.items.slice(0, 15).map((item, index) => (
                    <motion.div
                      key={`${activeTab.key}-${item.id}`}
                      initial={{ opacity: 0, y: 28, scale: 0.96 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{ type: "spring", stiffness: 260, damping: 23, delay: Math.min(index * 0.025, 0.24) }}
                      className="relative h-full"
                    >
                      <HomeCatalogCard item={item} activeKey={activeTab.key} />
                    </motion.div>
                  ))}
                </div>
                <Link
                  href={activeTab.href ?? activeTab.items[0]?.href ?? "#"}
                  className="mt-5 flex min-h-14 items-center justify-center gap-3 rounded-[12px] bg-black/24 px-5 text-sm font-black uppercase tracking-wide text-white transition hover:bg-black/34"
                >
                  Tüm hizmetleri görüntüle <MdIcon name="chevron_right" />
                </Link>
              </div>
            ) : (
              <div className="mt-8 rounded-[14px] border border-orange-300/18 bg-orange-500/8 p-8">
                <MdIcon name="hourglass_empty" className="text-5xl text-[color:var(--sf-primary-soft)]" />
                <h3 className="mt-4 text-xl font-black">{activeTab.emptyTitle ?? "Hazırlanıyor"}</h3>
                <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[color:var(--sf-muted)]">
                  {activeTab.emptyText ?? "Bu ürün grubu için listeleme alanı hazırlanıyor."}
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </section>
    </section>
  );
}

function HomeCatalogCard({ item, activeKey }: { item: HomeCatalogItem; activeKey: HomeTabKey }) {
  const visual = itemVisual(item);
  const favoriteType = activeKey === "agency" ? "agency" : activeKey === "social" ? "category" : undefined;

  return (
    <div className={`category-home-card group h-full bg-gradient-to-br ${visual.gradient} ${visual.text}`}>
      <span className="category-home-card-shine" />
      <FavoriteButton
        item={{ id: `${activeKey}:${item.id}`, title: item.title, subtitle: item.subtitle, href: item.href, icon: visual.icon, type: favoriteType }}
        className="absolute right-2 top-2 z-20 h-8 w-8 rounded-[9px]"
      />
      <Link href={item.href} className="relative z-10 grid h-full w-full place-items-center">
      <span className="grid place-items-center">
        <span className="grid h-[72px] w-[72px] place-items-center rounded-[18px] bg-white/13 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35),inset_0_-14px_30px_rgba(0,0,0,0.22),0_18px_42px_rgba(0,0,0,0.22)] transition duration-300 group-hover:scale-105">
          <MdIcon name={visual.icon} className="text-[42px]" />
        </span>
        <span className="mt-5 block line-clamp-2 text-center text-xl font-black leading-tight">{item.title}</span>
        <span className="mt-1 block text-center text-sm font-medium opacity-86">{item.subtitle}</span>
      </span>
      </Link>
    </div>
  );
}
