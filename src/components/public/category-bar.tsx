import Link from "next/link";
import { MdIcon } from "@/components/md3/icon";

type CategoryBarItem = {
  id: string;
  slug: string;
  sosyofoxCategoryName: string;
  icon: string;
};

export function CategoryBar({ categories, activeSlug }: { categories: CategoryBarItem[]; activeSlug?: string }) {
  if (!categories.length) return null;

  return (
    <section className="rounded-[14px] border border-white/10 bg-white/[0.035] p-3 shadow-[0_18px_60px_rgba(0,0,0,0.22)]">
      <p className="mb-3 text-sm font-black text-white">Kategori</p>
      <div className="category-scroll flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => {
          const active = category.slug === activeSlug;
          return (
            <Link
              key={category.id}
              href={`/kategori/${category.slug}`}
              className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-[12px] border px-4 text-sm font-black transition hover:-translate-y-0.5 hover:bg-orange-500/12 ${
                active
                  ? "border-orange-300/80 bg-orange-500/14 text-white shadow-[0_0_26px_rgba(255,122,26,0.16)]"
                  : "border-white/12 bg-black/14 text-white/72"
              }`}
            >
              <MdIcon name={category.icon} className="text-lg text-[color:var(--sf-primary-soft)]" />
              {category.sosyofoxCategoryName}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
