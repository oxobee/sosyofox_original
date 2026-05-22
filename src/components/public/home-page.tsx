import { HomeCatalogTabs } from "@/components/public/home-catalog-tabs";
import { agencyMenuGroups } from "@/lib/public-content";
import type { getVisibleCatalog } from "@/lib/catalog";

type Catalog = Awaited<ReturnType<typeof getVisibleCatalog>>;

export function HomePage({ catalog }: { catalog: Catalog }) {
  const socialItems = catalog.categories.map((category) => ({
    id: category.id,
    title: category.sosyofoxCategoryName,
    subtitle: "Hizmetleri",
    href: `/kategori/${category.slug}`,
    icon: category.icon,
    visualKey: category.sosyofoxCategoryName
  }));

  const agencyItems = agencyMenuGroups.flatMap((group) =>
    group.items.map((item) => ({
      id: item.href,
      title: item.title,
      subtitle: item.description,
      href: item.href,
      icon: item.icon,
      visualKey: `${group.title} ${item.title}`
    }))
  );

  return (
    <main className="mx-auto w-[min(1820px,calc(100vw-40px))] py-6 sm:py-8 lg:py-10">
      <HomeCatalogTabs
        tabs={[
          {
            key: "social",
            label: "Sosyal Medya Hizmetleri",
            title: "Sosyal Medya Hizmetlerimiz",
            description: "Tüm sosyal medya platformlarında bireysel veya kurumsal hesaplarınızı büyütmeye buradan başlayın.",
            icons: ["alternate_email", "photo_camera", "thumb_up"],
            href: "/sosyal-medya-hizmetleri",
            items: socialItems,
            emptyTitle: "API bağlantısı bekleniyor",
            emptyText: "Admin panelinden sağlayıcı anahtarı girilip senkronizasyon tamamlandığında kategoriler burada görünür."
          },
          {
            key: "agency",
            label: "Ajans Hizmetleri",
            title: "Ajans Hizmetleri",
            description: "Marka, yazılım, reklam ve içerik üretimi çözümlerini aynı premium panel deneyimiyle inceleyin.",
            icons: ["cloud", "travel_explore", "link"],
            href: "/ajans-hizmetleri",
            items: agencyItems
          },
          {
            key: "epin",
            label: "E-Pin Ürünleri",
            title: "E-Pin Ürünleri",
            description: "Oyun, platform ve dijital kod ürünleri için hazırlık alanı.",
            icons: ["stadia_controller", "sports_esports", "desktop_windows"],
            href: "/epin",
            items: [],
            emptyTitle: "E-Pin ürünleri yakında",
            emptyText: "Bu sekme hazır; e-pin ürünleri eklendiğinde aynı katalog düzeninde listelenecek."
          },
          {
            key: "licenses",
            label: "Lisans Ürünleri",
            title: "Lisans Ürünleri",
            description: "Yazılım ve dijital lisans kataloğu için hazırlık alanı.",
            icons: ["verified", "workspace_premium", "window"],
            href: "/lisanslar",
            items: [],
            emptyTitle: "Lisans ürünleri yakında",
            emptyText: "Bu sekme hazır; lisans ürünleri eklendiğinde aynı katalog düzeninde listelenecek."
          }
        ]}
      />
    </main>
  );
}
