"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdIcon } from "@/components/md3/icon";

const publicNavItems = [
  { label: "Ana Sayfa", href: "/", icon: "home" },
  { label: "Hizmetler", href: "/sosyal-medya-hizmetleri", icon: "apps" },
  { label: "Ajans", href: "/ajans-hizmetleri", icon: "auto_awesome" },
  { label: "Panelim", href: "/panel", icon: "space_dashboard" },
  { label: "Hesabım", href: "/login", icon: "person" },
];

const panelNavItems = [
  { label: "Özet", href: "/panel", icon: "space_dashboard" },
  { label: "Siparişler", href: "/panel/siparisler", icon: "receipt_long" },
  { label: "Bakiye", href: "/panel/bakiye", icon: "account_balance_wallet" },
  { label: "Destek", href: "/panel/destek", icon: "support_agent" },
  { label: "Ayarlar", href: "/panel/ayarlar", icon: "settings" },
];

export function MobileBottomNav({ variant = "public" }: { variant?: "public" | "panel" }) {
  const pathname = usePathname();
  const items = variant === "panel" ? panelNavItems : publicNavItems;

  return (
    <nav className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-5 gap-1 rounded-[22px] border border-white/10 bg-[#0c0f18]/94 p-1.5 shadow-[0_8px_40px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.05)] backdrop-blur-2xl md:hidden">
      {items.map(({ label, href, icon }) => {
        const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            className={`relative flex min-h-[60px] flex-col items-center justify-center gap-1 rounded-[16px] text-[10px] font-black transition-all duration-200 ${
              isActive
                ? "bg-orange-500/18 text-[color:var(--sf-primary-soft)] shadow-[inset_0_1px_0_rgba(255,189,122,0.2)]"
                : "text-white/48 hover:bg-white/6 hover:text-white/72"
            }`}
          >
            {isActive && (
              <span className="absolute inset-x-4 top-0 h-px rounded-full bg-[color:var(--sf-primary-soft)] opacity-70" />
            )}
            <MdIcon
              name={icon}
              className={`text-[22px] transition-all ${isActive ? "text-[color:var(--sf-primary-soft)]" : ""}`}
            />
            <span className="leading-none">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
