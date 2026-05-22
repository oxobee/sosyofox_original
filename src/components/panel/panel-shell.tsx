import Link from "next/link";
import { MdIcon } from "@/components/md3/icon";
import { requireUser } from "@/lib/auth/session";
import { formatMoney } from "@/lib/utils";

type PanelUser = Awaited<ReturnType<typeof requireUser>>;

const accountLinks = [
  ["Siparişlerim", "/panel/siparisler", "list_alt"],
  ["Faturalarım", "/panel/faturalar", "receipt_long"],
  ["Destek Taleplerim", "/panel/destek", "chat_bubble"],
  ["İndirim Kodlarım", "/panel/kuponlar", "percent"],
  ["Ayarlarım", "/panel/ayarlar", "settings"]
] as const;

export function PanelShell({ user, children }: { user: PanelUser; children: React.ReactNode }) {
  const fullName = user.profile?.fullName ?? user.email;
  const balance = user.wallet?.balance.toString() ?? "0";
  const currency = user.wallet?.currency ?? "TRY";

  return (
    <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
      <aside className="grid content-start gap-5 xl:sticky xl:top-24 xl:self-start">
        <section className="overflow-hidden rounded-[18px] border border-white/10 bg-[#0d1118] shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
          <div className="relative h-28 border-b border-white/10 bg-[radial-gradient(circle_at_22%_0%,rgba(255,122,26,0.28),transparent_34%),linear-gradient(135deg,rgba(255,122,26,0.14),rgba(18,24,36,0.94)_48%,rgba(8,12,18,0.98))]">
            <span className="absolute right-4 top-4 rounded-full bg-emerald-300 px-4 py-2 text-sm font-black uppercase text-[#06110f]">Bireysel</span>
            <span className="absolute bottom-4 left-5 grid h-20 w-20 place-items-center rounded-[18px] border border-white/12 bg-white/10 text-white shadow-[0_18px_46px_rgba(255,122,26,0.18),inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-xl">
              <MdIcon name="person" className="text-4xl" />
            </span>
          </div>
          <div className="px-5 pb-5 pt-5">
            <h1 className="mt-4 text-3xl font-black leading-tight">{fullName}</h1>
            <p className="mt-1 text-3xl font-black text-emerald-300">{formatMoney(balance, currency)}</p>
          </div>
          <div className="border-t border-white/10 p-5">
            <div className="flex items-center justify-between rounded-[16px] bg-white/[0.045] p-4">
              <span className="grid h-12 w-12 place-items-center rounded-[12px] bg-orange-500/14 text-[color:var(--sf-primary-soft)]">
                <MdIcon name="local_fire_department" />
              </span>
              <div className="min-w-0 flex-1 px-4">
                <div className="h-1.5 rounded-full bg-white/10">
                  <div className="h-full w-1/4 rounded-full bg-[color:var(--sf-primary)]" />
                </div>
              </div>
              <span className="rounded-[12px] border border-emerald-300/20 bg-emerald-300/12 px-3 py-2 text-sm font-black text-emerald-200">%20 indirim</span>
            </div>
          </div>
          <div className="px-5 pb-5">
            <Link href="/panel/bakiye" className="flex min-h-14 items-center justify-between rounded-[14px] bg-[linear-gradient(135deg,#ff9a2e,#ff7a1a_52%,#b3261e)] px-4 font-black text-white shadow-[0_18px_44px_rgba(255,122,26,0.24)] transition hover:brightness-110">
              <span className="inline-flex items-center gap-3"><MdIcon name="account_balance_wallet" /> Bakiye Ekle</span>
              <MdIcon name="chevron_right" />
            </Link>
          </div>
        </section>

        <section className="rounded-[18px] border border-white/10 bg-[#0d1118] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.24)]">
          <p className="mb-2 text-sm font-black uppercase tracking-[0.16em] text-white/42">Hesabım</p>
          <div className="grid gap-1">
            {accountLinks.map(([label, href, icon]) => (
              <Link key={href} href={href} className="grid min-h-14 grid-cols-[48px_1fr_28px] items-center rounded-[16px] px-3 text-white/84 transition hover:bg-white/8 hover:text-white">
                <span className="grid h-10 w-10 place-items-center rounded-[12px] border border-white/10 bg-white/5 text-white/52">
                  <MdIcon name={icon} />
                </span>
                <span className="pl-3 font-semibold">{label}</span>
                <MdIcon name="chevron_right" className="text-white/45" />
              </Link>
            ))}
          </div>
        </section>
      </aside>

      <section className="grid min-w-0 content-start gap-6">{children}</section>
    </div>
  );
}
