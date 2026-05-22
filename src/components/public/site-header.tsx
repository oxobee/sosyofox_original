"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { MdIcon } from "@/components/md3/icon";
import { FavoritesPopover } from "@/components/public/favorites";
import { agencyMenuGroups, publicSections, socialMenuGroups } from "@/lib/public-content";
import { formatMoney } from "@/lib/utils";

type HeaderUser = {
  fullName: string;
  balance: string;
  currency: string;
} | null;

type HeaderSearchItem = {
  id: string;
  type: "category" | "service";
  title: string;
  subtitle: string;
  href: string;
  icon: string;
  price?: string;
};

type HeaderSearchCatalog = {
  categories: HeaderSearchItem[];
  services: HeaderSearchItem[];
};

type MenuItem = {
  title: string;
  description: string;
  href: string;
  icon: string;
};

type MenuGroup = {
  title: string;
  items: MenuItem[];
};

const desktopNav = [
  { label: "Sosyal Medya", icon: "favorite", href: publicSections.social.href, menu: "social", disabled: false },
  { label: "Ajans Hizmetleri", icon: "auto_awesome", href: publicSections.agency.href, menu: "agency", disabled: false },
  { label: "E-Pin", icon: "stadia_controller", href: publicSections.epin.href, menu: "epin", disabled: true },
  { label: "Lisanslar", icon: "grid_view", href: publicSections.licenses.href, menu: "licenses", disabled: true }
] as const;

const platformOrder = [
  "Instagram",
  "TikTok",
  "YouTube",
  "Facebook",
  "Telegram",
  "Google Maps",
  "Google Play Store",
  "App Store",
  "X",
  "Twitter",
  "Linkedin",
  "Spotify",
  "SoundCloud",
  "Discord"
];

const categoryIconMap: Record<string, string> = {
  instagram: "photo_camera",
  tiktok: "music_note",
  youtube: "smart_display",
  facebook: "thumb_up",
  telegram: "send",
  maps: "location_on",
  google: "play_arrow",
  app: "apps",
  chrome: "extension",
  linkedin: "business_center",
  spotify: "radio_button_checked",
  soundcloud: "graphic_eq",
  discord: "forum",
  anket: "fact_check",
  premium: "verified",
  store: "storefront",
  github: "code",
  pinterest: "push_pin",
  snapchat: "photo_camera",
  reddit: "groups",
  forum: "forum",
  gmail: "mail"
};

function normalized(text: string) {
  return text.toLocaleLowerCase("tr");
}

function categoryIcon(item: HeaderSearchItem) {
  const title = normalized(item.title);
  const match = Object.entries(categoryIconMap).find(([key]) => title.includes(key));
  return match?.[1] ?? item.icon ?? "category";
}

function categoryDescription(title: string) {
  const value = normalized(title);
  if (value.includes("instagram")) return "Takipçi, beğeni, izlenme";
  if (value.includes("tiktok")) return "Video ve profil etkileşimi";
  if (value.includes("youtube")) return "İzlenme ve kanal büyümesi";
  if (value.includes("maps")) return "Harita görünürlüğü";
  if (value.includes("facebook")) return "Sayfa ve içerik etkileşimi";
  if (value.includes("telegram")) return "Kanal ve topluluk büyümesi";
  if (value.includes("google play")) return "Uygulama görünürlüğü";
  if (value.includes("app store")) return "iOS mağaza görünürlüğü";
  if (value.includes("spotify")) return "Dinlenme ve liste görünürlüğü";
  if (value.includes("anket")) return "Anket ve görev oylamaları";
  return "Sosyofox katalog hizmetleri";
}

function platformRank(title: string) {
  const value = normalized(title);
  const index = platformOrder.findIndex((item) => value.includes(normalized(item)));
  return index === -1 ? 999 : index;
}

