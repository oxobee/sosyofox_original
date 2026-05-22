import { notFound } from "next/navigation";
import { PublicShell } from "@/components/layout/public-shell";
import { AgencyServiceDetail } from "@/components/public/agency-pages";
import { agencyPages, getAgencyPage } from "@/lib/public-content";

export function generateStaticParams() {
  return agencyPages.map((page) => ({ slug: page.slug }));
}

export default async function AgencyServiceRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getAgencyPage(slug);
  if (!page) notFound();

  return (
    <PublicShell>
      <AgencyServiceDetail page={page} />
    </PublicShell>
  );
}
