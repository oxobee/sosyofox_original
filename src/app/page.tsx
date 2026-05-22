import { HomePage } from "@/components/public/home-page";
import { PublicShell } from "@/components/layout/public-shell";
import { getVisibleCatalog } from "@/lib/catalog";

export default async function Page() {
  const catalog = await getVisibleCatalog();
  return (
    <PublicShell>
      <HomePage catalog={catalog} />
    </PublicShell>
  );
}