function buildSocialMenuGroups(categories: HeaderSearchItem[]): MenuGroup[] {
  if (!categories.length) return socialMenuGroups;

  const items = categories
    .map((category) => ({
      title: category.title,
      description: categoryDescription(category.title),
      href: category.href,
      icon: categoryIcon(category)
    }))
    .sort((a, b) => platformRank(a.title) - platformRank(b.title) || a.title.localeCompare(b.title, "tr"));

  const popular = items.filter((item) => platformRank(item.title) < 9);
  const popularHrefs = new Set(popular.map((item) => item.href));
  const stores = items.filter((item) => !popularHrefs.has(item.href) && /app store|play store|chrome|maps|website|web site|gmail|github/i.test(item.title));
  const storeHrefs = new Set(stores.map((item) => item.href));
  const communities = items.filter((item) => !popularHrefs.has(item.href) && !storeHrefs.has(item.href) && /discord|telegram|reddit|linkedin|pinterest|snapchat|spotify|soundcloud|kick|kwai/i.test(item.title));
  const used = new Set([...popular, ...stores, ...communities].map((item) => item.href));
  const other = items.filter((item) => !used.has(item.href));

  return [
    { title: "Popüler Platformlar", items: popular },
    { title: "Mağaza ve Harita", items: stores },
    { title: "Topluluk ve Yayın", items: communities },
    { title: "Diğer Kategoriler", items: other }
  ].filter((group) => group.items.length);
}

const accountItems = [
  { label: "Siparişlerim", href: "/panel/siparisler", icon: "list_alt" },
  { label: "Faturalarım", href: "/panel/faturalar", icon: "receipt_long" },
  { label: "Destek Taleplerim", href: "/panel/destek", icon: "chat_bubble" },
  { label: "İndirim Kodlarım", href: "/panel/kuponlar", icon: "percent" },
  { label: "Ayarlar", href: "/panel/ayarlar", icon: "settings" }
];

function menuGroups(kind: string, dynamicSocialGroups: MenuGroup[]) {
  if (kind === "social") return dynamicSocialGroups;
  if (kind === "agency") return agencyMenuGroups;
  return [];
}

