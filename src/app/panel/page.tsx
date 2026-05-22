import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/md3/card";
import { MdIcon } from "@/components/md3/icon";
import { PanelShell } from "@/components/panel/panel-shell";
import { requireUser } from "@/lib/auth/session";
import { getVisibleCatalog } from "@/lib/catalog";
import { formatMoney } from "@/lib/utils";

const emptySections = [
  ["Son Siparişlerim", "Henüz siparişiniz bulunmuyor.", "shopping_basket", "/panel/siparisler"],
  ["Son Destek Taleplerim", "Henüz bir destek talebiniz bulunmuyor.", "chat_bubble", "/panel/destek"],
  ["Son Faturalarım", "Henüz faturanız bulunmuyor.", "inventory_2", "/panel/faturalar"]
];

export default async function PanelPage() {
  const user = await requireUser();
  const { services, categories } = await getVisibleCatalog();
  const balance = user.wallet?.balance.toString() ?? "0";
  const currency = user.wallet?.currency ?? "TRY";

  return (
    <AppShell>
      <PanelShell user={user}>
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="p-4">
              <MdIcon name="account_balance_wallet" className="text-[color:var(--sf-primary-soft)]" />
              <p className="mt-3 text-sm text-[color:var(--sf-muted)]">Bakiye</p>
              <p className="mt-1 text-2xl font-black">{formatMoney(balance, currency)}</p>
            </Card>
            <Card className="p-4">
              <MdIcon name="apps" className="text-[color:var(--sf-primary-soft)]" />
              <p className="mt-3 text-sm text-[color:var(--sf-muted)]">Yayındaki hizmet</p>
              <p className="mt-1 text-2xl font-black">{services.length}</p>
            </Card>
            <Card className="p-4">
              <MdIcon name="category" className="text-[color:var(--sf-primary-soft)]" />
              <p className="mt-3 text-sm text-[color:var(--sf-muted)]">Kategori</p>
              <p className="mt-1 text-2xl font-black">{categories.length}</p>
            </Card>
          </div>

          {emptySections.map(([title, description, icon, href]) => (
            <section key={title}>
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-4">
                  <span className="grid h-14 w-14 place-items-center rounded-[16px] bg-indigo-500 text-white shadow-[0_14px_38px_rgba(99,102,241,0.24)]">
                    <MdIcon name={icon} />
                  </span>
                  <h2 className="text-xl font-black md:text-2xl">{title}</h2>
                </div>
                <Link href={href} className="hidden min-h-12 items-center gap-2 rounded-[16px] bg-emerald-300 px-4 font-black text-[#06110f] md:inline-flex">
                  Tümünü Gör <MdIcon name="arrow_forward" />
                </Link>
              </div>
              <div className="grid min-h-44 place-items-center rounded-[22px] border border-white/10 bg-white/[0.035] p-6 text-center">
                <div>
                  <MdIcon name={icon} className="text-6xl text-white/78" />
                  <p className="mt-4 text-[color:var(--sf-muted)]">{description}</p>
                </div>
              </div>
            </section>
          ))}
      </PanelShell>
    </AppShell>
  );
}
