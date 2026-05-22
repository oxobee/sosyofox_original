"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { MdIcon } from "@/components/md3/icon";
import { cn } from "@/lib/utils";

export type FavoriteEntry = {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  icon: string;
  type?: "category" | "service" | "agency";
};

const FAVORITES_KEY = "sosyofox:favorites:v1";
const FAVORITES_EVENT = "sosyofox:favorites-changed";

function readFavorites(): FavoriteEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeFavorites(items: FavoriteEntry[]) {
  window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(FAVORITES_EVENT));
}

export function FavoriteButton({ item, className }: { item: FavoriteEntry; className?: string }) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const sync = () => setActive(readFavorites().some((favorite) => favorite.id === item.id));
    sync();
    window.addEventListener(FAVORITES_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(FAVORITES_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [item.id]);

  return (
    <button
      type="button"
      aria-label={active ? "Favorilerden çıkar" : "Favorilere ekle"}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        const current = readFavorites();
        const exists = current.some((favorite) => favorite.id === item.id);
        writeFavorites(exists ? current.filter((favorite) => favorite.id !== item.id) : [item, ...current].slice(0, 80));
        setActive(!exists);
      }}
      className={cn(
        "favorite-action grid h-9 w-9 place-items-center rounded-[11px] border border-white/14 bg-black/28 text-white/72 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_12px_28px_rgba(0,0,0,0.25)] backdrop-blur transition hover:border-orange-300/45 hover:text-[color:var(--sf-primary-soft)]",
        active && "is-active border-orange-300/55 bg-orange-500/16 text-[color:var(--sf-primary-soft)]",
        className
      )}
    >
      <MdIcon name="favorite" className="text-xl" />
    </button>
  );
}

export function FavoritesPopover({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [items, setItems] = useState<FavoriteEntry[]>([]);

  useEffect(() => {
    const sync = () => setItems(readFavorites());
    sync();
    window.addEventListener(FAVORITES_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(FAVORITES_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const grouped = useMemo(() => {
    return items.reduce<Record<string, FavoriteEntry[]>>((acc, item) => {
      const key = item.type === "service" ? "Servisler" : item.type === "agency" ? "Ajans Hizmetleri" : "Kategoriler";
      acc[key] = [...(acc[key] ?? []), item];
      return acc;
    }, {});
  }, [items]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 360, damping: 28 }}
          className="fixed right-4 top-[126px] z-50 w-[min(390px,calc(100vw-32px))] rounded-[16px] border border-orange-300/20 bg-[#0b0f14]/96 p-4 shadow-[0_24px_70px_rgba(0,0,0,0.48),0_0_38px_rgba(255,122,26,0.12)] backdrop-blur-2xl md:right-20 md:top-20"
        >
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.16em] text-[color:var(--sf-primary-soft)]">Favoriler</p>
              <p className="text-xs text-white/50">İşaretlediğiniz hizmetler</p>
            </div>
            <button type="button" onClick={onClose} className="grid h-8 w-8 place-items-center rounded-[10px] bg-white/8" aria-label="Favorileri kapat">
              <MdIcon name="close" className="text-base" />
            </button>
          </div>

          {items.length ? (
            <div className="max-h-[440px] overflow-y-auto pr-1">
              {Object.entries(grouped).map(([group, entries]) => (
                <div key={group} className="mb-3 last:mb-0">
                  <p className="mb-2 text-[11px] font-black uppercase tracking-[0.16em] text-white/42">{group}</p>
                  <div className="grid gap-2">
                    {entries.map((item) => (
                      <Link key={item.id} href={item.href} onClick={onClose} className="grid grid-cols-[40px_1fr_22px] items-center gap-3 rounded-[12px] border border-white/8 bg-white/[0.04] p-2 transition hover:bg-orange-500/10">
                        <span className="grid h-10 w-10 place-items-center rounded-[10px] bg-orange-500/12 text-[color:var(--sf-primary-soft)]">
                          <MdIcon name={item.icon} />
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-black text-white">{item.title}</span>
                          <span className="mt-0.5 block truncate text-xs text-white/48">{item.subtitle}</span>
                        </span>
                        <MdIcon name="chevron_right" className="text-lg text-white/48" />
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-[14px] border border-white/8 bg-white/[0.035] p-6 text-center">
              <MdIcon name="favorite" className="text-4xl text-white/32" />
              <p className="mt-3 text-sm font-black">Henüz favori eklenmedi.</p>
              <p className="mt-1 text-xs leading-5 text-white/48">Hizmet kartlarındaki kalp ikonuna basarak listenizi oluşturabilirsiniz.</p>
            </div>
          )}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