function HeaderProfileCard({ user, onClose }: { user: HeaderUser; onClose: () => void }) {
  if (!user) {
    return (
      <div className="mb-5 grid grid-cols-[88px_1fr] items-center gap-5 rounded-[22px] border border-orange-300/25 bg-[linear-gradient(135deg,rgba(255,122,26,0.16),rgba(255,255,255,0.035))] p-5">
        <span className="grid h-20 w-20 place-items-center rounded-full border-4 border-[color:var(--sf-primary)] text-[color:var(--sf-primary)]">
          <MdIcon name="person" className="text-5xl" />
        </span>
        <div>
          <p className="text-white/70">Merhaba,</p>
          <p className="text-xl font-black">Sosyofox Kullanıcısı</p>
          <Link
            href="/login"
            onClick={onClose}
            className="mt-3 inline-flex items-center gap-2 rounded-full border border-orange-300/35 bg-orange-500/14 px-4 py-2 text-sm font-black text-[color:var(--sf-primary-soft)]"
          >
            <MdIcon name="login" className="text-base" /> Giriş yap
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-5 rounded-[22px] border border-orange-300/25 bg-[linear-gradient(135deg,rgba(255,122,26,0.16),rgba(255,255,255,0.035))] p-5">
      <div className="grid grid-cols-[88px_1fr] items-center gap-5">
        <span className="grid h-20 w-20 place-items-center rounded-full border-4 border-[color:var(--sf-primary)] text-[color:var(--sf-primary)]">
          <MdIcon name="person" className="text-5xl" />
        </span>
        <div>
          <p className="text-white/70">Merhaba,</p>
          <p className="text-xl font-black">{user.fullName}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/35 bg-emerald-500/12 px-4 py-2 text-sm font-black text-emerald-200">
              <MdIcon name="account_balance_wallet" className="text-base" /> {formatMoney(user.balance, user.currency)}
            </span>
            <Link href="/panel/bakiye" onClick={onClose} className="inline-flex items-center gap-1 rounded-[12px] bg-[linear-gradient(135deg,#ff9a2e,#ff7a1a_52%,#b3261e)] px-4 py-2 text-sm font-black text-white shadow-[0_14px_34px_rgba(255,122,26,0.2)]">
              Bakiye yükle <MdIcon name="chevron_right" className="text-base" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function FullScreenMenu({
  open,
  title,
  children,
  onClose
}: {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div className="fixed inset-0 z-50 bg-black/72 backdrop-blur-sm md:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.aside
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ type: "spring", stiffness: 230, damping: 28 }}
            className="h-full w-full overflow-y-auto bg-[#05080b] px-5 py-4"
          >
            <div className="mb-5 flex items-center justify-between pt-2">
              <Image src="/brand/logo.png" alt="Sosyofox" width={190} height={39} className="h-8 w-auto" />
              <button type="button" onClick={onClose} aria-label={`${title} kapat`} className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/8">
                <MdIcon name="close" />
              </button>
            </div>
            {children}
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function HeaderSearch({ catalog, compact = false }: { catalog: HeaderSearchCatalog; compact?: boolean }) {
  const [query, setQuery] = useState("");
  const items = useMemo(() => {
    const value = query.trim().toLocaleLowerCase("tr");
    if (value.length < 2) return [];
    return [...catalog.categories, ...catalog.services]
      .filter((item) => `${item.title} ${item.subtitle}`.toLocaleLowerCase("tr").includes(value))
      .slice(0, 8);
  }, [catalog.categories, catalog.services, query]);

  return (
    <div className="relative min-w-0">
      <label className={`flex min-h-10 items-center gap-2 rounded-[12px] border border-white/10 bg-white/6 px-3 text-sm transition focus-within:border-orange-300/35 focus-within:bg-white/9 ${compact ? "" : "w-[min(260px,18vw)] 2xl:w-[min(340px,22vw)]"}`}>
        <MdIcon name="search" className="text-xl text-white" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Servis veya kategori ara..."
          className="min-w-0 flex-1 bg-transparent text-white outline-none placeholder:text-white/45"
        />
      </label>
      <AnimatePresence>
        {items.length ? (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 360, damping: 30 }}
            className="absolute left-0 right-0 top-[calc(100%+8px)] z-[70] overflow-hidden rounded-[14px] border border-orange-300/18 bg-[#0b0f14]/98 shadow-[0_24px_70px_rgba(0,0,0,0.5),0_0_34px_rgba(255,122,26,0.1)] backdrop-blur-xl"
          >
            <div className="max-h-[420px] overflow-y-auto p-2">
              {items.map((item) => (
                <Link
                  key={`${item.type}-${item.id}`}
                  href={item.href}
                  onClick={() => setQuery("")}
                  className="grid grid-cols-[42px_1fr_auto] items-center gap-3 rounded-[12px] p-2 transition hover:bg-orange-500/10"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-[10px] bg-orange-500/12 text-[color:var(--sf-primary-soft)]">
                    <MdIcon name={item.icon} className="text-xl" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-black text-white">{item.title}</span>
                    <span className="mt-0.5 block truncate text-xs text-white/48">{item.type === "category" ? "Kategori" : item.subtitle}</span>
                  </span>
                  {item.price ? <span className="text-xs font-black text-[color:var(--sf-primary-soft)]">{formatMoney(item.price)}</span> : null}
                </Link>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function AccountPopup({
  open,
  user,
  onClose,
  onLogout
}: {
  open: boolean;
  user: HeaderUser;
  onClose: () => void;
  onLogout: () => void;
}) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
          className="fixed right-6 top-20 z-[65] hidden w-[430px] overflow-hidden rounded-[18px] border border-white/10 bg-[#070a0f]/98 p-4 shadow-[0_30px_90px_rgba(0,0,0,0.56),0_0_40px_rgba(255,122,26,0.12)] backdrop-blur-2xl md:block"
        >
          <div className="mb-4 flex items-center justify-between">
            <Image src="/brand/logo.png" alt="Sosyofox" width={168} height={34} className="h-8 w-auto" />
            <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-[12px] border border-white/10 bg-white/8" aria-label="Hesap menüsünü kapat">
              <MdIcon name="close" />
            </button>
          </div>
          {user ? (
            <>
              <div className="relative mb-4 overflow-hidden rounded-[18px] border border-white/10 bg-[#11161b] pb-5 text-center">
                <div className="h-24 rounded-b-[24px] bg-[radial-gradient(circle_at_72%_20%,rgba(197,91,255,0.75),transparent_30%),linear-gradient(135deg,#4d0878,#8425c8_55%,#35103f)]" />
                <div className="-mt-10 grid place-items-center">
                  <span className="grid h-20 w-20 place-items-center rounded-full border-[5px] border-white bg-gradient-to-br from-red-300 to-red-700 text-white">
                    <MdIcon name="person" className="text-4xl" />
                  </span>
                </div>
                <p className="mt-3 text-2xl font-black">{user.fullName}</p>
                <p className="mt-1 text-xl font-black text-emerald-300">{formatMoney(user.balance, user.currency)}</p>
                <Link href="/panel/bakiye" onClick={onClose} className="mx-5 mt-5 flex min-h-13 items-center justify-between rounded-[12px] bg-[linear-gradient(135deg,#ff9a2e,#ff7a1a_52%,#b3261e)] px-5 font-black text-white shadow-[0_18px_44px_rgba(255,122,26,0.24)]">
                  <span className="inline-flex items-center gap-3"><MdIcon name="account_balance_wallet" /> Bakiye Ekle</span>
                  <MdIcon name="chevron_right" />
                </Link>
              </div>
              <div className="grid gap-1">
                {accountItems.map((item) => (
                  <Link key={item.href} href={item.href} onClick={onClose} className="grid min-h-13 grid-cols-[46px_1fr_28px] items-center rounded-[14px] px-3 text-white/90 transition hover:bg-white/7">
                    <span className="grid h-10 w-10 place-items-center rounded-[12px] border border-white/10 bg-white/6 text-white/58">
                      <MdIcon name={item.icon} />
                    </span>
                    <span className="pl-3 font-bold">{item.label}</span>
                    <MdIcon name="chevron_right" />
                  </Link>
                ))}
                <button type="button" onClick={onLogout} className="grid min-h-13 grid-cols-[46px_1fr_28px] items-center rounded-[14px] px-3 text-left text-white/90 transition hover:bg-white/7">
                  <span className="grid h-10 w-10 place-items-center rounded-[12px] border border-white/10 bg-white/6 text-white/58"><MdIcon name="logout" /></span>
                  <span className="pl-3 font-bold">Çıkış Yap</span>
                  <MdIcon name="chevron_right" />
                </button>
              </div>
            </>
          ) : (
            <div>
              <HeaderProfileCard user={null} onClose={onClose} />
              <div className="grid gap-3">
                <Link href="/login" onClick={onClose} className="cta flex min-h-13 items-center justify-center gap-2 px-5 font-black">
                  <MdIcon name="login" /> Giriş Yap
                </Link>
                <Link href="/register" onClick={onClose} className="flex min-h-13 items-center justify-center gap-2 rounded-[14px] border border-white/10 bg-white/8 px-5 font-black text-white">
                  <MdIcon name="person_add" /> Yeni Üyelik
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function MobileMegaSection({
  title,
  icon,
  open,
  groups,
  onToggle,
  onClose
}: {
  title: string;
  icon: string;
  open: boolean;
  groups: MenuGroup[];
  onToggle: () => void;
  onClose: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-[12px]">
      <button
        type="button"
        onClick={onToggle}
        className="grid min-h-12 w-full grid-cols-[42px_1fr_22px] items-center px-2.5 text-left text-sm font-black text-white/88"
      >
        <MdIcon name={icon} className="text-2xl" />
        <span>{title}</span>
        <MdIcon name={open ? "keyboard_arrow_up" : "keyboard_arrow_down"} />
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 30 }}
            className="overflow-hidden"
          >
            <div className="grid max-h-[62svh] gap-3 overflow-y-auto rounded-[12px] border border-white/10 bg-white/[0.035] p-3">
              {groups.map((group) => (
                <div key={group.title}>
                  <p className="mb-2 px-1 text-[11px] font-black uppercase tracking-[0.16em] text-[color:var(--sf-primary-soft)]">{group.title}</p>
                  <div className="grid gap-1">
                    {group.items.slice(0, 16).map((item) => (
                      <Link
                        key={item.href + item.title}
                        href={item.href}
                        onClick={onClose}
                        className="grid grid-cols-[38px_1fr_20px] items-center gap-2 rounded-[10px] p-1.5 text-white/84 transition hover:bg-orange-500/10"
                      >
                        <span className="grid h-9 w-9 place-items-center rounded-[10px] bg-orange-500/10 text-[color:var(--sf-primary-soft)]">
                          <MdIcon name={item.icon} className="text-lg" />
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-[13px] font-black">{item.title}</span>
                          <span className="mt-0.5 block truncate text-xs text-white/45">{item.description}</span>
                        </span>
                        <MdIcon name="chevron_right" className="text-lg text-white/48" />
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export function SiteHeader({ user, searchCatalog = { categories: [], services: [] } }: { user: HeaderUser; searchCatalog?: HeaderSearchCatalog }) {
  const [active, setActive] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mobileSocialOpen, setMobileSocialOpen] = useState(true);
  const [mobileAgencyOpen, setMobileAgencyOpen] = useState(false);
  const dynamicSocialGroups = useMemo(() => buildSocialMenuGroups(searchCatalog.categories), [searchCatalog.categories]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.assign("/");
  }

  return (
    <>
      <header onMouseLeave={() => setActive(null)} className="sticky top-0 z-40 border-b border-white/10 bg-[#090c12]/82 backdrop-blur-2xl">
        <div className="hidden h-16 items-center justify-between gap-4 px-4 md:flex lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/brand/logo.png" alt="Sosyofox" width={190} height={39} priority className="h-8 w-auto max-w-[172px]" />
          </Link>

          <nav className="hidden items-center gap-2 lg:flex xl:gap-3">
            {desktopNav.map((item) => {
              const content = (
                <>
                  <MdIcon name={item.icon} className="text-lg text-[color:var(--sf-primary-soft)]" />
                  <span className="whitespace-nowrap">{item.label}</span>
                  {item.disabled ? null : <MdIcon name="keyboard_arrow_down" className="text-base text-white/60" />}
                </>
              );
              return item.disabled ? (
                <span
                  key={item.href}
                  aria-disabled="true"
                  className="inline-flex min-h-10 cursor-not-allowed items-center gap-2 rounded-[12px] px-3 text-[13px] font-black tracking-normal text-white/40"
                >
                  {content}
                </span>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  onMouseEnter={() => setActive(item.menu)}
                  className="inline-flex min-h-10 items-center gap-2 rounded-[12px] px-3 text-[13px] font-black tracking-normal text-white/86 transition hover:bg-white/8 hover:text-white"
                >
                  {content}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <HeaderSearch catalog={searchCatalog} />
            <button
              type="button"
              onClick={() => setFavoritesOpen((value) => !value)}
              aria-label="Favoriler"
              className="grid h-10 w-10 place-items-center rounded-[12px] border border-white/10 bg-white/6 transition hover:border-orange-300/30 hover:bg-orange-500/10 hover:text-[color:var(--sf-primary-soft)]"
            >
              <MdIcon name="favorite" />
            </button>
            <button
              type="button"
              onClick={() => setNotificationsOpen((value) => !value)}
              aria-label="Bildirimler"
              className="relative grid h-10 w-10 place-items-center rounded-[12px] border border-orange-400/24 bg-orange-500/8 text-[color:var(--sf-primary-soft)] transition hover:bg-orange-500/14"
            >
              <MdIcon name="notifications" />
              <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-[color:var(--sf-primary)] text-[10px] font-black text-white">2</span>
            </button>
            <Link href="/panel" aria-label="Sepet" className="relative grid h-10 w-10 place-items-center rounded-[12px] border border-white/10 bg-white/6 transition hover:bg-white/10">
              <MdIcon name="shopping_cart" />
              <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-[color:var(--sf-primary)] text-[10px] font-black">0</span>
            </Link>
            <button
              type="button"
              onClick={() => setAccountOpen((value) => !value)}
              className="hidden min-h-10 min-w-[108px] shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-[12px] bg-[linear-gradient(135deg,var(--sf-primary),#ff7a1a_45%,#b3261e)] px-4 text-sm font-black text-white shadow-[0_16px_38px_rgba(255,122,26,0.24)] sm:inline-flex"
            >
              <MdIcon name={user ? "person" : "login"} className="text-lg" />
              {user ? "Hesabım" : "Giriş Yap"}
            </button>
          </div>
        </div>

        <div className="md:hidden">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 rounded-b-[18px] border-b border-white/10 bg-[#0b0f14] px-3 py-2.5">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="min-h-8 justify-self-start rounded-[9px] border border-white/12 bg-white/8 px-2.5 text-[11px] font-black uppercase text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_8px_22px_rgba(0,0,0,0.22)]"
            >
              <span className="inline-flex items-center gap-1.5"><MdIcon name="menu" className="text-base" /> Menü</span>
            </button>
            <Link href="/" className="justify-self-center">
              <Image src="/brand/logo.png" alt="Sosyofox" width={170} height={35} priority className="h-6 w-auto" />
            </Link>
            <button
              type="button"
              onClick={() => setAccountOpen(true)}
              className="min-h-8 justify-self-end rounded-[9px] border border-white/12 bg-white/8 px-2.5 text-[11px] font-black uppercase text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_8px_22px_rgba(0,0,0,0.22)]"
            >
              <span className="inline-flex items-center gap-1.5"><MdIcon name="person" className="text-base" /> Hesabım</span>
            </button>
          </div>
          <div className="grid grid-cols-[1fr_auto_auto] items-center gap-2 border-b border-white/10 bg-[#0b0f14] px-4 py-2.5">
            <HeaderSearch catalog={searchCatalog} compact />
            <button type="button" onClick={() => setFavoritesOpen((value) => !value)} aria-label="Favoriler" className="grid h-9 w-9 place-items-center rounded-[11px] border border-white/10 bg-white/6">
              <MdIcon name="favorite" className="text-xl" />
            </button>
            <button
              type="button"
              onClick={() => setNotificationsOpen((value) => !value)}
              aria-label="Bildirimler"
              className="relative grid h-9 w-9 place-items-center rounded-[11px] border border-orange-400/30 bg-orange-500/10 text-[color:var(--sf-primary-soft)]"
            >
              <MdIcon name="notifications" className="text-xl" />
              <span className="absolute -top-2 right-0 rounded-full bg-[color:var(--sf-primary)] px-1.5 py-0.5 text-[10px] font-black text-white">2</span>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {active ? (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 360, damping: 34 }}
              className="desktop-mega-menu absolute left-1/2 top-[64px] hidden w-[min(1760px,calc(100vw-32px))] -translate-x-1/2 overflow-visible rounded-[14px] border border-white/10 bg-[#0c1118]/96 p-3 shadow-[0_28px_90px_rgba(0,0,0,0.52)] backdrop-blur-2xl lg:block"
            >
              <div className="desktop-mega-grid grid gap-3 lg:grid-cols-4">
                {menuGroups(active, dynamicSocialGroups).map((group) => (
                  <div key={group.title}>
                    <p className="desktop-mega-title mb-2 text-[10px] font-black uppercase tracking-[0.16em] text-[color:var(--sf-primary-soft)]">{group.title}</p>
                    <div className="grid gap-1">
                      {group.items.map((item) => (
                        <Link key={item.href + item.title} href={item.href} className="desktop-mega-link group grid grid-cols-[36px_1fr_16px] items-center gap-2 rounded-[10px] p-1.5 transition hover:bg-orange-500/10">
                          <span className="grid h-9 w-9 place-items-center rounded-[9px] bg-orange-500/10 text-[color:var(--sf-primary-soft)] transition group-hover:bg-[color:var(--sf-primary)] group-hover:text-white">
                            <MdIcon name={item.icon} className="text-lg" />
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate text-[13px] font-black text-white">{item.title}</span>
                            <span className="mt-0.5 block truncate text-[11px] text-[color:var(--sf-muted)]">{item.description}</span>
                          </span>
                          <MdIcon name="chevron_right" className="text-base text-white/35" />
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </header>

      <AccountPopup open={accountOpen} user={user} onClose={() => setAccountOpen(false)} onLogout={logout} />
      <FavoritesPopover open={favoritesOpen} onClose={() => setFavoritesOpen(false)} />

      <AnimatePresence>
        {notificationsOpen ? (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 360, damping: 28 }}
            className="fixed right-4 top-[126px] z-50 w-[min(360px,calc(100vw-32px))] rounded-[16px] border border-orange-300/20 bg-[#0b0f14]/96 p-4 shadow-[0_24px_70px_rgba(0,0,0,0.48),0_0_38px_rgba(255,122,26,0.12)] backdrop-blur-2xl md:top-20"
          >
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.16em] text-[color:var(--sf-primary-soft)]">Bildirimler</p>
                <p className="text-xs text-white/50">Son sistem hareketleri</p>
              </div>
              <button type="button" onClick={() => setNotificationsOpen(false)} className="grid h-8 w-8 place-items-center rounded-[10px] bg-white/8" aria-label="Bildirimleri kapat">
                <MdIcon name="close" className="text-base" />
              </button>
            </div>
            <div className="grid gap-2">
              {[
                ["payments", "Bakiye yükleme ekranı hazır.", "Ödeme ve cüzdan işlemleri panelden yönetilir."],
                ["shopping_bag", "Sipariş takibi aktif.", "Sipariş durumlarınızı müşteri panelinde izleyebilirsiniz."]
              ].map(([icon, title, text]) => (
                <div key={title} className="grid grid-cols-[40px_1fr] gap-3 rounded-[12px] border border-white/8 bg-white/[0.04] p-3">
                  <span className="grid h-10 w-10 place-items-center rounded-[10px] bg-orange-500/12 text-[color:var(--sf-primary-soft)]"><MdIcon name={icon} /></span>
                  <span>
                    <span className="block text-sm font-black">{title}</span>
                    <span className="mt-1 block text-xs leading-5 text-white/55">{text}</span>
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <FullScreenMenu open={mobileOpen} title="Menü" onClose={() => setMobileOpen(false)}>
        <HeaderProfileCard user={user} onClose={() => setMobileOpen(false)} />
        <div className="grid gap-1">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="grid min-h-14 grid-cols-[48px_1fr_24px] items-center rounded-[14px] border border-orange-400/70 bg-orange-500/14 px-3 text-base text-[color:var(--sf-primary-soft)] shadow-[0_0_32px_rgba(255,122,26,0.18)]"
          >
            <MdIcon name="home" className="text-2xl" />
            <span>Ana Sayfa</span>
            <MdIcon name="chevron_right" />
          </Link>

          <MobileMegaSection
            title="Sosyal Medya Hizmetleri"
            icon="favorite"
            open={mobileSocialOpen}
            onToggle={() => setMobileSocialOpen((value) => !value)}
            groups={dynamicSocialGroups}
            onClose={() => setMobileOpen(false)}
          />

          <MobileMegaSection
            title="Ajans Hizmetleri"
            icon="auto_awesome"
            open={mobileAgencyOpen}
            onToggle={() => setMobileAgencyOpen((value) => !value)}
            groups={agencyMenuGroups}
            onClose={() => setMobileOpen(false)}
          />

          <Link href="/sosyal-medya-hizmetleri#populer" onClick={() => setMobileOpen(false)} className="grid min-h-14 grid-cols-[48px_1fr_24px] items-center rounded-[14px] px-3 text-base text-white/84">
            <MdIcon name="local_fire_department" className="text-2xl" />
            <span>Popüler Ürünler</span>
            <MdIcon name="chevron_right" />
          </Link>
          <Link href="/panel/destek" onClick={() => setMobileOpen(false)} className="grid min-h-14 grid-cols-[48px_1fr_24px] items-center rounded-[14px] px-3 text-base text-white/84">
            <MdIcon name="support_agent" className="text-2xl" />
            <span>Destek</span>
            <MdIcon name="chevron_right" />
          </Link>
        </div>
        <Link href="/kampanyalar" onClick={() => setMobileOpen(false)} className="mt-5 grid min-h-18 grid-cols-[54px_1fr_24px] items-center rounded-[16px] border border-orange-400/70 bg-orange-500/12 px-3 shadow-[0_0_32px_rgba(255,122,26,0.2)]">
          <MdIcon name="redeem" className="text-3xl text-[color:var(--sf-primary-soft)]" />
          <span><span className="block text-base font-black text-[color:var(--sf-primary-soft)]">Kampanyalar</span><span className="text-xs text-white/70">Özel fırsatlar ve indirimler</span></span>
          <MdIcon name="chevron_right" />
        </Link>
        {user ? (
          <div className="mt-5 rounded-[18px] border border-white/10 bg-white/[0.035] p-3">
            {[
              ["Ayarlar", "/panel/ayarlar", "settings"],
              ["Çıkış", "", "logout"]
            ].map(([label, href, icon]) => (
              <button key={label} type="button" onClick={label === "Çıkış" ? logout : () => { setMobileOpen(false); window.location.assign(href); }} className="grid min-h-14 grid-cols-[58px_1fr_28px] items-center rounded-[14px] px-3 text-left text-white/84">
                <MdIcon name={icon} className="text-3xl" />
                <span>{label}</span>
                <MdIcon name="chevron_right" />
              </button>
            ))}
          </div>
        ) : null}
        <div className="mt-5 grid min-h-18 grid-cols-[58px_1fr] items-center rounded-[18px] border border-white/10 bg-white/[0.035] px-4">
          <MdIcon name="verified_user" className="text-4xl text-emerald-300" />
          <span><span className="block font-black">Güvenli Alışveriş</span><span className="text-sm text-white/60">%100 güvenli ve hızlı hizmet</span></span>
        </div>
      </FullScreenMenu>

      <FullScreenMenu open={accountOpen} title="Hesabım" onClose={() => setAccountOpen(false)}>
        {user ? (
          <>
            <div className="relative mb-5 overflow-hidden rounded-[24px] border border-white/10 bg-[#11161b] pb-5 text-center">
              <div className="h-28 rounded-b-[32px] bg-[radial-gradient(circle_at_74%_20%,rgba(197,91,255,0.9),transparent_26%),linear-gradient(135deg,#4d0878,#8425c8_55%,#35103f)]" />
              <div className="-mt-12 grid place-items-center">
                <span className="grid h-24 w-24 place-items-center rounded-full border-[6px] border-white bg-gradient-to-br from-red-300 to-red-700 text-white">
                  <MdIcon name="person" className="text-5xl" />
                </span>
              </div>
              <p className="mt-3 text-2xl font-black">{user.fullName}</p>
              <p className="mt-1 text-xl font-black text-emerald-300">{formatMoney(user.balance, user.currency)}</p>
              <Link href="/panel/bakiye" onClick={() => setAccountOpen(false)} className="mx-5 mt-5 flex min-h-14 items-center justify-between rounded-[14px] bg-[linear-gradient(135deg,#ff9a2e,#ff7a1a_52%,#b3261e)] px-5 font-black text-white shadow-[0_18px_44px_rgba(255,122,26,0.24)]">
                <span className="inline-flex items-center gap-3"><MdIcon name="account_balance_wallet" /> Bakiye Ekle</span>
                <MdIcon name="chevron_right" />
              </Link>
            </div>
            <p className="mb-3 text-2xl font-black text-white/42">Hesabım</p>
            <div className="grid gap-2">
              {accountItems.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setAccountOpen(false)} className="grid min-h-16 grid-cols-[58px_1fr_36px] items-center rounded-[18px] px-4 text-lg text-white/90">
                  <span className="grid h-12 w-12 place-items-center rounded-[14px] border border-white/10 bg-white/6 text-white/55">
                    <MdIcon name={item.icon} className="text-2xl" />
                  </span>
                  <span className="pl-4">{item.label}</span>
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-white/8"><MdIcon name="chevron_right" /></span>
                </Link>
              ))}
              <button type="button" onClick={logout} className="grid min-h-16 grid-cols-[58px_1fr_36px] items-center rounded-[18px] px-4 text-left text-lg text-white/90">
                <span className="grid h-12 w-12 place-items-center rounded-[14px] border border-white/10 bg-white/6 text-white/55">
                  <MdIcon name="logout" className="text-2xl" />
                </span>
                <span className="pl-4">Çıkış Yap</span>
                <span className="grid h-9 w-9 place-items-center rounded-full bg-white/8"><MdIcon name="chevron_right" /></span>
              </button>
            </div>
          </>
        ) : (
          <div>
            <HeaderProfileCard user={null} onClose={() => setAccountOpen(false)} />
            <div className="grid gap-3">
              <Link href="/login" onClick={() => setAccountOpen(false)} className="cta flex min-h-14 items-center justify-center gap-2 px-5 font-black">
                <MdIcon name="login" /> Giriş Yap
              </Link>
              <Link href="/register" onClick={() => setAccountOpen(false)} className="flex min-h-14 items-center justify-center gap-2 rounded-[16px] border border-white/10 bg-white/8 px-5 font-black text-white">
                <MdIcon name="person_add" /> Yeni Üyelik
              </Link>
            </div>
          </div>
        )}
      </FullScreenMenu>

    </>
  );
}
