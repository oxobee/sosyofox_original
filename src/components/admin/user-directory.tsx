"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MdIcon } from "@/components/md3/icon";
import { formatMoney } from "@/lib/utils";

type AdminUser = {
  id: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  profile: { fullName: string | null; phone: string | null; adminNotes: string | null } | null;
  wallet: { balance: unknown; currency: string } | null;
  billingInfo: { type: string; fullName: string | null; companyName: string | null; taxNumber: string | null; phone: string | null; email: string | null } | null;
  orders: Array<{ id: string; status: string; quantity: number; totalPrice: string; createdAt: string; service: { sosyofoxServiceName: string } }>;
  payments: Array<{ id: string; provider: string; status: string; amount: string; createdAt: string }>;
  tickets: Array<{ id: string; subject: string; status: string; createdAt: string }>;
};

export function UserDirectory({ users }: { users: AdminUser[] }) {
  const [selected, setSelected] = useState<AdminUser | null>(null);

  return (
    <>
      <div className="grid gap-3">
        {users.map((user) => (
          <button
            type="button"
            key={user.id}
            onClick={() => setSelected(user)}
            className="grid gap-3 rounded-[16px] border border-white/10 bg-white/[0.04] p-4 text-left transition hover:border-orange-300/30 hover:bg-white/[0.07] md:grid-cols-[1fr_160px_130px_34px] md:items-center"
          >
            <span>
              <span className="block font-black text-white">{user.profile?.fullName ?? "İsimsiz kullanıcı"}</span>
              <span className="mt-1 block text-sm text-[color:var(--sf-muted)]">{user.email} · {user.profile?.phone ?? "Telefon yok"}</span>
            </span>
            <span className="text-sm font-bold text-[color:var(--sf-muted)]">{user.role} / {user.status}</span>
            <span className="text-sm font-black text-[color:var(--sf-primary-soft)]">{formatMoney(String(user.wallet?.balance ?? 0), user.wallet?.currency ?? "TRY")}</span>
            <MdIcon name="open_in_new" />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {selected ? (
          <motion.div className="fixed inset-0 z-50 grid place-items-center bg-black/72 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 280, damping: 28 }}
              className="max-h-[86svh] w-full max-w-5xl overflow-y-auto rounded-[22px] border border-white/10 bg-[#0b1017] shadow-[0_30px_120px_rgba(0,0,0,0.65)]"
            >
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#0b1017]/92 p-5 backdrop-blur-xl">
                <div>
                  <h2 className="text-2xl font-black">{selected.profile?.fullName ?? selected.email}</h2>
                  <p className="text-sm text-[color:var(--sf-muted)]">{selected.email}</p>
                </div>
                <button type="button" onClick={() => setSelected(null)} className="grid h-11 w-11 place-items-center rounded-[14px] bg-white/8">
                  <MdIcon name="close" />
                </button>
              </div>
              <div className="grid gap-5 p-5 lg:grid-cols-2">
                <InfoCard title="Profil" rows={[
                  ["Ad soyad", selected.profile?.fullName ?? "-"],
                  ["Telefon", selected.profile?.phone ?? "-"],
                  ["Rol", selected.role],
                  ["Durum", selected.status],
                  ["Kayıt", new Date(selected.createdAt).toLocaleDateString("tr-TR")]
                ]} />
                <InfoCard title="Bakiye ve Fatura" rows={[
                  ["Bakiye", formatMoney(String(selected.wallet?.balance ?? 0), selected.wallet?.currency ?? "TRY")],
                  ["Fatura tipi", selected.billingInfo?.type ?? "-"],
                  ["Firma/Ad", selected.billingInfo?.companyName ?? selected.billingInfo?.fullName ?? "-"],
                  ["Vergi/TCKN", selected.billingInfo?.taxNumber ?? "-"],
                  ["Fatura telefonu", selected.billingInfo?.phone ?? "-"]
                ]} />
                <ListCard title="Son Siparişler" items={selected.orders.map((order) => `${order.service.sosyofoxServiceName} · ${order.status} · ${formatMoney(String(order.totalPrice))}`)} empty="Sipariş yok" />
                <ListCard title="Son Ödemeler" items={selected.payments.map((payment) => `${payment.provider} · ${payment.status} · ${formatMoney(String(payment.amount))}`)} empty="Ödeme yok" />
                <div className="lg:col-span-2">
                  <label className="grid gap-2">
                    <span className="font-black">Admin notları</span>
                    <textarea defaultValue={selected.profile?.adminNotes ?? ""} className="min-h-28 rounded-[14px] border border-white/10 bg-black/18 p-4 outline-none focus:border-[color:var(--sf-primary)]" />
                  </label>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {["Bilgileri güncelle", "Bakiye ekle/çıkar", "Pasifleştir", "KVKK dışa aktar"].map((action) => (
                      <button key={action} type="button" className="rounded-[12px] border border-white/10 bg-white/7 px-4 py-2 text-sm font-black text-white">{action}</button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

function InfoCard({ title, rows }: { title: string; rows: Array<[string, string]> }) {
  return (
    <section className="rounded-[18px] border border-white/10 bg-white/[0.035] p-5">
      <h3 className="font-black">{title}</h3>
      <div className="mt-4 grid gap-3">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-4 border-b border-white/8 pb-2 text-sm">
            <span className="text-[color:var(--sf-muted)]">{label}</span>
            <span className="text-right font-bold text-white">{value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function ListCard({ title, items, empty }: { title: string; items: string[]; empty: string }) {
  return (
    <section className="rounded-[18px] border border-white/10 bg-white/[0.035] p-5">
      <h3 className="font-black">{title}</h3>
      <div className="mt-4 grid gap-2">
        {items.length ? items.map((item) => <p key={item} className="rounded-[12px] bg-white/5 p-3 text-sm text-[color:var(--sf-muted)]">{item}</p>) : <p className="text-sm text-[color:var(--sf-muted)]">{empty}</p>}
      </div>
    </section>
  );
}
