import { notFound } from "next/navigation";
import { PublicShell } from "@/components/layout/public-shell";
import { getPrisma } from "@/lib/db/prisma";

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getPrisma().legalPage.findFirst({ where: { slug, isPublished: true } }).catch(() => null);
  if (!page) notFound();

  return (
    <PublicShell>
      <main className="sf-container py-10">
        <article className="sf-card prose prose-invert max-w-none p-6">
          <h1>{page.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: page.content }} />
        </article>
      </main>
    </PublicShell>
  );
}
