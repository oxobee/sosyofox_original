import Image from "next/image";
import Link from "next/link";
import { MdIcon } from "@/components/md3/icon";
import { SiteHeader } from "@/components/public/site-header";
import { requireUser } from "@/lib/auth/session";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";

const userNav = [
  ["Özet", "/panel", "space_dashboard"],
  ["Siparişler", "/panel/siparisler", "receipt_long"],
  ["Bakiye", "/panel/bakiye", "account_balance_wallet"],
  ["Destek", "/panel/destek", "support_agent"],
  ["Ayarlar", "/panel/ayarlar", "settings"]
];

const adminNav = [
  ["Dashboard", "/admin", "analytics"],
  ["Kullanıcılar", "/admin/users", "group"],
  ["Siparişler", "/admin/orders", "shopping_bag"],
  ["Hizmetler", "/admin/services", "deployed_code"],
  ["Entegrasyonlar", "/admin/integrations", "hub"],
  ["Fiyatlandırma", "/admin/pricing", "sell"],
  ["AI İsimlendirme", "/admin/ai-rename", "auto_awesome"],
  ["Ödemeler", "/admin/payments", "payments"],
  ["İçerik", "/admin/content", "edit_document"],
  ["Raporlar", "/admin/reports", "monitoring"],
  ["Ayarlar", "/admin/settings", "settings"],
  ["Audit", "/admin/audit", "shield_lock"]
];

export async function AppShell({ children, admin = false }: { children: React.ReactNode; admin?: boolean }) {
  const user = await requireUser();
  const nav = admin ? adminNav : userNav;
  const displayName = user.profile?.fullName ?? user.email;
  const headerUser = {
    fullName: displayName,
    balance: user.wallet?.balance.toString() ?? "0",
    currency: user.wallet?.currency ?? "TRY"
  };

  if (!admin) {
    return (
      <div className="min-h-screen bg-[color:var(--sf-bg)] pb-24 text-white lg:pb-0">
        <SiteHeader user={headerUser} />
        <main className="p-4 lg:p-8">{children}</main>
        <MobileBottomNav variant="panel" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[color:var(--sf-bg)] pb-20 text-white lg:grid lg:grid-cols-[280px_1fr] lg:pb-0">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[280px] border-r border-white/10 bg-[#0c1018]/92 p-4 backdrop-blur-xl lg:block">
        <Link href={admin ? "/admin" : "/panel"} className="mb-8 flex items-center gap-3 rounded-[18px] p-2">
          <Image src="/brand/logo.png" alt="Sosyofox" width={168} height={34} className="h-8 w-auto" />
        </Link>
        <nav className="grid gap-2">
          {nav.map(([label, href, icon]) => (
            <Link key={href} href={href} className="inline-flex min-h-12 items-center gap-3 rounded-[14px] px-3 font-semibold text-[color:var(--sf-muted)] transition hover:bg-white/8 hover:text-white">
              <MdIcon name={icon} />
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="lg:col-start-2">
        <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0b0d12]/88 backdrop-blur-2xl">
          <div className="flex min-h-16 items-center justify-between gap-3 px-4 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <Link href={admin ? "/admin" : "/panel"} className="grid h-10 w-10 shrink-0 place-items-center rounded-[14px] border border-white/10 bg-white/6 lg:hidden">
                <Image src="/brand/icon.png" alt="Sosyofox" width={28} height={28} className="h-7 w-7 object-contain" />
              </Link>
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--sf-primary-soft)]">{admin ? "Admin panel" : "Kullanıcı paneli"}</p>
                <p className="truncate font-semibold">{displayName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="grid h-11 w-11 place-items-center rounded-[14px] border border-white/10 bg-white/5" aria-label="Bildirimler">
                <MdIcon name="notifications" />
              </button>
              <form action="/api/auth/logout" method="post">
                <button className="grid h-11 w-11 place-items-center rounded-[14px] border border-white/10 bg-white/5" aria-label="Çıkış">
                  <MdIcon name="logout" />
                </button>
              </form>
            </div>
          </div>
        </header>
        <div className="p-4 lg:p-8">{children}</div>
      </main>
      <nav className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-5 gap-2 rounded-[20px] border border-white/10 bg-[#10141d]/92 p-2 shadow-2xl backdrop-blur-xl lg:hidden">
        {nav.slice(0, 5).map(([label, href, icon]) => (
          <Link key={href} href={href} className="grid min-h-14 place-items-center rounded-[14px] text-[10px] font-semibold text-[color:var(--sf-muted)] hover:bg-white/8 hover:text-white">
            <MdIcon name={icon} />
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
