import { SiteHeader } from "@/components/public/site-header";
import { getCurrentUser } from "@/lib/auth/session";
import { getHeaderSearchCatalog } from "@/lib/catalog";

export async function PublicShell({ children }: { children: React.ReactNode }) {
  const [user, searchCatalog] = await Promise.all([
    getCurrentUser(),
    getHeaderSearchCatalog()
  ]);
  const headerUser = user
    ? {
        fullName: user.profile?.fullName ?? user.email,
        balance: user.wallet?.balance?.toString() ?? "0",
        currency: user.wallet?.currency ?? "TRY"
      }
    : null;

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <SiteHeader user={headerUser} searchCatalog={searchCatalog} />
      {children}
    </div>
  );
}
