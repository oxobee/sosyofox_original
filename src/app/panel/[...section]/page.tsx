import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/md3/card";
import { MdIcon } from "@/components/md3/icon";
import { PanelShell } from "@/components/panel/panel-shell";
import { requireUser } from "@/lib/auth/session";

const titles: Record<string, [string, string, string]> = {
  siparisler: ["Siparişler", "Sipariş geçmişi, durum takibi ve destek bağlantıları.", "receipt_long"],
  bakiye: ["Bakiye", "Kart, havale/EFT ve transaction geçmişi.", "account_balance_wallet"],
  faturalar: ["Faturalar", "Fatura ve fiş kayıtlarınızı buradan takip edin.", "receipt_long"],
  destek: ["Destek", "Siparişe bağlı veya genel destek talepleri.", "support_agent"],
  kuponlar: ["İndirim Kodları", "Kampanya, kupon ve avantaj kayıtlarınız.", "percent"],
  ayarlar: ["Ayarlar", "Profil, fatura bilgileri, tema ve bildirim tercihleri.", "settings"]
};

export default async function PanelSectionPage({ params }: { params: Promise<{ section: string[] }> }) {
  const user = await requireUser();
  const { section } = await params;
  const [title, description, icon] = titles[section[0]] ?? ["Panel", "Kullanıcı paneli modülü.", "dashboard"];

  return (
    <AppShell>
      <PanelShell user={user}>
        <section className="sf-card p-6">
          <MdIcon name={icon} className="text-4xl text-[color:var(--sf-primary-soft)]" />
          <h1 className="mt-4 text-3xl font-black">{title}</h1>
          <p className="mt-2 max-w-2xl leading-7 text-[color:var(--sf-muted)]">{description}</p>
        </section>
        <div className="grid gap-4 md:grid-cols-2">
          {["Mobil uyumlu akış", "Güvenli işlem kaydı"].map((item) => (
            <Card key={item}>
              <MdIcon name="check_circle" className="text-[color:var(--sf-primary-soft)]" />
              <h2 className="mt-4 font-black">{item}</h2>
              <p className="mt-2 text-sm leading-6 text-[color:var(--sf-muted)]">Bu alan panel shell, ikon seti ve animasyon sistemiyle hazırdır.</p>
            </Card>
          ))}
        </div>
      </PanelShell>
    </AppShell>
  );
}
